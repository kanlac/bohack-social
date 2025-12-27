# Vercel AI SDK v6 + Qwen 集成要点

## 核心问题与解决方案

1. **AI SDK v6 API 变化**：`ai/react` → `@ai-sdk/react`，`convertToCoreMessages` → `convertToModelMessages`
2. **Provider 兼容性**：`qwen-ai-provider` 不支持 v2 规范，使用 `@ai-sdk/openai-compatible` + Qwen compatible-mode API
3. **区域 endpoint**：国内 API key 需使用 `dashscope.aliyuncs.com`，国际版用 `dashscope-intl.aliyuncs.com`
4. **环境变量加载**：修改 `.env.local` 后必须重启开发服务器
5. **消息结构**：v6 中消息有 `parts` 数组，需遍历 `part.type === 'text'` 获取内容

## 验证方法
```bash
curl -X POST https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions \
  -H "Authorization: Bearer $QWEN_API_KEY" -H "Content-Type: application/json" \
  -d '{"model":"qwen-plus","messages":[{"role":"user","content":"test"}]}'
```

## 关键要点

6. **Structured Outputs**：用 `generateObject` + Zod schema 替代 `generateText`，100% 保证 JSON 格式
7. **Qwen JSON 模式**：prompt 必须包含 "json" 关键词，否则报错 `<400> must contain the word 'json'`
8. **React Strict Mode**：useEffect 会执行两次，用 `useRef` 防止重复（成功后才设置 `ref.current = true`）
