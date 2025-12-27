'use client'

import { motion } from 'framer-motion'

export default function LoadingTransition() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-6">
      {/* Animated Icon */}
      <motion.div
        className="relative mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        {/* Rotating Rings */}
        <motion.div
          className="absolute inset-0 w-32 h-32"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-hot-pink border-r-purple" />
        </motion.div>
        <motion.div
          className="absolute inset-2 w-28 h-28"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-b-cyber-blue border-l-electric-lime" />
        </motion.div>

        {/* Center Emoji */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <motion.div
            className="text-6xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            ✨
          </motion.div>
        </div>
      </motion.div>

      {/* Loading Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <h2 className="text-3xl sm:text-4xl font-outfit font-bold text-gradient mb-4">
          AI 正在施魔法...
        </h2>
        <motion.p
          className="text-gray-600 text-lg"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          为你生成专属名片
        </motion.p>
      </motion.div>

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            background: ['#FF006E', '#8B5CF6', '#00F5FF', '#CCFF00', '#FF9E00'][i % 5],
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}
