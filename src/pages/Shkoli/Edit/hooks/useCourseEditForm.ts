import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useRef } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import type { TFunction } from 'i18next'

import type { CourseResponse } from '../../../../types/courses'
import {
  getCourseEditSchema,
  type CourseEditFormValues,
} from '../validations/courseEditSchema'

type UseCourseEditFormOptions = {
  course?: CourseResponse
  t: TFunction
}

export const useCourseEditForm = ({
  course,
  t,
}: UseCourseEditFormOptions) => {
  const schema = useMemo(() => getCourseEditSchema(t), [t])

  const form = useForm<CourseEditFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      type: '',
      executionType: '',
      ageGroupList: [],
      price: '',
      isInLyceum: true,
      address: '',
      achievements: '',
      facebookLink: '',
      websiteLink: '',
      activeStartMonth: '',
      activeEndMonth: '',
      lecturerIds: [],
      scheduleSlots: [],
      scheduleSpecialCases: [],
    },
  })

  const { control, reset, setValue, watch } = form

  const scheduleSlots = useFieldArray({
    control,
    name: 'scheduleSlots',
  })
  const scheduleSpecialCases = useFieldArray({
    control,
    name: 'scheduleSpecialCases',
  })
  const scheduleSlotValues = watch('scheduleSlots') ?? []
  const isInLyceum = watch('isInLyceum') ?? true
  const previousIsInLyceum = useRef<boolean | null>(null)

  useEffect(() => {
    if (!course) return

    reset({
      name: course.name ?? '',
      description: course.description ?? '',
      type: course.type ?? '',
      executionType: course.executionType ?? '',
      ageGroupList: course.ageGroupList ?? [],
      price: typeof course.price === 'number' ? course.price.toString() : '',
      isInLyceum: (course.address ?? '').trim() === '',
      address: course.address ?? '',
      achievements: course.achievements ?? '',
      facebookLink: course.facebookLink ?? '',
      websiteLink: course.websiteLink ?? '',
      activeStartMonth: course.activeStartMonth ?? '',
      activeEndMonth: course.activeEndMonth ?? '',
      lecturerIds:
        course.lecturerIds?.map((value) => value.toString()) ?? [],
      scheduleSlots:
        course.schedule?.slots?.map((slot) => ({
          recurrence: slot.recurrence ?? 'WEEKLY',
          dayOfWeek: slot.dayOfWeek ?? '',
          dayOfMonth:
            typeof slot.dayOfMonth === 'number'
              ? slot.dayOfMonth.toString()
              : '',
          startTime: slot.startTime ?? '',
          endTime: slot.endTime ?? '',
          singleClassDurationMinutes:
            typeof slot.singleClassDurationMinutes === 'number'
              ? slot.singleClassDurationMinutes.toString()
              : '',
        })) ?? [],
      scheduleSpecialCases:
        course.schedule?.specialCases?.map((entry) => ({
          date: entry.date ?? '',
          cancelled: entry.cancelled ?? false,
          reason: entry.reason ?? '',
        })) ?? [],
    })
  }, [course, reset])

  useEffect(() => {
    scheduleSlotValues.forEach((slot, index) => {
      if (!slot) return
      const dayOfMonthValue = slot.dayOfMonth?.trim() ?? ''
      const dayOfWeekValue = slot.dayOfWeek?.trim() ?? ''

      if (slot.recurrence === 'WEEKLY' && dayOfMonthValue !== '') {
        setValue(`scheduleSlots.${index}.dayOfMonth`, '', {
          shouldValidate: true,
        })
      }

      if (slot.recurrence === 'MONTHLY' && dayOfWeekValue !== '') {
        setValue(`scheduleSlots.${index}.dayOfWeek`, '', {
          shouldValidate: true,
        })
      }
    })
  }, [scheduleSlotValues, setValue])

  useEffect(() => {
    const previousValue = previousIsInLyceum.current
    previousIsInLyceum.current = isInLyceum
    if (previousValue === null) return
    if (previousValue && isInLyceum) return
    if (!previousValue && isInLyceum) {
      setValue('address', '', { shouldValidate: true })
    }
  }, [isInLyceum, setValue])

  return {
    form,
    scheduleSlots,
    scheduleSpecialCases,
    scheduleSlotValues,
    isInLyceum,
  }
}
