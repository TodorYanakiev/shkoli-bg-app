import { createContext, useContext } from 'react'

export type ToastTone = 'success' | 'info' | 'error'

export type ToastItem = {
  id: string
  message: string
  tone: ToastTone
  isExiting: boolean
}

export type ToastOptions = {
  message: string
  tone?: ToastTone
  durationMs?: number
}

export type ToastContextValue = {
  showToast: (options: ToastOptions) => void
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
