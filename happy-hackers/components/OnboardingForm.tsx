'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface FormData {
  moods: string[]
  interests: string[]
  project: string
  wechat: string
}

interface Props {
  onComplete: (data: FormData) => void
}

const moodOptions = [
  { emoji: '🧑‍💻', label: '疯狂改bug中', color: 'from-hot-pink to-purple' },
  { emoji: '😑', label: '已躺平', color: 'from-purple to-blue-500' },
  { emoji: '👀', label: '四处游荡', color: 'from-cyber-blue to-blue-400' },
  { emoji: '✨', label: '灵感爆发', color: 'from-sunset-orange to-yellow-400' },
  { emoji: '🤝', label: '求队友', color: 'from-electric-lime to-green-400' },
  { emoji: '☕', label: '咖啡续命', color: 'from-amber-600 to-orange-500' },
  { emoji: '🐟', label: '摸鱼中', color: 'from-cyan-400 to-blue-500' },
]

const interestOptions = [
  { label: '设计', icon: '🎨' },
  { label: '医疗', icon: '⚕️' },
  { label: '量子计算', icon: '⚛️' },
  { label: '建筑', icon: '🏛️' },
  { label: 'AI Agent', icon: '🤖' },
  { label: '算法', icon: '📐' },
  { label: '玄学', icon: '🔮' },
  { label: '情感陪伴', icon: '💝' },
]

export default function OnboardingForm({ onComplete }: Props) {
  const [formData, setFormData] = useState<FormData>({
    moods: [],
    interests: [],
    project: '',
    wechat: '',
  })

  const toggleMood = (mood: string) => {
    setFormData(prev => ({
      ...prev,
      moods: prev.moods.includes(mood)
        ? prev.moods.filter(m => m !== mood)
        : [...prev.moods, mood]
    }))
  }

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.moods.length > 0 && formData.interests.length > 0 && formData.project) {
      onComplete(formData)
    }
  }

  const isValid = formData.moods.length > 0 && formData.interests.length > 0 && formData.project.trim()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass rounded-3xl p-6 sm:p-10 shadow-2xl"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-4xl sm:text-5xl font-outfit font-bold text-gradient mb-3">
          嗨！欢迎 👋
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          让我们快速了解一下你～
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Moods Section */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-lg font-semibold font-outfit mb-4 text-gray-800">
            你此刻的状态？ <span className="text-hot-pink">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {moodOptions.map((mood, index) => {
              const isSelected = formData.moods.includes(mood.label)
              return (
                <motion.button
                  key={mood.label}
                  type="button"
                  onClick={() => toggleMood(mood.label)}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    relative p-4 rounded-2xl font-medium transition-all
                    ${isSelected
                      ? `bg-gradient-to-br ${mood.color} text-white shadow-lg`
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                    }
                  `}
                >
                  <div className="text-3xl mb-1">{mood.emoji}</div>
                  <div className="text-sm">{mood.label}</div>
                  {isSelected && (
                    <motion.div
                      layoutId="mood-check"
                      className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center"
                    >
                      <span className="text-xs">✓</span>
                    </motion.div>
                  )}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Interests Section */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <label className="block text-lg font-semibold font-outfit mb-4 text-gray-800">
            感兴趣的话题？ <span className="text-hot-pink">*</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {interestOptions.map((interest, index) => {
              const isSelected = formData.interests.includes(interest.label)
              return (
                <motion.button
                  key={interest.label}
                  type="button"
                  onClick={() => toggleInterest(interest.label)}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    px-5 py-3 rounded-full font-medium transition-all
                    ${isSelected
                      ? 'bg-gradient-to-r from-hot-pink to-purple text-white shadow-lg glow-pink'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                    }
                  `}
                >
                  <span className="mr-2">{interest.icon}</span>
                  {interest.label}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Project Description */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <label className="block text-lg font-semibold font-outfit mb-4 text-gray-800">
            你在做什么项目？ <span className="text-hot-pink">*</span>
          </label>
          <input
            type="text"
            value={formData.project}
            onChange={(e) => setFormData({ ...formData, project: e.target.value })}
            placeholder="用一句话描述你在做的项目..."
            className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-gray-200 focus:border-hot-pink focus:outline-none text-gray-800 placeholder-gray-400 transition-all"
          />
        </motion.div>

        {/* WeChat ID */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <label className="block text-lg font-semibold font-outfit mb-4 text-gray-800">
            微信ID <span className="text-gray-400 text-sm font-normal">(选填)</span>
          </label>
          <input
            type="text"
            value={formData.wechat}
            onChange={(e) => setFormData({ ...formData, wechat: e.target.value })}
            placeholder="你的微信ID（选填）"
            className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-gray-200 focus:border-cyber-blue focus:outline-none text-gray-800 placeholder-gray-400 transition-all"
          />
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={!isValid}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          whileHover={isValid ? { scale: 1.02, y: -2 } : {}}
          whileTap={isValid ? { scale: 0.98 } : {}}
          className={`
            w-full py-5 rounded-2xl font-bold text-lg font-outfit transition-all
            ${isValid
              ? 'bg-gradient-to-r from-hot-pink via-purple to-cyber-blue text-white shadow-xl hover:shadow-2xl glow-pink'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isValid ? '继续 ✨' : '请完成必填项'}
        </motion.button>
      </form>
    </motion.div>
  )
}
