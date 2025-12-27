'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import AgentChatModal from '@/components/AgentChatModal'

interface User {
  id: string
  emoji: string
  title: string
  project: string
  bio: string
  interests: string[]
  moods: string[]
  color: string // 个性化颜色主题
}

interface MyProfile {
  id: string
  emoji: string
  title: string
  project: string
  bio: string
  interests: string[]
  moods: string[]
  wechat?: string
}

// Mock data - 柔和配色版本
const MOCK_USERS: User[] = [
  {
    id: '1',
    emoji: '🌙',
    title: '深夜代码诗人',
    project: '用AI写诗的聊天机器人',
    bio: '代码是我的韵脉，bug是我的灵感',
    interests: ['AI/机器学习', '开源项目', '前端技术'],
    moods: ['疯狂改bug中', '灵感爆发'],
    color: 'from-indigo-400 to-purple-500',
  },
  {
    id: '2',
    emoji: '⚡',
    title: 'Web3冲浪者',
    project: 'NFT艺术品交易平台',
    bio: '在区块链的浪潮中寻找下一个风口',
    interests: ['Web3/区块链', '设计/UI/UX', '游戏开发'],
    moods: ['求队友', '四处游荡'],
    color: 'from-cyan-400 to-blue-500',
  },
  {
    id: '3',
    emoji: '🎨',
    title: '像素魔法师',
    project: '开源设计系统组件库',
    bio: '每个像素都是精心调教的艺术品',
    interests: ['设计/UI/UX', '前端技术', '开源项目'],
    moods: ['灵感爆发', '咖啡续命'],
    color: 'from-pink-400 to-rose-500',
  },
  {
    id: '4',
    emoji: '🔥',
    title: 'AI炼金术士',
    project: '智能代码审查助手',
    bio: '用机器学习点石成金',
    interests: ['AI/机器学习', '后端架构', '开源项目'],
    moods: ['疯狂改bug中', '咖啡续命'],
    color: 'from-orange-400 to-red-500',
  },
  {
    id: '5',
    emoji: '🌈',
    title: '全栈梦想家',
    project: '实时协作白板应用',
    bio: '前端后端都是我的战场',
    interests: ['前端技术', '后端架构', 'AI/机器学习'],
    moods: ['求队友', '灵感爆发'],
    color: 'from-violet-400 to-purple-500',
  },
  {
    id: '6',
    emoji: '🎮',
    title: '游戏宇宙建造师',
    project: '元宇宙社交游戏引擎',
    bio: '用代码创造平行世界',
    interests: ['游戏开发', 'Web3/区块链', 'AI/机器学习'],
    moods: ['四处游荡', '摸鱼中'],
    color: 'from-emerald-400 to-teal-500',
  },
  {
    id: '7',
    emoji: '🤖',
    title: '机器人驯兽师',
    project: '智能家居控制系统',
    bio: '让机器听我的指挥',
    interests: ['硬件/IoT', 'AI/机器学习', '后端架构'],
    moods: ['疯狂改bug中', '已躺平'],
    color: 'from-slate-400 to-gray-500',
  },
  {
    id: '8',
    emoji: '✨',
    title: '开源传教士',
    project: '开发者工具CLI框架',
    bio: '开源改变世界，从我做起',
    interests: ['开源项目', '前端技术', '后端架构'],
    moods: ['灵感爆发', '咖啡续命'],
    color: 'from-amber-400 to-yellow-500',
  },
  {
    id: '9',
    emoji: '🚀',
    title: '性能狂魔',
    project: '超快速Web渲染引擎',
    bio: '每一毫秒都值得优化',
    interests: ['前端技术', '后端架构', '开源项目'],
    moods: ['疯狂改bug中', '求队友'],
    color: 'from-sky-400 to-blue-500',
  },
  {
    id: '10',
    emoji: '🎭',
    title: '体验设计者',
    project: '无障碍交互组件库',
    bio: '让每个人都能享受科技之美',
    interests: ['设计/UI/UX', '前端技术', '开源项目'],
    moods: ['灵感爆发', '四处游荡'],
    color: 'from-fuchsia-400 to-pink-500',
  },
]

const ALL_INTERESTS = [
  'AI/机器学习',
  'Web3/区块链',
  '游戏开发',
  '前端技术',
  '后端架构',
  '设计/UI/UX',
  '硬件/IoT',
  '开源项目',
]

