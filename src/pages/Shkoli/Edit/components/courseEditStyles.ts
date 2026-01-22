export const courseEditStyles = {
  inputClassName: (hasError: boolean, extraClasses?: string) =>
    [
      'mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
      hasError
        ? 'border-rose-300 bg-rose-50/40 focus-visible:outline-rose-300'
        : 'border-slate-200/80 bg-white',
      extraClasses,
    ].join(' '),
  fieldsetClassName:
    'space-y-4 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 sm:p-5',
  legendClassName:
    'text-xs font-semibold uppercase tracking-wide text-slate-500',
  errorTextClassName: 'mt-1 text-xs font-medium text-rose-600',
  actionBarClassName:
    'flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 sm:flex-row sm:items-center',
  primaryActionButtonClassName:
    'inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto',
  secondaryActionButtonClassName:
    'inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-400 sm:w-auto',
}
