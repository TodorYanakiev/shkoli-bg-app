import { useMemo } from 'react'
import type { TFunction } from 'i18next'

import type { CourseAgeGroup, CourseType } from '../../../types/courses'

type CourseFilterChipsProps = {
  courseTypes?: CourseType[]
  ageGroup?: CourseAgeGroup
  minPrice?: number
  maxPrice?: number
  onClear: () => void
  locale: string
  t: TFunction
}

export const CourseFilterChips = ({
  courseTypes,
  ageGroup,
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

  if (ageGroup) {
    chips.push({
      key: 'ageGroup',
      label: t(`courses.ageGroups.${ageGroup}`),
    })
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
