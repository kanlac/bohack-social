'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface Profile {
  id: string
  emoji: string
  title: string
  project: string
  bio: string
  interests: string[]
  moods: string[]
  wechat?: string
}

export default function MePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasProfile, setHasProfile] = useState(false)
  const initialized = useRef(false)
  const router = useRouter()

  useEffect(() => {
    if (initialized.current) {
      return
    }
    initialized.current = true

    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/get-profile')
        const data = await response.json()

        if (data.hasProfile && data.profile) {
          setProfile(data.profile)
          setHasProfile(true)
        } else {
          setHasProfile(false)
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        setHasProfile(false)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: -50 }}
          className="text-center"
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            ✨
          </motion.div>
          <p className="text-gray-600">加载中...</p>
        </motion.div>
      </div>
    )
  }

  // No profile state
  if (!hasProfile || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: -64 }}
          className="max-w-md w-full"
        >
          <div className="glass rounded-3xl p-12 shadow-xl border border-gray-200/50 text-center">
            <div className="text-6xl mb-6">👋</div>
            <h2 className="text-2xl font-outfit font-bold text-gradient mb-4">
              还没有创建名片哦
            </h2>
            <p className="text-gray-600 mb-8">
              完成 Onboarding 问卷后，AI 会为你生成专属名片
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-hot-pink to-purple text-white font-bold shadow-lg"
            >
              开始创建名片 →
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Profile card
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-outfit font-bold text-gradient mb-2">
            我的名片
          </h1>
          <p className="text-gray-600">
            这是 AI 为你生成的专属名片
          </p>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring' }}
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
              transition={{ delay: 0.4 }}
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sunset-orange to-hot-pink flex items-center justify-center text-4xl shadow-lg">
                {profile.emoji}
              </div>
              <div>
                <h3 className="text-2xl font-outfit font-bold text-gray-800">
                  {profile.title}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {profile.project}
                </p>
              </div>
            </motion.div>

            {/* Bio */}
            <motion.p
              className="text-gray-700 text-lg mb-6 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {profile.bio}
            </motion.p>

            {/* Tags */}
            <motion.div
              className="flex flex-wrap gap-2 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {profile.interests.slice(0, 3).map((interest, i) => (
                <motion.span
                  key={interest}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9 + i * 0.1, type: 'spring' }}
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
              transition={{ delay: 1.0 }}
            >
              <p className="text-sm text-gray-500">当前状态</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.moods.map((mood, i) => (
                  <motion.span
                    key={mood}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.1 + i * 0.1, type: 'spring' }}
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
          transition={{ delay: 1.2 }}
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/explore')}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-hot-pink via-purple to-cyber-blue text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
          >
            让你的分身去找人聊聊天 💬
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/')}
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
          transition={{ delay: 1.4 }}
        >
          你的 AI 分身会代表你和其他人的分身对话，找到最适合你的队友～
        </motion.p>
      </motion.div>
    </div>
  )
}
