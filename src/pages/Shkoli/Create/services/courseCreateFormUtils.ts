import type {
  CourseAgeGroup,
  CourseSchedule,
  CourseScheduleDayOfWeek,
  CourseScheduleRecurrence,
  CourseScheduleSlot,
  CourseScheduleSpecialCase,
  CourseType,
  CourseRequest,
} from '../../../../types/courses'
import type { CourseCreateFormValues } from '../validations/courseCreateSchema'

export const normalizeOptionalText = (value: string) => {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export const normalizeOptionalNumber = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : undefined
}

export const normalizeOptionalInteger = (value: string) => {
  const parsed = normalizeOptionalNumber(value)
  return parsed != null && Number.isInteger(parsed) ? parsed : undefined
}

export const buildCourseSchedule = (
  values: CourseCreateFormValues,
): CourseSchedule | undefined => {
  const slots: CourseScheduleSlot[] = values.scheduleSlots.map((slot) => {
    const recurrence = slot.recurrence as CourseScheduleRecurrence
    const dayOfWeek =
      recurrence === 'WEEKLY'
        ? ((slot.dayOfWeek || undefined) as
            | CourseScheduleDayOfWeek
            | undefined)
        : undefined
    const dayOfMonth =
      recurrence === 'MONTHLY'
        ? normalizeOptionalInteger(slot.dayOfMonth)
        : undefined

    return {
      recurrence,
      dayOfWeek,
      dayOfMonth,
      startTime: normalizeOptionalText(slot.startTime),
      endTime: normalizeOptionalText(slot.endTime),
      singleClassDurationMinutes: normalizeOptionalInteger(
        slot.singleClassDurationMinutes,
      ),
    }
  })

  const specialCases: CourseScheduleSpecialCase[] =
    values.scheduleSpecialCases.map((entry) => ({
      date: entry.date.trim(),
      cancelled: entry.cancelled ? true : undefined,
      reason: normalizeOptionalText(entry.reason),
    }))

  if (slots.length === 0 && specialCases.length === 0) {
    return undefined
  }

  return {
    slots: slots.length > 0 ? slots : undefined,
    specialCases: specialCases.length > 0 ? specialCases : undefined,
  }
}

export const defaultScheduleSlot = {
  recurrence: 'WEEKLY',
  dayOfWeek: '',
  dayOfMonth: '',
  startTime: '',
  endTime: '',
  singleClassDurationMinutes: '',
}

export const defaultSpecialCase = {
  date: '',
  cancelled: false,
  reason: '',
}

type CourseCreatePayloadResult = {
  payload: CourseRequest
  lecturerIds: number[]
}

export const buildCourseCreatePayload = (
  values: CourseCreateFormValues,
  lyceumId: number | null,
): CourseCreatePayloadResult => {
  const uniqueAgeGroups = Array.from(
    new Set(values.ageGroupList),
  ) as CourseAgeGroup[]
  const lecturerIds =
    values.lecturerIds
      ?.map((value) => Number(value))
      .filter(Number.isFinite) ?? []
  const schedule = buildCourseSchedule(values)
  const isInLyceumValue = values.isInLyceum ?? true

  const payload: CourseRequest = {
    name: values.name.trim(),
    description: values.description.trim(),
    type: values.type as CourseType,
    ageGroupList: uniqueAgeGroups,
    schedule,
    lyceumId: lyceumId ?? undefined,
    address: isInLyceumValue
      ? undefined
      : normalizeOptionalText(values.address),
    price: normalizeOptionalNumber(values.price),
    achievements: normalizeOptionalText(values.achievements),
    facebookLink: normalizeOptionalText(values.facebookLink),
    websiteLink: normalizeOptionalText(values.websiteLink),
    lecturerIds: lecturerIds.length > 0 ? lecturerIds : undefined,
  }

  return { payload, lecturerIds }
}
