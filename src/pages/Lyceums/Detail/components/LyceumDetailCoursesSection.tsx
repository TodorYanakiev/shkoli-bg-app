import type { TFunction } from 'i18next'

import type { CourseResponse } from '../../../../types/courses'
import CourseCard from '../../../Shkoli/components/CourseCard'

type LyceumDetailCoursesSectionProps = {
  courses?: CourseResponse[]
  isCoursesLoading: boolean
  coursesErrorMessage: string | null
  t: TFunction
}

export const LyceumDetailCoursesSection = ({
  courses,
  isCoursesLoading,
  coursesErrorMessage,
  t,
}: LyceumDetailCoursesSectionProps) => (
  <section id="lyceum-courses" className="scroll-mt-24">
    <h3 className="text-3xl font-semibold text-slate-900">
      {t('pages.lyceums.detail.sections.courses')}
    </h3>
    {isCoursesLoading ? (
      <div className="mt-4 animate-pulse rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-base text-slate-600">
        {t('pages.lyceums.detail.coursesLoading')}
      </div>
    ) : coursesErrorMessage ? (
      <div
        className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-base text-rose-700"
        role="alert"
      >
        {coursesErrorMessage}
      </div>
    ) : courses && courses.length > 0 ? (
      <ul className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course, index) => (
          <li key={course.id ?? `${course.name ?? 'course'}-${index}`}>
            <CourseCard course={course} />
          </li>
        ))}
      </ul>
    ) : (
      <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-base text-slate-600">
        {t('pages.lyceums.detail.coursesPlaceholder')}
      </div>
    )}
  </section>
)
