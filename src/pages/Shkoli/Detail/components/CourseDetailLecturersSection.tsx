import type { TFunction } from 'i18next'

import type { UserResponse } from '../../../../types/users'
import { getUserDisplayName } from '../../../../utils/user'

type CourseDetailLecturersSectionProps = {
  lecturers?: UserResponse[]
  isLecturersLoading: boolean
  lecturersErrorMessage: string | null
  fallbackValue: string
  t: TFunction
}

export const CourseDetailLecturersSection = ({
  lecturers,
  isLecturersLoading,
  lecturersErrorMessage,
  fallbackValue,
  t,
}: CourseDetailLecturersSectionProps) => (
  <div
    id="course-lecturers"
    className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
  >
    <h3 className="text-sm font-semibold text-slate-900">
      {t('pages.shkoli.detail.sections.lecturers')}
    </h3>
    {isLecturersLoading ? (
      <p className="mt-3 text-sm text-slate-600">
        {t('pages.shkoli.detail.lecturersLoading')}
      </p>
    ) : lecturersErrorMessage ? (
      <div
        className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
        role="alert"
      >
        {lecturersErrorMessage}
      </div>
    ) : lecturers && lecturers.length > 0 ? (
      <ul className="mt-4 space-y-3">
        {lecturers.map((lecturer) => {
          const displayName = getUserDisplayName(lecturer) || fallbackValue
          return (
            <li
              key={lecturer.id ?? displayName}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-600">
                {displayName
                  .split(' ')
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {displayName}
                </p>
                <p className="text-xs text-slate-500">
                  {lecturer.email ?? fallbackValue}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    ) : (
      <p className="mt-3 text-sm text-slate-600">
        {t('pages.shkoli.detail.lecturersPlaceholder')}
      </p>
    )}
  </div>
)
