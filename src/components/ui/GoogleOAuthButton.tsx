import { useTranslation } from 'react-i18next'

import { getGoogleOAuthAuthorizationUrl } from '../../services/auth'

type GoogleOAuthButtonProps = {
  className?: string
}

const GoogleOAuthButton = ({ className }: GoogleOAuthButtonProps) => {
  const { t } = useTranslation()

  const handleContinue = () => {
    window.location.assign(getGoogleOAuthAuthorizationUrl())
  }

  return (
    <button
      type="button"
      onClick={handleContinue}
      data-testid="auth-google-continue"
      className={[
        'inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition',
        'hover:border-slate-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
        className,
      ].join(' ')}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="h-5 w-5 shrink-0"
      >
        <path
          fill="#4285F4"
          d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.44a5.51 5.51 0 0 1-2.39 3.62v3h3.87c2.27-2.09 3.57-5.18 3.57-8.65z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.87-3c-1.07.72-2.44 1.14-4.07 1.14-3.13 0-5.78-2.11-6.73-4.95H1.27v3.1A12 12 0 0 0 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.27 14.29A7.2 7.2 0 0 1 4.9 12c0-.8.14-1.57.37-2.29v-3.1H1.27A12 12 0 0 0 0 12c0 1.93.46 3.76 1.27 5.39l4-3.1z"
        />
        <path
          fill="#EA4335"
          d="M12 4.77c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.61l4 3.1c.95-2.84 3.6-4.94 6.73-4.94z"
        />
      </svg>
      {t('common.auth.continueWithGoogle')}
    </button>
  )
}

export default GoogleOAuthButton
