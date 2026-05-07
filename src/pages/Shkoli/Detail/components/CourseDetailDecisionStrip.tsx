import type { TFunction } from 'i18next'

import { SubscriptionActionGroup } from '../../../../components/ui/SubscriptionActionGroup'

type CourseDetailDecisionStripProps = {
  websiteLink: string | null
  facebookLink: string | null
  scheduleValue: string
  durationValue: string | null
  locationValue: string
  activeMonthsValue: string | null
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

export const CourseDetailDecisionStrip = ({
  websiteLink,
  facebookLink,
  scheduleValue,
  durationValue,
  locationValue,
  activeMonthsValue,
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
}: CourseDetailDecisionStripProps) => {
  const primaryActionClassName =
    'inline-flex h-10 w-full items-center justify-center rounded-xl bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-dark sm:h-11 sm:px-5 sm:text-base lg:h-12 lg:w-auto lg:px-6 lg:text-lg'
  const secondaryActionClassName =
    'inline-flex h-10 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 sm:h-11 sm:px-5 sm:text-base lg:h-12 lg:w-auto lg:px-6 lg:text-lg'
  const iconActionClassName =
    'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:border-slate-400 hover:text-slate-900 sm:h-11 sm:w-11 lg:h-12 lg:w-12'
  const facts = [
    {
      key: 'schedule',
      value: scheduleValue,
      mobileLayoutClassName: '',
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
          <rect x="3.5" y="4" width="13" height="12" rx="2" />
          <path d="M6 2.5v3" />
          <path d="M14 2.5v3" />
          <path d="M3.5 7.5h13" />
        </svg>
      ),
    },
    durationValue
      ? {
          key: 'duration',
          value: durationValue,
          mobileLayoutClassName: '',
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
              <circle cx="10" cy="10" r="6.5" />
              <path d="M10 6.5V10l2.5 1.8" />
            </svg>
          ),
        }
      : null,
    {
      key: 'location',
      value: locationValue,
      mobileLayoutClassName: 'sm:col-span-2',
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
    activeMonthsValue
      ? {
          key: 'activeMonths',
          value: activeMonthsValue,
          mobileLayoutClassName: '',
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
              <rect x="3.5" y="4" width="13" height="12" rx="2" />
              <path d="M6 2.5v3" />
              <path d="M14 2.5v3" />
              <path d="M3.5 7.5h13" />
              <path d="M7.5 10.5h1.5" />
              <path d="M11 10.5h1.5" />
            </svg>
          ),
        }
      : null,
  ].filter(Boolean) as Array<{
    key: string
    value: string
    mobileLayoutClassName: string
    icon: JSX.Element
  }>

  return (
    <div className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6 sm:py-4 lg:px-9 lg:py-2.5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-4">
        <div className="grid w-full gap-2.5 sm:grid-cols-2 lg:flex lg:w-auto lg:flex-wrap lg:items-start lg:gap-4">
          {websiteLink ? (
            <a
              href={websiteLink}
              target="_blank"
              rel="noreferrer"
              className={primaryActionClassName}
            >
              {t('pages.shkoli.detail.actions.visitWebsite')}
            </a>
          ) : null}

          {facebookLink ? (
            <a
              href={facebookLink}
              target="_blank"
              rel="noreferrer"
              className={secondaryActionClassName}
            >
              {t('pages.shkoli.detail.fields.facebook')}
            </a>
          ) : null}

          <SubscriptionActionGroup
            className="lg:min-w-[220px]"
            label={t(
              isSubscribed
                ? 'pages.shkoli.detail.actions.unsubscribe'
                : 'pages.shkoli.detail.actions.subscribe',
            )}
            pendingLabel={t(
              isSubscribed
                ? 'pages.shkoli.detail.actions.unsubscribing'
                : 'pages.shkoli.detail.actions.subscribing',
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
              {t('pages.shkoli.detail.actions.viewSubscribers')}
            </button>
          ) : null}

          <button
            type="button"
            onClick={onShare}
            disabled={isSharePending}
            aria-label={t('pages.shkoli.detail.actions.share')}
            title={t('pages.shkoli.detail.actions.share')}
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
            {t('pages.shkoli.detail.actions.leaveReview')}
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
