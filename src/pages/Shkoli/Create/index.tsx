import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import { useToast } from '../../../components/feedback/ToastContext'
import {
  COURSE_AGE_GROUPS,
  COURSE_DAYS_OF_WEEK,
  COURSE_SCHEDULE_RECURRENCES,
  COURSE_TYPES,
} from '../../../constants/courses'
import type { ApiError } from '../../../types/api'
import type {
  CourseAgeGroup,
  CourseRequest,
  CourseSchedule,
  CourseScheduleDayOfWeek,
  CourseScheduleRecurrence,
  CourseScheduleSlot,
  CourseScheduleSpecialCase,
  CourseType,
} from '../../../types/courses'
import { getUserDisplayName } from '../../../utils/user'
import {
  getCourseCreateSchema,
  type CourseCreateFormValues,
} from '../../../validations/courses'
import { useUserProfile } from '../../Profile/hooks/useUserProfile'
import { lyceumCoursesQueryKey } from '../../Lyceums/hooks/useLyceumCourses'
import { useLyceum } from '../../Lyceums/hooks/useLyceum'
import { useLyceumLecturers } from '../../Lyceums/hooks/useLyceumLecturers'
import { useCreateCourseMutation } from '../hooks/useCreateCourseMutation'

const getCreateCourseLoadErrorMessage = (
  error: ApiError | null,
  t: (key: string) => string,
) => {
  if (!error) return null
  if (error.kind === 'network') {
    return t('errors.network')
  }
  if (error.kind === 'unauthorized' || error.kind === 'forbidden') {
    return t('errors.auth.forbidden')
  }
  return t('pages.shkoli.create.loadFailed')
}

const getCreateCourseErrorMessage = (
  error: ApiError | null,
  t: (key: string) => string,
) => {
  if (!error) return null
  if (error.kind === 'network') {
    return t('errors.network')
  }
  if (error.kind === 'unauthorized' || error.kind === 'forbidden') {
    return t('errors.auth.forbidden')
  }
  return t('errors.courses.createFailed')
}

const normalizeOptionalText = (value: string) => {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

const normalizeOptionalNumber = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : undefined
}

const normalizeOptionalInteger = (value: string) => {
  const parsed = normalizeOptionalNumber(value)
  return parsed != null && Number.isInteger(parsed) ? parsed : undefined
}

const buildCourseSchedule = (
  values: CourseCreateFormValues,
): CourseSchedule | undefined => {
  const slots: CourseScheduleSlot[] = values.scheduleSlots.map((slot) => {
    const recurrence = slot.recurrence as CourseScheduleRecurrence
    const dayOfWeek =
      recurrence === 'WEEKLY'
        ? ((slot.dayOfWeek || undefined) as
            | CourseScheduleDayOfWeek
            | undefined)
        : undefined
    const dayOfMonth =
      recurrence === 'MONTHLY'
        ? normalizeOptionalInteger(slot.dayOfMonth)
        : undefined

    return {
      recurrence,
      dayOfWeek,
      dayOfMonth,
      startTime: normalizeOptionalText(slot.startTime),
      classesCount: normalizeOptionalInteger(slot.classesCount),
      singleClassDurationMinutes: normalizeOptionalInteger(
        slot.singleClassDurationMinutes,
      ),
      gapBetweenClassesMinutes: normalizeOptionalInteger(
        slot.gapBetweenClassesMinutes,
      ),
    }
  })

  const specialCases: CourseScheduleSpecialCase[] =
    values.scheduleSpecialCases.map((entry) => ({
      date: entry.date.trim(),
      cancelled: entry.cancelled ? true : undefined,
      reason: normalizeOptionalText(entry.reason),
    }))

  if (slots.length === 0 && specialCases.length === 0) {
    return undefined
  }

  return {
    slots: slots.length > 0 ? slots : undefined,
    specialCases: specialCases.length > 0 ? specialCases : undefined,
  }
}

const defaultScheduleSlot = {
  recurrence: 'WEEKLY',
  dayOfWeek: '',
  dayOfMonth: '',
  startTime: '',
  classesCount: '',
  singleClassDurationMinutes: '',
  gapBetweenClassesMinutes: '',
}

const defaultSpecialCase = {
  date: '',
  cancelled: false,
  reason: '',
}

