import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

import UserAvatar from '../../components/ui/UserAvatar'
import type { ApiError } from '../../types/api'
import { getUserDisplayName, getUserFullName } from '../../utils/user'
import { useUserProfile } from './hooks/useUserProfile'

const getProfileErrorMessage = (
  error: ApiError | null,
  t: (key: string) => string,
) => {
  if (!error) return null
  if (error.kind === 'network') {
    return t('errors.network')
  }
  if (error.kind === 'unauthorized' || error.kind === 'forbidden') {
    return t('errors.auth.forbidden')
  }
  return t('errors.profile.loadFailed')
}

const ProfilePage = () => {
  const { t } = useTranslation()
  const { data: user, isLoading, error } = useUserProfile()

  const displayName = getUserDisplayName(user) || t('pages.profile.unknownUser')
  const fullName = getUserFullName(user) || t('pages.profile.emptyValue')
  const username = user?.username ?? t('pages.profile.emptyValue')
  const email = user?.email ?? t('pages.profile.emptyValue')

  const errorMessage = getProfileErrorMessage(error ?? null, t)

  return (
    <section className="space-y-6">
      <Helmet>
        <title>{`${t('pages.profile.title')} | ${t('app.title')}`}</title>
      </Helmet>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <UserAvatar
          alt={t('nav.profileAvatarAlt', { name: displayName })}
          size="lg"
        />
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {t('pages.profile.title')}
          </h1>
          <p className="text-sm text-slate-600">
            {t('pages.profile.subtitle')}
          </p>
        </div>
      </div>
      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          {t('pages.profile.loading')}
        </div>
      ) : errorMessage ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
          role="alert"
        >
          {errorMessage}
        </div>
      ) : user ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            {t('pages.profile.details.title')}
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <dt className="text-slate-500">
                {t('pages.profile.details.fullName')}
              </dt>
              <dd className="font-medium text-slate-900">{fullName}</dd>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <dt className="text-slate-500">
                {t('pages.profile.details.username')}
              </dt>
              <dd className="font-medium text-slate-900">{username}</dd>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <dt className="text-slate-500">
                {t('pages.profile.details.email')}
              </dt>
              <dd className="font-medium text-slate-900">{email}</dd>
            </div>
          </dl>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          {t('pages.profile.empty')}
        </div>
      )}
    </section>
  )
}

export default ProfilePage
