import { useMemo } from 'react'
import type { TFunction } from 'i18next'
import type { UseFormRegister } from 'react-hook-form'

import { useUsersByIds } from '../../../../hooks/useUsersByIds'
import type { ApiError } from '../../../../types/api'
import type { UserResponse } from '../../../../types/users'
import { getUserDisplayName } from '../../../../utils/user'
import { courseEditStyles } from './courseEditStyles'
import type { CourseEditFormValues } from '../validations/courseEditSchema'

type CourseEditLecturersSectionProps = {
  register: UseFormRegister<CourseEditFormValues>
  lecturers?: UserResponse[]
  courseLecturerIds?: number[]
  isLecturersLoading: boolean
  lecturersError: ApiError | null
  t: TFunction
}

export const CourseEditLecturersSection = ({
  register,
  lecturers,
  courseLecturerIds,
  isLecturersLoading,
  lecturersError,
  t,
}: CourseEditLecturersSectionProps) => {
  const availableLecturerIds = useMemo(
    () =>
      new Set(
        (lecturers ?? [])
          .map((lecturer) => lecturer.id)
          .filter((id): id is number => id != null),
      ),
    [lecturers],
  )
  const initialLecturerIds = useMemo(
    () =>
      Array.from(
        new Set(
          (courseLecturerIds ?? []).filter((value) =>
            Number.isFinite(value),
          ),
        ),
      ),
    [courseLecturerIds],
  )
  const missingLecturerIds = useMemo(
    () =>
      initialLecturerIds.filter(
        (id) => !availableLecturerIds.has(id),
      ),
    [availableLecturerIds, initialLecturerIds],
  )
  const { data: missingLecturers = [] } = useUsersByIds(missingLecturerIds, {
    enabled:
      !isLecturersLoading &&
      !lecturersError &&
      missingLecturerIds.length > 0,
  })
  const resolvedMissingLecturerIds = useMemo(
    () =>
      new Set(
        missingLecturers
          .map((lecturer) => lecturer.id)
          .filter((id): id is number => id != null),
      ),
    [missingLecturers],
  )
  const unresolvedMissingLecturerIds = useMemo(
    () =>
      missingLecturerIds.filter(
        (id) => !resolvedMissingLecturerIds.has(id),
      ),
    [missingLecturerIds, resolvedMissingLecturerIds],
  )
  const mergedLecturers = useMemo(() => {
    const merged = [...(lecturers ?? [])]
    const mergedIds = new Set(availableLecturerIds)
    missingLecturers.forEach((lecturer) => {
      const lecturerId = lecturer.id
      if (lecturerId == null || mergedIds.has(lecturerId)) {
        return
      }
      merged.push(lecturer)
      mergedIds.add(lecturerId)
    })
    return merged
  }, [availableLecturerIds, lecturers, missingLecturers])
  const hasLecturerOptions =
    mergedLecturers.length > 0 || unresolvedMissingLecturerIds.length > 0

  const lecturerCards =
    isLecturersLoading || lecturersError
      ? []
      : mergedLecturers.map((lecturer) => {
          const displayName = getUserDisplayName(lecturer)
          return {
            key: lecturer.id ?? displayName,
            id: lecturer.id,
            displayName:
              displayName || t('pages.shkoli.create.lecturers.unknown'),
            email:
              lecturer.email ??
              t('pages.shkoli.detail.notProvided'),
          }
        })
  const missingCards = unresolvedMissingLecturerIds.map((lecturerId) => ({
    key: `missing-${lecturerId}`,
    id: lecturerId,
    displayName: `${t('pages.shkoli.create.lecturers.unknown')} #${lecturerId}`,
    email: t('pages.shkoli.detail.notProvided'),
  }))

  return (
    <fieldset className={courseEditStyles.fieldsetClassName}>
      <legend className={courseEditStyles.legendClassName}>
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
      ) : hasLecturerOptions ? (
        <div className="space-y-2">
          <p className="text-sm text-slate-600">
            {t('pages.shkoli.create.lecturers.hint')}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {[...lecturerCards, ...missingCards].map((lecturer) => {
              return (
                <label
                  key={lecturer.key}
                  className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                >
                  <input
                    type="checkbox"
                    value={lecturer.id?.toString() ?? ''}
                    {...register('lecturerIds')}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    disabled={lecturer.id == null}
                  />
                  <span>
                    <span className="block font-medium text-slate-900">
                      {lecturer.displayName}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {lecturer.email}
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
}
