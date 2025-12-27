import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText } from 'ai';

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

export async function POST(req: Request) {
  try {
    const formData: FormData = await req.json();

    // 构建 prompt
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

请按以下 JSON 格式返回，不要包含任何其他文本：
{
  "questions": [
    {
      "question": "问题内容",
      "options": [
        "选项1",
        "选项2",
        "选项3",
        "选项4"
      ]
    },
    {
      "question": "问题内容",
      "options": [
        "选项1",
        "选项2",
        "选项3",
        "选项4"
      ]
    },
    {
      "question": "问题内容",
      "options": [
        "选项1",
        "选项2",
        "选项3",
        "选项4"
      ]
    }
  ]
}`;

    const { text } = await generateText({
      model: qwen('qwen-plus'),
      prompt: prompt,
    });

    // 解析 AI 返回的 JSON
    try {
      // 尝试提取 JSON 部分
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedResponse = JSON.parse(jsonMatch[0]);
        return Response.json(parsedResponse);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', text);
      return Response.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error generating questions:', error);
    return Response.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}
