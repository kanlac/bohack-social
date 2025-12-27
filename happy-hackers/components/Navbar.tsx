'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { name: '首页', path: '/', icon: '🏠' },
    { name: '探索', path: '/explore', icon: '🔍' },
    { name: '我的', path: '/me', icon: '👤' },
  ]

  const isActive = (path: string) => pathname === path

  // 在首页（onboarding 流程）时使用半透明样式
  const isOnboardingPage = pathname === '/'

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: isOnboardingPage ? 0.95 : 1 }}
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-4 sm:px-6 lg:px-8 ${isOnboardingPage ? 'pointer-events-auto' : ''}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-2xl px-6 py-4 shadow-lg border border-gray-200/50">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer"
              >
                <span className="text-xl font-outfit font-bold text-gradient">
                  Happy Hackers
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const active = isActive(item.path)
                return (
                  <Link key={item.path} href={item.path}>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        relative px-6 py-2.5 rounded-xl font-medium transition-all cursor-pointer
                        ${active
                          ? 'bg-gradient-to-r from-hot-pink to-purple text-white shadow-md'
                          : 'text-gray-700 hover:bg-white/60'
                        }
                      `}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.name}
                      {active && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-hot-pink to-purple rounded-xl -z-10"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                )
              })}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-white/60 hover:bg-white/80 flex items-center justify-center text-gray-700 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-gray-200/50 space-y-2">
                  {navItems.map((item) => {
                    const active = isActive(item.path)
                    return (
                      <Link key={item.path} href={item.path}>
                        <motion.div
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`
                            px-4 py-3 rounded-xl font-medium transition-all cursor-pointer
                            ${active
                              ? 'bg-gradient-to-r from-hot-pink to-purple text-white shadow-md'
                              : 'text-gray-700 hover:bg-white/60'
                            }
                          `}
                        >
                          <span className="mr-2">{item.icon}</span>
                          {item.name}
                        </motion.div>
                      </Link>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  )
}
