import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { AdminLyceumAdminForm } from './AdminLyceumAdminForm'
import { AdminLyceumAdminList } from './AdminLyceumAdminList'
import { useAdminLyceumAdminActions } from '../hooks/useAdminLyceumAdminActions'

type AdminLyceumAdminsModalProps = {
  lyceumId: number
  lyceumName?: string
  isOpen: boolean
  onClose: () => void
}

export const AdminLyceumAdminsModal = ({
  lyceumId,
  lyceumName,
  isOpen,
  onClose,
}: AdminLyceumAdminsModalProps) => {
  const { t } = useTranslation()
  const adminActions = useAdminLyceumAdminActions(lyceumId)

  useEffect(() => {
    if (!isOpen) return undefined
    if (typeof document === 'undefined') return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const modalTitleId = 'admin-lyceum-admins-title'
  const modalDescId = 'admin-lyceum-admins-description'
  const fallbackValue = t('pages.lyceums.detail.notProvided')

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-3xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalTitleId}
        aria-describedby={modalDescId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
            aria-label={t('feedback.dismiss')}
            title={t('feedback.dismiss')}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6l-12 12" />
            </svg>
          </button>
          <div className="space-y-1">
            <h3 id={modalTitleId} className="text-sm font-semibold text-slate-900">
              {t('pages.admin.lyceums.admins.title')}
            </h3>
            <p id={modalDescId} className="text-sm text-slate-600">
              {t('pages.admin.lyceums.admins.subtitle', {
                name: lyceumName ?? fallbackValue,
              })}
            </p>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
            <AdminLyceumAdminForm
              lyceumId={lyceumId}
              isOpen={isOpen}
              isAssigning={adminActions.isAssigning}
              assignError={adminActions.assignError}
              onAssign={adminActions.onAssign}
            />
            <AdminLyceumAdminList
              lyceumId={lyceumId}
              isOpen={isOpen}
              isRemoving={adminActions.isRemoving}
              removingId={adminActions.removingId}
              removeError={adminActions.removeError}
              onRemove={adminActions.onRemove}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
