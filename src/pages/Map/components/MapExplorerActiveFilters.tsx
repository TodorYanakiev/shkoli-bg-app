import { useMemo } from 'react'
import type { TFunction } from 'i18next'

import type { CourseSortKey } from '../../Shkoli/types'
import type { MapFilterState } from '../types'

type MapExplorerActiveFiltersProps = {
  state: MapFilterState
  locale: string
  t: TFunction
}

const COURSE_SORT_LABEL_KEYS: Record<Exclude<CourseSortKey, ''>, string> = {
  'price,asc': 'pages.shkoli.list.filters.sort.priceAsc',
  'price,desc': 'pages.shkoli.list.filters.sort.priceDesc',
  'name,asc': 'pages.shkoli.list.filters.sort.nameAsc',
  'name,desc': 'pages.shkoli.list.filters.sort.nameDesc',
}

const MapExplorerActiveFilters = ({
  state,
  locale,
  t,
}: MapExplorerActiveFiltersProps) => {
  const formatter = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }),
    [locale],
  )

  const chips: Array<{ key: string; label: string }> = []

  state.ageGroups?.forEach((group) => {
    chips.push({
      key: `age-${group}`,
      label: t(`courses.ageGroups.${group}`),
    })
  })

  state.dayOfWeek?.forEach((day) => {
    chips.push({
      key: `day-${day}`,
      label: t(`courses.daysOfWeek.${day}`),
    })
  })

  if (state.town) {
    chips.push({
      key: 'town',
      label: t('pages.shkoli.list.filters.townLabel') + `: ${state.town}`,
    })
  }

  if (state.startTimeFrom || state.startTimeTo) {
    if (state.startTimeFrom && state.startTimeTo) {
      chips.push({
        key: 'time-range',
        label: t('pages.shkoli.list.filters.timeRange', {
          from: state.startTimeFrom,
          to: state.startTimeTo,
        }),
      })
    } else if (state.startTimeFrom) {
      chips.push({
        key: 'time-from',
        label: t('pages.shkoli.list.filters.timeFromChip', {
          value: state.startTimeFrom,
        }),
      })
    } else if (state.startTimeTo) {
      chips.push({
        key: 'time-to',
        label: t('pages.shkoli.list.filters.timeToChip', {
          value: state.startTimeTo,
        }),
      })
    }
  }

  if (state.minPrice != null || state.maxPrice != null) {
    const minLabel =
      state.minPrice != null ? formatter.format(state.minPrice) : undefined
    const maxLabel =
      state.maxPrice != null ? formatter.format(state.maxPrice) : undefined

    if (minLabel && maxLabel) {
      chips.push({
        key: 'price-range',
        label: t('pages.shkoli.list.filters.priceRange', {
          min: minLabel,
          max: maxLabel,
        }),
      })
    } else if (minLabel) {
      chips.push({
        key: 'price-from',
        label: t('pages.shkoli.list.filters.priceFromChip', {
          value: minLabel,
        }),
      })
    } else if (maxLabel) {
      chips.push({
        key: 'price-to',
        label: t('pages.shkoli.list.filters.priceToChip', {
          value: maxLabel,
        }),
      })
    }
  }

  if (state.courseSort) {
    chips.push({
      key: 'sort',
      label: t(COURSE_SORT_LABEL_KEYS[state.courseSort]),
    })
  }

  if (chips.length === 0) {
    return null
  }

  const visibleChips = chips.slice(0, 7)
  const hiddenCount = chips.length - visibleChips.length

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {visibleChips.map((chip) => (
        <span
          key={chip.key}
          className="rounded-full border border-emerald-200/80 bg-emerald-50/70 px-3 py-1 text-[11px] font-medium text-emerald-800"
        >
          {chip.label}
        </span>
      ))}
      {hiddenCount > 0 ? (
        <span className="rounded-full border border-slate-200/80 bg-slate-100/80 px-3 py-1 text-[11px] font-semibold text-slate-600">
          +{hiddenCount}
        </span>
      ) : null}
    </div>
  )
}

export default MapExplorerActiveFilters
