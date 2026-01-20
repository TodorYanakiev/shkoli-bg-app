import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import {
  AUTH_TOKENS_CHANGED_EVENT,
  getAccessToken,
} from '../utils/authStorage'

const usersQueryKey = ['users'] as const

export const useAuthQueryReset = () => {
  const queryClient = useQueryClient()
  const previousTokenRef = useRef<string | null>(getAccessToken())

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const handleTokensChange = () => {
      const nextToken = getAccessToken()
      if (previousTokenRef.current === nextToken) return
      previousTokenRef.current = nextToken

      if (nextToken) {
        void queryClient.resetQueries({ queryKey: usersQueryKey })
        return
      }

      queryClient.removeQueries({ queryKey: usersQueryKey })
    }

    window.addEventListener('storage', handleTokensChange)
    window.addEventListener(AUTH_TOKENS_CHANGED_EVENT, handleTokensChange)

    return () => {
      window.removeEventListener('storage', handleTokensChange)
      window.removeEventListener(AUTH_TOKENS_CHANGED_EVENT, handleTokensChange)
    }
  }, [queryClient])
}