export default function ExplorePageV2() {
  const [myProfile, setMyProfile] = useState<MyProfile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [hasProfile, setHasProfile] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [chatTargetUser, setChatTargetUser] = useState<User | null>(null)
  const initialized = useRef(false)
  const router = useRouter()

  // 获取当前用户的 profile
  useEffect(() => {
    if (initialized.current) {
      return
    }
    initialized.current = true

    const fetchMyProfile = async () => {
      try {
        const response = await fetch('/api/get-profile')
        const data = await response.json()

        if (data.hasProfile && data.profile) {
          setMyProfile(data.profile)
          setHasProfile(true)
        } else {
          setHasProfile(false)
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        setHasProfile(false)
      } finally {
        setIsLoadingProfile(false)
      }
    }

    fetchMyProfile()
  }, [])

  const filteredUsers = MOCK_USERS.filter(user => {
    const matchesInterests = selectedInterests.length === 0 ||
      selectedInterests.some(interest => user.interests.includes(interest))
    const matchesSearch = searchQuery === '' ||
      user.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.project.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesInterests && matchesSearch
  })

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  // Loading state
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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

  // No profile - guide to onboarding
  if (!hasProfile || !myProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="glass rounded-3xl p-12 shadow-xl border border-gray-200/50 text-center">
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="text-2xl font-outfit font-bold text-gradient mb-4">
              开始你的社交之旅
            </h2>
            <p className="text-gray-600 mb-8">
              完成 Onboarding 问卷，让 AI 为你生成专属名片，然后你的分身就可以代表你去找队友啦！
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

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-8"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-outfit font-bold text-gradient mb-4">
          探索现场 Hackers 🔍
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          {filteredUsers.length} 位黑客正在现场创造奇迹
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索称号或项目..."
            className="w-full sm:w-96 px-6 py-4 rounded-2xl glass border-2 border-gray-200 focus:border-cyber-blue focus:outline-none text-gray-800 placeholder-gray-400 transition-all"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2"
        >
          {ALL_INTERESTS.map((interest, index) => {
            const isSelected = selectedInterests.includes(interest)
            return (
              <motion.button
                key={interest}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                onClick={() => toggleInterest(interest)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  px-4 py-2 rounded-full font-medium transition-all
                  ${isSelected
                    ? 'bg-gradient-to-r from-hot-pink to-purple text-white shadow-lg'
                    : 'glass text-gray-700 hover:bg-white/80 border border-gray-200'
                  }
                `}
              >
                {interest}
              </motion.button>
            )
          })}
        </motion.div>
      </motion.div>

      {/* User Cards Grid */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{
                  delay: index * 0.05,
                  type: 'spring',
                  stiffness: 300,
                  damping: 25
                }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => setSelectedUser(user)}
                className="glass rounded-3xl p-6 cursor-pointer hover:shadow-2xl transition-shadow relative overflow-hidden group"
              >
                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${user.color} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`} />

                <div className="relative">
                  {/* Emoji Avatar - 柔和渐变背景 */}
                  <motion.div
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${user.color} bg-opacity-20 backdrop-blur-sm flex items-center justify-center text-5xl shadow-md mb-4 relative`}
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="absolute inset-0 bg-white/40 rounded-2xl" />
                    <span className="relative z-10">{user.emoji}</span>
                  </motion.div>

                  <h3 className="text-2xl font-outfit font-bold text-gray-800 mb-2 group-hover:text-gradient transition-all">
                    {user.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {user.project}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {user.interests.slice(0, 3).map((interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1 bg-gradient-to-r from-purple/20 to-cyber-blue/20 text-purple-700 rounded-full text-xs font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 text-sm text-gray-500">
                    {user.moods.slice(0, 2).map((mood) => (
                      <span key={mood} className="opacity-75">
                        {mood}
                      </span>
                    ))}
                  </div>

                  <motion.div
                    className="absolute bottom-4 right-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredUsers.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-outfit font-bold text-gray-800 mb-2">
              没有找到匹配的 Hacker
            </h3>
            <p className="text-gray-600">
              试试调整筛选条件或搜索关键词
            </p>
          </motion.div>
        )}
      </div>

      {/* Detail Modal - 同样使用个性化颜色 */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="glass rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedUser(null)
                  }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors z-10 cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>

                <div className={`absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br ${selectedUser.color} opacity-20 rounded-full blur-3xl`} />
                <div className={`absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr ${selectedUser.color} opacity-20 rounded-full blur-3xl`} />

                <div className="relative">
                  <div className="flex items-center gap-6 mb-6">
                    <motion.div
                      className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${selectedUser.color} bg-opacity-20 backdrop-blur-sm flex items-center justify-center text-6xl shadow-lg flex-shrink-0 relative`}
                      animate={{ rotate: [0, -5, 5, -5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="absolute inset-0 bg-white/40 rounded-2xl" />
                      <span className="relative z-10">{selectedUser.emoji}</span>
                    </motion.div>
                    <div>
                      <h2 className="text-3xl font-outfit font-bold text-gradient mb-2">
                        {selectedUser.title}
                      </h2>
                      <p className="text-gray-600 text-lg">
                        {selectedUser.project}
                      </p>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6 p-6 bg-white/50 rounded-2xl"
                  >
                    <p className="text-gray-700 text-lg italic">
                      "{selectedUser.bio}"
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      感兴趣的话题
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.interests.map((interest, i) => (
                        <motion.span
                          key={interest}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.05 }}
                          className="px-4 py-2 bg-gradient-to-r from-purple/20 to-cyber-blue/20 text-purple-700 rounded-full text-sm font-medium"
                        >
                          {interest}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      当前状态
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.moods.map((mood, i) => (
                        <motion.span
                          key={mood}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + i * 0.05 }}
                          className="px-4 py-2 bg-gradient-to-r from-hot-pink/20 to-purple/20 text-hot-pink rounded-full text-sm font-medium"
                        >
                          {mood}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 flex gap-3"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setChatTargetUser(selectedUser)
                        setIsChatModalOpen(true)
                      }}
                      className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-hot-pink via-purple to-cyber-blue text-white font-bold shadow-lg hover:shadow-xl transition-shadow"
                    >
                      发起聊天 💬
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-4 rounded-2xl bg-white/80 hover:bg-white text-gray-700 font-semibold border-2 border-gray-200 transition-all"
                    >
                      ⭐
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Agent Chat Modal */}
      {chatTargetUser && myProfile && (
        <AgentChatModal
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
          user1={{
            emoji: myProfile.emoji,
            title: myProfile.title,
            project: myProfile.project
          }}
          user2={{
            emoji: chatTargetUser.emoji,
            title: chatTargetUser.title,
            project: chatTargetUser.project
          }}
        />
      )}
    </div>
  )
}
