'use client'

import { motion } from 'framer-motion'

interface FormData {
  moods: string[]
  interests: string[]
  project: string
  wechat: string
}

interface Props {
  formData: FormData
}

// Mock AI-generated profile data
const generateProfile = (data: FormData) => {
  const titles = [
    '疯狂的诗人',
    '忧郁的码农',
    '灵感捕手',
    '深夜哲学家',
    '代码魔法师',
    '创意游侠',
    '梦想工程师',
  ]

  const bios = [
    '在代码与梦想的交界处游走，用bug换取成长。',
    '白天写代码，夜晚写诗，偶尔也写人生。',
    '相信技术能改变世界，更相信人能改变技术。',
    '不只是敲代码的机器，更是追梦的浪漫主义者。',
  ]

  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    bio: bios[Math.floor(Math.random() * bios.length)],
    vibe: data.moods[0] || '探索者',
    matchScore: Math.floor(Math.random() * 20) + 80,
  }
}

export default function ProfilePreview({ formData }: Props) {
  const profile = generateProfile(formData)

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
              🚀
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

          {/* Vibe & Match Score */}
          <motion.div
            className="flex items-center justify-between pt-6 border-t-2 border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div>
              <p className="text-sm text-gray-500">当前状态</p>
              <p className="text-lg font-semibold text-gray-800">{profile.vibe}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">AI 匹配度</p>
              <p className="text-2xl font-bold text-gradient">{profile.matchScore}%</p>
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
