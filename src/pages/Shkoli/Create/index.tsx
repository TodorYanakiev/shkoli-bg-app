import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import SeoHead from '../../../components/ui/SeoHead'
import { useCurrentLocale } from '../../../hooks/useCurrentLocale'
import { CourseCreateActions } from './components/CourseCreateActions'
import { CourseCreateDetailsSection } from './components/CourseCreateDetailsSection'
import { CourseCreateHeader } from './components/CourseCreateHeader'
import { CourseCreateImagesSection } from './components/CourseCreateImagesSection'
import { CourseCreateLecturersSection } from './components/CourseCreateLecturersSection'
import { CourseCreateLinksSection } from './components/CourseCreateLinksSection'
import { CourseCreateLyceumCard } from './components/CourseCreateLyceumCard'
import { CourseCreateOverviewSection } from './components/CourseCreateOverviewSection'
import { CourseCreateScheduleSection } from './components/CourseCreateScheduleSection'
import { useCourseCreateData } from './hooks/useCourseCreateData'
import { useCourseCreateForm } from './hooks/useCourseCreateForm'
import { useCourseCreateImages } from './hooks/useCourseCreateImages'
import { useCourseCreateSubmit } from './hooks/useCourseCreateSubmit'
import { getCourseCreateLoadError } from './services/courseCreateErrors'

const CourseCreatePage = () => {
  const { t, i18n } = useTranslation()
  const locale = useCurrentLocale()
  const [searchParams] = useSearchParams()
  const timePickerLang = i18n.language === 'bg' ? 'bg' : 'en-GB'

  const lyceumIdParam = searchParams.get('lyceumId')
  const lyceumId = lyceumIdParam ? Number(lyceumIdParam) : null
  const isValidLyceumId = lyceumId != null && Number.isFinite(lyceumId)

  const {
    lyceum,
    lecturers,
    isLecturersLoading,
    lyceumError,
    lecturersError,
    userError,
    isUserAdminForLyceum,
    hasCourseAccess,
    isLoading,
  } = useCourseCreateData({ lyceumId, isValidLyceumId })

  const {
    form,
    scheduleSlots,
    scheduleSpecialCases,
    scheduleSlotValues,
    isInLyceum,
  } = useCourseCreateForm({ t })

  const {
    mainImage,
    galleryImages,
    mainImageError,
    galleryImageError,
    allowedImageTypesLabel,
    isUploadingImages,
    handleSingleImageSelect,
    handleGallerySelect,
    removeSingleImage,
    removeGalleryImage,
    updateMainAltText,
    updateGalleryAltText,
    uploadCourseImages,
  } = useCourseCreateImages({ t })

  const { onSubmit, isSubmitting, submitError, isPending } =
    useCourseCreateSubmit({
      lyceumId,
      isValidLyceumId,
      hasCourseAccess,
      uploadCourseImages,
      isUploadingImages,
      setError: form.setError,
      t,
    })

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  const loadError = getCourseCreateLoadError(
    lyceumError ??
      userError ??
      (!isUserAdminForLyceum ? lecturersError ?? null : null),
  )
  const loadErrorMessage = loadError ? t(loadError.messageKey) : null
  const submitErrorMessage = submitError ? t(submitError.messageKey) : null

  const pageTitle = `${t('pages.shkoli.create.title')} | ${t('app.title')}`

  return (
    <section className="space-y-6">
      <SeoHead
        title={pageTitle}
        description={t('pages.shkoli.create.subtitle')}
        canonicalPath="/shkoli/new"
        locale={locale}
        forceNoindex
      />
      <CourseCreateHeader
        lyceum={lyceum}
        isValidLyceumId={isValidLyceumId}
        lyceumId={lyceumId}
        t={t}
      />
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
          <CourseCreateLyceumCard lyceum={lyceum} t={t} />
          <CourseCreateOverviewSection
            register={register}
            errors={errors}
            locale={i18n.language}
            t={t}
          />
          <CourseCreateDetailsSection
            register={register}
            errors={errors}
            isInLyceum={isInLyceum}
            t={t}
          />
          <CourseCreateLinksSection
            register={register}
            errors={errors}
            t={t}
          />
          <CourseCreateScheduleSection
            register={register}
            errors={errors}
            scheduleSlots={scheduleSlots}
            scheduleSpecialCases={scheduleSpecialCases}
            scheduleSlotValues={scheduleSlotValues}
            timePickerLang={timePickerLang}
            isSubmitting={isSubmitting}
            t={t}
          />
          <CourseCreateImagesSection
            allowedImageTypesLabel={allowedImageTypesLabel}
            mainImage={mainImage}
            galleryImages={galleryImages}
            mainImageError={mainImageError}
            galleryImageError={galleryImageError}
            isSubmitting={isSubmitting}
            onSingleImageSelect={handleSingleImageSelect}
            onGallerySelect={handleGallerySelect}
            onRemoveSingleImage={removeSingleImage}
            onRemoveGalleryImage={removeGalleryImage}
            onUpdateMainAltText={updateMainAltText}
            onUpdateGalleryAltText={updateGalleryAltText}
            t={t}
          />
          <CourseCreateLecturersSection
            register={register}
            lecturers={lecturers}
            isLecturersLoading={isLecturersLoading}
            lecturersError={lecturersError}
            t={t}
          />
          <CourseCreateActions
            isSubmitting={isSubmitting}
            isPending={isPending}
            isUploadingImages={isUploadingImages}
            isValidLyceumId={isValidLyceumId}
            lyceumId={lyceumId}
            t={t}
          />
        </form>
      )}
    </section>
  )
}

export default CourseCreatePage
