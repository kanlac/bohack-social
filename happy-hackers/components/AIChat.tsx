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
  options: string[]
}

interface Answer {
  selectedOptions: string[]
  customInput: string
}

interface Props {
  formData: FormData
  onComplete: (answers: Answer[]) => void
  onSkip: () => void
}

export default function AIChat({ formData, onComplete, onSkip }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [customInput, setCustomInput] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [aiQuestions, setAiQuestions] = useState<Question[]>([])
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    // 加载 AI 生成的问题
    const loadQuestions = async () => {
      try {
        setIsLoadingQuestions(true)
        setLoadError(false)
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
          setAnswers(new Array(data.questions.length).fill({ selectedOptions: [], customInput: '' }))
        } else {
          throw new Error('Invalid questions format')
        }
      } catch (error) {
        console.error('Failed to load AI questions:', error)
        setLoadError(true)
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

  const toggleOption = (option: string) => {
    setSelectedOptions(prev =>
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option]
    )
  }

  const handleNext = () => {
    if (selectedOptions.length > 0 || customInput.trim()) {
      const newAnswers = [...answers]
      newAnswers[currentQuestion] = {
        selectedOptions: [...selectedOptions],
        customInput: customInput
      }
      setAnswers(newAnswers)
      setSelectedOptions([])
      setCustomInput('')

      if (currentQuestion < aiQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        onComplete(newAnswers)
      }
    }
  }

  const handleSkip = () => {
    setSelectedOptions([])
    setCustomInput('')

    if (currentQuestion < aiQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      onSkip()
    }
  }

  const canProceed = selectedOptions.length > 0 || customInput.trim().length > 0

  const progress = aiQuestions.length > 0 ? ((currentQuestion + 1) / aiQuestions.length) * 100 : 0

  // 加载中状态
  if (isLoadingQuestions) {
    return (
      <div className="glass rounded-3xl p-6 sm:p-10 shadow-2xl max-w-2xl mx-auto min-h-[400px] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            className="w-20 h-20 rounded-full bg-gradient-to-br from-hot-pink to-purple flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            🤖
          </motion.div>
          <h3 className="text-2xl font-outfit font-bold text-gradient mb-2">
            AI 正在生成问题...
          </h3>
          <p className="text-gray-600">
            根据你的信息量身定制有趣的问题～
          </p>
        </motion.div>
      </div>
    )
  }

  // 错误状态
  if (loadError || aiQuestions.length === 0) {
    return (
      <div className="glass rounded-3xl p-6 sm:p-10 shadow-2xl max-w-2xl mx-auto min-h-[400px] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-2xl font-outfit font-bold text-gray-800 mb-2">
            哎呀，出错了
          </h3>
          <p className="text-gray-600 mb-6">
            AI 生成问题失败，请刷新页面重试
          </p>
          <motion.button
            onClick={() => window.location.reload()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-hot-pink to-purple text-white font-semibold shadow-lg"
          >
            刷新页面
          </motion.button>
        </motion.div>
      </div>
    )
  }

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
          {answers[currentQuestion] && (answers[currentQuestion].selectedOptions.length > 0 || answers[currentQuestion].customInput) && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 justify-end"
            >
              <div className="flex-1 bg-gradient-to-br from-cyber-blue to-blue-400 rounded-2xl rounded-tr-sm p-5 shadow-md max-w-md ml-auto">
                {answers[currentQuestion].selectedOptions.length > 0 && (
                  <div className="text-white mb-2">
                    {answers[currentQuestion].selectedOptions.map((opt, idx) => (
                      <div key={idx} className="text-sm mb-1">✓ {opt}</div>
                    ))}
                  </div>
                )}
                {answers[currentQuestion].customInput && (
                  <p className="text-white text-sm italic border-t border-white/30 pt-2 mt-2">
                    💭 {answers[currentQuestion].customInput}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-sunset-orange to-yellow-400 flex items-center justify-center text-2xl shadow-lg">
                😊
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Answer Area - Multiple Choice + Custom Input */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {/* Multiple Choice Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {aiQuestions[currentQuestion].options.map((option, index) => {
            const isSelected = selectedOptions.includes(option)
            return (
              <motion.button
                key={index}
                type="button"
                onClick={() => toggleOption(option)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative p-4 rounded-2xl text-left font-medium transition-all
                  ${isSelected
                    ? 'bg-gradient-to-br from-cyber-blue to-blue-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0
                    ${isSelected ? 'border-white bg-white' : 'border-gray-300'}
                  `}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-cyber-blue" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm">{option}</span>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Custom Input */}
        <div className="relative">
          <textarea
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="或者，输入你自己的想法..."
            rows={2}
            className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-gray-200 focus:border-purple focus:outline-none text-gray-800 placeholder-gray-400 resize-none transition-all"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.button
            onClick={handleSkip}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="py-4 px-6 rounded-2xl bg-white text-gray-600 font-semibold border-2 border-gray-200 hover:bg-gray-50 transition-all"
          >
            跳过 →
          </motion.button>
          <motion.button
            onClick={handleNext}
            disabled={!canProceed}
            whileHover={canProceed ? { scale: 1.02 } : {}}
            whileTap={canProceed ? { scale: 0.98 } : {}}
            className={`
              flex-1 py-4 rounded-2xl font-bold transition-all
              ${canProceed
                ? currentQuestion === aiQuestions.length - 1
                  ? 'bg-gradient-to-r from-electric-lime to-green-400 text-gray-800 shadow-lg hover:shadow-xl'
                  : 'bg-gradient-to-r from-cyber-blue to-blue-500 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {currentQuestion === aiQuestions.length - 1 ? '完成 ✨' : '下一题 →'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
