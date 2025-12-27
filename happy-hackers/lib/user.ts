import Cookies from 'js-cookie'

const USER_ID_KEY = 'bohack_user_id'
const COOKIE_EXPIRES_DAYS = 365 // 1 year

/**
 * Generate a new user ID using crypto.randomUUID()
 */
export function generateUserId(): string {
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    return window.crypto.randomUUID()
  }
  // Fallback for older browsers
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

/**
 * Get the current user ID from Cookie or LocalStorage
 * If no user ID exists, generate and save a new one
 */
export function getUserId(): string {
  if (typeof window === 'undefined') {
    return '' // SSR support
  }

  // Try to get from Cookie first
  let userId = Cookies.get(USER_ID_KEY)

  // If not in Cookie, try LocalStorage as backup
  if (!userId) {
    userId = localStorage.getItem(USER_ID_KEY) || undefined
  }

  // If still no userId, generate a new one
  if (!userId) {
    userId = generateUserId()
    saveUserId(userId)
  }

  return userId
}

/**
 * Save user ID to both Cookie and LocalStorage
 */
export function saveUserId(userId: string): void {
  if (typeof window === 'undefined') {
    return // SSR support
  }

  // Save to Cookie (with 1 year expiration)
  Cookies.set(USER_ID_KEY, userId, {
    expires: COOKIE_EXPIRES_DAYS,
    sameSite: 'lax',
  })

  // Also save to LocalStorage as backup
  localStorage.setItem(USER_ID_KEY, userId)
}

/**
 * Clear user ID from both Cookie and LocalStorage
 * (useful for testing or user logout)
 */
export function clearUserId(): void {
  if (typeof window === 'undefined') {
    return
  }

  Cookies.remove(USER_ID_KEY)
  localStorage.removeItem(USER_ID_KEY)
}

/**
 * Check if user ID exists
 */
export function hasUserId(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  return !!(Cookies.get(USER_ID_KEY) || localStorage.getItem(USER_ID_KEY))
}
