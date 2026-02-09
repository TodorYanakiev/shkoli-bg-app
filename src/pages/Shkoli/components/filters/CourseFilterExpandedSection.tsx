import type { UseFormReturn } from 'react-hook-form'
import type { TFunction } from 'i18next'

import type { CourseFilterFormValues } from '../../validations/courseFilterSchema'
import { CoursePriceRangeSlider } from '../CoursePriceRangeSlider'
import CourseFilterDaySelect from './CourseFilterDaySelect'
import CourseFilterSortSelect from './CourseFilterSortSelect'
import CourseFilterTownSelect from './CourseFilterTownSelect'

type CourseFilterExpandedSectionProps = {
  form: UseFormReturn<CourseFilterFormValues>
  locale: string
  t: TFunction
  closeSignal: number
}

const CourseFilterExpandedSection = ({
  form,
  locale,
  t,
  closeSignal,
}: CourseFilterExpandedSectionProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = form

  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <CourseFilterSortSelect
        control={control}
        t={t}
        closeSignal={closeSignal}
      />
      <CourseFilterTownSelect
        control={control}
        t={t}
        closeSignal={closeSignal}
      />
      <CourseFilterDaySelect
        control={control}
        register={register}
        errors={errors}
        locale={locale}
        t={t}
        closeSignal={closeSignal}
      />
      <CoursePriceRangeSlider
        control={control}
        errors={errors}
        locale={locale}
        t={t}
      />
    </div>
  )
}

export default CourseFilterExpandedSection
