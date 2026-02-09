import { useTranslation } from 'react-i18next'

import { RatingStars } from '../../../../components/ui/RatingStars'
import UserAvatar from '../../../../components/ui/UserAvatar'
import type { UserResponse } from '../../../../types/users'

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
  const averageRating =
    typeof lecturer.averageRating === 'number' &&
    Number.isFinite(lecturer.averageRating)
      ? lecturer.averageRating
      : null

  const content = (
    <>
      <UserAvatar
        alt={t('pages.lyceums.detail.lecturerCard.avatarAlt', { name })}
        size="full"
        shape="square"
        className="relative border-0 transition-transform duration-300 group-hover:scale-[1.05]"
      />
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent px-2 py-2 text-[11px] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
        <span className="truncate font-semibold">{name}</span>
        <span className="truncate text-[10px] text-slate-100">{email}</span>
      </div>
      <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 shadow-sm">
        {averageRating != null ? (
          <RatingStars
            rating={averageRating}
            ariaLabel={t('pages.lyceums.detail.lecturerCard.ratingLabel', {
              rating: averageRating.toFixed(1),
              max: 5,
            })}
            showValue={false}
          />
        ) : (
          <span className="text-[10px] font-semibold text-slate-500">
            {t('pages.lyceums.detail.lecturerCard.noRating')}
          </span>
        )}
      </div>
    </>
  )

  if (!onOpenReviews) {
    return (
      <article className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200/70 bg-white/70 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-md">
        {content}
      </article>
    )
  }

  return (
    <button
      type="button"
      onClick={onOpenReviews}
      className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200/70 bg-white/70 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
      aria-label={t('pages.lyceums.detail.lecturerCard.openReviews', {
        name,
      })}
      title={t('pages.lyceums.detail.lecturerCard.openReviews', {
        name,
      })}
    >
      {content}
    </button>
  )
}

export default LyceumLecturerCard
