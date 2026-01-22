import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { CourseEditActions } from './components/CourseEditActions'
import { CourseEditDetailsSection } from './components/CourseEditDetailsSection'
import { CourseEditHeader } from './components/CourseEditHeader'
import { CourseEditImagesSection } from './components/CourseEditImagesSection'
import { CourseEditLecturersSection } from './components/CourseEditLecturersSection'
import { CourseEditLinksSection } from './components/CourseEditLinksSection'
import { CourseEditOverviewSection } from './components/CourseEditOverviewSection'
import { CourseEditScheduleSection } from './components/CourseEditScheduleSection'
import { useCourseEditData } from './hooks/useCourseEditData'
import { useCourseEditForm } from './hooks/useCourseEditForm'
import { useCourseEditImages } from './hooks/useCourseEditImages'
import { useCourseEditSubmit } from './hooks/useCourseEditSubmit'
import {
  getCourseEditLoadError,
  getCourseImagesError,
} from './services/courseEditErrors'

const CourseEditPage = () => {
  const { t, i18n } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const courseId = Number(id)
  const isValidId = Number.isFinite(courseId)
  const timePickerLang = i18n.language === 'bg' ? 'bg' : 'en-GB'

  const {
    course,
    lecturers,
    courseImages,
    logoImages,
    mainImages,
    existingGalleryImages,
    isCourseLoading,
    isUserLoading,
    isLecturersLoading,
    isImagesLoading,
    courseError,
    userError,
    lecturersError,
    courseImagesError,
    hasEditAccess,
    lyceumId,
  } = useCourseEditData({ courseId, isValidId })

  const {
    form,
    scheduleSlots,
    scheduleSpecialCases,
    scheduleSlotValues,
    isInLyceum,
  } = useCourseEditForm({ course, t })

  const {
    logoImage,
    mainImage,
    galleryImages,
    logoImageError,
    mainImageError,
    galleryImageError,
    allowedImageTypesLabel,
    isUploadingImages,
    isDeletePending,
    imageActionError,
    handleSingleImageSelect,
    handleGallerySelect,
    removeSingleImage,
    removeGalleryImage,
    updateLogoAltText,
    updateMainAltText,
    updateGalleryAltText,
    uploadCourseImages,
    deleteExistingImages,
    handleDeleteExistingImage,
    markImageError,
  } = useCourseEditImages({ courseId, isValidId, t })

  const { onSubmit, isSubmitting, submitError } = useCourseEditSubmit({
    courseId,
    isValidId,
    course,
    hasEditAccess,
    lyceumId,
    logoImage,
    mainImage,
    logoImages,
    mainImages,
    uploadCourseImages,
    deleteExistingImages,
    markImageError,
    isUploadingImages,
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

  const isLoading = isCourseLoading || isUserLoading
  const loadError = getCourseEditLoadError(courseError ?? userError ?? null)
  const imagesError = getCourseImagesError(courseImagesError ?? null)
  const loadErrorMessage = loadError ? t(loadError.messageKey) : null
  const imagesErrorMessage = imagesError ? t(imagesError.messageKey) : null
  const imageActionErrorMessage = imageActionError
    ? t(imageActionError.messageKey)
    : null
  const submitErrorMessage = submitError ? t(submitError.messageKey) : null

  const pageTitle = `${t('pages.shkoli.edit.title')} | ${t('app.title')}`

  return (
    <section className="space-y-6">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <CourseEditHeader
        courseId={courseId}
        isValidId={isValidId}
        t={t}
      />
      {!isValidId ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
          role="alert"
        >
          {t('pages.shkoli.edit.invalidId')}
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-60 animate-pulse rounded-2xl bg-slate-200" />
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
            {t('pages.shkoli.edit.loading')}
          </div>
        </div>
      ) : loadErrorMessage ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
          role="alert"
        >
          {loadErrorMessage}
        </div>
      ) : !course ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          {t('pages.shkoli.edit.notFound')}
        </div>
      ) : !hasEditAccess ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
          role="alert"
        >
          {t('errors.auth.forbidden')}
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
          <CourseEditOverviewSection
            register={register}
            errors={errors}
            t={t}
          />
          <CourseEditDetailsSection
            register={register}
            errors={errors}
            isInLyceum={isInLyceum}
            t={t}
          />
          <CourseEditLinksSection
            register={register}
            errors={errors}
            t={t}
          />
          <CourseEditScheduleSection
            register={register}
            errors={errors}
            scheduleSlots={scheduleSlots}
            scheduleSpecialCases={scheduleSpecialCases}
            scheduleSlotValues={scheduleSlotValues}
            timePickerLang={timePickerLang}
            isSubmitting={isSubmitting}
            t={t}
          />
          <CourseEditImagesSection
            courseImages={courseImages}
            logoImages={logoImages}
            mainImages={mainImages}
            existingGalleryImages={existingGalleryImages}
            isImagesLoading={isImagesLoading}
            imagesErrorMessage={imagesErrorMessage}
            imageActionErrorMessage={imageActionErrorMessage}
            isDeletePending={isDeletePending}
            isSubmitting={isSubmitting}
            onDeleteExistingImage={handleDeleteExistingImage}
            allowedImageTypesLabel={allowedImageTypesLabel}
            logoImage={logoImage}
            mainImage={mainImage}
            galleryImages={galleryImages}
            logoImageError={logoImageError}
            mainImageError={mainImageError}
            galleryImageError={galleryImageError}
            onSingleImageSelect={handleSingleImageSelect}
            onGallerySelect={handleGallerySelect}
            onRemoveSingleImage={removeSingleImage}
            onRemoveGalleryImage={removeGalleryImage}
            onUpdateLogoAltText={updateLogoAltText}
            onUpdateMainAltText={updateMainAltText}
            onUpdateGalleryAltText={updateGalleryAltText}
            t={t}
          />
          <CourseEditLecturersSection
            register={register}
            lecturers={lecturers}
            isLecturersLoading={isLecturersLoading}
            lecturersError={lecturersError}
            t={t}
          />
          <CourseEditActions
            courseId={courseId}
            isSubmitting={isSubmitting}
            t={t}
          />
        </form>
      )}
    </section>
  )
}

export default CourseEditPage
