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
3. 问题应该能引发有意思的回答
4. 可以加入适当的 emoji

请按以下 JSON 格式返回，不要包含任何其他文本：
{
  "questions": [
    {
      "question": "问题内容",
      "placeholder": "回答提示"
    },
    {
      "question": "问题内容",
      "placeholder": "回答提示"
    },
    {
      "question": "问题内容",
      "placeholder": "回答提示"
    }
  ]
}`;

    const { text } = await generateText({
      model: qwen('qwen-plus'),
      prompt: prompt,
    });

    // 解析 AI 返回的 JSON
    let parsedResponse;
    try {
      // 尝试提取 JSON 部分
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      // 如果解析失败，返回默认问题
      console.error('Failed to parse AI response:', text);
      parsedResponse = {
        questions: [
          {
            question: '如果你的项目是一种动物，会是什么？为什么？🦄',
            placeholder: '比如：猫头鹰，因为我的项目在夜间最活跃...',
          },
          {
            question: '凌晨3点的你通常在做什么？',
            placeholder: '诚实点～',
          },
          {
            question: '你最想在黑客松遇到什么样的队友？',
            placeholder: '描述一下你的理想队友...',
          },
        ],
      };
    }

    return Response.json(parsedResponse);
  } catch (error) {
    console.error('Error generating questions:', error);
    return Response.json(
      {
        error: 'Failed to generate questions',
        questions: [
          {
            question: '如果你的项目是一种动物，会是什么？为什么？🦄',
            placeholder: '比如：猫头鹰，因为我的项目在夜间最活跃...',
          },
          {
            question: '凌晨3点的你通常在做什么？',
            placeholder: '诚实点～',
          },
          {
            question: '你最想在黑客松遇到什么样的队友？',
            placeholder: '描述一下你的理想队友...',
          },
        ],
      },
      { status: 200 } // 即使出错也返回默认问题
    );
  }
}
