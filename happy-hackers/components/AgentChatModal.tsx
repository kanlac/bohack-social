'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface User {
  emoji: string
  title: string
  project: string
}

interface Message {
  role: 'user1' | 'user2'
  content: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  user1: User
  user2: User
}

export default function AgentChatModal({ isOpen, onClose, user1, user2 }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasStartedRef = useRef(false)

  // Mock 对话数据
  const mockConversation: Message[] = [
    { role: 'user1', content: '嘿！看到你在做 Web3 钱包，界面设计得怎么样？' },
    { role: 'user2', content: '哈哈，还在打磨中！你的 AI 聊天机器人听起来很酷，用的什么模型？' },
    { role: 'user1', content: '主要用 Qwen，正在优化 prompt。你的钱包支持哪些链？' },
    { role: 'user2', content: '目前支持 ETH 和 Polygon，准备加入 Solana。你的机器人有什么特别功能吗？' },
    { role: 'user1', content: '我在尝试让它理解用户情绪，做出更人性化的回应。你用什么框架做前端？' },
    { role: 'user2', content: 'Next.js + Tailwind，动画用 Framer Motion。情绪识别听起来很有挑战性！' },
    { role: 'user1', content: '是啊，正在调教 AI 的语气。要不要合作？你的 UI 能力 + 我的后端，可以做个很酷的产品。' },
    { role: 'user2', content: '好主意！我一直想给钱包加个 AI 助手，帮用户解释交易。' },
    { role: 'user1', content: '完美！我的 AI 正好可以做这个。咱们黑客松结束后聊聊？' },
    { role: 'user2', content: '必须的！加个微信吧，我是 frontend_wiz' }
  ]

  // 自动播放对话
  useEffect(() => {
    if (isOpen && !hasStartedRef.current) {
      hasStartedRef.current = true
      setMessages([])
      setIsGenerating(true)

      const timers: NodeJS.Timeout[] = []

      // 逐条添加消息
      mockConversation.forEach((msg, index) => {
        const timer = setTimeout(() => {
          setMessages(prev => [...prev, msg])

          // 最后一条消息后停止生成状态
          if (index === mockConversation.length - 1) {
            setTimeout(() => setIsGenerating(false), 500)
          }
        }, index * 1500) // 每条消息间隔 1.5 秒
        timers.push(timer)
      })

      // Cleanup: 清除所有定时器
      return () => {
        timers.forEach(timer => clearTimeout(timer))
      }
    }

    // 重置 ref 当 Modal 关闭时
    if (!isOpen) {
      hasStartedRef.current = false
    }
  }, [isOpen])

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-6xl h-[90vh] rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border border-purple-500/20 shadow-2xl shadow-purple-500/20"
        >
          {/* Animated background grid */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(to right, rgb(139, 92, 246) 1px, transparent 1px),
                linear-gradient(to bottom, rgb(139, 92, 246) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }} />
          </div>

          {/* Header with users */}
          <div className="relative z-10 p-8 border-b border-purple-500/20 bg-slate-900/50 backdrop-blur-xl">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              {/* User 1 */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500/30 blur-xl rounded-full animate-pulse" />
                  <div className="relative text-6xl">{user1.emoji}</div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    {user1.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">{user1.project}</p>
                </div>
              </motion.div>

              {/* Connection line */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex-1 mx-8 relative"
              >
                <div className="relative h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                    animate={{
                      x: ['-100%', '100%']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                  />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-full">
                  <span className="text-xs font-mono text-purple-400 tracking-wider">NEURAL SYNC</span>
                </div>
              </motion.div>

              {/* User 2 */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4"
              >
                <div className="text-right">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                    {user2.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">{user2.project}</p>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-pink-500/30 blur-xl rounded-full animate-pulse" />
                  <div className="relative text-6xl">{user2.emoji}</div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Chat messages */}
          <div className="relative z-10 h-[calc(90vh-240px)] overflow-y-auto p-8 space-y-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className={`flex items-start gap-3 ${
                      msg.role === 'user2' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div className={`relative flex-shrink-0 text-3xl ${
                      msg.role === 'user1'
                        ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20'
                        : 'bg-gradient-to-br from-pink-500/20 to-purple-500/20'
                    } p-2 rounded-2xl border ${
                      msg.role === 'user1' ? 'border-cyan-500/30' : 'border-pink-500/30'
                    }`}>
                      <div className={`absolute inset-0 ${
                        msg.role === 'user1' ? 'bg-cyan-500/10' : 'bg-pink-500/10'
                      } blur-xl rounded-2xl`} />
                      <span className="relative">
                        {msg.role === 'user1' ? user1.emoji : user2.emoji}
                      </span>
                    </div>

                    {/* Message bubble */}
                    <div className={`flex-1 ${msg.role === 'user2' ? 'flex justify-end' : ''}`}>
                      <div className={`max-w-2xl ${
                        msg.role === 'user1'
                          ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30'
                          : 'bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-500/30'
                      } backdrop-blur-xl border rounded-3xl p-5 shadow-lg ${
                        msg.role === 'user1' ? 'rounded-tl-md' : 'rounded-tr-md'
                      }`}>
                        <div className={`text-xs font-mono mb-2 ${
                          msg.role === 'user1' ? 'text-cyan-400' : 'text-pink-400'
                        }`}>
                          {msg.role === 'user1' ? `我（${user1.title}）` : user2.title}
                        </div>
                        <p className="text-white leading-relaxed">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Generating indicator */}
            {isGenerating && messages.length < mockConversation.length && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 max-w-4xl mx-auto"
              >
                <div className="flex gap-1.5 px-4 py-3 bg-purple-500/10 border border-purple-500/30 rounded-2xl backdrop-blur-xl">
                  <motion.div
                    className="w-2 h-2 bg-purple-400 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-purple-400 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-purple-400 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
                <span className="text-sm text-purple-400 font-mono">思维同步中...</span>
              </motion.div>
            )}
          </div>

          {/* Footer controls */}
          <div className="relative z-10 p-6 border-t border-purple-500/20 bg-slate-900/50 backdrop-blur-xl">
            <div className="flex items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-slate-700 to-slate-600 text-white font-semibold shadow-lg border border-slate-500/50 hover:border-slate-400/50 transition-colors"
              >
                关闭
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isGenerating}
                className={`px-8 py-3 rounded-xl font-semibold shadow-lg border transition-all ${
                  isGenerating
                    ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-500/50 hover:border-purple-400/50 hover:shadow-purple-500/50'
                }`}
              >
                {isGenerating ? '生成中...' : '重新生成'}
              </motion.button>
            </div>
          </div>

          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-slate-800/50 backdrop-blur-xl border border-purple-500/30 flex items-center justify-center text-purple-400 hover:bg-slate-700/50 hover:border-purple-400/50 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
