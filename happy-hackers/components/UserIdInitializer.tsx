'use client'

import { useEffect, useRef } from 'react'
import { getUserId } from '@/lib/user'

/**
 * Component to initialize user ID on app startup
 * This ensures every user gets a unique ID on first visit
 */
export default function UserIdInitializer() {
  const initialized = useRef(false)

  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (initialized.current) {
      return
    }

    // Get or generate user ID
    const userId = getUserId()
    console.log('User ID initialized:', userId)
    initialized.current = true
  }, [])

  return null // This component doesn't render anything
}
