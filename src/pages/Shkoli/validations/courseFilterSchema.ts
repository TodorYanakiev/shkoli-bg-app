import type { TFunction } from 'i18next'
import { z } from 'zod'

import { COURSE_AGE_GROUPS, COURSE_TYPES } from '../../../constants/courses'
import { COURSE_SORT_OPTIONS } from '../types'

const isCourseType = (value: string) =>
  COURSE_TYPES.includes(value as (typeof COURSE_TYPES)[number])

const isCourseAgeGroup = (value: string) =>
  COURSE_AGE_GROUPS.includes(value as (typeof COURSE_AGE_GROUPS)[number])

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
      courseType: z
        .string()
        .trim()
        .refine((value) => value === '' || isCourseType(value), {
          message: t('validation.invalidOption'),
        }),
      ageGroup: z
        .string()
        .trim()
        .refine((value) => value === '' || isCourseAgeGroup(value), {
          message: t('validation.invalidOption'),
        }),
      minPrice: getOptionalNumberField(t),
      maxPrice: getOptionalNumberField(t),
      sort: z.enum(COURSE_SORT_OPTIONS),
    })
    .superRefine((values, context) => {
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
