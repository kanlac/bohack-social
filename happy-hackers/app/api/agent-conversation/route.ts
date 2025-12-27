import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

const qwen = createOpenAICompatible({
  name: 'qwen',
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.QWEN_API_KEY || '',
});

interface User {
  emoji: string;
  title: string;
  project: string;
  bio?: string;
  interests?: string[];
  moods?: string[];
}

interface Message {
  role: 'user1' | 'user2';
  content: string;
}

interface RequestData {
  user1: User;
  user2: User;
}

// 定义对话的 Zod Schema
const ConversationSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user1', 'user2']),
      content: z.string().min(10).max(500),
    })
  ).length(8), // 8 轮对话，精炼而充分
});

export async function POST(req: Request) {
  try {
    const { user1, user2 }: RequestData = await req.json();

    // 构建 prompt - 必须包含 "json" 关键词
    const prompt = `你是一个黑客松社交助手，需要模拟两个参与者的数字分身进行对话。请生成一段自然、有趣的对话，以 JSON 格式输出。

## 参与者信息

**User1（我）**：
- 称号：${user1.title}
- Emoji：${user1.emoji}
- 项目：${user1.project}
${user1.bio ? `- 签名：${user1.bio}` : ''}
${user1.interests && user1.interests.length > 0 ? `- 兴趣：${user1.interests.join('、')}` : ''}
${user1.moods && user1.moods.length > 0 ? `- 状态：${user1.moods.join('、')}` : ''}

**User2**：
- 称号：${user2.title}
- Emoji：${user2.emoji}
- 项目：${user2.project}
${user2.bio ? `- 签名：${user2.bio}` : ''}
${user2.interests && user2.interests.length > 0 ? `- 兴趣：${user2.interests.join('、')}` : ''}
${user2.moods && user2.moods.length > 0 ? `- 状态：${user2.moods.join('、')}` : ''}

## 对话要求

1. **总共 8 轮对话**（user1 和 user2 轮流发言，各 4 次）
2. **第 1 轮**：user1 主动打招呼并简单介绍自己
3. **第 2-7 轮**：围绕以下话题自然展开：
   - 各自的项目和技术栈
   - 共同的兴趣点
   - 可能的合作机会
   - 当前遇到的挑战
4. **第 8 轮**：user2 总结对话，表达合作意愿
5. **语气风格**：
   - 保持角色特点（符合称号和状态）
   - 自然、友好、有趣
   - 每条消息 2-3 句话，简洁有力
   - 避免过于正式或机械

## JSON 输出格式

请直接输出 JSON 对象，格式如下：

\`\`\`json
{
  "messages": [
    {"role": "user1", "content": "user1 的第一条消息"},
    {"role": "user2", "content": "user2 的回复"},
    ...共 8 条消息
  ]
}
\`\`\`

现在请生成这段对话的 JSON 数据。`;

    // 使用 generateObject 生成结构化输出
    const { object } = await generateObject({
      model: qwen('qwen-plus'),
      schema: ConversationSchema,
      prompt: prompt,
      temperature: 0.8, // 保持创意性
    });

    // 验证并返回结果
    const conversation: Message[] = object.messages.map(msg => ({
      role: msg.role as 'user1' | 'user2',
      content: msg.content,
    }));

    return Response.json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error('Error generating conversation:', error);
    return Response.json(
      { error: 'Failed to generate conversation' },
      { status: 500 }
    );
  }
}
