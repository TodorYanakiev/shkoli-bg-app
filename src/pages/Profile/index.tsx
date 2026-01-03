import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

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
  const roleLabel = user?.role
    ? ({ USER: t('pages.profile.roles.user'), ADMIN: t('pages.profile.roles.admin') }[
        user.role
      ] ?? t('pages.profile.roles.unknown'))
    : t('pages.profile.emptyValue')

  const errorMessage = getProfileErrorMessage(error ?? null, t)

  return (
    <section className="space-y-6">
      <Helmet>
        <title>{`${t('pages.profile.title')} | ${t('app.title')}`}</title>
      </Helmet>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          {t('pages.profile.title')}
        </h1>
        <p className="text-sm text-slate-600">{t('pages.profile.subtitle')}</p>
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
        <>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              {t('pages.profile.summary.title')}
            </h2>
            <div className="mt-4 flex items-center gap-4">
              <UserAvatar
                alt={t('nav.profileAvatarAlt', { name: displayName })}
                size="lg"
              />
              <div>
                <p className="text-lg font-semibold text-slate-900">
                  {displayName}
                </p>
                <span className="mt-2 inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              {t('pages.profile.details.title')}
            </h2>
            <dl className="mt-4 space-y-3 text-sm sm:space-y-0 sm:grid sm:grid-cols-[minmax(0,180px)_minmax(0,1fr)] sm:gap-x-6 sm:gap-y-3">
              <div className="sm:contents">
                <dt className="text-slate-500">
                  {t('pages.profile.details.fullName')}
                </dt>
                <dd className="font-medium text-slate-900">{fullName}</dd>
              </div>
              <div className="sm:contents">
                <dt className="text-slate-500">
                  {t('pages.profile.details.username')}
                </dt>
                <dd className="font-medium text-slate-900">{username}</dd>
              </div>
              <div className="sm:contents">
                <dt className="text-slate-500">
                  {t('pages.profile.details.email')}
                </dt>
                <dd className="font-medium text-slate-900">{email}</dd>
              </div>
            </dl>
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          {t('pages.profile.empty')}
        </div>
      )}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">
          {t('pages.profile.actions.title')}
        </h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            to="/profile/change-password"
            className="inline-flex items-center justify-center rounded-full border border-brand/30 px-4 py-2 text-sm font-semibold text-brand transition hover:border-brand hover:text-brand-dark"
          >
            {t('pages.profile.actions.changePassword')}
          </Link>
          <Link
            to="/profile/lyceum-rights"
            className="inline-flex items-center justify-center rounded-full border border-brand/30 px-4 py-2 text-sm font-semibold text-brand transition hover:border-brand hover:text-brand-dark"
          >
            {t('pages.profile.actions.requestLyceumRights')}
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ProfilePage
