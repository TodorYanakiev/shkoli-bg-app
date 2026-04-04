import { useId } from 'react'

type SubscriptionActionGroupProps = {
  label: string
  pendingLabel: string
  tooltip?: string
  className?: string
  onAction: () => void
  isPending: boolean
  errorMessage: string | null
}

export const SubscriptionActionGroup = ({
  label,
  pendingLabel,
  tooltip,
  className,
  onAction,
  isPending,
  errorMessage,
}: SubscriptionActionGroupProps) => {
  const tooltipId = useId()

  return (
    <div
      className={[
        'flex w-full min-w-0 flex-col gap-2 lg:min-w-[220px] lg:w-auto',
        className ?? '',
      ]
        .join(' ')
        .trim()}
    >
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="group relative inline-flex w-full lg:w-auto">
          <button
            type="button"
            onClick={onAction}
            disabled={isPending}
            aria-describedby={tooltip && !isPending ? tooltipId : undefined}
            className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 sm:h-11 sm:px-5 sm:text-base lg:h-12 lg:px-6"
          >
            {isPending ? pendingLabel : label}
          </button>

          {tooltip && !isPending ? (
            <div
              id={tooltipId}
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-3 flex w-64 max-w-[calc(100vw-2rem)] -translate-x-1/2 translate-y-1 flex-col items-center opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
            >
              <div className="rounded-2xl border border-white/10 bg-slate-950/95 px-4 py-3 text-center text-xs font-medium leading-5 text-white shadow-[0_20px_45px_-20px_rgba(15,23,42,0.75)] backdrop-blur-sm">
                {tooltip}
              </div>
              <span
                aria-hidden="true"
                className="-mt-1.5 h-3 w-3 rotate-45 rounded-[2px] border-b border-r border-white/10 bg-slate-950/95"
              />
            </div>
          ) : null}
        </div>
      </div>
      {errorMessage ? (
        <div
          className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
          role="alert"
        >
          {errorMessage}
        </div>
      ) : null}
    </div>
  )
}
