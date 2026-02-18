import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { UseFormReturn } from 'react-hook-form'

import type { AppError } from '../../../types/appError'
import type { ReviewFormValues } from '../validations/reviewSchema'

type CourseDetailReviewComposerProps = {
  contentKeyPrefix: 'pages.reviews.courseDetail' | 'pages.reviews.lecturerDetail'
  isAuthenticated: boolean
  hasOwnReview: boolean
  isMutating: boolean
  isDeletePending: boolean
  selectedRating: number
  actionError: AppError | null
  ownReviewIsLoading: boolean
  ownReviewError: AppError | null
  form: UseFormReturn<ReviewFormValues>
  onSubmit: () => void
  onDelete: () => void
}

export const CourseDetailReviewComposer = ({
  contentKeyPrefix,
  isAuthenticated,
  hasOwnReview,
  isMutating,
  isDeletePending,
  selectedRating,
  actionError,
  ownReviewIsLoading,
  ownReviewError,
  form,
  onSubmit,
  onDelete,
}: CourseDetailReviewComposerProps) => {
  const { t } = useTranslation()

  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm">
      <p className="text-lg font-semibold text-brand">
        {t(`${contentKeyPrefix}.yourReviewTitle`)}
      </p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">
        {t(`${contentKeyPrefix}.yourReviewQuestion`)}
      </p>
      <p className="mt-1 text-sm text-slate-500">
        {t(`${contentKeyPrefix}.yourReviewHint`)}
      </p>

      {ownReviewIsLoading ? (
        <p className="mt-3 text-sm text-slate-600">
          {t('pages.reviews.form.loadingOwnReview')}
        </p>
      ) : null}
      {ownReviewError ? (
        <div
          className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
          role="alert"
        >
          {t(ownReviewError.messageKey)}
        </div>
      ) : null}

      {!isAuthenticated ? (
        <p className="mt-3 text-sm text-slate-600">
          {t('pages.reviews.form.authHint')}{' '}
          <Link to="/auth/login" className="font-semibold text-brand underline">
            {t('pages.reviews.form.authAction')}
          </Link>
        </p>
      ) : (
        <form onSubmit={onSubmit} aria-busy={isMutating} className="mt-3 space-y-3">
          <input type="hidden" {...form.register('rating')} />
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 5 }, (_, index) => index + 1).map(
              (rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => {
                    form.setValue('rating', rating, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    })
                  }}
                  className="inline-flex h-7 w-7 items-center justify-center"
                  aria-label={t(`${contentKeyPrefix}.ratingLevel`, {
                    rating,
                  })}
                >
                  <svg
                    viewBox="0 0 20 20"
                    className={`h-6 w-6 ${
                      rating <= selectedRating
                        ? 'text-amber-400'
                        : 'text-slate-300'
                    }`}
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M10 1.5l2.47 4.99 5.5.8-3.98 3.88.94 5.49L10 14.9l-4.93 2.57.94-5.49L2.03 7.29l5.5-.8L10 1.5z" />
                  </svg>
                </button>
              ),
            )}
          </div>
          {form.formState.errors.rating ? (
            <p className="text-xs text-rose-600" role="alert">
              {form.formState.errors.rating.message}
            </p>
          ) : null}

          <textarea
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm"
            placeholder={t('pages.reviews.form.commentPlaceholder')}
            {...form.register('comment')}
          />
          {form.formState.errors.comment ? (
            <p className="text-xs text-rose-600" role="alert">
              {form.formState.errors.comment.message}
            </p>
          ) : null}
          {actionError ? (
            <div
              className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
              role="alert"
            >
              {t(actionError.messageKey)}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-end gap-2">
            {hasOwnReview ? (
              <button
                type="button"
                onClick={onDelete}
                disabled={isMutating}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-rose-200 px-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeletePending
                  ? t('pages.reviews.form.deleting')
                  : t('pages.reviews.form.delete')}
              </button>
            ) : null}
            <button
              type="submit"
              disabled={isMutating}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isMutating
                ? hasOwnReview
                  ? t('pages.reviews.form.updating')
                  : t('pages.reviews.form.submitting')
                : hasOwnReview
                  ? t('pages.reviews.form.update')
                  : t('pages.reviews.form.submit')}
            </button>
          </div>
        </form>
      )}
    </article>
  )
}

