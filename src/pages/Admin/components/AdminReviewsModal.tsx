import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'

import { RatingStars } from '../../../components/ui/RatingStars'
import { useAdminReviewsModal } from '../hooks/useAdminReviewsModal'
import type { AdminReviewEntity } from '../types'
import { formatAdminAverageRating } from '../services/adminReviewFormatters'
import { AdminReviewsList } from './AdminReviewsList'

type AdminReviewsModalProps = {
  isOpen: boolean
  reviewTarget: AdminReviewEntity | null
  onClose: () => void
}

export const AdminReviewsModal = ({
  isOpen,
  reviewTarget,
  onClose,
}: AdminReviewsModalProps) => {
  const { t, i18n } = useTranslation()
  const {
    reviews,
    reviewerNames,
    reviewersAreLoading,
    resolvedAverage,
    actionError,
    isDeletePending,
    isLoading,
    error,
    isDeletingReview,
    onDeleteReview,
  } = useAdminReviewsModal({
    isOpen,
    reviewTarget,
  })

  const handleClose = useCallback(() => {
    if (isDeletePending) return
    onClose()
  }, [isDeletePending, onClose])

  useEffect(() => {
    if (!isOpen) return
    if (typeof document === 'undefined') return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleClose, isOpen])

  if (!isOpen || !reviewTarget) return null
  if (typeof document === 'undefined') return null

  const modalTitleId = 'admin-reviews-modal-title'
  const modalDescId = 'admin-reviews-modal-description'
  const nameFallback = t('pages.profile.emptyValue')
  const targetName = reviewTarget.name ?? nameFallback
  const entityLabel = t(`pages.admin.reviews.entity.${reviewTarget.type}`)

  const modalContent = (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 px-4 py-8 backdrop-blur-sm"
      onClick={handleClose}
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
        <div className="relative rounded-2xl border border-slate-200/70 bg-white/95 p-5 shadow-sm">
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label={t('feedback.dismiss')}
            title={t('feedback.dismiss')}
            disabled={isDeletePending}
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
              {t('pages.admin.reviews.title', { name: targetName })}
            </h3>
            <p id={modalDescId} className="text-sm text-slate-600">
              {t('pages.admin.reviews.subtitle', { entity: entityLabel })}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <div className="flex flex-wrap items-center gap-3">
              {resolvedAverage != null ? (
                <>
                  <RatingStars rating={resolvedAverage} showValue={false} />
                  <span className="text-xs font-semibold text-amber-700">
                    {formatAdminAverageRating(resolvedAverage, i18n.language)}
                  </span>
                </>
              ) : (
                <span className="text-xs text-slate-600">
                  {t('pages.admin.reviews.summary.noRatings')}
                </span>
              )}
              <span className="text-xs text-slate-500">
                {t('pages.admin.reviews.summary.count', {
                  count: reviews.length,
                })}
              </span>
            </div>
          </div>

          {actionError ? (
            <div
              className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
              role="alert"
            >
              {t(actionError.messageKey)}
            </div>
          ) : null}

          <div className="mt-4">
            {isLoading ? (
              <p className="text-sm text-slate-600">
                {t('pages.admin.reviews.loading')}
              </p>
            ) : error ? (
              <div
                className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
                role="alert"
              >
                {t(error.messageKey)}
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-sm text-slate-600">
                {t('pages.admin.reviews.empty')}
              </p>
            ) : (
              <>
                {reviewersAreLoading ? (
                  <p className="mb-3 text-xs text-slate-500">
                    {t('pages.admin.reviews.reviewersLoading')}
                  </p>
                ) : null}
                <AdminReviewsList
                  reviews={reviews}
                  reviewerNames={reviewerNames}
                  onDeleteReview={onDeleteReview}
                  isDeletingReview={isDeletingReview}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
