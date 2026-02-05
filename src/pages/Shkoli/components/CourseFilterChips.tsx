import { useMemo } from 'react'
import type { TFunction } from 'i18next'

import type {
  CourseAgeGroup,
  CourseScheduleDayOfWeek,
  CourseType,
} from '../../../types/courses'

type CourseFilterChipsProps = {
  courseTypes?: CourseType[]
  ageGroups?: CourseAgeGroup[]
  dayOfWeek?: CourseScheduleDayOfWeek[]
  startTimeFrom?: string
  startTimeTo?: string
  minPrice?: number
  maxPrice?: number
  onClear: () => void
  locale: string
  t: TFunction
}

export const CourseFilterChips = ({
  courseTypes,
  ageGroups,
  dayOfWeek,
  startTimeFrom,
  startTimeTo,
  minPrice,
  maxPrice,
  onClear,
  locale,
  t,
}: CourseFilterChipsProps) => {
  const formatter = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }),
    [locale],
  )

  const chips: { key: string; label: string }[] = []

  courseTypes?.forEach((type) => {
    chips.push({
      key: `courseType-${type}`,
      label: t(`courses.types.${type}`),
    })
  })

  ageGroups?.forEach((group) => {
    chips.push({
      key: `ageGroup-${group}`,
      label: t(`courses.ageGroups.${group}`),
    })
  })

  dayOfWeek?.forEach((day) => {
    chips.push({
      key: `dayOfWeek-${day}`,
      label: t(`courses.daysOfWeek.${day}`),
    })
  })

  if (startTimeFrom || startTimeTo) {
    if (startTimeFrom && startTimeTo) {
      chips.push({
        key: 'timeRange',
        label: t('pages.shkoli.list.filters.timeRange', {
          from: startTimeFrom,
          to: startTimeTo,
        }),
      })
    } else if (startTimeFrom) {
      chips.push({
        key: 'timeFrom',
        label: t('pages.shkoli.list.filters.timeFromChip', {
          value: startTimeFrom,
        }),
      })
    } else if (startTimeTo) {
      chips.push({
        key: 'timeTo',
        label: t('pages.shkoli.list.filters.timeToChip', {
          value: startTimeTo,
        }),
      })
    }
  }

  if (minPrice != null || maxPrice != null) {
    const minLabel =
      minPrice != null ? formatter.format(minPrice) : undefined
    const maxLabel =
      maxPrice != null ? formatter.format(maxPrice) : undefined

    if (minLabel && maxLabel) {
      chips.push({
        key: 'priceRange',
        label: t('pages.shkoli.list.filters.priceRange', {
          min: minLabel,
          max: maxLabel,
        }),
      })
    } else if (minLabel) {
      chips.push({
        key: 'priceFrom',
        label: t('pages.shkoli.list.filters.priceFromChip', {
          value: minLabel,
        }),
      })
    } else if (maxLabel) {
      chips.push({
        key: 'priceTo',
        label: t('pages.shkoli.list.filters.priceToChip', {
          value: maxLabel,
        }),
      })
    }
  }

  if (chips.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="rounded-full bg-emerald-50 px-4 py-1 text-xs font-medium text-emerald-800"
        >
          {chip.label}
        </span>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="rounded-full border border-emerald-100 bg-white px-4 py-1 text-xs font-semibold text-emerald-800 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50"
      >
        {t('pages.shkoli.list.filters.clearAll')}
      </button>
    </div>
  )
}
