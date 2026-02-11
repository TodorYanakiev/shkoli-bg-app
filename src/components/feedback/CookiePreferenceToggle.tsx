type CookiePreferenceToggleProps = {
  icon: string
  title: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
}

const CookiePreferenceToggle = ({
  icon,
  title,
  description,
  checked,
  disabled = false,
  onChange,
}: CookiePreferenceToggleProps) => (
  <label
    className={`flex items-start justify-between gap-4 rounded-2xl border px-4 py-3 ${
      disabled
        ? 'border-slate-200 bg-slate-100/80'
        : 'border-slate-300 bg-white/90 transition-colors hover:border-brand-dark'
    }`}
  >
    <span className="flex min-w-0 gap-3">
      <span
        aria-hidden
        className={`mt-0.5 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full text-sm ${
          disabled ? 'bg-slate-200' : 'bg-amber-100'
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-slate-900">{title}</span>
        <span className="block text-xs leading-5 text-slate-600">{description}</span>
      </span>
    </span>
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(event) => onChange?.(event.target.checked)}
      className="mt-1 h-4 w-4 cursor-pointer rounded border-slate-400 text-brand-dark focus:ring-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
    />
  </label>
)

export default CookiePreferenceToggle
