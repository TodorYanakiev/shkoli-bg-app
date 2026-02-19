import { useTranslation } from 'react-i18next'

import type { ApiError } from '../../../types/api'
import type { CourseResponse } from '../../../types/courses'
import CourseCard from '../../Shkoli/components/CourseCard'
import ProfileHorizontalCarousel from './ProfileHorizontalCarousel'

type ProfileLecturedCoursesPanelProps = {
  courses: CourseResponse[]
  isLoading: boolean
  error: ApiError | null
}

const ProfileLecturedCoursesPanel = ({
  courses,
  isLoading,
  error,
}: ProfileLecturedCoursesPanelProps) => {
  const { t } = useTranslation()

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">
          {t('pages.profile.lecturedCourses.title')}
        </h2>
        {!isLoading && !error && courses.length > 0 ? (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            ({courses.length})
          </span>
        ) : null}
      </div>

      <div className="mt-5 space-y-4">
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
            {t('pages.profile.lecturedCourses.loading')}
          </div>
        ) : error ? (
          <div
            className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
            role="alert"
          >
            {t('pages.profile.lecturedCourses.error')}
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
            {t('pages.profile.lecturedCourses.empty')}
          </div>
        ) : (
          <ProfileHorizontalCarousel
            items={courses}
            previousLabel={t('pages.profile.lecturedCourses.previous')}
            nextLabel={t('pages.profile.lecturedCourses.next')}
            getItemKey={(course, index) =>
              course.id ?? `${course.name ?? 'course'}-${index}`
            }
            renderItem={(course) => (
              <CourseCard course={course} hideShadow />
            )}
          />
        )}
      </div>
    </section>
  )
}

export default ProfileLecturedCoursesPanel
