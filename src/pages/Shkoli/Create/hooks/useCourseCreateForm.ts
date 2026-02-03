import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useRef } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import type { TFunction } from 'i18next'

import {
  getCourseCreateSchema,
  type CourseCreateFormValues,
} from '../validations/courseCreateSchema'

type UseCourseCreateFormOptions = {
  t: TFunction
}

export const useCourseCreateForm = ({ t }: UseCourseCreateFormOptions) => {
  const schema = useMemo(() => getCourseCreateSchema(t), [t])

  const form = useForm<CourseCreateFormValues>({
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

  const { control, setValue, watch } = form

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
