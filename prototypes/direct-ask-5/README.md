# 黑客松社交应用 - Onboarding 原型

一个充满活力的黑客松社交应用 onboarding 流程原型，采用 Gen Z 美学设计。

## 特性

- 🎨 **大胆的视觉设计** - 活力色彩、渐变、玻璃态效果
- ✨ **流畅动画** - 使用 Framer Motion 打造丝滑的微交互
- 📱 **响应式设计** - Mobile-first，适配各种屏幕尺寸
- 🤖 **AI 对话** - 模拟 AI 提问和互动体验
- 💫 **三步流程** - 表单填写 → AI 对话 → 名片生成

## 技术栈

- **框架**: Next.js 15 + React 18
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **语言**: TypeScript
- **字体**: Outfit (标题) + Manrope (正文)

## 快速开始

### 安装依赖

```bash
npm install
```

### 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3005](http://localhost:3005) 查看原型。

### 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
prototypes/direct-ask-5/
├── app/
│   ├── globals.css          # 全局样式和自定义 CSS
│   ├── layout.tsx            # 根布局组件
│   └── page.tsx              # 主页面（流程编排）
├── components/
│   ├── OnboardingForm.tsx    # 表单填写组件
│   ├── AIChat.tsx            # AI 对话组件
│   ├── LoadingTransition.tsx # 加载过渡动画
│   └── ProfilePreview.tsx    # 名片预览组件
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 流程说明

### 1️⃣ 表单填写
用户填写基本信息：
- 当前状态/感受（多选）
- 感兴趣的话题（多选）
- 项目描述（必填）
- 微信 ID（选填）

### 2️⃣ AI 对话
AI 提出三个有趣问题：
- 如果你的项目是一种动物...
- 凌晨3点的你在做什么
- 你想遇到什么样的队友

用户可以选择回答或跳过。

### 3️⃣ 名片生成
展示 AI 生成的个性化名片：
- 专属代号（如"疯狂的诗人"）
- AI 撰写的个性简介
- 技能标签
- 匹配度评分

## 设计理念

### 色彩系统
- **Electric Lime** (#CCFF00) - 能量与活力
- **Hot Pink** (#FF006E) - 激情与创造力
- **Cyber Blue** (#00F5FF) - 科技与未来
- **Sunset Orange** (#FF9E00) - 温暖与友好
- **Purple** (#8B5CF6) - 想象与神秘

### 交互原则
- **即时反馈**: 每个操作都有视觉反馈
- **弹性动画**: 使用 spring 动画营造活力感
- **渐进披露**: 分步引导，避免信息过载
- **有趣友好**: 使用 emoji 和轻松的文案

## Mock 数据

所有数据均为 mock，无需后端：
- AI 问题预设在 `AIChat.tsx`
- 名片数据随机生成于 `ProfilePreview.tsx`
- 可根据需要修改 mock 数据

## 自定义

### 修改颜色主题
编辑 `tailwind.config.js`:

```js
colors: {
  'electric-lime': '#CCFF00',
  'hot-pink': '#FF006E',
  // ... 添加你的颜色
}
```

### 修改动画
编辑 `tailwind.config.js` 的 `animation` 和 `keyframes` 部分。

### 修改字体
在 `app/globals.css` 中更新 Google Fonts 导入。

## 许可

仅供 hackathon 原型展示使用。
