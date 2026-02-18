import type { TFunction } from 'i18next'
import type { Path, UseFormSetError } from 'react-hook-form'

import type { ApiError } from '../../../../types/api'
import type { CourseEditFormValues } from '../validations/courseEditSchema'

const directFieldMap: Record<string, Path<CourseEditFormValues>> = {
  name: 'name',
  description: 'description',
  type: 'type',
  executionType: 'executionType',
  ageGroupList: 'ageGroupList',
  price: 'price',
  address: 'address',
  achievements: 'achievements',
  facebookLink: 'facebookLink',
  websiteLink: 'websiteLink',
  activeStartMonth: 'activeStartMonth',
  activeEndMonth: 'activeEndMonth',
  lecturerIds: 'lecturerIds',
}

const scheduleSlotFieldNames = new Set([
  'recurrence',
  'dayOfWeek',
  'dayOfMonth',
  'startTime',
  'endTime',
  'singleClassDurationMinutes',
])

const scheduleSpecialCaseFieldNames = new Set([
  'date',
  'cancelled',
  'reason',
])

const normalizeFieldPath = (rawField: string) =>
  rawField.trim().replace(/\[(\d+)\]/g, '.$1')

const toScheduleSlotPath = (
  normalizedField: string,
): Path<CourseEditFormValues> | null => {
  const parts = normalizedField.split('.')
  const index =
    parts[0] === 'schedule' && parts[1] === 'slots'
      ? Number(parts[2])
      : parts[0] === 'scheduleSlots'
        ? Number(parts[1])
        : Number.NaN
  const fieldName =
    parts[0] === 'schedule' && parts[1] === 'slots'
      ? parts[3]
      : parts[0] === 'scheduleSlots'
        ? parts[2]
        : ''

  if (!Number.isInteger(index) || !scheduleSlotFieldNames.has(fieldName)) {
    return null
  }

  return `scheduleSlots.${index}.${fieldName}` as Path<CourseEditFormValues>
}

const toScheduleSpecialCasePath = (
  normalizedField: string,
): Path<CourseEditFormValues> | null => {
  const parts = normalizedField.split('.')
  const index =
    parts[0] === 'schedule' && parts[1] === 'specialCases'
      ? Number(parts[2])
      : parts[0] === 'scheduleSpecialCases'
        ? Number(parts[1])
        : Number.NaN
  const fieldName =
    parts[0] === 'schedule' && parts[1] === 'specialCases'
      ? parts[3]
      : parts[0] === 'scheduleSpecialCases'
        ? parts[2]
        : ''

  if (
    !Number.isInteger(index) ||
    !scheduleSpecialCaseFieldNames.has(fieldName)
  ) {
    return null
  }

  return `scheduleSpecialCases.${index}.${fieldName}` as Path<CourseEditFormValues>
}

const resolveFormFieldPaths = (
  rawField: string,
): Path<CourseEditFormValues>[] => {
  const normalizedField = normalizeFieldPath(rawField)

  if (directFieldMap[normalizedField]) {
    return [directFieldMap[normalizedField]]
  }

  if (normalizedField === 'activePeriod' || normalizedField === 'activeMonths') {
    return ['activeStartMonth', 'activeEndMonth']
  }

  if (
    normalizedField === 'schedule' ||
    normalizedField === 'schedule.slots' ||
    normalizedField === 'scheduleSlots'
  ) {
    return ['scheduleSlots']
  }

  if (
    normalizedField === 'schedule.specialCases' ||
    normalizedField === 'scheduleSpecialCases'
  ) {
    return ['scheduleSpecialCases']
  }

  const scheduleSlotPath = toScheduleSlotPath(normalizedField)
  if (scheduleSlotPath) {
    return [scheduleSlotPath]
  }

  const scheduleSpecialCasePath = toScheduleSpecialCasePath(normalizedField)
  if (scheduleSpecialCasePath) {
    return [scheduleSpecialCasePath]
  }

  return []
}

const getFieldValidationMessageKey = (
  rawField: string,
  message: string,
): string => {
  const normalizedField = rawField.toLowerCase()
  const normalizedMessage = message.toLowerCase()

  if (
    normalizedMessage.includes('blank') ||
    normalizedMessage.includes('required') ||
    normalizedMessage.includes('must not be null') ||
    normalizedMessage.includes('cannot be null')
  ) {
    return 'validation.required'
  }

  if (
    normalizedField.includes('description') &&
    normalizedMessage.includes('500')
  ) {
    return 'validation.descriptionMax'
  }

  if (
    normalizedField.includes('email') &&
    normalizedMessage.includes('email')
  ) {
    return 'validation.email'
  }

  if (
    normalizedMessage.includes('number') ||
    normalizedMessage.includes('numeric') ||
    normalizedMessage.includes('integer') ||
    normalizedMessage.includes('range')
  ) {
    return 'validation.number'
  }

  if (
    normalizedMessage.includes('invalid') ||
    normalizedMessage.includes('enum') ||
    normalizedMessage.includes('parse') ||
    normalizedMessage.includes('unsupported')
  ) {
    return 'validation.invalidOption'
  }

  return 'validation.invalidOption'
}

type ApplyCourseEditServerFieldErrorsParams = {
  error: ApiError
  setError: UseFormSetError<CourseEditFormValues>
  t: TFunction
}

export const applyCourseEditServerFieldErrors = ({
  error,
  setError,
  t,
}: ApplyCourseEditServerFieldErrorsParams) => {
  let hasMappedFieldError = false

  Object.entries(error.fieldErrors ?? {}).forEach(([rawField, rawMessage]) => {
    const fields = resolveFormFieldPaths(rawField)
    if (fields.length === 0) return

    const messageKey = getFieldValidationMessageKey(rawField, rawMessage)
    fields.forEach((field) => {
      setError(field, {
        type: 'server',
        message: t(messageKey),
      })
    })
    hasMappedFieldError = true
  })

  if (hasMappedFieldError) return true
  if (error.status !== 400) return false

  const normalizedMessage = error.message?.toLowerCase() ?? ''

  if (normalizedMessage.includes('schedule')) {
    setError('scheduleSlots', {
      type: 'server',
      message: t('errors.courses.updateInvalid'),
    })
    hasMappedFieldError = true
  }

  if (
    normalizedMessage.includes('active') &&
    normalizedMessage.includes('month')
  ) {
    setError('activeStartMonth', {
      type: 'server',
      message: t('errors.courses.updateInvalid'),
    })
    setError('activeEndMonth', {
      type: 'server',
      message: t('errors.courses.updateInvalid'),
    })
    hasMappedFieldError = true
  }

  if (
    normalizedMessage.includes('name') &&
    normalizedMessage.includes('required')
  ) {
    setError('name', {
      type: 'server',
      message: t('validation.required'),
    })
    hasMappedFieldError = true
  }

  return hasMappedFieldError
}
