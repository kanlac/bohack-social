# Qwen AI Chatbot Demo

这是一个使用 Vercel AI SDK 和 Qwen Provider 构建的 AI 聊天机器人演示应用。

## 技术栈

- **Next.js 16** - React 框架
- **Vercel AI SDK v6** - AI 应用开发工具包
- **@ai-sdk/openai-compatible** - OpenAI 兼容提供商
- **Qwen API (Compatible Mode)** - 阿里云通义千问 AI 模型
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架

## 实现说明

本项目使用 **Qwen 的 OpenAI Compatible Mode API** 而不是社区的 `qwen-ai-provider`，因为：
- AI SDK v6 需要支持 v2 规范的 provider
- 目前的 `qwen-ai-provider` (v0.1.1) 仍使用 v1 规范
- Qwen 提供了完全兼容 OpenAI 的 API 端点，可以直接使用 `@ai-sdk/openai-compatible`

这种方式更稳定且完全兼容 AI SDK v6 的所有功能。

## 功能特性

- 实时流式对话响应
- 简洁现代的聊天界面
- 支持 Qwen Plus 模型
- 完整的 TypeScript 类型支持

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 文件为 `.env.local`:

```bash
cp .env.example .env.local
```

然后编辑 `.env.local` 文件，添加你的 Qwen API Key:

```env
QWEN_API_KEY=your_actual_api_key_here
```

### 3. 获取 Qwen API Key

1. 访问 [阿里云 DashScope 控制台](https://dashscope.console.aliyun.com/apiKey)
2. 登录或注册账号（使用阿里云中国账号）
3. 创建或查看你的 API Key
4. 将 API Key 复制到 `.env.local` 文件中

**注意**：本项目默认使用**中国大陆区域** endpoint (`https://dashscope.aliyuncs.com`)。如果你使用国际版账号，需要修改 `app/api/chat/route.ts` 中的 `baseURL` 为 `https://dashscope-intl.aliyuncs.com/compatible-mode/v1`

### 4. 运行开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可使用聊天机器人。

## 项目结构

```
chat-app-demo/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Chat API 端点
│   ├── page.tsx                  # 主页面
│   └── layout.tsx                # 根布局
├── components/
│   └── chat.tsx                  # 聊天 UI 组件
├── .env.example                  # 环境变量示例
└── README-CHATBOT.md            # 本文档
```

## 核心代码说明

### API Route ([app/api/chat/route.ts](app/api/chat/route.ts))

使用 Vercel AI SDK 的 `streamText` 函数通过 OpenAI-compatible provider 调用 Qwen API:

```typescript
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { streamText, convertToModelMessages } from 'ai';

// Create Qwen provider using OpenAI-compatible endpoint
const qwen = createOpenAICompatible({
  name: 'qwen',
  baseURL: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.QWEN_API_KEY || '',
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: qwen('qwen-plus'),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
```

**关键点**:
- 使用 `createOpenAICompatible` 创建 provider
- `baseURL` 设置为 Qwen 的 compatible-mode 端点（**中国区**）
- 使用 `convertToModelMessages` (AI SDK v6) 而不是 `convertToCoreMessages`
- 使用 `toUIMessageStreamResponse()` 返回流式响应

**区域选择**:
- 中国大陆：`https://dashscope.aliyuncs.com/compatible-mode/v1` （默认）
- 国际版：`https://dashscope-intl.aliyuncs.com/compatible-mode/v1`

### Chat Component ([components/chat.tsx](components/chat.tsx))

使用 AI SDK v6 的 `useChat` hook 管理聊天状态:

```typescript
'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  // 访问消息内容使用 message.parts
  // {messages.map((message) => (
  //   message.parts.map((part) =>
  //     part.type === 'text' ? <span>{part.text}</span> : null
  //   )
  // ))}
}
```

**AI SDK v6 的变化**:
- 从 `@ai-sdk/react` 导入 `useChat` 而不是 `ai/react`
- 使用 `DefaultChatTransport` 配置 API 端点
- 使用 `sendMessage` 发送消息而不是 `handleSubmit`
- 手动管理 `input` 状态使用 `useState`
- 消息对象有 `parts` 数组，每个 part 有 `type` 和内容字段

## 可用的 Qwen 模型

你可以在 API route 中更换不同的 Qwen 模型:

- `qwen-plus` - 通义千问 Plus (默认)
- `qwen-turbo` - 通义千问 Turbo (更快速)
- `qwen-max` - 通义千问 Max (最强性能)

修改 [app/api/chat/route.ts](app/api/chat/route.ts#L11) 中的模型名称即可:

```typescript
model: qwen('qwen-turbo'), // 更换为其他模型
```

## 调试和故障排除

### 常见问题

1. **401 Unauthorized Error**
   - 检查 `.env.local` 文件是否存在并包含正确的 `QWEN_API_KEY`
   - 确认 API Key 在 [DashScope 控制台](https://dashscope.console.aliyun.com/apiKey) 中有效
   - 重启开发服务器以加载新的环境变量

2. **Module not found: 'ai/react'**
   - AI SDK v6 改变了导入路径
   - 使用 `@ai-sdk/react` 而不是 `ai/react`
   - 运行 `npm install @ai-sdk/react`

3. **Export convertToCoreMessages doesn't exist**
   - AI SDK v6 重命名了这个函数
   - 使用 `convertToModelMessages` 而不是 `convertToCoreMessages`
   - 记得添加 `await` 因为它返回 Promise

4. **AI_UnsupportedModelVersionError: v1**
   - `qwen-ai-provider` 包还不支持 AI SDK v6 的 v2 规范
   - 使用 `@ai-sdk/openai-compatible` 和 Qwen 的 compatible-mode API
   - 参考本项目的实现方式

### 验证设置

运行开发服务器后，打开浏览器控制台：
- 没有编译错误 = 代码配置正确 ✅
- 401 错误 = 需要配置 API Key
- 其他 4xx/5xx 错误 = 检查 API 端点和配置

## 文档参考

- [Vercel AI SDK v6 文档](https://v6.ai-sdk.dev/docs)
- [OpenAI Compatible Providers](https://v6.ai-sdk.dev/providers/openai-compatible-providers)
- [Qwen Compatible Mode API](https://www.alibabacloud.com/help/en/model-studio/compatibility-of-openai-with-dashscope)
- [阿里云 DashScope 文档](https://help.aliyun.com/zh/dashscope/)

## 注意事项

- 确保你的 Qwen API Key 有足够的额度
- API Key 应该保存在 `.env.local` 文件中，不要提交到版本控制
- 生产环境部署时，需要在 Vercel 或其他平台配置环境变量

## 扩展功能建议

- 添加消息历史持久化
- 实现多轮对话上下文管理
- 添加工具调用 (Tool Calling) 功能
- 实现结构化输出 (Structured Output)
- 添加用户认证和会话管理

## License

MIT
