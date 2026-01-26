export const getInputClassName = (
  hasError: boolean,
  extraClasses?: string,
) =>
  [
    'mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm transition',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
    'disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400',
    hasError
      ? 'border-rose-300 bg-rose-50/40 focus-visible:outline-rose-300'
      : 'border-slate-200 bg-white',
    extraClasses,
  ].join(' ')
