import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import type { UserResponse } from '../../../../types/users'
import { getUserDisplayName } from '../../../../utils/user'
import { UserReviewsSection } from '../../../Reviews/components/UserReviewsSection'

type LyceumLecturerReviewsModalProps = {
  lecturer: UserResponse
  lyceumId: number
  onClose: () => void
}

const LyceumLecturerReviewsModal = ({
  lecturer,
  lyceumId,
  onClose,
}: LyceumLecturerReviewsModalProps) => {
  const { t } = useTranslation()

  useEffect(() => {
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
  }, [onClose])

  const lecturerName =
    getUserDisplayName(lecturer) ||
    t('pages.reviews.list.reviewerFallback')

  return (
    <div
      className="fixed inset-0 z-40 flex items-start justify-center bg-slate-900/40 px-4 pb-8 pt-24 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lecturer-reviews-title"
        className="w-full max-w-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border border-slate-200/70 bg-white/95 p-5 shadow-xl">
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
          <h3 id="lecturer-reviews-title" className="text-lg font-semibold text-slate-900">
            {t('pages.lyceums.detail.lecturerReviews.title', {
              name: lecturerName,
            })}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {t('pages.lyceums.detail.lecturerReviews.subtitle')}
          </p>

          {lecturer.id == null ? (
            <div
              className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
              role="alert"
            >
              {t('errors.reviews.userNotFound')}
            </div>
          ) : (
            <UserReviewsSection
              userId={lecturer.id}
              averageRating={lecturer.averageRating ?? null}
              lyceumId={lyceumId}
              className="mt-4"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default LyceumLecturerReviewsModal
