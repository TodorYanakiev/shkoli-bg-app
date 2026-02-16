import type { TFunction } from 'i18next'

import type {
  CourseResponse,
  CourseScheduleSlot,
} from '../../../types/courses'
import type { MapExplorerItem } from '../types'

const normalizeOptionalText = (value?: string | null) => {
  const trimmed = value?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : null
}

export const formatMapAverageRating = (value: number) => {
  const rounded = Math.round(value * 10) / 10
  return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(1)
}

const formatTime = (value?: string) => {
  if (!value) return null
  const trimmed = value.trim()
  if (trimmed.length >= 5 && trimmed.includes(':')) {
    return trimmed.slice(0, 5)
  }
  return trimmed
}

const formatSlotLabel = (slot: CourseScheduleSlot, t: TFunction) => {
  if (slot.recurrence === 'WEEKLY' && slot.dayOfWeek) {
    const dayLabel = t(`courses.daysOfWeek.${slot.dayOfWeek}`)
    const timeLabel = formatTime(slot.startTime)
    return timeLabel ? `${dayLabel}, ${timeLabel}` : dayLabel
  }

  if (slot.recurrence === 'MONTHLY' && slot.dayOfMonth) {
    const monthDayLabel = t('pages.map.activity.monthlyDay', {
      day: slot.dayOfMonth,
    })
    const timeLabel = formatTime(slot.startTime)
    return timeLabel ? `${monthDayLabel}, ${timeLabel}` : monthDayLabel
  }

  return null
}

export const getMapLyceumLocation = (
  item: MapExplorerItem,
  t: TFunction,
) => {
  const town = normalizeOptionalText(item.town)
  const address = normalizeOptionalText(item.address)
  if (town && address) {
    return `${town} - ${address}`
  }
  if (town) {
    return town
  }
  if (address) {
    return address
  }
  return t('pages.map.locationFallback')
}

export const getActivityAgeGroupLabel = (
  course: CourseResponse,
  t: TFunction,
) => {
  const groups = (course.ageGroupList ?? []).filter(
    (group): group is NonNullable<typeof group> => Boolean(group),
  )

  if (groups.length === 0) {
    return t('pages.map.activity.ageUnknown')
  }

  return groups
    .map((group) => t(`courses.ageGroups.${group}`))
    .join(', ')
}

export const getActivityScheduleLabel = (
  course: CourseResponse,
  t: TFunction,
) => {
  const slots = course.schedule?.slots ?? []
  if (slots.length === 0) {
    return t('pages.map.activity.scheduleUnknown')
  }

  const firstSlot = slots[0]
  const slotLabel = formatSlotLabel(firstSlot, t)
  return slotLabel ?? t('pages.map.activity.scheduleUnknown')
}

export const getCourseName = (course: CourseResponse, t: TFunction) =>
  normalizeOptionalText(course.name) ?? t('pages.map.activity.untitled')
