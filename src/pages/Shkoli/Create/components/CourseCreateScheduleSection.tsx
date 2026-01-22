import type { TFunction } from 'i18next'
import type {
  FieldErrors,
  UseFieldArrayReturn,
  UseFormRegister,
} from 'react-hook-form'

import { courseCreateStyles } from './courseCreateStyles'
import { CourseCreateScheduleSlots } from './CourseCreateScheduleSlots'
import { CourseCreateScheduleSpecialCases } from './CourseCreateScheduleSpecialCases'
import type { CourseCreateFormValues } from '../validations/courseCreateSchema'

type CourseCreateScheduleSectionProps = {
  register: UseFormRegister<CourseCreateFormValues>
  errors: FieldErrors<CourseCreateFormValues>
  scheduleSlots: UseFieldArrayReturn<CourseCreateFormValues, 'scheduleSlots'>
  scheduleSpecialCases: UseFieldArrayReturn<
    CourseCreateFormValues,
    'scheduleSpecialCases'
  >
  scheduleSlotValues: CourseCreateFormValues['scheduleSlots']
  timePickerLang: string
  isSubmitting: boolean
  t: TFunction
}

export const CourseCreateScheduleSection = ({
  register,
  errors,
  scheduleSlots,
  scheduleSpecialCases,
  scheduleSlotValues,
  timePickerLang,
  isSubmitting,
  t,
}: CourseCreateScheduleSectionProps) => (
  <fieldset className={courseCreateStyles.fieldsetClassName}>
    <legend className={courseCreateStyles.legendClassName}>
      {t('pages.shkoli.create.form.sections.schedule')}
    </legend>
    <CourseCreateScheduleSlots
      register={register}
      errors={errors}
      scheduleSlots={scheduleSlots}
      scheduleSlotValues={scheduleSlotValues}
      timePickerLang={timePickerLang}
      isSubmitting={isSubmitting}
      t={t}
    />
    <CourseCreateScheduleSpecialCases
      register={register}
      errors={errors}
      scheduleSpecialCases={scheduleSpecialCases}
      t={t}
    />
  </fieldset>
)
