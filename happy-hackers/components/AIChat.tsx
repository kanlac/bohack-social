'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FormData {
  moods: string[]
  interests: string[]
  project: string
  wechat?: string
}

interface Question {
  question: string
  placeholder: string
}

interface Props {
  formData: FormData
  onComplete: () => void
  onSkip: () => void
}

const defaultQuestions: Question[] = [
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
]

export default function AIChat({ formData, onComplete, onSkip }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>(['', '', ''])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [aiQuestions, setAiQuestions] = useState<Question[]>(defaultQuestions)
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true)

  useEffect(() => {
    // 加载 AI 生成的问题
    const loadQuestions = async () => {
      try {
        setIsLoadingQuestions(true)
        const response = await fetch('/api/generate-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        const data = await response.json()
        if (data.questions && data.questions.length === 3) {
          setAiQuestions(data.questions)
          setAnswers(new Array(data.questions.length).fill(''))
        }
      } catch (error) {
        console.error('Failed to load AI questions:', error)
        // 使用默认问题
      } finally {
        setIsLoadingQuestions(false)
      }
    }

    loadQuestions()
  }, [formData])

  useEffect(() => {
    // Simulate AI typing when question changes
    if (!isLoadingQuestions) {
      setIsTyping(true)
      const timer = setTimeout(() => {
        setIsTyping(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [currentQuestion, isLoadingQuestions])

  const handleNext = () => {
    if (currentAnswer.trim()) {
      const newAnswers = [...answers]
      newAnswers[currentQuestion] = currentAnswer
      setAnswers(newAnswers)
      setCurrentAnswer('')

      if (currentQuestion < aiQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        onComplete()
      }
    }
  }

  const handleSkip = () => {
    if (currentQuestion < aiQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setCurrentAnswer('')
    } else {
      onSkip()
    }
  }

  const progress = ((currentQuestion + 1) / aiQuestions.length) * 100

  return (
    <div className="glass rounded-3xl p-6 sm:p-10 shadow-2xl max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h2 className="text-3xl sm:text-4xl font-outfit font-bold text-gradient mb-3">
          让我们聊聊 💬
        </h2>
        <p className="text-gray-600">
          回答几个有趣的问题，让 AI 更了解你～
        </p>

        {/* Progress Bar */}
        <div className="mt-6 bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-hot-pink via-purple to-cyber-blue"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          问题 {currentQuestion + 1} / {aiQuestions.length}
        </p>
      </motion.div>

      {/* Chat Area */}
      <div className="space-y-6 mb-8 min-h-[300px]">
        <AnimatePresence mode="wait">
          {/* AI Question */}
          <motion.div
            key={`question-${currentQuestion}`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
            className="flex items-start gap-3"
          >
            <motion.div
              className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-hot-pink to-purple flex items-center justify-center text-2xl shadow-lg"
              animate={isTyping ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.6, repeat: isTyping ? Infinity : 0 }}
            >
              🤖
            </motion.div>
            <motion.div
              className="flex-1 bg-white rounded-2xl rounded-tl-sm p-5 shadow-md"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {isTyping ? (
                <div className="flex gap-1">
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              ) : (
                <p className="text-gray-800 text-lg">
                  {aiQuestions[currentQuestion].question}
                </p>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Previous Answers */}
        <AnimatePresence>
          {answers[currentQuestion] && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 justify-end"
            >
              <div className="flex-1 bg-gradient-to-br from-cyber-blue to-blue-400 rounded-2xl rounded-tr-sm p-5 shadow-md max-w-md ml-auto">
                <p className="text-white text-lg">
                  {answers[currentQuestion]}
                </p>
              </div>
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-sunset-orange to-yellow-400 flex items-center justify-center text-2xl shadow-lg">
                😊
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div className="relative">
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                if (currentAnswer.trim()) handleNext()
              }
            }}
            placeholder={aiQuestions[currentQuestion].placeholder}
            rows={3}
            className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-gray-200 focus:border-cyber-blue focus:outline-none text-gray-800 placeholder-gray-400 resize-none transition-all"
          />
          <motion.button
            onClick={handleNext}
            disabled={!currentAnswer.trim()}
            whileHover={currentAnswer.trim() ? { scale: 1.1 } : {}}
            whileTap={currentAnswer.trim() ? { scale: 0.9 } : {}}
            className={`
              absolute bottom-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center transition-all
              ${currentAnswer.trim()
                ? 'bg-gradient-to-br from-cyber-blue to-blue-500 text-white shadow-lg cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </motion.button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.button
            onClick={handleSkip}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-4 rounded-2xl bg-white text-gray-600 font-semibold border-2 border-gray-200 hover:bg-gray-50 transition-all"
          >
            跳过这题 →
          </motion.button>
          {currentQuestion === aiQuestions.length - 1 && (
            <motion.button
              onClick={onComplete}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-electric-lime to-green-400 text-gray-800 font-bold shadow-lg hover:shadow-xl transition-all"
            >
              完成 ✨
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
