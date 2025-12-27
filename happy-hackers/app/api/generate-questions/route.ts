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
            question: '如果你的项目是一种动物，会是什么？🦄',
            options: [
              '🦉 猫头鹰 - 夜间最活跃',
              '🐆 猎豹 - 追求速度与效率',
              '🦥 树懒 - 慢工出细活',
              '🦊 狐狸 - 聪明且灵活'
            ]
          },
          {
            question: '凌晨3点的你通常在做什么？',
            options: [
              '💻 还在写代码',
              '😴 早就睡了',
              '🎮 打游戏放松',
              '📚 看技术文档学习'
            ]
          },
          {
            question: '你最想在黑客松遇到什么样的队友？',
            options: [
              '🚀 技术大牛，能快速实现想法',
              '🎨 设计高手，让产品颜值爆表',
              '💡 创意达人，脑洞大开',
              '🤝 团队粘合剂，氛围担当'
            ]
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
            question: '如果你的项目是一种动物，会是什么？🦄',
            options: [
              '🦉 猫头鹰 - 夜间最活跃',
              '🐆 猎豹 - 追求速度与效率',
              '🦥 树懒 - 慢工出细活',
              '🦊 狐狸 - 聪明且灵活'
            ]
          },
          {
            question: '凌晨3点的你通常在做什么？',
            options: [
              '💻 还在写代码',
              '😴 早就睡了',
              '🎮 打游戏放松',
              '📚 看技术文档学习'
            ]
          },
          {
            question: '你最想在黑客松遇到什么样的队友？',
            options: [
              '🚀 技术大牛，能快速实现想法',
              '🎨 设计高手，让产品颜值爆表',
              '💡 创意达人，脑洞大开',
              '🤝 团队粘合剂，氛围担当'
            ]
          },
        ],
      },
      { status: 200 } // 即使出错也返回默认问题
    );
  }
}
