import type {
  CourseScheduleSlot,
  CourseScheduleSpecialCase,
} from '../../../../types/courses'
import type { TFunction } from 'i18next'
import { BGN_PER_EUR } from '../../../../constants/currency'
import type { ScheduleBadge } from '../types'

const formatCurrency = (
  value: number,
  locale: string,
  currency: 'EUR' | 'BGN',
) => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  } catch {
    return value.toFixed(2)
  }
}

export const formatPrice = (price: number, locale: string) => {
  const euroLabel = formatCurrency(price, locale, 'EUR')
  const levaLabel = formatCurrency(price * BGN_PER_EUR, locale, 'BGN')
  return `${euroLabel} / ${levaLabel}`
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

const getPrimaryScheduleSlot = (
  scheduleSlots: CourseScheduleSlot[],
) => scheduleSlots[0]

export const getScheduleSummaryValue = (
  scheduleSlots: CourseScheduleSlot[],
  fallbackValue: string,
  t: TFunction,
) => {
  const primarySlot = getPrimaryScheduleSlot(scheduleSlots)
  if (!primarySlot) return fallbackValue

  const primaryBadge = getScheduleBadge(primarySlot, fallbackValue, t)
  return primaryBadge.value
}

export const getScheduleTimeRangeValue = (
  scheduleSlots: CourseScheduleSlot[],
  fallbackValue: string,
) => {
  const primarySlot = getPrimaryScheduleSlot(scheduleSlots)
  if (!primarySlot) return fallbackValue

  const start = primarySlot.startTime
    ? formatScheduleTime(primarySlot.startTime)
    : null
  const end = primarySlot.endTime
    ? formatScheduleTime(primarySlot.endTime)
    : null

  if (start && end) return `${start} - ${end}`
  return start ?? end ?? fallbackValue
}

export const getScheduleDurationValue = (
  scheduleSlots: CourseScheduleSlot[],
  fallbackValue: string,
  t: TFunction,
) => {
  const primarySlot = getPrimaryScheduleSlot(scheduleSlots)
  if (!primarySlot) return fallbackValue

  if (typeof primarySlot.singleClassDurationMinutes !== 'number') {
    return fallbackValue
  }

  return t('pages.shkoli.detail.schedule.minutes', {
    count: primarySlot.singleClassDurationMinutes,
  })
}
