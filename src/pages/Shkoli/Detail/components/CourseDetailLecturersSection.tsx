import type { TFunction } from 'i18next'

import { RatingStars } from '../../../../components/ui/RatingStars'
import UserAvatar from '../../../../components/ui/UserAvatar'
import type { UserResponse } from '../../../../types/users'
import { getUserDisplayName } from '../../../../utils/user'
import { resolveUserImageUrl } from '../../../../utils/userImages'

type CourseDetailLecturersSectionProps = {
  lecturers?: UserResponse[]
  isLecturersLoading: boolean
  lecturersErrorMessage: string | null
  fallbackValue: string
  onOpenLecturerReviews?: (lecturer: UserResponse) => void
  t: TFunction
}

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
      <ul className="mt-6 grid gap-5 md:grid-cols-2">
        {lecturers.map((lecturer, index) => {
          const displayName = getUserDisplayName(lecturer) || fallbackValue
          const averageRating =
            typeof lecturer.averageRating === 'number' &&
            Number.isFinite(lecturer.averageRating)
              ? lecturer.averageRating
              : null
          const avatarUrl = resolveUserImageUrl(lecturer.profileImage)
          const ratingValue = averageRating?.toFixed(1)
          const emailValue = lecturer.email ?? fallbackValue
          const descriptionValue = lecturer.description?.trim() || fallbackValue

          return (
            <li
              key={lecturer.id ?? `${displayName}-${index}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_-26px_rgba(15,23,42,0.45)] md:p-6"
            >
              <div className="grid gap-4 sm:grid-cols-[10.5rem_minmax(0,1fr)] lg:grid-cols-[11.5rem_minmax(0,1fr)]">
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  <UserAvatar
                    alt={t('pages.shkoli.detail.lecturerCard.avatarAlt', {
                      name: displayName,
                    })}
                    src={avatarUrl}
                    size="full"
                    shape="rounded"
                    className="h-36 w-full border-0 bg-slate-100"
                  />
                </div>
                <div className="min-w-0 space-y-4">
                  <div>
                    <p className="text-xl font-semibold leading-tight text-slate-900">
                      {displayName}
                    </p>
                    <div className="mt-2 inline-flex flex-wrap items-center gap-2">
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
                      <span
                        className={
                          averageRating != null
                            ? 'text-base font-semibold text-amber-600'
                            : 'text-sm font-medium text-slate-500'
                        }
                      >
                        {ratingValue ?? t('pages.shkoli.detail.lecturerCard.noRating')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-base text-slate-600">
                    <svg
                      viewBox="0 0 20 20"
                      className="h-4 w-4 shrink-0 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="2.5" y="4.5" width="15" height="11" rx="2" />
                      <path d="M3.5 6l6.5 5 6.5-5" />
                    </svg>
                    <p className="truncate">{emailValue}</p>
                  </div>

                  <div className="max-h-28 overflow-y-auto rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                    <p className="text-sm leading-relaxed text-slate-600">
                      {descriptionValue}
                    </p>
                  </div>

                  {onOpenLecturerReviews ? (
                    <button
                      type="button"
                      onClick={() => onOpenLecturerReviews(lecturer)}
                      className="inline-flex items-center text-sm font-semibold text-brand underline decoration-brand/40 underline-offset-2 hover:text-brand-dark"
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
