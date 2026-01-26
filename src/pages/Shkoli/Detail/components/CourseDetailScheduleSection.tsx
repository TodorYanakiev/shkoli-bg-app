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
  <div
    id="course-schedule"
    className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
  >
    <h3 className="text-sm font-semibold text-slate-900">
      {t('pages.shkoli.detail.sections.schedule')}
    </h3>
    {scheduleSlots.length === 0 && scheduleSpecialCases.length === 0 ? (
      <p className="mt-3 text-sm text-slate-600">
        {t('pages.shkoli.detail.schedule.empty')}
      </p>
    ) : (
      <div className="mt-4 space-y-6">
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
  </div>
)
