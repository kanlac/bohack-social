import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateObject } from 'ai';
import { z } from 'zod';

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

    // 定义名片数据结构的 Zod schema
    const profileSchema = z.object({
      title: z.string().describe('2-6个字的称号，体现用户的特点或状态，要有创意和个性'),
      bio: z.string().describe('15-30字的个性签名，简洁有力，展现用户的态度或特点'),
      emoji: z.string().describe('一个最合适的 emoji 来代表这个人'),
      tags: z.array(z.string()).describe('3-5个关键词标签，包括身份、技能、性格或兴趣'),
      uniqueQuote: z.string().describe('10-25字的独特语录，提炼用户最有趣或最有个性的观点/态度'),
      background: z.string().describe('15-35字的背景故事，一句话概括用户最有趣的背景或经历，体现反差感或独特性'),
    });

    const prompt = `你是一个黑客松活动的 AI 助手，负责为参与者生成个性化的名片。

用户信息：
- 当前状态：${formData.moods.join('、')}
- 感兴趣的话题：${formData.interests.join('、')}
- 正在做的项目：${formData.project}

问卷回答：
${answersText}

请根据用户的信息和问卷回答，生成一张有个性、有趣、丰富的名片 JSON 数据。参考以下风格：
- 如果用户是"研究生在读的说唱音乐人"，可以突出这种反差感
- 如果用户思考深入，可以提炼他们的哲学观点
- 抓住最有趣、最独特的细节

要求：
1. **称号 (title)**：2-6个字，体现用户的特点或状态，要有创意和个性（如"深夜代码诗人"、"AI炼金术士"、"死掉的歌手"）
2. **个性签名 (bio)**：15-30字，简洁有力，展现用户的态度或特点，可以稍微文艺或幽默
3. **emoji**：为这个人选一个最合适的 emoji 来代表 ta
4. **标签 (tags)**：3-5个关键词，可以包括：
   - 身份标签（如"Gap高中生"、"研究生"）
   - 技能标签（如"Cursor编程"、"占星术"）
   - 性格标签（如"实用主义"、"哲学思考者"）
   - 兴趣标签（如"量子计算"、"说唱音乐"）
5. **独特语录 (uniqueQuote)**：10-25字，提炼用户最有趣或最有个性的观点/态度（可以是口头禅、金句、或代表性想法）
6. **背景故事 (background)**：15-35字，一句话概括用户最有趣的背景或经历，体现反差感或独特性`;

    const { object } = await generateObject({
      model: qwen('qwen-plus'),
      schema: profileSchema,
      prompt: prompt,
    });

    return Response.json(object);
  } catch (error) {
    console.error('Error generating profile:', error);
    return Response.json(
      { error: 'Failed to generate profile' },
      { status: 500 }
    );
  }
}
