import type {
  ManualLyceumOption,
  ManualLyceumTownGroup,
} from '../services/lyceumManualPicker'

type LyceumManualPickerTownGroupProps = {
  group: ManualLyceumTownGroup
  panelId: string
  isExpanded: boolean
  isSubmitting: boolean
  onToggle: () => void
  onSelect: (option: ManualLyceumOption) => void
}

const LyceumManualPickerTownGroup = ({
  group,
  panelId,
  isExpanded,
  isSubmitting,
  onToggle,
  onSelect,
}: LyceumManualPickerTownGroupProps) => (
  <section className="space-y-2">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-lg px-1 py-1 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:bg-slate-100/70"
      aria-expanded={isExpanded}
      aria-controls={panelId}
    >
      <span>{group.town}</span>
      <span
        className={[
          'text-brand transition-transform',
          isExpanded ? 'rotate-180' : 'rotate-0',
        ].join(' ')}
        aria-hidden="true"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20">
          <path
            d="M5.5 7.5l4.5 4.5 4.5-4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
    {isExpanded ? (
      <ul id={panelId} className="grid gap-2 sm:grid-cols-2">
        {group.lyceums.map((lyceum) => {
          const key = `${lyceum.town}-${lyceum.name}`
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => onSelect(lyceum)}
                disabled={isSubmitting}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left transition hover:border-brand/40 hover:bg-brand/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="text-sm font-semibold text-slate-900">
                  {lyceum.name}
                </span>
                <span className="ml-3 text-xs font-medium text-slate-500">
                  {lyceum.town}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    ) : null}
  </section>
)

export default LyceumManualPickerTownGroup
