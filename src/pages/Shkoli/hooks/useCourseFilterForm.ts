import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import type { TFunction } from 'i18next'

import {
  getCourseFilterSchema,
  type CourseFilterFormValues,
} from '../validations/courseFilterSchema'

type UseCourseFilterFormOptions = {
  t: TFunction
  defaultValues: CourseFilterFormValues
}

export const useCourseFilterForm = ({
  t,
  defaultValues,
}: UseCourseFilterFormOptions) => {
  const schema = useMemo(() => getCourseFilterSchema(t), [t])

  const form = useForm<CourseFilterFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const { reset } = form

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  return form
}
