import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import type { CourseAgeGroup, CourseResponse } from '../../../../types/courses'
import { useCourseCardLocation } from '../../../Shkoli/hooks/useCourseCardLocation'

type AdminCourseCardProps = {
  course: CourseResponse
  onRequestDelete?: (id?: number, name?: string) => void
  isDeleting?: boolean
}

export const AdminCourseCard = ({
  course,
  onRequestDelete,
  isDeleting = false,
}: AdminCourseCardProps) => {
  const { t, i18n } = useTranslation()
  const fallback = t('pages.shkoli.detail.notProvided')
  const title = course.name ?? t('pages.shkoli.list.card.untitled')
  const canEdit = Boolean(course.id)
  const typeLabel = course.type
    ? t(`courses.types.${course.type}`)
    : fallback
  const executionTypeLabel = course.executionType
    ? t(`courses.executionTypes.${course.executionType}`)
    : null
  const ageGroups = (course.ageGroupList ?? []).filter(
    Boolean,
  ) as CourseAgeGroup[]
  const ageGroupsLabel =
    ageGroups.length === 0
      ? fallback
      : ageGroups.length === 1
        ? t(`courses.ageGroups.${ageGroups[0]}`)
        : `${t(`courses.ageGroups.${ageGroups[0]}`)} ${t(
            'pages.shkoli.list.card.ageMore',
            {
              count: ageGroups.length - 1,
            },
          )}`
  const formatter = useMemo(
    () => new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 0 }),
    [i18n.language],
  )
  const priceLabel =
    course.price != null
      ? `${formatter.format(course.price)} ${t(
          'pages.shkoli.list.card.priceUnit',
        )}`
      : t('pages.shkoli.detail.priceFree')
  const { resolvedAddress, isLoading: isLyceumAddressLoading } =
    useCourseCardLocation({
      courseAddress: course.address,
      lyceumId: course.lyceumId,
    })
  const addressLabel =
    resolvedAddress ??
    (isLyceumAddressLoading
      ? t('pages.shkoli.list.card.locationLoading')
      : t('pages.shkoli.list.card.locationFallback'))

  const actionBaseClassName =
    'inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold transition'
  const actionClassName = `${actionBaseClassName} border-slate-200 bg-white text-slate-600 hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-60`
  const deleteClassName = [
    actionBaseClassName,
    'border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300',
    isDeleting ? 'cursor-wait opacity-70' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {canEdit ? (
            <Link to={`/shkoli/${course.id}/edit`} className={actionClassName}>
              {t('pages.admin.courses.actions.update')}
            </Link>
          ) : (
            <span
              className={`${actionClassName} cursor-not-allowed opacity-60`}
              aria-disabled="true"
            >
              {t('pages.admin.courses.actions.update')}
            </span>
          )}
          <button
            type="button"
            className={deleteClassName}
            onClick={() => onRequestDelete?.(course.id, course.name)}
            disabled={!course.id || isDeleting}
          >
            {isDeleting
              ? t('pages.admin.courses.actions.deleting')
              : t('pages.admin.courses.actions.delete')}
          </button>
        </div>
        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
          {typeLabel}
        </span>
      </div>
      <div className="mt-4 space-y-2">
        <h3 className="text-base font-semibold text-slate-900">
          {title}
        </h3>
        <p className="text-xs text-slate-500">
          {addressLabel}
        </p>
      </div>
      <dl className="mt-4 space-y-3 text-xs text-slate-600">
        {executionTypeLabel ? (
          <div className="flex items-center justify-between gap-3">
            <dt className="text-slate-500">
              {t('pages.shkoli.detail.fields.executionType')}
            </dt>
            <dd className="font-semibold text-slate-900">
              {executionTypeLabel}
            </dd>
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-3">
          <dt className="text-slate-500">
            {t('pages.shkoli.detail.fields.ageGroups')}
          </dt>
          <dd className="text-right font-medium text-slate-900">
            {ageGroupsLabel}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-slate-500">
            {t('pages.shkoli.detail.fields.price')}
          </dt>
          <dd className="font-medium text-slate-900">
            {priceLabel}
          </dd>
        </div>
      </dl>
      {course.id ? (
        <Link
          to={`/shkoli/${course.id}`}
          className="mt-4 inline-flex items-center justify-center rounded-full border border-brand/20 bg-brand/10 px-4 py-2 text-xs font-semibold text-brand transition hover:border-brand/40 hover:bg-brand/20"
        >
          {t('pages.admin.courses.actions.view')}
        </Link>
      ) : null}
    </article>
  )
}
