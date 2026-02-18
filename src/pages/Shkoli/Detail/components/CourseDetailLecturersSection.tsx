import type { TFunction } from 'i18next'

import { RatingStars } from '../../../../components/ui/RatingStars'
import type { UserResponse } from '../../../../types/users'
import { getUserDisplayName } from '../../../../utils/user'

type CourseDetailLecturersSectionProps = {
  lecturers?: UserResponse[]
  isLecturersLoading: boolean
  lecturersErrorMessage: string | null
  fallbackValue: string
  onOpenLecturerReviews?: (lecturer: UserResponse) => void
  t: TFunction
}

const getInitials = (value: string) =>
  value
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

export const CourseDetailLecturersSection = ({
  lecturers,
  isLecturersLoading,
  lecturersErrorMessage,
  fallbackValue,
  onOpenLecturerReviews,
  t,
}: CourseDetailLecturersSectionProps) => (
  <section id="course-lecturers" className="scroll-mt-24">
    <h3 className="text-3xl font-semibold text-slate-900">
      {t('pages.shkoli.detail.sections.lecturers')}
    </h3>
    {isLecturersLoading ? (
      <p className="mt-3 text-base text-slate-600">
        {t('pages.shkoli.detail.lecturersLoading')}
      </p>
    ) : lecturersErrorMessage ? (
      <div
        className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-base text-rose-700"
        role="alert"
      >
        {lecturersErrorMessage}
      </div>
    ) : lecturers && lecturers.length > 0 ? (
      <ul className="mt-5 grid gap-3 md:grid-cols-2">
        {lecturers.map((lecturer, index) => {
          const displayName = getUserDisplayName(lecturer) || fallbackValue
          const averageRating =
            typeof lecturer.averageRating === 'number' &&
            Number.isFinite(lecturer.averageRating)
              ? lecturer.averageRating
              : null
          return (
            <li
              key={lecturer.id ?? `${displayName}-${index}`}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-600">
                  {getInitials(displayName)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {displayName}
                    </p>
                    <div className="inline-flex items-center gap-1.5">
                      <RatingStars
                        rating={averageRating ?? 0}
                        showValue={false}
                        ariaLabel={
                          averageRating != null
                            ? t('pages.shkoli.detail.lecturerCard.ratingLabel', {
                                rating: averageRating.toFixed(1),
                                max: 5,
                              })
                            : t('pages.shkoli.detail.lecturerCard.noRating')
                        }
                        className={averageRating == null ? 'opacity-60' : undefined}
                      />
                      <span className="text-xs font-semibold text-amber-600">
                        {averageRating != null
                          ? averageRating.toFixed(1)
                          : t('pages.shkoli.detail.lecturerCard.noRating')}
                      </span>
                    </div>
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-500">
                    {lecturer.email ?? fallbackValue}
                  </p>
                  {onOpenLecturerReviews ? (
                    <button
                      type="button"
                      onClick={() => onOpenLecturerReviews(lecturer)}
                      className="mt-2 text-xs font-semibold text-brand underline decoration-brand/40 underline-offset-2 hover:text-brand-dark"
                      aria-label={t(
                        'pages.shkoli.detail.lecturerReviews.openReviews',
                        { name: displayName },
                      )}
                    >
                      {t('pages.shkoli.detail.lecturerCard.viewReviews')}
                    </button>
                  ) : null}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    ) : (
      <p className="mt-3 text-base text-slate-600">
        {t('pages.shkoli.detail.lecturersPlaceholder')}
      </p>
    )}
  </section>
)
