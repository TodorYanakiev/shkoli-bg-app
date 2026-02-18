import type { TFunction } from 'i18next'

type CourseDetailDecisionStripProps = {
  websiteLink: string | null
  facebookLink: string | null
  scheduleValue: string
  durationValue: string | null
  locationValue: string
  onOpenReviews: () => void
  t: TFunction
}

type FactItemProps = {
  icon: JSX.Element
  value: string
}

const FactItem = ({ icon, value }: FactItemProps) => (
  <div className="inline-flex items-center gap-2 text-base text-slate-700">
    <span className="text-brand">{icon}</span>
    <span className="font-medium">{value}</span>
  </div>
)

export const CourseDetailDecisionStrip = ({
  websiteLink,
  facebookLink,
  scheduleValue,
  durationValue,
  locationValue,
  onOpenReviews,
  t,
}: CourseDetailDecisionStripProps) => {
  const facts = [
    {
      key: 'schedule',
      value: scheduleValue,
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
  ].filter(Boolean) as Array<{
    key: string
    value: string
    icon: JSX.Element
  }>

  const hasExternalLinks = Boolean(websiteLink || facebookLink)

  return (
    <div className="border-t border-slate-200 bg-white px-8 py-2.5 lg:px-9">
      <div className="flex flex-wrap items-center gap-3 lg:gap-4">
        {websiteLink ? (
          <a
            href={websiteLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-brand px-6 text-lg font-semibold text-white transition hover:bg-brand-dark"
          >
            {t('pages.shkoli.detail.actions.visitWebsite')}
          </a>
        ) : null}

        {facebookLink ? (
          <a
            href={facebookLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-lg font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          >
            {t('pages.shkoli.detail.fields.facebook')}
          </a>
        ) : null}

        <button
          type="button"
          onClick={onOpenReviews}
          className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-lg font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
        >
          {t('pages.shkoli.detail.actions.leaveReview')}
        </button>

        {hasExternalLinks ? (
          <span className="hidden h-8 w-px bg-slate-200 lg:inline-block" />
        ) : null}

        {facts.map((fact, index) => (
          <div key={fact.key} className="contents">
            {index > 0 ? (
              <span className="hidden h-7 w-px bg-slate-200 lg:inline-block" />
            ) : null}
            <FactItem value={fact.value} icon={fact.icon} />
          </div>
        ))}
      </div>
    </div>
  )
}
