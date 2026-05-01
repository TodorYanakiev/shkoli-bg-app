import { useTranslation } from 'react-i18next'

import TownSelect from '../../../../components/ui/TownSelect'
import type { AdminLyceumsFilterState } from '../types'

type AdminLyceumsFiltersProps = {
  state: AdminLyceumsFilterState
  townOptions: string[]
  hasActiveFilters: boolean
  isLoading: boolean
  onNameChange: (value: string) => void
  onTownChange: (value: string) => void
  onIncludeVerifiedChange: (value: boolean) => void
  onIncludeUnverifiedChange: (value: boolean) => void
  onClear: () => void
}

export const AdminLyceumsFilters = ({
  state,
  townOptions,
  hasActiveFilters,
  isLoading,
  onNameChange,
  onTownChange,
  onIncludeVerifiedChange,
  onIncludeUnverifiedChange,
  onClear,
}: AdminLyceumsFiltersProps) => {
  const { t } = useTranslation()

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="space-y-1 text-sm text-slate-700">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t('pages.admin.lyceums.filters.nameLabel')}
          </span>
          <input
            type="text"
            value={state.name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder={t('pages.admin.lyceums.filters.namePlaceholder')}
            className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
          />
        </label>
        <div className="space-y-1 text-sm text-slate-700">
          <label
            htmlFor="admin-lyceums-town-filter"
            className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            {t('pages.admin.lyceums.filters.townLabel')}
          </label>
          <TownSelect
            id="admin-lyceums-town-filter"
            value={state.town}
            onChange={onTownChange}
            options={townOptions}
            placeholder={t('pages.admin.lyceums.filters.townAll')}
            emptyOptionLabel={t('pages.admin.lyceums.filters.townAll')}
            variant="filter"
          />
        </div>
        <fieldset className="space-y-2 text-sm text-slate-700">
          <legend className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t('pages.admin.lyceums.filters.verificationLabel')}
          </legend>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={state.includeVerified}
              onChange={(event) => onIncludeVerifiedChange(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand/30"
            />
            <span>{t('pages.admin.lyceums.filters.verified')}</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={state.includeUnverified}
              onChange={(event) =>
                onIncludeUnverifiedChange(event.target.checked)
              }
              className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand/30"
            />
            <span>{t('pages.admin.lyceums.filters.unverified')}</span>
          </label>
        </fieldset>
        <div className="flex items-end">
          <button
            type="button"
            onClick={onClear}
            disabled={!hasActiveFilters || isLoading}
            className="h-11 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm font-semibold text-slate-700 transition hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('pages.admin.lyceums.filters.clear')}
          </button>
        </div>
      </div>
    </div>
  )
}
