import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import { useToast } from '../../../components/feedback/ToastContext'
import {
  COURSE_AGE_GROUPS,
  COURSE_DAYS_OF_WEEK,
  COURSE_IMAGE_ALLOWED_MIME_TYPES,
  COURSE_IMAGE_MAX_SIZE_BYTES,
  COURSE_IMAGE_MAX_SIZE_MB,
  COURSE_SCHEDULE_RECURRENCES,
  COURSE_TYPES,
} from '../../../constants/courses'
import { env } from '../../../constants/env'
import type { ApiError } from '../../../types/api'
import type {
  CourseAgeGroup,
  CourseImageRole,
  CourseRequest,
  CourseSchedule,
  CourseScheduleDayOfWeek,
  CourseScheduleRecurrence,
  CourseScheduleSlot,
  CourseScheduleSpecialCase,
  CourseType,
} from '../../../types/courses'
import { uploadFileToS3 } from '../../../services/s3'
import { getUserDisplayName } from '../../../utils/user'
import {
  getCourseCreateSchema,
  type CourseCreateFormValues,
} from '../../../validations/courses'
import { useUserProfile } from '../../Profile/hooks/useUserProfile'
import { lyceumCoursesQueryKey } from '../../Lyceums/hooks/useLyceumCourses'
import { useLyceum } from '../../Lyceums/hooks/useLyceum'
import { useLyceumLecturers } from '../../Lyceums/hooks/useLyceumLecturers'
import { courseDetailQueryKey } from '../hooks/useCourse'
import { useCreateCourseMutation } from '../hooks/useCreateCourseMutation'
import { useRegisterCourseImageMutation } from '../hooks/useRegisterCourseImageMutation'

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

type PendingCourseImage = {
  id: string
  role: CourseImageRole
  file: File
  previewUrl: string
  altText: string
  width?: number
  height?: number
  mimeType?: string
  status: 'idle' | 'uploading' | 'uploaded' | 'error'
  progress: number
  error?: string
}

