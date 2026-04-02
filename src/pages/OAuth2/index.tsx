import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import SeoHead from '../../components/ui/SeoHead'
import { useToast } from '../../components/feedback/ToastContext'
import { useCurrentLocale } from '../../hooks/useCurrentLocale'
import { useLocalizedNavigate } from '../../hooks/useLocalizedNavigate'
import { consumeStoredPostLoginRedirect } from '../../services/authRedirect'
import { setTokens } from '../../utils/authStorage'
import OAuth2CallbackErrorState from './components/OAuth2CallbackErrorState'
import OAuth2CompleteProfileForm from './components/OAuth2CompleteProfileForm'
import { useOAuth2CallbackResult } from './hooks/useOAuth2CallbackResult'

const OAuth2Page = () => {
  const { t } = useTranslation()
  const locale = useCurrentLocale()
  const navigate = useLocalizedNavigate()
  const routerNavigate = useNavigate()
  const { showToast } = useToast()
  const callbackResult = useOAuth2CallbackResult()
  const handledCompleteRef = useRef(false)

  useEffect(() => {
    if (callbackResult.state !== 'complete' || handledCompleteRef.current) {
      return
    }

    handledCompleteRef.current = true
    setTokens({
      accessToken: callbackResult.accessToken,
      refreshToken: callbackResult.refreshToken,
    })
    showToast({
      message: t('feedback.auth.oauth2Success'),
      tone: 'success',
    })

    const postLoginRedirect = consumeStoredPostLoginRedirect()

    if (postLoginRedirect) {
      routerNavigate(postLoginRedirect, { replace: true })
      return
    }

    navigate('/profile', { replace: true })
  }, [callbackResult, navigate, routerNavigate, showToast, t])

  const isPendingCompletion = callbackResult.state === 'pending'

  const pageTitle = useMemo(
    () =>
      isPendingCompletion
        ? t('pages.oauth2.completeProfile.title')
        : t('pages.oauth2.title'),
    [isPendingCompletion, t],
  )
  const pageSubtitle = useMemo(
    () =>
      isPendingCompletion
        ? t('pages.oauth2.completeProfile.subtitle')
        : t('pages.oauth2.subtitle'),
    [isPendingCompletion, t],
  )

  return (
    <section className="space-y-3">
      <SeoHead
        title={`${pageTitle} | ${t('app.title')}`}
        description={pageSubtitle}
        canonicalPath="/auth/oauth2/callback"
        locale={locale}
        forceNoindex
      />
      <h1 className="text-2xl font-semibold text-slate-900">
        {pageTitle}
      </h1>
      <p className="text-sm text-slate-600">
        {pageSubtitle}
      </p>
      {callbackResult.state === 'pending' ? (
        <OAuth2CompleteProfileForm
          registrationToken={callbackResult.registrationToken}
          missingFields={callbackResult.missingFields}
        />
      ) : null}
      {callbackResult.state === 'complete' ? (
        <div
          className="mt-6 w-full max-w-md rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-700 shadow-sm"
          aria-busy="true"
        >
          {t('pages.oauth2.loading')}
        </div>
      ) : null}
      {callbackResult.state === 'error' ? (
        <OAuth2CallbackErrorState messageKey={callbackResult.messageKey} />
      ) : null}
    </section>
  )
}

export default OAuth2Page