const CourseCreatePage = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  const schema = useMemo(() => getCourseCreateSchema(t), [t])

  const lyceumIdParam = searchParams.get('lyceumId')
  const lyceumId = lyceumIdParam ? Number(lyceumIdParam) : null
  const isValidLyceumId = lyceumId != null && Number.isFinite(lyceumId)

  const {
    data: lyceum,
    isLoading: isLyceumLoading,
    error: lyceumError,
  } = useLyceum(lyceumId ?? undefined, { enabled: isValidLyceumId })
  const {
    data: lecturers,
    isLoading: isLecturersLoading,
    error: lecturersError,
  } = useLyceumLecturers(lyceumId ?? undefined, { enabled: isValidLyceumId })
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useUserProfile()

  const isUserAdminForLyceum =
    lyceumId != null &&
    (user?.role === 'ADMIN' || user?.administratedLyceumId === lyceumId)
  const isLyceumLecturer = Boolean(
    user?.id != null &&
      lecturers?.some((lecturer) => lecturer.id === user.id),
  )
  const hasCourseAccess = Boolean(
    lyceumId != null && (isUserAdminForLyceum || isLyceumLecturer),
  )

  const mutation = useCreateCourseMutation()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CourseCreateFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      type: '',
      ageGroupList: [],
      price: '',
      address: '',
      achievements: '',
      facebookLink: '',
      websiteLink: '',
      lecturerIds: [],
      scheduleSlots: [],
      scheduleSpecialCases: [],
    },
  })

  const scheduleSlots = useFieldArray({
    control,
    name: 'scheduleSlots',
  })
  const scheduleSpecialCases = useFieldArray({
    control,
    name: 'scheduleSpecialCases',
  })
  const scheduleSlotValues = watch('scheduleSlots') ?? []

  useEffect(() => {
    scheduleSlotValues.forEach((slot, index) => {
      if (!slot) return
      const dayOfMonthValue = slot.dayOfMonth?.trim() ?? ''
      const dayOfWeekValue = slot.dayOfWeek?.trim() ?? ''

      if (slot.recurrence === 'WEEKLY' && dayOfMonthValue !== '') {
        setValue(`scheduleSlots.${index}.dayOfMonth`, '', {
          shouldValidate: true,
        })
      }

      if (slot.recurrence === 'MONTHLY' && dayOfWeekValue !== '') {
        setValue(`scheduleSlots.${index}.dayOfWeek`, '', {
          shouldValidate: true,
        })
      }
    })
  }, [scheduleSlotValues, setValue])

  const inputClassName = (hasError: boolean, extraClasses?: string) =>
    [
      'mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
      hasError
        ? 'border-rose-300 bg-rose-50/40 focus-visible:outline-rose-300'
        : 'border-slate-200/80 bg-white',
      extraClasses,
    ].join(' ')
  const fieldsetClassName =
    'space-y-4 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 sm:p-5'
  const legendClassName =
    'text-xs font-semibold uppercase tracking-wide text-slate-500'
  const errorTextClassName = 'mt-1 text-xs font-medium text-rose-600'
  const actionBarClassName =
    'flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 sm:flex-row sm:items-center'
  const primaryActionButtonClassName =
    'inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto'
  const secondaryActionButtonClassName =
    'inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-400 sm:w-auto'

  const onSubmit = (values: CourseCreateFormValues) => {
    if (!isValidLyceumId || !hasCourseAccess) return

    const uniqueAgeGroups = Array.from(
      new Set(values.ageGroupList),
    ) as CourseAgeGroup[]
    const lecturerIds =
      values.lecturerIds
        ?.map((value) => Number(value))
        .filter(Number.isFinite) ?? []
    const schedule = buildCourseSchedule(values)

    const payload: CourseRequest = {
      name: values.name.trim(),
      description: values.description.trim(),
      type: values.type as CourseType,
      ageGroupList: uniqueAgeGroups,
      schedule,
      lyceumId,
      address: normalizeOptionalText(values.address),
      price: normalizeOptionalNumber(values.price),
      achievements: normalizeOptionalText(values.achievements),
      facebookLink: normalizeOptionalText(values.facebookLink),
      websiteLink: normalizeOptionalText(values.websiteLink),
      lecturerIds: lecturerIds.length > 0 ? lecturerIds : undefined,
    }

    mutation.mutate(payload, {
      onSuccess: (data) => {
        if (lyceumId != null) {
          queryClient.invalidateQueries({
            queryKey: lyceumCoursesQueryKey(lyceumId),
          })
        }
        showToast({
          message: t('feedback.courses.createSuccess'),
          tone: 'success',
        })
        if (data.id != null) {
          navigate(`/shkoli/${data.id}`, { replace: true })
        } else if (lyceumId != null) {
          navigate(`/lyceums/${lyceumId}`, { replace: true })
        } else {
          navigate('/shkoli', { replace: true })
        }
      },
    })
  }

  const isAccessLoading =
    isValidLyceumId && !isUserAdminForLyceum && isLecturersLoading
  const isLoading = isLyceumLoading || isUserLoading || isAccessLoading
  const loadErrorMessage = getCreateCourseLoadErrorMessage(
    lyceumError ??
      userError ??
      (!isUserAdminForLyceum ? lecturersError ?? null : null),
    t,
  )
  const submitErrorMessage = getCreateCourseErrorMessage(
    mutation.error ?? null,
    t,
  )

  const pageTitle = `${t('pages.shkoli.create.title')} | ${t('app.title')}`

  return (
    <section className="space-y-6">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {t('pages.shkoli.create.title')}
          </h1>
          <p className="text-sm text-slate-600">
            {lyceum?.name
              ? t('pages.shkoli.create.subtitleWithLyceum', {
                  name: lyceum.name,
                })
              : t('pages.shkoli.create.subtitle')}
          </p>
        </div>
        <Link
          to={isValidLyceumId ? `/lyceums/${lyceumId}` : '/shkoli'}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 sm:w-auto"
        >
          {isValidLyceumId
            ? t('pages.shkoli.create.backLink')
            : t('pages.shkoli.create.backFallback')}
        </Link>
      </div>
      {!isValidLyceumId ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
          role="alert"
        >
          {t('pages.shkoli.create.invalidLyceum')}
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-60 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      ) : loadErrorMessage ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
          role="alert"
        >
          {loadErrorMessage}
        </div>
      ) : !hasCourseAccess ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
          role="alert"
        >
          {t('errors.auth.forbidden')}
        </div>
      ) : !lyceum ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          {t('pages.shkoli.create.notFound')}
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {submitErrorMessage ? (
            <div
              className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
              role="alert"
            >
              {submitErrorMessage}
            </div>
          ) : null}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t('pages.shkoli.create.lyceumLabel')}
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {lyceum.name ?? t('pages.shkoli.create.lyceumFallback')}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {[lyceum.town, lyceum.address].filter(Boolean).join(', ') ||
                t('pages.shkoli.create.lyceumFallback')}
            </p>
          </div>

          <fieldset className={fieldsetClassName}>
            <legend className={legendClassName}>
              {t('pages.shkoli.create.form.sections.overview')}
            </legend>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                {t('pages.shkoli.create.form.fields.name')}
                <input
                  type="text"
                  {...register('name')}
                  placeholder={t('pages.shkoli.create.form.fields.name')}
                  className={inputClassName(Boolean(errors.name))}
                />
                {errors.name ? (
                  <span className={errorTextClassName}>
                    {errors.name.message}
                  </span>
                ) : null}
              </label>
              <label className="text-sm font-medium text-slate-700">
                {t('pages.shkoli.create.form.fields.type')}
                <select
                  {...register('type')}
                  className={inputClassName(Boolean(errors.type))}
                >
                  <option value="">
                    {t('pages.shkoli.create.form.fields.typePlaceholder')}
                  </option>
                  {COURSE_TYPES.map((value) => (
                    <option key={value} value={value}>
                      {t(`courses.types.${value}`)}
                    </option>
                  ))}
                </select>
                {errors.type ? (
                  <span className={errorTextClassName}>
                    {errors.type.message}
                  </span>
                ) : null}
              </label>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">
                {t('pages.shkoli.create.form.fields.ageGroups')}
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {COURSE_AGE_GROUPS.map((group) => (
                  <label
                    key={group}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                  >
                    <input
                      type="checkbox"
                      value={group}
                      {...register('ageGroupList')}
                      className="h-4 w-4 rounded border-slate-300 text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    />
                    <span>{t(`courses.ageGroups.${group}`)}</span>
                  </label>
                ))}
              </div>
              {errors.ageGroupList ? (
                <span className={errorTextClassName}>
                  {errors.ageGroupList.message}
                </span>
              ) : null}
            </div>
            <label className="text-sm font-medium text-slate-700">
              {t('pages.shkoli.create.form.fields.description')}
              <textarea
                {...register('description')}
                rows={4}
                placeholder={t('pages.shkoli.create.form.fields.description')}
                className={inputClassName(Boolean(errors.description))}
              />
              {errors.description ? (
                <span className={errorTextClassName}>
                  {errors.description.message}
                </span>
              ) : null}
            </label>
          </fieldset>

          <fieldset className={fieldsetClassName}>
            <legend className={legendClassName}>
              {t('pages.shkoli.create.form.sections.details')}
            </legend>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                {t('pages.shkoli.create.form.fields.price')}
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('price')}
                  placeholder={t('pages.shkoli.create.form.fields.price')}
                  className={inputClassName(Boolean(errors.price))}
                />
                {errors.price ? (
                  <span className={errorTextClassName}>
                    {errors.price.message}
                  </span>
                ) : null}
              </label>
              <label className="text-sm font-medium text-slate-700">
                {t('pages.shkoli.create.form.fields.address')}
                <input
                  type="text"
                  {...register('address')}
                  placeholder={t('pages.shkoli.create.form.fields.address')}
                  className={inputClassName(Boolean(errors.address))}
                />
                {errors.address ? (
                  <span className={errorTextClassName}>
                    {errors.address.message}
                  </span>
                ) : null}
              </label>
            </div>
            <label className="text-sm font-medium text-slate-700">
              {t('pages.shkoli.create.form.fields.achievements')}
              <textarea
                {...register('achievements')}
                rows={3}
                placeholder={t('pages.shkoli.create.form.fields.achievements')}
                className={inputClassName(Boolean(errors.achievements))}
              />
              {errors.achievements ? (
                <span className={errorTextClassName}>
                  {errors.achievements.message}
                </span>
              ) : null}
            </label>
          </fieldset>

          <fieldset className={fieldsetClassName}>
            <legend className={legendClassName}>
              {t('pages.shkoli.create.form.sections.links')}
            </legend>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                {t('pages.shkoli.create.form.fields.websiteLink')}
                <input
                  type="url"
                  {...register('websiteLink')}
                  placeholder={t('pages.shkoli.create.form.fields.websiteLink')}
                  className={inputClassName(Boolean(errors.websiteLink))}
                />
                {errors.websiteLink ? (
                  <span className={errorTextClassName}>
                    {errors.websiteLink.message}
                  </span>
                ) : null}
              </label>
              <label className="text-sm font-medium text-slate-700">
                {t('pages.shkoli.create.form.fields.facebookLink')}
                <input
                  type="url"
                  {...register('facebookLink')}
                  placeholder={t('pages.shkoli.create.form.fields.facebookLink')}
                  className={inputClassName(Boolean(errors.facebookLink))}
                />
                {errors.facebookLink ? (
                  <span className={errorTextClassName}>
                    {errors.facebookLink.message}
                  </span>
                ) : null}
              </label>
            </div>
          </fieldset>

          <fieldset className={fieldsetClassName}>
            <legend className={legendClassName}>
              {t('pages.shkoli.create.form.sections.schedule')}
            </legend>
            <div className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-700">
                  {t('pages.shkoli.create.schedule.slotsTitle')}
                </p>
                <button
                  type="button"
                  onClick={() => scheduleSlots.append(defaultScheduleSlot)}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                >
                  {t('pages.shkoli.create.schedule.addSlot')}
                </button>
              </div>
              {scheduleSlots.fields.length === 0 ? (
                <p className="text-sm text-slate-600">
                  {t('pages.shkoli.create.schedule.slotsEmpty')}
                </p>
              ) : (
                <div className="space-y-4">
                  {scheduleSlots.fields.map((field, index) => {
                    const slotErrors = errors.scheduleSlots?.[index]
                    const recurrenceValue =
                      scheduleSlotValues[index]?.recurrence ?? field.recurrence
                    const isWeekly = recurrenceValue === 'WEEKLY'
                    const isMonthly = recurrenceValue === 'MONTHLY'
                    return (
                      <div
                        key={field.id}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                      >
                        <div className="grid gap-3 md:grid-cols-2">
                          <label className="text-sm font-medium text-slate-700">
                            {t('pages.shkoli.detail.schedule.recurrence')}
                            <select
                              {...register(`scheduleSlots.${index}.recurrence`)}
                              className={inputClassName(
                                Boolean(slotErrors?.recurrence),
                              )}
                            >
                              {COURSE_SCHEDULE_RECURRENCES.map((recurrence) => (
                                <option key={recurrence} value={recurrence}>
                                  {t(`courses.recurrence.${recurrence}`)}
                                </option>
                              ))}
                            </select>
                            {slotErrors?.recurrence ? (
                              <span className={errorTextClassName}>
                                {slotErrors.recurrence.message}
                              </span>
                            ) : null}
                          </label>
                          {isWeekly ? (
                            <label className="text-sm font-medium text-slate-700">
                              {t('pages.shkoli.detail.schedule.dayOfWeek')}
                              <select
                                {...register(
                                  `scheduleSlots.${index}.dayOfWeek`,
                                )}
                                className={inputClassName(
                                  Boolean(slotErrors?.dayOfWeek),
                                )}
                              >
                                <option value="">
                                  {t(
                                    'pages.shkoli.create.schedule.dayOfWeekPlaceholder',
                                  )}
                                </option>
                                {COURSE_DAYS_OF_WEEK.map((day) => (
                                  <option key={day} value={day}>
                                    {t(`courses.daysOfWeek.${day}`)}
                                  </option>
                                ))}
                              </select>
                              {slotErrors?.dayOfWeek ? (
                                <span className={errorTextClassName}>
                                  {slotErrors.dayOfWeek.message}
                                </span>
                              ) : null}
                            </label>
                          ) : null}
                          {isMonthly ? (
                            <label className="text-sm font-medium text-slate-700">
                              {t('pages.shkoli.detail.schedule.dayOfMonth')}
                              <input
                                type="number"
                                min="1"
                                max="31"
                                {...register(
                                  `scheduleSlots.${index}.dayOfMonth`,
                                )}
                                className={inputClassName(
                                  Boolean(slotErrors?.dayOfMonth),
                                )}
                              />
                              {slotErrors?.dayOfMonth ? (
                                <span className={errorTextClassName}>
                                  {slotErrors.dayOfMonth.message}
                                </span>
                              ) : null}
                            </label>
                          ) : null}
                          <label className="text-sm font-medium text-slate-700">
                            {t('pages.shkoli.detail.schedule.startTime')}
                            <input
                              type="time"
                              {...register(`scheduleSlots.${index}.startTime`)}
                              className={inputClassName(
                                Boolean(slotErrors?.startTime),
                              )}
                            />
                            {slotErrors?.startTime ? (
                              <span className={errorTextClassName}>
                                {slotErrors.startTime.message}
                              </span>
                            ) : null}
                          </label>
                          <label className="text-sm font-medium text-slate-700">
                            {t('pages.shkoli.detail.schedule.classesCount')}
                            <input
                              type="number"
                              min="1"
                              {...register(
                                `scheduleSlots.${index}.classesCount`,
                              )}
                              className={inputClassName(
                                Boolean(slotErrors?.classesCount),
                              )}
                            />
                            {slotErrors?.classesCount ? (
                              <span className={errorTextClassName}>
                                {slotErrors.classesCount.message}
                              </span>
                            ) : null}
                          </label>
                          <label className="text-sm font-medium text-slate-700">
                            {t('pages.shkoli.detail.schedule.duration')}
                            <input
                              type="number"
                              min="1"
                              {...register(
                                `scheduleSlots.${index}.singleClassDurationMinutes`,
                              )}
                              className={inputClassName(
                                Boolean(slotErrors?.singleClassDurationMinutes),
                              )}
                            />
                            {slotErrors?.singleClassDurationMinutes ? (
                              <span className={errorTextClassName}>
                                {slotErrors.singleClassDurationMinutes.message}
                              </span>
                            ) : null}
                          </label>
                          <label className="text-sm font-medium text-slate-700">
                            {t('pages.shkoli.detail.schedule.gap')}
                            <input
                              type="number"
                              min="0"
                              {...register(
                                `scheduleSlots.${index}.gapBetweenClassesMinutes`,
                              )}
                              className={inputClassName(
                                Boolean(slotErrors?.gapBetweenClassesMinutes),
                              )}
                            />
                            {slotErrors?.gapBetweenClassesMinutes ? (
                              <span className={errorTextClassName}>
                                {slotErrors.gapBetweenClassesMinutes.message}
                              </span>
                            ) : null}
                          </label>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <button
                            type="button"
                            onClick={() => scheduleSlots.remove(index)}
                            className="text-xs font-semibold text-rose-600 transition hover:text-rose-700"
                          >
                            {t('pages.shkoli.create.schedule.removeSlot')}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            <div className="space-y-4 pt-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-700">
                  {t('pages.shkoli.create.schedule.specialCasesTitle')}
                </p>
                <button
                  type="button"
                  onClick={() => scheduleSpecialCases.append(defaultSpecialCase)}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                >
                  {t('pages.shkoli.create.schedule.addSpecialCase')}
                </button>
              </div>
              {scheduleSpecialCases.fields.length === 0 ? (
                <p className="text-sm text-slate-600">
                  {t('pages.shkoli.create.schedule.specialCasesEmpty')}
                </p>
              ) : (
                <div className="space-y-3">
                  {scheduleSpecialCases.fields.map((field, index) => {
                    const caseErrors = errors.scheduleSpecialCases?.[index]
                    return (
                      <div
                        key={field.id}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                      >
                        <div className="grid gap-3 md:grid-cols-2">
                          <label className="text-sm font-medium text-slate-700">
                            {t('pages.shkoli.create.schedule.date')}
                            <input
                              type="date"
                              {...register(
                                `scheduleSpecialCases.${index}.date`,
                              )}
                              className={inputClassName(
                                Boolean(caseErrors?.date),
                              )}
                            />
                            {caseErrors?.date ? (
                              <span className={errorTextClassName}>
                                {caseErrors.date.message}
                              </span>
                            ) : null}
                          </label>
                          <label className="text-sm font-medium text-slate-700">
                            {t('pages.shkoli.create.schedule.reason')}
                            <input
                              type="text"
                              {...register(
                                `scheduleSpecialCases.${index}.reason`,
                              )}
                              className={inputClassName(
                                Boolean(caseErrors?.reason),
                              )}
                            />
                            {caseErrors?.reason ? (
                              <span className={errorTextClassName}>
                                {caseErrors.reason.message}
                              </span>
                            ) : null}
                          </label>
                        </div>
                        <label className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-700">
                          <input
                            type="checkbox"
                            {...register(
                              `scheduleSpecialCases.${index}.cancelled`,
                            )}
                            className="h-4 w-4 rounded border-slate-300 text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                          />
                          {t('pages.shkoli.create.schedule.cancelled')}
                        </label>
                        <div className="mt-3 flex justify-end">
                          <button
                            type="button"
                            onClick={() => scheduleSpecialCases.remove(index)}
                            className="text-xs font-semibold text-rose-600 transition hover:text-rose-700"
                          >
                            {t('pages.shkoli.create.schedule.removeSpecialCase')}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </fieldset>

          <fieldset className={fieldsetClassName}>
            <legend className={legendClassName}>
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
                            {displayName || t('pages.shkoli.create.lecturers.unknown')}
                          </span>
                          <span className="block text-xs text-slate-500">
                            {lecturer.email ?? t('pages.shkoli.detail.notProvided')}
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

          <div className={actionBarClassName}>
            <button
              type="submit"
              className={primaryActionButtonClassName}
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? t('pages.shkoli.create.form.actions.submitting')
                : t('pages.shkoli.create.form.actions.submit')}
            </button>
            <Link
              to={isValidLyceumId ? `/lyceums/${lyceumId}` : '/shkoli'}
              className={secondaryActionButtonClassName}
            >
              {t('pages.shkoli.create.form.actions.cancel')}
            </Link>
          </div>
        </form>
      )}
    </section>
  )
}

export default CourseCreatePage