const createImageId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`

const sanitizeFileName = (fileName: string) =>
  fileName
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '-')

const buildCourseImageS3Key = (
  courseId: number,
  role: CourseImageRole,
  fileName: string,
  orderIndex?: number,
) => {
  const prefix = env.s3AllowedPrefix || 'courses/'
  const normalizedPrefix = prefix.endsWith('/') ? prefix : `${prefix}/`
  const safeName = sanitizeFileName(fileName)
  const timestamp = Date.now()
  const indexSuffix =
    role === 'GALLERY' && typeof orderIndex === 'number'
      ? `-${orderIndex + 1}`
      : ''
  return `${normalizedPrefix}${courseId}/${role.toLowerCase()}${indexSuffix}-${timestamp}-${safeName}`
}

const loadImageDimensions = (url: string) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image()
    image.onload = () =>
      resolve({ width: image.width, height: image.height })
    image.onerror = () => reject(new Error('invalid_image'))
    image.src = url
  })

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

const isApiError = (value: unknown): value is ApiError =>
  typeof value === 'object' &&
  value !== null &&
  'status' in value &&
  'kind' in value

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
  const registerImageMutation = useRegisterCourseImageMutation()
  const [logoImage, setLogoImage] = useState<PendingCourseImage | null>(
    null,
  )
  const [mainImage, setMainImage] = useState<PendingCourseImage | null>(
    null,
  )
  const [galleryImages, setGalleryImages] = useState<
    PendingCourseImage[]
  >([])
  const [logoImageError, setLogoImageError] = useState<string | null>(
    null,
  )
  const [mainImageError, setMainImageError] = useState<string | null>(
    null,
  )
  const [galleryImageError, setGalleryImageError] = useState<string | null>(
    null,
  )
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const imageStateRef = useRef({
    logoImage: null as PendingCourseImage | null,
    mainImage: null as PendingCourseImage | null,
    galleryImages: [] as PendingCourseImage[],
  })

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
  const allowedImageTypesLabel = useMemo(
    () =>
      COURSE_IMAGE_ALLOWED_MIME_TYPES.map((type) =>
        type.replace('image/', '').toUpperCase(),
      ).join(', '),
    [],
  )

  const validateImageFile = (file: File) => {
    if (
      !COURSE_IMAGE_ALLOWED_MIME_TYPES.includes(
        file.type as (typeof COURSE_IMAGE_ALLOWED_MIME_TYPES)[number],
      )
    ) {
      return t('validation.imageType', {
        formats: allowedImageTypesLabel,
      })
    }
    if (file.size > COURSE_IMAGE_MAX_SIZE_BYTES) {
      return t('validation.imageSize', {
        size: COURSE_IMAGE_MAX_SIZE_MB,
      })
    }
    return null
  }

  const createPendingImage = async (
    file: File,
    role: CourseImageRole,
  ): Promise<PendingCourseImage> => {
    const previewUrl = URL.createObjectURL(file)
    try {
      const { width, height } = await loadImageDimensions(previewUrl)
      return {
        id: createImageId(),
        role,
        file,
        previewUrl,
        altText: '',
        width,
        height,
        mimeType: file.type,
        status: 'idle',
        progress: 0,
      }
    } catch (error) {
      URL.revokeObjectURL(previewUrl)
      throw error
    }
  }

  const updateImageState = (
    id: string,
    updates: Partial<PendingCourseImage>,
  ) => {
    setLogoImage((prev) =>
      prev && prev.id === id ? { ...prev, ...updates } : prev,
    )
    setMainImage((prev) =>
      prev && prev.id === id ? { ...prev, ...updates } : prev,
    )
    setGalleryImages((prev) =>
      prev.map((image) =>
        image.id === id ? { ...image, ...updates } : image,
      ),
    )
  }

  const clearImageState = (image: PendingCourseImage | null) => {
    if (!image) return
    URL.revokeObjectURL(image.previewUrl)
  }

  const handleSingleImageSelect = async (
    event: ChangeEvent<HTMLInputElement>,
    role: CourseImageRole,
  ) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const errorMessage = validateImageFile(file)
    if (errorMessage) {
      if (role === 'LOGO') {
        setLogoImageError(errorMessage)
      } else {
        setMainImageError(errorMessage)
      }
      return
    }

    try {
      const pendingImage = await createPendingImage(file, role)
      if (role === 'LOGO') {
        clearImageState(logoImage)
        setLogoImage(pendingImage)
        setLogoImageError(null)
      } else {
        clearImageState(mainImage)
        setMainImage(pendingImage)
        setMainImageError(null)
      }
    } catch {
      if (role === 'LOGO') {
        setLogoImageError(t('pages.shkoli.create.images.loadError'))
      } else {
        setMainImageError(t('pages.shkoli.create.images.loadError'))
      }
    }
  }

  const handleGallerySelect = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (files.length === 0) return

    const validFiles = files.filter((file) => {
      const errorMessage = validateImageFile(file)
      if (errorMessage) {
        setGalleryImageError(errorMessage)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    try {
      const pendingImages = await Promise.all(
        validFiles.map((file) => createPendingImage(file, 'GALLERY')),
      )
      setGalleryImages((prev) => [...prev, ...pendingImages])
      setGalleryImageError(null)
    } catch {
      setGalleryImageError(t('pages.shkoli.create.images.loadError'))
    }
  }

  const removeSingleImage = (role: CourseImageRole) => {
    if (role === 'LOGO') {
      clearImageState(logoImage)
      setLogoImage(null)
      setLogoImageError(null)
    } else {
      clearImageState(mainImage)
      setMainImage(null)
      setMainImageError(null)
    }
  }

  const removeGalleryImage = (id: string) => {
    setGalleryImages((prev) => {
      const target = prev.find((image) => image.id === id)
      if (target) {
        clearImageState(target)
      }
      return prev.filter((image) => image.id !== id)
    })
  }

  const formatImageSize = (size: number) =>
    `${(size / (1024 * 1024)).toFixed(2)} MB`

  const getImageStatusLabel = (image: PendingCourseImage) => {
    if (image.status === 'uploading') {
      return t('pages.shkoli.create.images.progress', {
        progress: image.progress,
      })
    }
    if (image.status === 'uploaded') {
      return t('pages.shkoli.create.images.uploaded')
    }
    if (image.status === 'error') {
      return image.error ?? t('pages.shkoli.create.images.error')
    }
    return t('pages.shkoli.create.images.pending')
  }

  const getImageStatusClassName = (image: PendingCourseImage) => {
    if (image.status === 'error') return 'text-rose-600'
    if (image.status === 'uploaded') return 'text-emerald-600'
    return 'text-slate-500'
  }

  const getImageUploadErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
      if (
        error.message === 's3_config_missing' ||
        error.message === 's3_bucket_missing'
      ) {
        return t('errors.courses.imageConfigMissing')
      }
    }

    if (isApiError(error)) {
      if (error.status === 409) {
        return t('errors.courses.imageDuplicate')
      }
      if (error.kind === 'network') {
        return t('errors.network')
      }
      if (error.kind === 'unauthorized' || error.kind === 'forbidden') {
        return t('errors.auth.forbidden')
      }
    }

    return t('errors.courses.imageUploadFailed')
  }

  const uploadCourseImages = async (courseId: number) => {
    const images: PendingCourseImage[] = [
      ...(logoImage ? [logoImage] : []),
      ...(mainImage ? [mainImage] : []),
      ...galleryImages,
    ]

    if (images.length === 0) {
      return { uploadedCount: 0, failedCount: 0 }
    }

    setIsUploadingImages(true)
    let uploadedCount = 0
    let failedCount = 0

    try {
      for (const image of images) {
        updateImageState(image.id, {
          status: 'uploading',
          progress: 0,
          error: undefined,
        })

        try {
          const orderIndex =
            image.role === 'GALLERY'
              ? galleryImages.findIndex((item) => item.id === image.id)
              : undefined
          const s3Key = buildCourseImageS3Key(
            courseId,
            image.role,
            image.file.name,
            orderIndex,
          )
          await uploadFileToS3({
            file: image.file,
            key: s3Key,
            onProgress: (progress) =>
              updateImageState(image.id, { progress }),
          })

          await registerImageMutation.mutateAsync({
            courseId,
            data: {
              s3Key,
              role: image.role,
              altText: normalizeOptionalText(image.altText),
              width: image.width,
              height: image.height,
              mimeType: image.mimeType,
              orderIndex:
                image.role === 'GALLERY' && orderIndex != null
                  ? orderIndex
                  : undefined,
            },
          })

          updateImageState(image.id, {
            status: 'uploaded',
            progress: 100,
          })
          uploadedCount += 1
        } catch (error) {
          updateImageState(image.id, {
            status: 'error',
            error: getImageUploadErrorMessage(error),
          })
          failedCount += 1
        }
      }
    } finally {
      setIsUploadingImages(false)
    }

    return { uploadedCount, failedCount }
  }

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

  useEffect(() => {
    imageStateRef.current = {
      logoImage,
      mainImage,
      galleryImages,
    }
  }, [logoImage, mainImage, galleryImages])

  useEffect(() => {
    return () => {
      const current = imageStateRef.current
      if (current.logoImage) {
        URL.revokeObjectURL(current.logoImage.previewUrl)
      }
      if (current.mainImage) {
        URL.revokeObjectURL(current.mainImage.previewUrl)
      }
      current.galleryImages.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl)
      })
    }
  }, [])

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

  const onSubmit = async (values: CourseCreateFormValues) => {
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

    try {
      const data = await mutation.mutateAsync(payload)
      if (lyceumId != null) {
        queryClient.invalidateQueries({
          queryKey: lyceumCoursesQueryKey(lyceumId),
        })
      }

      const courseId = data.id
      const imageResult =
        courseId != null
          ? await uploadCourseImages(courseId)
          : { uploadedCount: 0, failedCount: 0 }

      if (courseId != null) {
        queryClient.invalidateQueries({
          queryKey: courseDetailQueryKey(courseId),
        })
      }

      showToast({
        message: t('feedback.courses.createSuccess'),
        tone: 'success',
      })

      if (imageResult.failedCount > 0) {
        showToast({
          message: t('errors.courses.imagesUploadFailed'),
          tone: 'error',
        })
      }

      if (courseId != null) {
        navigate(`/shkoli/${courseId}`, { replace: true })
      } else if (lyceumId != null) {
        navigate(`/lyceums/${lyceumId}`, { replace: true })
      } else {
        navigate('/shkoli', { replace: true })
      }
    } catch {
      // handled by mutation state
    }
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
  const isSubmitting = mutation.isPending || isUploadingImages

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
              {t('pages.shkoli.create.form.sections.images')}
            </legend>
            <p className="text-sm text-slate-600">
              {t('pages.shkoli.create.images.helper', {
                size: COURSE_IMAGE_MAX_SIZE_MB,
                formats: allowedImageTypesLabel,
              })}
            </p>
            <div className="grid gap-4 pt-2 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700">
                    {t('pages.shkoli.create.images.logoLabel')}
                  </p>
                  {logoImage ? (
                    <button
                      type="button"
                      onClick={() => removeSingleImage('LOGO')}
                      disabled={isSubmitting}
                      className="text-xs font-semibold text-rose-600 transition hover:text-rose-700 disabled:cursor-not-allowed disabled:text-rose-300"
                    >
                      {t('pages.shkoli.create.images.remove')}
                    </button>
                  ) : null}
                </div>
                <input
                  type="file"
                  accept={COURSE_IMAGE_ALLOWED_MIME_TYPES.join(',')}
                  onChange={(event) =>
                    handleSingleImageSelect(event, 'LOGO')
                  }
                  disabled={isSubmitting}
                  className="mt-3 w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
                />
                {logoImageError ? (
                  <span className={errorTextClassName}>{logoImageError}</span>
                ) : null}
                {logoImage ? (
                  <div className="mt-4 flex gap-3">
                    <img
                      src={logoImage.previewUrl}
                      alt={t('pages.shkoli.create.images.previewAlt')}
                      className="h-20 w-20 rounded-xl border border-slate-200 object-cover"
                    />
                    <div className="flex-1 space-y-2">
                      <label className="text-xs font-medium text-slate-600">
                        {t('pages.shkoli.create.images.altTextLabel')}
                        <input
                          type="text"
                          value={logoImage.altText}
                          onChange={(event) =>
                            setLogoImage((prev) =>
                              prev
                                ? { ...prev, altText: event.target.value }
                                : prev,
                            )
                          }
                          disabled={isSubmitting}
                          className={inputClassName(false)}
                          placeholder={t(
                            'pages.shkoli.create.images.altTextPlaceholder',
                          )}
                        />
                      </label>
                      <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                        {logoImage.width && logoImage.height ? (
                          <span>
                            {logoImage.width}x{logoImage.height}px
                          </span>
                        ) : null}
                        <span>{formatImageSize(logoImage.file.size)}</span>
                        <span>{logoImage.mimeType || logoImage.file.type}</span>
                      </div>
                      <p
                        className={`text-xs font-medium ${getImageStatusClassName(logoImage)}`}
                      >
                        {getImageStatusLabel(logoImage)}
                      </p>
                      {logoImage.status === 'uploading' ? (
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-brand transition-all"
                            style={{
                              width: `${logoImage.progress}%`,
                            }}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-slate-500">
                    {t('pages.shkoli.create.images.empty')}
                  </p>
                )}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700">
                    {t('pages.shkoli.create.images.mainLabel')}
                  </p>
                  {mainImage ? (
                    <button
                      type="button"
                      onClick={() => removeSingleImage('MAIN')}
                      disabled={isSubmitting}
                      className="text-xs font-semibold text-rose-600 transition hover:text-rose-700 disabled:cursor-not-allowed disabled:text-rose-300"
                    >
                      {t('pages.shkoli.create.images.remove')}
                    </button>
                  ) : null}
                </div>
                <input
                  type="file"
                  accept={COURSE_IMAGE_ALLOWED_MIME_TYPES.join(',')}
                  onChange={(event) =>
                    handleSingleImageSelect(event, 'MAIN')
                  }
                  disabled={isSubmitting}
                  className="mt-3 w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
                />
                {mainImageError ? (
                  <span className={errorTextClassName}>{mainImageError}</span>
                ) : null}
                {mainImage ? (
                  <div className="mt-4 flex gap-3">
                    <img
                      src={mainImage.previewUrl}
                      alt={t('pages.shkoli.create.images.previewAlt')}
                      className="h-20 w-20 rounded-xl border border-slate-200 object-cover"
                    />
                    <div className="flex-1 space-y-2">
                      <label className="text-xs font-medium text-slate-600">
                        {t('pages.shkoli.create.images.altTextLabel')}
                        <input
                          type="text"
                          value={mainImage.altText}
                          onChange={(event) =>
                            setMainImage((prev) =>
                              prev
                                ? { ...prev, altText: event.target.value }
                                : prev,
                            )
                          }
                          disabled={isSubmitting}
                          className={inputClassName(false)}
                          placeholder={t(
                            'pages.shkoli.create.images.altTextPlaceholder',
                          )}
                        />
                      </label>
                      <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                        {mainImage.width && mainImage.height ? (
                          <span>
                            {mainImage.width}x{mainImage.height}px
                          </span>
                        ) : null}
                        <span>{formatImageSize(mainImage.file.size)}</span>
                        <span>{mainImage.mimeType || mainImage.file.type}</span>
                      </div>
                      <p
                        className={`text-xs font-medium ${getImageStatusClassName(mainImage)}`}
                      >
                        {getImageStatusLabel(mainImage)}
                      </p>
                      {mainImage.status === 'uploading' ? (
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-brand transition-all"
                            style={{
                              width: `${mainImage.progress}%`,
                            }}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-slate-500">
                    {t('pages.shkoli.create.images.empty')}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {t('pages.shkoli.create.images.galleryLabel')}
                  </p>
                  <p className="text-xs text-slate-500">
                    {t('pages.shkoli.create.images.galleryHint')}
                  </p>
                </div>
                <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900">
                  {t('pages.shkoli.create.images.addGallery')}
                  <input
                    type="file"
                    accept={COURSE_IMAGE_ALLOWED_MIME_TYPES.join(',')}
                    multiple
                    onChange={handleGallerySelect}
                    disabled={isSubmitting}
                    className="sr-only"
                  />
                </label>
              </div>
              {galleryImageError ? (
                <span className={errorTextClassName}>
                  {galleryImageError}
                </span>
              ) : null}
              {galleryImages.length === 0 ? (
                <p className="mt-3 text-xs text-slate-500">
                  {t('pages.shkoli.create.images.galleryEmpty')}
                </p>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {galleryImages.map((image, index) => (
                    <div
                      key={image.id}
                      className="rounded-xl border border-slate-200 p-3"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={image.previewUrl}
                          alt={t('pages.shkoli.create.images.previewAlt')}
                          className="h-16 w-16 rounded-lg border border-slate-200 object-cover"
                        />
                        <div className="flex-1 space-y-2">
                          <p className="text-xs font-semibold text-slate-600">
                            {t('pages.shkoli.create.images.galleryItem', {
                              index: index + 1,
                            })}
                          </p>
                          <label className="text-xs font-medium text-slate-600">
                            {t('pages.shkoli.create.images.altTextLabel')}
                            <input
                              type="text"
                              value={image.altText}
                              onChange={(event) =>
                                setGalleryImages((prev) =>
                                  prev.map((item) =>
                                    item.id === image.id
                                      ? {
                                          ...item,
                                          altText: event.target.value,
                                        }
                                      : item,
                                  ),
                                )
                              }
                              disabled={isSubmitting}
                              className={inputClassName(false)}
                              placeholder={t(
                                'pages.shkoli.create.images.altTextPlaceholder',
                              )}
                            />
                          </label>
                          <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                            {image.width && image.height ? (
                              <span>
                                {image.width}x{image.height}px
                              </span>
                            ) : null}
                            <span>{formatImageSize(image.file.size)}</span>
                            <span>{image.mimeType || image.file.type}</span>
                          </div>
                          <p
                            className={`text-xs font-medium ${getImageStatusClassName(image)}`}
                          >
                            {getImageStatusLabel(image)}
                          </p>
                          {image.status === 'uploading' ? (
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-brand transition-all"
                                style={{
                                  width: `${image.progress}%`,
                                }}
                              />
                            </div>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(image.id)}
                          disabled={isSubmitting}
                          className="text-xs font-semibold text-rose-600 transition hover:text-rose-700 disabled:cursor-not-allowed disabled:text-rose-300"
                        >
                          {t('pages.shkoli.create.images.remove')}
                        </button>
                      </div>
                    </div>
                  ))}
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
              disabled={isSubmitting}
            >
              {mutation.isPending
                ? t('pages.shkoli.create.form.actions.submitting')
                : isUploadingImages
                  ? t('pages.shkoli.create.form.actions.uploadingImages')
                  : t('pages.shkoli.create.form.actions.submit')}
            </button>
            <Link
              to={isValidLyceumId ? `/lyceums/${lyceumId}` : '/shkoli'}
              className={secondaryActionButtonClassName}
              aria-disabled={isSubmitting}
              tabIndex={isSubmitting ? -1 : 0}
              onClick={(event) => {
                if (isSubmitting) {
                  event.preventDefault()
                }
              }}
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
