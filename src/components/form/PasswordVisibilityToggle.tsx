import showPasswordIcon from '../../assets/show-password.svg'

type PasswordVisibilityToggleProps = {
  isVisible: boolean
  onToggle: () => void
  ariaLabel: string
  className?: string
}

const PasswordVisibilityToggle = ({
  isVisible,
  onToggle,
  ariaLabel,
  className,
}: PasswordVisibilityToggleProps) => {
  const classes = [
    'absolute inset-y-0 right-3 inline-flex items-center justify-center text-slate-500 transition hover:text-slate-700',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type="button" onClick={onToggle} aria-label={ariaLabel} className={classes}>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-brand transition duration-200 ${
          isVisible ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'
        }`}
      />
      <img
        src={showPasswordIcon}
        alt=""
        aria-hidden="true"
        className="h-4 w-4"
      />
    </button>
  )
}

export default PasswordVisibilityToggle
