import type { TFunction } from 'i18next'

import type {
  CourseScheduleSlot,
  CourseScheduleSpecialCase,
} from '../../../../types/courses'
import type { ScheduleBadge } from '../types'

export const formatPrice = (
  price: number,
  locale: string,
  t: TFunction,
) => {
  if (price === 0) {
    return t('pages.shkoli.detail.priceFree')
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'BGN',
      maximumFractionDigits: 2,
    }).format(price)
  } catch {
    return price.toFixed(2)
  }
}

export const formatScheduleDate = (value: string, locale: string) => {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }
  return parsed.toLocaleDateString(locale)
}

export const formatScheduleTime = (value: string) => {
  const match = value.match(/(\d{1,2}):(\d{2})/)
  if (!match) return value
  const hours = match[1].padStart(2, '0')
  const minutes = match[2].padStart(2, '0')
  return `${hours}:${minutes}`
}

export const getTrimmedString = (
  value: string | null | undefined,
): string | null => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export const getScheduleBadge = (
  slot: CourseScheduleSlot,
  fallbackValue: string,
  t: TFunction,
): ScheduleBadge => {
  if (slot.dayOfWeek) {
    return {
      label: t('pages.shkoli.detail.schedule.dayOfWeek'),
      value: t(`courses.daysOfWeek.${slot.dayOfWeek}`),
      kind: 'dayOfWeek',
    }
  }

  if (typeof slot.dayOfMonth === 'number') {
    return {
      label: t('pages.shkoli.detail.schedule.dayOfMonth'),
      value: String(slot.dayOfMonth),
      kind: 'dayOfMonth',
    }
  }

  return {
    label: t('pages.shkoli.detail.schedule.recurrence'),
    value: slot.recurrence
      ? t(`courses.recurrence.${slot.recurrence}`)
      : fallbackValue,
    kind: 'recurrence',
  }
}

export const getSpecialCaseStatus = (
  entry: CourseScheduleSpecialCase,
  t: TFunction,
) =>
  entry.cancelled
    ? t('pages.shkoli.detail.schedule.cancelled')
    : t('pages.shkoli.detail.schedule.active')
