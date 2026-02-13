import { type FormEvent, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { TFunction } from 'i18next'

import type { LyceumFilterFormValues } from '../validations/lyceumFilterSchema'
import LyceumFilterTownSelect from './filters/LyceumFilterTownSelect'

type LyceumFilterPanelProps = {
  form: UseFormReturn<LyceumFilterFormValues>
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  isFetching: boolean
  t: TFunction
}

const LyceumFilterPanel = ({
  form,
  onSubmit,
  isFetching,
  t,
}: LyceumFilterPanelProps) => {
  const { control } = form
  const [closeSignal, setCloseSignal] = useState(0)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    setCloseSignal((previous) => previous + 1)
    onSubmit(event)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="relative z-30 mx-auto flex w-full max-w-[560px] flex-col gap-3 sm:flex-row sm:items-center sm:gap-0">
        <LyceumFilterTownSelect
          control={control}
          t={t}
          closeSignal={closeSignal}
        />

        <button
          type="submit"
          disabled={isFetching}
          className="flex h-12 w-full items-center justify-center rounded-full border border-emerald-900/20 bg-emerald-700 px-7 text-sm font-semibold text-white shadow-[0_14px_24px_-14px_rgba(5,150,105,0.95)] transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-[156px] sm:rounded-l-none sm:rounded-r-full sm:border-l-0 sm:px-8"
        >
          {t('pages.lyceums.list.filters.apply')}
        </button>
      </div>
    </form>
  )
}

export default LyceumFilterPanel
