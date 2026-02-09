import type { TFunction } from 'i18next'
import { z } from 'zod'

import {
  COURSE_AGE_GROUPS,
  COURSE_DAYS_OF_WEEK,
  COURSE_TYPES,
} from '../../../constants/courses'
import { LYCEUM_TOWNS } from '../../../constants/lyceums'
import { COURSE_SORT_OPTIONS } from '../types'

const isCourseType = (value: string) =>
  COURSE_TYPES.includes(value as (typeof COURSE_TYPES)[number])

const isCourseAgeGroup = (value: string) =>
  COURSE_AGE_GROUPS.includes(value as (typeof COURSE_AGE_GROUPS)[number])

const isCourseDayOfWeek = (value: string) =>
  COURSE_DAYS_OF_WEEK.includes(
    value as (typeof COURSE_DAYS_OF_WEEK)[number],
  )

const isLyceumTown = (value: string) =>
  LYCEUM_TOWNS.includes(value as (typeof LYCEUM_TOWNS)[number])

const isTimeValue = (value: string) =>
  /^([01]\d|2[0-3]):[0-5]\d$/.test(value)

const parseTimeToMinutes = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

const getOptionalNumberField = (t: TFunction) =>
  z.string().trim().refine(
    (value) => value === '' || Number.isFinite(Number(value)),
    {
      message: t('validation.number'),
    },
  )

export const getCourseFilterSchema = (t: TFunction) =>
  z
    .object({
      courseTypes: z
        .array(z.string().trim())
        .refine((values) => values.every(isCourseType), {
          message: t('validation.invalidOption'),
        }),
      ageGroups: z
        .array(z.string().trim())
        .refine((values) => values.every(isCourseAgeGroup), {
          message: t('validation.invalidOption'),
        }),
      dayOfWeek: z
        .array(z.string().trim())
        .refine((values) => values.every(isCourseDayOfWeek), {
          message: t('validation.invalidOption'),
        }),
      town: z
        .string()
        .trim()
        .refine((value) => value === '' || isLyceumTown(value), {
          message: t('validation.invalidOption'),
        }),
      startTimeFrom: z
        .string()
        .trim()
        .refine((value) => value === '' || isTimeValue(value), {
          message: t('validation.invalidOption'),
        }),
      startTimeTo: z
        .string()
        .trim()
        .refine((value) => value === '' || isTimeValue(value), {
          message: t('validation.invalidOption'),
        }),
      minPrice: getOptionalNumberField(t),
      maxPrice: getOptionalNumberField(t),
      sort: z.enum(COURSE_SORT_OPTIONS),
    })
    .superRefine((values, context) => {
      if (values.startTimeFrom && values.startTimeTo) {
        const start = parseTimeToMinutes(values.startTimeFrom)
        const end = parseTimeToMinutes(values.startTimeTo)
        if (start > end) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('validation.invalidOption'),
            path: ['startTimeTo'],
          })
        }
      }
      if (values.minPrice.trim() === '' || values.maxPrice.trim() === '') {
        return
      }
      const min = Number(values.minPrice)
      const max = Number(values.maxPrice)
      if (Number.isFinite(min) && Number.isFinite(max) && min > max) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('validation.number'),
          path: ['maxPrice'],
        })
      }
    })

export type CourseFilterFormValues = z.infer<
  ReturnType<typeof getCourseFilterSchema>
>
