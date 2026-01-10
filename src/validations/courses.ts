import type { TFunction } from 'i18next'
import { z } from 'zod'

import {
  COURSE_AGE_GROUPS,
  COURSE_DAYS_OF_WEEK,
  COURSE_SCHEDULE_RECURRENCES,
  COURSE_TYPES,
} from '../constants/courses'

const isCourseType = (value: string) =>
  COURSE_TYPES.includes(value as (typeof COURSE_TYPES)[number])

const isCourseAgeGroup = (value: string) =>
  COURSE_AGE_GROUPS.includes(value as (typeof COURSE_AGE_GROUPS)[number])

const isCourseRecurrence = (value: string) =>
  COURSE_SCHEDULE_RECURRENCES.includes(
    value as (typeof COURSE_SCHEDULE_RECURRENCES)[number],
  )

const isCourseDayOfWeek = (value: string) =>
  COURSE_DAYS_OF_WEEK.includes(value as (typeof COURSE_DAYS_OF_WEEK)[number])

const optionalTextField = z.string().trim()

const getOptionalNumberField = (t: TFunction) =>
  z.string().trim().refine(
    (value) => value === '' || Number.isFinite(Number(value)),
    {
      message: t('validation.number'),
    },
  )

const getOptionalIntegerField = (t: TFunction) =>
  getOptionalNumberField(t).refine(
    (value) => value === '' || Number.isInteger(Number(value)),
    {
      message: t('validation.number'),
    },
  )

const getCourseScheduleSlotSchema = (t: TFunction) =>
  z
    .object({
      recurrence: z
        .string()
        .trim()
        .min(1, t('validation.required'))
        .refine(isCourseRecurrence, {
          message: t('validation.invalidOption'),
        }),
      dayOfWeek: z
        .string()
        .trim()
        .refine((value) => value === '' || isCourseDayOfWeek(value), {
          message: t('validation.invalidOption'),
        }),
      dayOfMonth: getOptionalIntegerField(t),
      startTime: optionalTextField,
      classesCount: getOptionalIntegerField(t),
      singleClassDurationMinutes: getOptionalIntegerField(t),
      gapBetweenClassesMinutes: getOptionalIntegerField(t),
    })
    .superRefine((values, context) => {
      if (values.recurrence === 'WEEKLY' && values.dayOfWeek.trim() === '') {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('validation.required'),
          path: ['dayOfWeek'],
        })
      }

      if (
        values.recurrence === 'MONTHLY' &&
        values.dayOfMonth.trim() === ''
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('validation.required'),
          path: ['dayOfMonth'],
        })
      }
    })

const getCourseSpecialCaseSchema = (t: TFunction) =>
  z.object({
    date: z.string().trim().min(1, t('validation.required')),
    cancelled: z.boolean().optional(),
    reason: optionalTextField,
  })

export const getCourseCreateSchema = (t: TFunction) =>
  z.object({
    name: z.string().trim().min(1, t('validation.required')),
    description: z.string().trim().min(1, t('validation.required')),
    type: z
      .string()
      .trim()
      .min(1, t('validation.required'))
      .refine(isCourseType, {
        message: t('validation.invalidOption'),
      }),
    ageGroupList: z
      .array(z.string().trim())
      .min(1, t('validation.required'))
      .refine((values) => values.every(isCourseAgeGroup), {
        message: t('validation.invalidOption'),
      }),
    price: getOptionalNumberField(t),
    address: optionalTextField,
    achievements: optionalTextField,
    facebookLink: optionalTextField,
    websiteLink: optionalTextField,
    lecturerIds: z.array(z.string().trim()).optional(),
    scheduleSlots: z.array(getCourseScheduleSlotSchema(t)),
    scheduleSpecialCases: z.array(getCourseSpecialCaseSchema(t)),
  })

export type CourseCreateFormValues = z.infer<
  ReturnType<typeof getCourseCreateSchema>
>
