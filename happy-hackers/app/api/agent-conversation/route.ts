import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText } from 'ai';

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

// 生成 Agent Prompt
function generateAgentPrompt(
  user: User,
  conversationHistory: Message[],
  currentRole: 'user1' | 'user2',
  isFirstMessage: boolean
): string {
  const historyText = conversationHistory
    .map((msg) => {
      const speaker = msg.role === currentRole ? '你' : '对方';
      return `${speaker}: ${msg.content}`;
    })
    .join('\n');

  const context = isFirstMessage
    ? '这是对话的开始，请主动打个招呼并简单介绍自己。'
    : `对话历史：
${historyText}

请自然地回应对方的话，继续这段对话。`;

  return `你现在要扮演一个黑客松参与者的数字分身，代表这个人和另一个参与者聊天。

你的角色信息：
- 称号：${user.title}
- emoji：${user.emoji}
- 正在做的项目：${user.project}
${user.bio ? `- 个性签名：${user.bio}` : ''}
${user.interests && user.interests.length > 0 ? `- 感兴趣的话题：${user.interests.join('、')}` : ''}
${user.moods && user.moods.length > 0 ? `- 当前状态：${user.moods.join('、')}` : ''}

${context}

要求：
1. 保持角色特点，语气符合你的称号和状态
2. 内容自然、有趣，像真实的人在聊天
3. 每次回复2-3句话，不要太长
4. 围绕共同兴趣和项目展开讨论
5. 直接输出对话内容，不要包含任何前缀或标记`;
}

export async function POST(req: Request) {
  try {
    const { user1, user2 }: RequestData = await req.json();

    const conversation: Message[] = [];
    const totalRounds = 12; // 生成12轮对话

    // 轮流生成对话
    for (let i = 0; i < totalRounds; i++) {
      const currentRole = i % 2 === 0 ? 'user1' : 'user2';
      const currentUser = currentRole === 'user1' ? user1 : user2;
      const isFirstMessage = i === 0;

      // 生成 prompt
      const prompt = generateAgentPrompt(
        currentUser,
        conversation,
        currentRole,
        isFirstMessage
      );

      // 调用 AI 生成消息
      const { text } = await generateText({
        model: qwen('qwen-plus'),
        prompt: prompt,
        temperature: 0.8, // 增加创意性
      });

      // 清理 AI 返回的内容（去除可能的前缀）
      const cleanedContent = text
        .replace(/^(你好|嗨|哈喽|Hi|Hello)[，,、：:！!]\s*/i, '')
        .trim();

      // 添加到对话历史
      conversation.push({
        role: currentRole,
        content: cleanedContent || text, // 如果清理后为空则使用原文
      });

      // 如果是最后几轮，添加结束提示
      if (i === totalRounds - 2) {
        // 倒数第二轮，提示即将结束
        const nextRole = (i + 1) % 2 === 0 ? 'user1' : 'user2';
        const nextUser = nextRole === 'user1' ? user1 : user2;

        const closingPrompt = `你现在要扮演一个黑客松参与者的数字分身，代表这个人和另一个参与者聊天。

你的角色信息：
- 称号：${nextUser.title}
- emoji：${nextUser.emoji}
- 正在做的项目：${nextUser.project}
${nextUser.bio ? `- 个性签名：${nextUser.bio}` : ''}

对话历史：
${conversation.map((msg) => `${msg.role === nextRole ? '你' : '对方'}: ${msg.content}`).join('\n')}

这是对话的最后一轮，请自然地总结对话并表达期待未来合作的意愿。

要求：
1. 保持角色特点，语气符合你的称号和状态
2. 内容自然、有趣
3. 2-3句话，不要太长
4. 表达对这次对话的感受和对未来合作的期待
5. 直接输出对话内容，不要包含任何前缀或标记`;

        const { text: closingText } = await generateText({
          model: qwen('qwen-plus'),
          prompt: closingPrompt,
          temperature: 0.8,
        });

        conversation.push({
          role: nextRole,
          content: closingText.trim(),
        });

        // 结束循环
        break;
      }
    }

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
