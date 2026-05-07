type StatisticsPanelItem = {
  key: string
  label: string
  description: string
  value: string
}

type StatisticsPanelProps = {
  id: string
  title: string
  subtitle: string
  items: StatisticsPanelItem[]
  isLoading: boolean
  errorMessage: string | null
}

export const StatisticsPanel = ({
  id,
  title,
  subtitle,
  items,
  isLoading,
  errorMessage,
}: StatisticsPanelProps) => (
  <section id={id} className="scroll-mt-24">
    <div className="max-w-3xl">
      <h3 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
        {title}
      </h3>
      <p className="mt-2 text-base leading-7 text-slate-600">{subtitle}</p>
    </div>

    {errorMessage ? (
      <div
        className="mt-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        role="alert"
      >
        {errorMessage}
      </div>
    ) : null}

    {isLoading ? (
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-36 animate-pulse rounded-lg border border-slate-200 bg-slate-100"
          />
        ))}
      </div>
    ) : !errorMessage ? (
      <dl className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.key}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <dt className="text-sm font-medium text-slate-600">
              {item.label}
            </dt>
            <dd className="mt-3 text-3xl font-semibold text-slate-950">
              {item.value}
            </dd>
            <p className="mt-2 text-sm leading-5 text-slate-500">
              {item.description}
            </p>
          </div>
        ))}
      </dl>
    ) : null}
  </section>
)
