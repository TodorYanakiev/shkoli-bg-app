import { useTranslation } from 'react-i18next'

import UserAvatar from './UserAvatar'
import type { UserResponse } from '../../types/users'
import { getUserDisplayName } from '../../utils/user'
import { resolveUserImageUrl } from '../../utils/userImages'

type SubscribersListSectionProps = {
  subscribers?: UserResponse[]
  isSubscribersLoading: boolean
  subscribersErrorMessage: string | null
  emptyMessage: string
}

const SubscriberCard = ({ subscriber }: { subscriber: UserResponse }) => {
  const { t } = useTranslation()
  const displayName =
    getUserDisplayName(subscriber) || t('subscribersModal.subscriberFallback')
  const avatarUrl = resolveUserImageUrl(subscriber.profileImage)

  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <UserAvatar
          alt={t('nav.profileAvatarAlt', { name: displayName })}
          src={avatarUrl}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900 sm:text-base">
            {displayName}
          </p>
          {subscriber.email ? (
            <p className="mt-1 truncate text-sm text-slate-600">
              {subscriber.email}
            </p>
          ) : null}
          {subscriber.username ? (
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
              @{subscriber.username}
            </p>
          ) : null}
        </div>
      </div>
    </li>
  )
}

export const SubscribersListSection = ({
  subscribers,
  isSubscribersLoading,
  subscribersErrorMessage,
  emptyMessage,
}: SubscribersListSectionProps) => {
  const { t } = useTranslation()

  return (
    <section>
      <h4 className="text-sm font-semibold text-slate-900">
        {t('subscribersModal.listTitle')}
      </h4>
      {isSubscribersLoading ? (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`subscriber-skeleton-${index}`}
              className="h-24 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      ) : subscribersErrorMessage ? (
        <div
          className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          role="alert"
        >
          {subscribersErrorMessage}
        </div>
      ) : subscribers && subscribers.length > 0 ? (
        <ul className="mt-3 grid gap-3 md:grid-cols-2">
          {subscribers.map((subscriber, index) => (
            <SubscriberCard
              key={subscriber.id ?? `${subscriber.email}-${index}`}
              subscriber={subscriber}
            />
          ))}
        </ul>
      ) : (
        <div className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-600">
          {emptyMessage}
        </div>
      )}
    </section>
  )
}
