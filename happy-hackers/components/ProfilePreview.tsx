'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface FormData {
  moods: string[]
  interests: string[]
  project: string
  wechat: string
}

interface Answer {
  selectedOptions: string[]
  customInput: string
}

interface Props {
  formData: FormData
  answers: Answer[]
}

interface Profile {
  title: string
  bio: string
  emoji: string
}

export default function ProfilePreview({ formData, answers }: Props) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const hasGeneratedRef = useRef(false)

  useEffect(() => {
    // Prevent duplicate execution in React Strict Mode
    if (hasGeneratedRef.current) {
      return
    }
    hasGeneratedRef.current = true

    const generateAndSaveProfile = async () => {
      try {
        setIsLoading(true)
        setError(false)

        // Step 1: Generate profile with AI
        const generateResponse = await fetch('/api/generate-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ formData, answers }),
        })

        const profileData = await generateResponse.json()
        if (profileData.error) {
          throw new Error(profileData.error)
        }
        setProfile(profileData)
        setIsLoading(false)

        // Step 2: Save profile to database
        setIsSaving(true)
        const saveResponse = await fetch('/api/save-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            emoji: profileData.emoji,
            title: profileData.title,
            project: formData.project,
            bio: profileData.bio,
            interests: formData.interests,
            moods: formData.moods,
            wechat: formData.wechat,
            answers: answers,
          }),
        })

        const saveResult = await saveResponse.json()
        if (saveResult.error) {
          console.error('Failed to save profile:', saveResult.error)
        } else {
          console.log('Profile saved successfully:', saveResult.user)
        }
      } catch (err) {
        console.error('Failed to generate profile:', err)
        setError(true)
      } finally {
        setIsLoading(false)
        setIsSaving(false)
      }
    }

    generateAndSaveProfile()
  }, [formData, answers])

  // 加载中状态
  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl p-10 shadow-2xl min-h-[400px] flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              className="text-6xl mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              ✨
            </motion.div>
            <h3 className="text-2xl font-outfit font-bold text-gradient mb-2">
              AI 正在生成你的专属名片...
            </h3>
            <p className="text-gray-600">稍等片刻～</p>
          </div>
        </motion.div>
      </div>
    )
  }

  // 错误状态
  if (error || !profile) {
    return (
      <div className="w-full max-w-md mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-10 shadow-2xl text-center"
        >
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-2xl font-outfit font-bold text-gray-800 mb-2">
            生成失败
          </h3>
          <p className="text-gray-600 mb-6">
            AI 生成名片失败，请刷新页面重试
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
    <div className="w-full max-w-md mx-auto px-4">
      {/* Success Header */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="text-center mb-6"
      >
        <div className="inline-block text-7xl mb-4">🎉</div>
        <h2 className="text-3xl font-outfit font-bold text-gradient">
          名片生成完成！
        </h2>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: 'spring' }}
        className="glass rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Decorative Background Blobs */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-hot-pink/20 to-purple/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyber-blue/20 to-electric-lime/20 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative">
          {/* Avatar & Title */}
          <motion.div
            className="flex items-center gap-4 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sunset-orange to-hot-pink flex items-center justify-center text-4xl shadow-lg">
              {profile.emoji}
            </div>
            <div>
              <h3 className="text-2xl font-outfit font-bold text-gray-800">
                {profile.title}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {formData.project}
              </p>
            </div>
          </motion.div>

          {/* Bio */}
          <motion.p
            className="text-gray-700 text-lg mb-6 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {profile.bio}
          </motion.p>

          {/* Tags */}
          <motion.div
            className="flex flex-wrap gap-2 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            {formData.interests.slice(0, 3).map((interest, i) => (
              <motion.span
                key={interest}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.1 + i * 0.1, type: 'spring' }}
                className="px-4 py-2 bg-gradient-to-r from-purple/20 to-cyber-blue/20 text-purple-700 rounded-full text-sm font-medium"
              >
                {interest}
              </motion.span>
            ))}
          </motion.div>

          {/* Current Vibe */}
          <motion.div
            className="pt-6 border-t-2 border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <p className="text-sm text-gray-500">当前状态</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.moods.map((mood, i) => (
                <motion.span
                  key={mood}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.3 + i * 0.1, type: 'spring' }}
                  className="px-3 py-1 bg-gradient-to-r from-hot-pink/20 to-purple/20 text-purple-700 rounded-full text-sm font-medium"
                >
                  {mood}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="mt-6 space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
      >
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-hot-pink via-purple to-cyber-blue text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
        >
          进入 Me 页面 ✨
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-2xl bg-white text-gray-700 font-semibold border-2 border-gray-200 hover:bg-gray-50 transition-all"
        >
          继续完善资料 →
        </motion.button>
      </motion.div>

      {/* Hint */}
      <motion.p
        className="text-center text-sm text-gray-500 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        点击「继续完善资料」可以让 AI 更了解你哦～
      </motion.p>
    </div>
  )
}
