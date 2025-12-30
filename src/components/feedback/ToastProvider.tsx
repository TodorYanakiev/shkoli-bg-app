import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'

type ToastTone = 'success' | 'info' | 'error'

type ToastItem = {
  id: string
  message: string
  tone: ToastTone
  isExiting: boolean
}

type ToastOptions = {
  message: string
  tone?: ToastTone
  durationMs?: number
}

type ToastContextValue = {
  showToast: (options: ToastOptions) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

const DEFAULT_DURATION_MS = 3600
const EXIT_DURATION_MS = 220

const createToastId = (() => {
  let counter = 0
  return () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID()
    }
    counter += 1
    return `toast-${Date.now()}-${counter}`
  }
})()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

const ToastProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation()
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timeoutIds = useRef(new Map<string, number>())
  const exitTimeoutIds = useRef(new Map<string, number>())

  const scheduleRemoval = useCallback((id: string) => {
    setToasts((current) =>
      current.map((toast) =>
        toast.id === id && !toast.isExiting
          ? { ...toast, isExiting: true }
          : toast,
      ),
    )

    const exitTimeout = window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
      exitTimeoutIds.current.delete(id)
      timeoutIds.current.delete(id)
    }, EXIT_DURATION_MS)

    exitTimeoutIds.current.set(id, exitTimeout)
  }, [])

  const showToast = useCallback(
    ({ message, tone = 'info', durationMs = DEFAULT_DURATION_MS }: ToastOptions) => {
      const id = createToastId()

      setToasts((current) => [
        ...current,
        { id, message, tone, isExiting: false },
      ])

      const timeoutId = window.setTimeout(() => {
        scheduleRemoval(id)
      }, durationMs)

      timeoutIds.current.set(id, timeoutId)
    },
    [scheduleRemoval],
  )

  const dismissToast = useCallback(
    (id: string) => {
      const timeoutId = timeoutIds.current.get(id)
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
      timeoutIds.current.delete(id)
      scheduleRemoval(id)
    },
    [scheduleRemoval],
  )

  useEffect(() => {
    return () => {
      timeoutIds.current.forEach((timeoutId) =>
        window.clearTimeout(timeoutId),
      )
      exitTimeoutIds.current.forEach((timeoutId) =>
        window.clearTimeout(timeoutId),
      )
      timeoutIds.current.clear()
      exitTimeoutIds.current.clear()
    }
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  const toastToneClassName = (tone: ToastTone) => {
    if (tone === 'success') {
      return 'border-emerald-200 bg-emerald-50 text-emerald-800'
    }
    if (tone === 'error') {
      return 'border-rose-200 bg-rose-50 text-rose-800'
    }
    return 'border-slate-200 bg-white text-slate-800'
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(92vw,380px)] flex-col gap-3 sm:right-6 sm:top-6"
        aria-live="polite"
        aria-relevant="additions"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={[
              'pointer-events-auto flex items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-sm shadow-lg backdrop-blur',
              toastToneClassName(toast.tone),
              toast.isExiting
                ? 'motion-safe:animate-toast-out'
                : 'motion-safe:animate-toast-in',
            ].join(' ')}
          >
            <span className="font-medium">{toast.message}</span>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:text-slate-700"
              aria-label={t('feedback.dismiss')}
            >
              {t('feedback.dismiss')}
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider
