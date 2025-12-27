import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText } from 'ai';

export const maxDuration = 30;

const qwen = createOpenAICompatible({
  name: 'qwen',
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.QWEN_API_KEY || '',
});

interface Answer {
  selectedOptions: string[];
  customInput: string;
}

interface RequestData {
  formData: {
    moods: string[];
    interests: string[];
    project: string;
    wechat?: string;
  };
  answers: Answer[];
}

export async function POST(req: Request) {
  try {
    const { formData, answers }: RequestData = await req.json();

    // 构建用户画像描述
    const answersText = answers
      .map((answer, idx) => {
        const parts = [];
        if (answer.selectedOptions.length > 0) {
          parts.push(answer.selectedOptions.join('、'));
        }
        if (answer.customInput) {
          parts.push(answer.customInput);
        }
        return `问题${idx + 1}回答：${parts.join('；')}`;
      })
      .join('\n');

    const prompt = `你是一个黑客松活动的 AI 助手，负责为参与者生成个性化的名片。

用户信息：
- 当前状态：${formData.moods.join('、')}
- 感兴趣的话题：${formData.interests.join('、')}
- 正在做的项目：${formData.project}

问卷回答：
${answersText}

请根据用户的信息和问卷回答，生成一张有个性、有趣的名片：

要求：
1. **称号 (title)**：2-6个字，体现用户的特点或状态，要有创意和个性（如"深夜代码诗人"、"AI炼金术士"）
2. **个性签名 (bio)**：15-30字，简洁有力，展现用户的态度或特点，可以稍微文艺或幽默
3. **emoji**：为这个人选一个最合适的 emoji 来代表 ta

请按以下 JSON 格式返回，不要包含任何其他文本：
{
  "title": "称号",
  "bio": "个性签名",
  "emoji": "代表emoji"
}`;

    const { text } = await generateText({
      model: qwen('qwen-plus'),
      prompt: prompt,
    });

    // 解析 AI 返回的 JSON
    try {
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
    console.error('Error generating profile:', error);
    return Response.json(
      { error: 'Failed to generate profile' },
      { status: 500 }
    );
  }
}
