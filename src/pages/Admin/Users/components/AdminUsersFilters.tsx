import { useTranslation } from 'react-i18next'

import type { AdminUserRoleFilter, AdminUsersFilterState } from '../types'

type AdminUsersFiltersProps = {
  state: AdminUsersFilterState
  hasActiveFilters: boolean
  isLoading: boolean
  onSearchChange: (value: string) => void
  onRoleChange: (value: AdminUserRoleFilter) => void
  onIncludeEnabledChange: (value: boolean) => void
  onIncludeDisabledChange: (value: boolean) => void
  onClear: () => void
}

export const AdminUsersFilters = ({
  state,
  hasActiveFilters,
  isLoading,
  onSearchChange,
  onRoleChange,
  onIncludeEnabledChange,
  onIncludeDisabledChange,
  onClear,
}: AdminUsersFiltersProps) => {
  const { t } = useTranslation()

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="space-y-1 text-sm text-slate-700">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t('pages.admin.users.filters.searchLabel')}
          </span>
          <input
            type="text"
            value={state.search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t('pages.admin.users.filters.searchPlaceholder')}
            className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
          />
        </label>
        <label className="space-y-1 text-sm text-slate-700">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t('pages.admin.users.filters.roleLabel')}
          </span>
          <select
            value={state.role}
            onChange={(event) =>
              onRoleChange(event.target.value as AdminUserRoleFilter)
            }
            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
          >
            <option value="">
              {t('pages.admin.users.filters.roleAll')}
            </option>
            <option value="USER">
              {t('pages.admin.users.filters.roleUser')}
            </option>
            <option value="ADMIN">
              {t('pages.admin.users.filters.roleAdmin')}
            </option>
          </select>
        </label>
        <fieldset className="space-y-2 text-sm text-slate-700">
          <legend className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t('pages.admin.users.filters.statusLabel')}
          </legend>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={state.includeEnabled}
              onChange={(event) => onIncludeEnabledChange(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand/30"
            />
            <span>{t('pages.admin.users.filters.enabled')}</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={state.includeDisabled}
              onChange={(event) =>
                onIncludeDisabledChange(event.target.checked)
              }
              className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand/30"
            />
            <span>{t('pages.admin.users.filters.disabled')}</span>
          </label>
        </fieldset>
        <div className="flex items-end">
          <button
            type="button"
            onClick={onClear}
            disabled={!hasActiveFilters || isLoading}
            className="h-11 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm font-semibold text-slate-700 transition hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('pages.admin.users.filters.clear')}
          </button>
        </div>
      </div>
    </div>
  )
}

