import type { TFunction } from 'i18next'

type LyceumDetailDecisionStripProps = {
  coursesCount: number
  lecturersCount: number
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

export const LyceumDetailDecisionStrip = ({
  coursesCount,
  lecturersCount,
  locationValue,
  onOpenReviews,
  t,
}: LyceumDetailDecisionStripProps) => {
  const facts = [
    {
      key: 'courses',
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
  ]

  return (
    <div className="border-t border-slate-200 bg-white px-8 py-2.5 lg:px-9">
      <div className="flex flex-wrap items-center gap-3 lg:gap-4">
        <button
          type="button"
          onClick={onOpenReviews}
          className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-lg font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
        >
          {t('pages.lyceums.detail.actions.leaveReview')}
        </button>

        <span className="hidden h-8 w-px bg-slate-200 lg:inline-block" />

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
