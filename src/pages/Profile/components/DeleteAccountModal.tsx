import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type DeleteAccountModalProps = {
  isOpen: boolean
  username: string
  onCancel: () => void
  onConfirm: () => void
  isSubmitting: boolean
}

const DeleteAccountModal = ({
  isOpen,
  username,
  onCancel,
  onConfirm,
  isSubmitting,
}: DeleteAccountModalProps) => {
  const { t } = useTranslation()

  const handleCancel = useCallback(() => {
    if (isSubmitting) return
    onCancel()
  }, [isSubmitting, onCancel])

  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleCancel, isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4 py-8 backdrop-blur-sm"
      onClick={handleCancel}
      role="presentation"
    >
      <div
        className="w-full max-w-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-account-title"
        aria-describedby="delete-account-description"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative rounded-2xl border border-slate-200/70 bg-white/95 p-5 shadow-xl">
          <button
            type="button"
            onClick={handleCancel}
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label={t('feedback.dismiss')}
            title={t('feedback.dismiss')}
            disabled={isSubmitting}
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
          <h3 id="delete-account-title" className="text-sm font-semibold text-slate-900">
            {t('pages.profile.edit.delete.modal.title')}
          </h3>
          <p id="delete-account-description" className="mt-2 text-sm text-slate-600">
            {t('pages.profile.edit.delete.modal.description', { username })}
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {t('pages.profile.edit.delete.modal.cancel')}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? t('pages.profile.edit.delete.modal.deleting')
                : t('pages.profile.edit.delete.modal.confirm')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteAccountModal
