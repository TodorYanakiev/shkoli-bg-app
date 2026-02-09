import { useTranslation } from 'react-i18next'

import type { RequestOutcome } from '../types'
import type { LyceumRightsRequestFormValues } from '../validations/lyceumRightsSchemas'

type LyceumRightsRequestSentStateProps = {
  requestOutcome: RequestOutcome | null
  requestedLyceum: LyceumRightsRequestFormValues | null
  isVerifySubmitting: boolean
  onStartOver: () => void
}

const LyceumRightsRequestSentState = ({
  requestOutcome,
  requestedLyceum,
  isVerifySubmitting,
  onStartOver,
}: LyceumRightsRequestSentStateProps) => {
  const { t } = useTranslation()

  return (
    <div className="mt-4 space-y-3">
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
        {t('pages.profile.lyceumRights.request.outcomes.emailSent', {
          email: requestOutcome?.email
            ? requestOutcome.email
            : t('pages.profile.lyceumRights.request.outcomes.emailFallback'),
        })}
      </div>
      <div className="text-xs font-medium text-slate-500">
        {t('pages.profile.lyceumRights.request.outcomes.requestedLyceum', {
          lyceumName: requestedLyceum?.lyceumName ?? '',
          town: requestedLyceum?.town ?? '',
        })}
      </div>
      <button
        type="button"
        onClick={onStartOver}
        disabled={isVerifySubmitting}
        className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-400"
      >
        {t('pages.profile.lyceumRights.request.startOver')}
      </button>
    </div>
  )
}

export default LyceumRightsRequestSentState
