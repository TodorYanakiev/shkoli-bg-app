import { useTranslation } from 'react-i18next'

import UserAvatar from '../../../../components/ui/UserAvatar'
import type { UserResponse } from '../../../../types/users'

type LyceumLecturerCardProps = {
  lecturer: UserResponse
  displayName: string
  fallbackValue: string
}

const LyceumLecturerCard = ({
  lecturer,
  displayName,
  fallbackValue,
}: LyceumLecturerCardProps) => {
  const { t } = useTranslation()
  const name = displayName || fallbackValue
  const email = lecturer.email ?? fallbackValue

  return (
    <article
      className="group relative flex aspect-square w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-slate-200/70 bg-white/70 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
      tabIndex={0}
    >
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
    </article>
  )
}

export default LyceumLecturerCard
