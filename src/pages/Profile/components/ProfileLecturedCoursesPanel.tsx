import { useTranslation } from 'react-i18next'

import type { ApiError } from '../../../types/api'
import type { CourseResponse } from '../../../types/courses'
import LecturedCourseCard from './LecturedCourseCard'

type ProfileLecturedCoursesPanelProps = {
  displayName: string
  fallbackValue: string
  activeCourse: CourseResponse | null
  isLoading: boolean
  error: ApiError | null
  count: number
  showControls: boolean
  currentIndex: number
  onPrevious: () => void
  onNext: () => void
}

const ProfileLecturedCoursesPanel = ({
  displayName,
  fallbackValue,
  activeCourse,
  isLoading,
  error,
  count,
  showControls,
  currentIndex,
  onPrevious,
  onNext,
}: ProfileLecturedCoursesPanelProps) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-3">
      {showControls ? (
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            {t('pages.profile.lecturedCourses.count', {
              current: currentIndex + 1,
              total: count,
            })}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrevious}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-brand/40 hover:text-brand"
              aria-label={t('pages.profile.lecturedCourses.previous')}
            >
              {t('pages.profile.lecturedCourses.previous')}
            </button>
            <button
              type="button"
              onClick={onNext}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-brand/40 hover:text-brand"
              aria-label={t('pages.profile.lecturedCourses.next')}
            >
              {t('pages.profile.lecturedCourses.next')}
            </button>
          </div>
        </div>
      ) : null}
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
      ) : count === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
          {t('pages.profile.lecturedCourses.empty')}
        </div>
      ) : activeCourse ? (
        <LecturedCourseCard
          course={activeCourse}
          lecturerName={displayName}
          additionalLecturers={Math.max(
            0,
            (activeCourse.lecturerIds?.length ?? 0) - 1,
          )}
          fallbackValue={fallbackValue}
        />
      ) : null}
    </div>
  )
}

export default ProfileLecturedCoursesPanel
