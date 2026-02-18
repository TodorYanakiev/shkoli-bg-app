import type { TFunction } from 'i18next'

import type {
  CourseScheduleSlot,
  CourseScheduleSpecialCase,
} from '../../../../types/courses'
import { CourseDetailScheduleSlots } from './CourseDetailScheduleSlots'
import { CourseDetailScheduleSpecialCases } from './CourseDetailScheduleSpecialCases'

type CourseDetailScheduleSectionProps = {
  scheduleSlots: CourseScheduleSlot[]
  scheduleSpecialCases: CourseScheduleSpecialCase[]
  fallbackValue: string
  locale: string
  t: TFunction
}

export const CourseDetailScheduleSection = ({
  scheduleSlots,
  scheduleSpecialCases,
  fallbackValue,
  locale,
  t,
}: CourseDetailScheduleSectionProps) => (
  <section id="course-schedule" className="scroll-mt-24">
    <h3 className="text-3xl font-semibold text-slate-900">
      {t('pages.shkoli.detail.sections.schedule')}
    </h3>
    {scheduleSlots.length === 0 && scheduleSpecialCases.length === 0 ? (
      <p className="mt-3 text-base text-slate-600">
        {t('pages.shkoli.detail.schedule.empty')}
      </p>
    ) : (
      <div className="mt-6 space-y-5">
        <CourseDetailScheduleSlots
          scheduleSlots={scheduleSlots}
          fallbackValue={fallbackValue}
          t={t}
        />
        <CourseDetailScheduleSpecialCases
          scheduleSpecialCases={scheduleSpecialCases}
          locale={locale}
          t={t}
        />
      </div>
    )}
  </section>
)
