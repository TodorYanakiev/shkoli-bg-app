import { useEffect, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import type { AppError } from '../../../types/appError'
import type { ReviewFormValues } from '../validations/reviewSchema'
import { ReviewEditor } from './ReviewEditor'

type ReviewEditorPanelProps = {
  editorMode?: 'inline' | 'modal'
  isAuthenticated: boolean
  hasOwnReview: boolean
  isMutating: boolean
  isDeletePending: boolean
  selectedRating: number
  actionError: AppError | null
  form: UseFormReturn<ReviewFormValues>
  onSubmit: () => void
  onDelete: () => void
  ownReviewIsLoading: boolean
  ownReviewError: AppError | null
  triggerButtonId?: string
}

export const ReviewEditorPanel = ({
  editorMode = 'inline',
  isAuthenticated,
  hasOwnReview,
  isMutating,
  isDeletePending,
  selectedRating,
  actionError,
  form,
  onSubmit,
  onDelete,
  ownReviewIsLoading,
  ownReviewError,
  triggerButtonId,
}: ReviewEditorPanelProps) => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (!isModalOpen || typeof document === 'undefined') return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModalOpen])

  const editor = (
    <ReviewEditor
      isAuthenticated={isAuthenticated}
      hasOwnReview={hasOwnReview}
      isMutating={isMutating}
      isDeletePending={isDeletePending}
      selectedRating={selectedRating}
      actionError={actionError}
      form={form}
      onSubmit={onSubmit}
      onDelete={onDelete}
    />
  )

  return (
    <div className="mt-6 border-t border-slate-100 pt-4">
      {ownReviewIsLoading ? (
        <p className="mb-3 text-sm text-slate-600">
          {t('pages.reviews.form.loadingOwnReview')}
        </p>
      ) : null}
      {ownReviewError ? (
        <div
          className="mb-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
          role="alert"
        >
          {t(ownReviewError.messageKey)}
        </div>
      ) : null}
      {editorMode === 'modal' && isAuthenticated ? (
        <>
          <button
            id={triggerButtonId}
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-dark"
          >
            {t(
              hasOwnReview
                ? 'pages.reviews.form.openEdit'
                : 'pages.reviews.form.openCreate',
            )}
          </button>
          {isModalOpen ? (
            <div
              className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4 py-8 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
              role="presentation"
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="review-editor-title"
                className="w-full max-w-xl"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="relative rounded-2xl border border-slate-200/70 bg-white/95 p-5 shadow-xl">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
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
                  <div id="review-editor-title" className="sr-only">
                    {t(
                      hasOwnReview
                        ? 'pages.reviews.form.editTitle'
                        : 'pages.reviews.form.createTitle',
                    )}
                  </div>
                  {editor}
                </div>
              </div>
            </div>
          ) : null}
        </>
      ) : (
        editor
      )}
    </div>
  )
}
