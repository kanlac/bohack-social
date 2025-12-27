import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateObject } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Create Qwen provider using OpenAI-compatible endpoint (China region)
const qwen = createOpenAICompatible({
  name: 'qwen',
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.QWEN_API_KEY || '',
});

interface FormData {
  moods: string[];
  interests: string[];
  project: string;
  wechat?: string;
}

// 定义严格的输出 schema
const QuestionsSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()).length(4)
    })
  ).length(3)
});

export async function POST(req: Request) {
  try {
    const formData: FormData = await req.json();

    // 构建 prompt - 必须包含 "json" 关键词以启用 Qwen 的 JSON 模式
    const prompt = `你是一个黑客松活动的 AI 助手，负责帮助参与者互相了解。

用户信息：
- 当前状态：${formData.moods.join('、')}
- 感兴趣的话题：${formData.interests.join('、')}
- 正在做的项目：${formData.project}

请根据用户的信息，生成 3 个有趣、有创意、能帮助其他参与者更好了解 ta 的问题。

要求：
1. 每个问题要结合用户的状态、兴趣或项目
2. 问题要有趣、轻松，避免过于严肃
3. 每个问题提供 4 个不同方向的选项，选项要有创意且有区分度
4. 选项可以加入适当的 emoji，让问题更生动
5. 请以 JSON 格式返回结果`;

    // 使用 generateObject 强制输出符合 schema 的 JSON
    const { object } = await generateObject({
      model: qwen('qwen-plus'),
      schema: QuestionsSchema,
      prompt: prompt,
    });

    // object 已经是解析好且类型安全的对象，直接返回
    return Response.json(object);
  } catch (error) {
    console.error('Error generating questions:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return Response.json(
      {
        error: 'Failed to generate questions',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
