import { useTranslation } from 'react-i18next'

import { RatingStars } from '../../../../components/ui/RatingStars'
import UserAvatar from '../../../../components/ui/UserAvatar'
import type { UserResponse } from '../../../../types/users'
import { resolveUserImageUrl } from '../../../../utils/userImages'

type LyceumLecturerCardProps = {
  lecturer: UserResponse
  displayName: string
  fallbackValue: string
  onOpenReviews?: () => void
}

const LyceumLecturerCard = ({
  lecturer,
  displayName,
  fallbackValue,
  onOpenReviews,
}: LyceumLecturerCardProps) => {
  const { t } = useTranslation()
  const name = displayName || fallbackValue
  const email = lecturer.email ?? fallbackValue
  const description = lecturer.description?.trim() || fallbackValue
  const avatarUrl = resolveUserImageUrl(lecturer.profileImage)
  const averageRating =
    typeof lecturer.averageRating === 'number' &&
    Number.isFinite(lecturer.averageRating)
      ? lecturer.averageRating
      : null

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_-26px_rgba(15,23,42,0.45)]">
      <div className="grid gap-4 sm:grid-cols-[8.5rem_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          <UserAvatar
            alt={t('pages.lyceums.detail.lecturerCard.avatarAlt', { name })}
            src={avatarUrl}
            size="full"
            shape="rounded"
            className="h-36 w-full border-0 bg-slate-100"
          />
        </div>
        <div className="min-w-0 space-y-3">
          <div>
            <p className="text-xl font-semibold leading-tight text-slate-900">
              {name}
            </p>
            <div className="mt-2 inline-flex items-center gap-2">
              <RatingStars
                rating={averageRating ?? 0}
                showValue={false}
                className={averageRating == null ? 'opacity-60' : undefined}
                ariaLabel={t('pages.lyceums.detail.lecturerCard.ratingLabel', {
                  rating: averageRating != null ? averageRating.toFixed(1) : '0.0',
                  max: 5,
                })}
              />
              <span
                className={
                  averageRating != null
                    ? 'text-base font-semibold text-amber-600'
                    : 'text-sm font-medium text-slate-500'
                }
              >
                {averageRating != null
                  ? averageRating.toFixed(1)
                  : t('pages.lyceums.detail.lecturerCard.noRating')}
              </span>
            </div>
          </div>

          <p className="truncate text-base text-slate-600">{email}</p>

          <div className="max-h-24 overflow-y-auto rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
            <p className="text-sm leading-relaxed text-slate-600">{description}</p>
          </div>

          {onOpenReviews ? (
            <button
              type="button"
              onClick={onOpenReviews}
              className="inline-flex items-center text-sm font-semibold text-brand underline decoration-brand/40 underline-offset-2 hover:text-brand-dark"
              aria-label={t('pages.lyceums.detail.lecturerCard.openReviews', {
                name,
              })}
              title={t('pages.lyceums.detail.lecturerCard.openReviews', {
                name,
              })}
            >
              {t('pages.lyceums.detail.lecturerCard.viewReviews')}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export default LyceumLecturerCard
