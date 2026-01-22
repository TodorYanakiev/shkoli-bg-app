import type { TFunction } from 'i18next'
import type { UseFormRegister } from 'react-hook-form'

import type { ApiError } from '../../../../types/api'
import type { UserResponse } from '../../../../types/users'
import { getUserDisplayName } from '../../../../utils/user'
import { courseCreateStyles } from './courseCreateStyles'
import type { CourseCreateFormValues } from '../validations/courseCreateSchema'

type CourseCreateLecturersSectionProps = {
  register: UseFormRegister<CourseCreateFormValues>
  lecturers?: UserResponse[]
  isLecturersLoading: boolean
  lecturersError: ApiError | null
  t: TFunction
}

export const CourseCreateLecturersSection = ({
  register,
  lecturers,
  isLecturersLoading,
  lecturersError,
  t,
}: CourseCreateLecturersSectionProps) => (
  <fieldset className={courseCreateStyles.fieldsetClassName}>
    <legend className={courseCreateStyles.legendClassName}>
      {t('pages.shkoli.create.form.sections.lecturers')}
    </legend>
    {isLecturersLoading ? (
      <p className="text-sm text-slate-600">
        {t('pages.shkoli.create.lecturers.loading')}
      </p>
    ) : lecturersError ? (
      <p className="text-sm text-rose-600">
        {t('pages.shkoli.create.lecturers.error')}
      </p>
    ) : lecturers && lecturers.length > 0 ? (
      <div className="space-y-2">
        <p className="text-sm text-slate-600">
          {t('pages.shkoli.create.lecturers.hint')}
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {lecturers.map((lecturer) => {
            const displayName = getUserDisplayName(lecturer)
            return (
              <label
                key={lecturer.id ?? displayName}
                className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
              >
                <input
                  type="checkbox"
                  value={lecturer.id ?? ''}
                  {...register('lecturerIds')}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  disabled={lecturer.id == null}
                />
                <span>
                  <span className="block font-medium text-slate-900">
                    {displayName ||
                      t('pages.shkoli.create.lecturers.unknown')}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {lecturer.email ??
                      t('pages.shkoli.detail.notProvided')}
                  </span>
                </span>
              </label>
            )
          })}
        </div>
      </div>
    ) : (
      <p className="text-sm text-slate-600">
        {t('pages.shkoli.create.lecturers.empty')}
      </p>
    )}
  </fieldset>
)
