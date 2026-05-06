import type { TFunction } from 'i18next'

import { SubscriptionActionGroup } from '../../../../components/ui/SubscriptionActionGroup'

type LyceumDetailDecisionStripProps = {
  coursesCount: number
  lecturersCount: number
  locationValue: string
  isSubscribed: boolean
  isSubscriptionPending: boolean
  subscriptionErrorMessage: string | null
  subscriptionTooltip: string | null
  canViewSubscribers: boolean
  isSharePending: boolean
  onSubscriptionAction: () => void
  onShare: () => void
  onOpenSubscribers: () => void
  onOpenReviews: () => void
  t: TFunction
}

type FactItemProps = {
  icon: JSX.Element
  value: string
}

const FactItem = ({ icon, value }: FactItemProps) => (
  <div className="flex min-h-11 items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 sm:text-base lg:min-h-0 lg:items-center lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:py-0">
    <span className="mt-0.5 shrink-0 text-brand lg:mt-0">{icon}</span>
    <span className="min-w-0 flex-1 font-medium leading-5">{value}</span>
  </div>
)

export const LyceumDetailDecisionStrip = ({
  coursesCount,
  lecturersCount,
  locationValue,
  isSubscribed,
  isSubscriptionPending,
  subscriptionErrorMessage,
  subscriptionTooltip,
  canViewSubscribers,
  isSharePending,
  onSubscriptionAction,
  onShare,
  onOpenSubscribers,
  onOpenReviews,
  t,
}: LyceumDetailDecisionStripProps) => {
  const secondaryActionClassName =
    'inline-flex h-10 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 sm:h-11 sm:px-5 sm:text-base lg:h-12 lg:w-auto lg:px-6 lg:text-lg'
  const iconActionClassName =
    'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:border-slate-400 hover:text-slate-900 sm:h-11 sm:w-11 lg:h-12 lg:w-12'
  const facts = [
    {
      key: 'courses',
      mobileLayoutClassName: '',
      value: t('pages.lyceums.detail.facts.coursesCount', {
        count: coursesCount,
      }),
      icon: (
        <svg
          viewBox="0 0 20 20"
          className="h-[18px] w-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M7 4.5h9" />
          <path d="M7 10h9" />
          <path d="M7 15.5h9" />
          <circle cx="4.3" cy="4.5" r="1" />
          <circle cx="4.3" cy="10" r="1" />
          <circle cx="4.3" cy="15.5" r="1" />
        </svg>
      ),
    },
    {
      key: 'lecturers',
      mobileLayoutClassName: '',
      value: t('pages.lyceums.detail.facts.lecturersCount', {
        count: lecturersCount,
      }),
      icon: (
        <svg
          viewBox="0 0 20 20"
          className="h-[18px] w-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M7 10.5a2.5 2.5 0 1 0-2.5-2.5A2.5 2.5 0 0 0 7 10.5z" />
          <path d="M4 15.5a3 3 0 0 1 6 0" />
          <path d="M14.5 10a2 2 0 1 0-1.8-3" />
          <path d="M12.8 15a2.8 2.8 0 0 1 4.2.8" />
        </svg>
      ),
    },
    {
      key: 'location',
      mobileLayoutClassName: 'sm:col-span-2',
      value: locationValue,
      icon: (
        <svg
          viewBox="0 0 20 20"
          className="h-[18px] w-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10 17s5-4.5 5-8a5 5 0 1 0-10 0c0 3.5 5 8 5 8z" />
          <circle cx="10" cy="9" r="1.8" />
        </svg>
      ),
    },
  ] as Array<{
    key: string
    value: string
    mobileLayoutClassName: string
    icon: JSX.Element
  }>

  return (
    <div className="border-t border-slate-200 bg-white px-4 py-3 sm:px-6 sm:py-3.5 lg:px-9">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-4">
        <div className="grid w-full gap-2.5 sm:grid-cols-2 lg:flex lg:w-auto lg:flex-wrap lg:items-start lg:gap-4">
          <SubscriptionActionGroup
            className="lg:min-w-[220px]"
            label={t(
              isSubscribed
                ? 'pages.lyceums.detail.actions.unsubscribe'
                : 'pages.lyceums.detail.actions.subscribe',
            )}
            pendingLabel={t(
              isSubscribed
                ? 'pages.lyceums.detail.actions.unsubscribing'
                : 'pages.lyceums.detail.actions.subscribing',
            )}
            tooltip={subscriptionTooltip ?? undefined}
            onAction={onSubscriptionAction}
            isPending={isSubscriptionPending}
            errorMessage={subscriptionErrorMessage}
          />

          {canViewSubscribers ? (
            <button
              type="button"
              onClick={onOpenSubscribers}
              className={`${secondaryActionClassName} lg:hidden`}
            >
              {t('pages.lyceums.detail.actions.viewSubscribers')}
            </button>
          ) : null}

          <button
            type="button"
            onClick={onShare}
            disabled={isSharePending}
            aria-label={t('pages.lyceums.detail.actions.share')}
            title={t('pages.lyceums.detail.actions.share')}
            className={`${iconActionClassName} disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400`}
          >
            {isSharePending ? (
              <svg
                viewBox="0 0 20 20"
                className="h-[18px] w-[18px] animate-spin"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M10 3.5a6.5 6.5 0 1 1-4.6 1.9" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 20 20"
                className="h-[18px] w-[18px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="5" cy="10" r="2" />
                <circle cx="14.5" cy="5.5" r="2" />
                <circle cx="14.5" cy="14.5" r="2" />
                <path d="M6.7 9l6-2.7" />
                <path d="M6.7 11l6 2.7" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenReviews}
            className={secondaryActionClassName}
          >
            {t('pages.lyceums.detail.actions.leaveReview')}
          </button>
        </div>

        <div className="grid w-full gap-2 sm:grid-cols-2 lg:flex lg:min-w-0 lg:flex-1 lg:flex-wrap lg:items-center lg:gap-4">
          <span className="hidden h-8 w-px bg-slate-200 lg:inline-block" />

          {facts.map((fact, index) => (
            <div
              key={fact.key}
              className={[fact.mobileLayoutClassName, 'lg:contents']
                .join(' ')
                .trim()}
            >
              {index > 0 ? (
                <span className="hidden h-7 w-px bg-slate-200 lg:inline-block" />
              ) : null}
              <FactItem value={fact.value} icon={fact.icon} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
