'use client'

import { useEffect, useState, useRef } from 'react'
import { getUserId } from '../user'

/**
 * React Hook to get and manage user ID
 * Automatically initializes user ID on first mount
 */
export function useUserId() {
  const [userId, setUserId] = useState<string>('')
  const initialized = useRef(false)

  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (initialized.current) {
      return
    }

    const id = getUserId()
    setUserId(id)
    initialized.current = true
  }, [])

  return userId
}
