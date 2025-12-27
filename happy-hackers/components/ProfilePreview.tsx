'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface FormData {
  moods: string[]
  interests: string[]
  project: string
  wechat: string
}

interface Answer {
  question: string
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
  tags?: string[]
  uniqueQuote?: string
  background?: string
}

export default function ProfilePreview({ formData, answers }: Props) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const hasGeneratedRef = useRef(false)
  const router = useRouter()

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
            tags: profileData.tags || [],
            uniqueQuote: profileData.uniqueQuote || '',
            background: profileData.background || '',
          }),
        })

        const saveResult = await saveResponse.json()
        if (saveResult.error) {
          console.error('Failed to save profile:', saveResult.error)
        } else {
          console.log('Profile saved successfully:', saveResult.user)
          // 保存成功后，等待一下然后跳转到 /me 页面
          setTimeout(() => {
            router.push('/me')
          }, 1500)
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
  }, [formData, answers, router])

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
        <p className="text-gray-600 mt-2">即将跳转到你的名片页面...</p>
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

          {/* Background Story */}
          {profile.background && (
            <motion.div
              className="mb-6 p-4 bg-gradient-to-r from-purple/10 to-cyber-blue/10 rounded-2xl border border-purple/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <p className="text-sm text-gray-500 mb-1">背景故事</p>
              <p className="text-gray-700 leading-relaxed">
                {profile.background}
              </p>
            </motion.div>
          )}

          {/* Unique Quote */}
          {profile.uniqueQuote && (
            <motion.div
              className="mb-6 p-4 bg-gradient-to-r from-hot-pink/10 to-purple/10 rounded-2xl border border-hot-pink/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <p className="text-sm text-gray-500 mb-1">独特语录</p>
              <p className="text-gray-700 italic leading-relaxed">
                "{profile.uniqueQuote}"
              </p>
            </motion.div>
          )}

          {/* Tags */}
          <motion.div
            className="flex flex-wrap gap-2 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            {(profile.tags && profile.tags.length > 0 ? profile.tags : formData.interests.slice(0, 3)).map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2 + i * 0.1, type: 'spring' }}
                className="px-4 py-2 bg-gradient-to-r from-purple/20 to-cyber-blue/20 text-purple-700 rounded-full text-sm font-medium"
              >
                {tag}
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
    </div>
  )
}
