export const getInputClassName = (hasError: boolean) =>
  [
    'mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
    'disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400',
    hasError
      ? 'border-rose-300 bg-rose-50/40 focus-visible:outline-rose-300'
      : 'border-slate-200/80 bg-white',
  ].join(' ')

export const actionButtonClassName =
  'inline-flex w-full items-center justify-center rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300'

export const removeButtonClassName =
  'inline-flex items-center justify-center rounded-full border border-rose-200 bg-white px-3 py-1 text-[10px] font-semibold text-rose-600 shadow-sm transition hover:border-rose-300 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-60'

export const confirmButtonClassName =
  'inline-flex items-center justify-center rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300'

export const cancelButtonClassName =
  'inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-60'
