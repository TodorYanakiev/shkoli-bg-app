import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type AdminCourseDeleteModalProps = {
  isOpen: boolean
  courseName?: string
  onConfirm: () => void
  onCancel: () => void
  isSubmitting?: boolean
}

export const AdminCourseDeleteModal = ({
  isOpen,
  courseName,
  onConfirm,
  onCancel,
  isSubmitting = false,
}: AdminCourseDeleteModalProps) => {
  const { t } = useTranslation()

  const handleCancel = useCallback(() => {
    if (isSubmitting) return
    onCancel()
  }, [isSubmitting, onCancel])

  useEffect(() => {
    if (!isOpen) return undefined
    if (typeof document === 'undefined') return undefined
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

  const titleId = 'admin-course-delete-title'
  const descriptionId = 'admin-course-delete-description'
  const resolvedName = courseName ?? t('pages.shkoli.detail.notProvided')

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
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm">
          <button
            type="button"
            onClick={handleCancel}
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
          <h3 id={titleId} className="text-sm font-semibold text-slate-900">
            {t('pages.admin.courses.deleteConfirm.title')}
          </h3>
          <p id={descriptionId} className="mt-2 text-sm text-slate-600">
            {t('pages.admin.courses.deleteConfirm.description', {
              name: resolvedName,
            })}
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {t('pages.admin.courses.deleteConfirm.cancel')}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? t('pages.admin.courses.actions.deleting')
                : t('pages.admin.courses.deleteConfirm.confirm')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
