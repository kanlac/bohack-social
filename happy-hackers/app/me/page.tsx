'use client'

import { motion } from 'framer-motion'
import { useUserId } from '@/lib/hooks/useUserId'
import { clearUserId } from '@/lib/user'
import { useRouter } from 'next/navigation'

export default function MePage() {
  const userId = useUserId()
  const router = useRouter()

  const handleClearId = () => {
    if (confirm('确定要清除用户 ID 吗？这将重新生成一个新的 ID。')) {
      clearUserId()
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="glass rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-200/50">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-hot-pink to-purple rounded-full flex items-center justify-center text-5xl"
            >
              👤
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-outfit font-bold text-gradient mb-2">
              我的信息
            </h1>
            <p className="text-gray-600">
              这是你的身份信息，会自动保存在浏览器中
            </p>
          </div>

          {/* User ID Section */}
          <div className="space-y-6">
            <div className="bg-white/60 rounded-2xl p-6 border border-gray-200/50">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                用户 ID
              </label>
              <div className="bg-white rounded-xl p-4 border border-gray-300/50">
                <code className="text-sm text-gray-800 break-all font-mono">
                  {userId || '加载中...'}
                </code>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                💡 此 ID 保存在 Cookie 和 LocalStorage 中，不换浏览器和清除数据的情况下会一直保留
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200/50"
              >
                <div className="text-3xl mb-2">🍪</div>
                <h3 className="font-semibold text-gray-800 mb-1">Cookie 保存</h3>
                <p className="text-sm text-gray-600">
                  有效期 1 年
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50"
              >
                <div className="text-3xl mb-2">💾</div>
                <h3 className="font-semibold text-gray-800 mb-1">本地备份</h3>
                <p className="text-sm text-gray-600">
                  LocalStorage 双重保护
                </p>
              </motion.div>
            </div>

            {/* Actions */}
            <div className="pt-4 space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClearId}
                className="w-full px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
              >
                🗑️ 清除用户 ID（仅用于测试）
              </motion.button>

              <p className="text-xs text-center text-gray-500">
                清除后刷新页面会自动生成新的 ID
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
