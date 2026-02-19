import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import CourseLecturerReviewsModal from './components/CourseLecturerReviewsModal'
import { CourseDetailContent } from './components/CourseDetailContent'
import { getCourseDetailSideNavItems } from './components/courseDetailSideNavItems'
import { useCourseDetailData } from './hooks/useCourseDetailData'
import { useCourseDetailDeleteAction } from './hooks/useCourseDetailDeleteAction'
import { useCourseDetailLayout } from './hooks/useCourseDetailLayout'
import { useCourseDetailTabs } from './hooks/useCourseDetailTabs'
import { useCourseLecturerReviewsModal } from './hooks/useCourseLecturerReviewsModal'
import { useCourseDetailView } from './hooks/useCourseDetailView'
import { useShkoliPageBackground } from '../hooks/useShkoliPageBackground'

const CourseDetailPage = () => {
  const { t, i18n } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const courseId = Number(id)
  const isValidId = Number.isFinite(courseId)

  const {
    course,
    lecturers,
    lyceum,
    courseError,
    lecturersError,
    lyceumError,
    isLoading,
    isLecturersLoading,
    isLyceumLoading,
    canEditCourse,
    lyceumId,
  } = useCourseDetailData({ courseId, isValidId })
  const { isDeletingCourse, onDeleteCourse } = useCourseDetailDeleteAction({
    courseId,
    canDeleteCourse: canEditCourse,
    courseName: course?.name,
  })

  const {
    fallbackValue,
    courseName,
    courseTypeLabel,
    hasCourseType,
    courseDescription,
    ageGroups,
    priceValue,
    executionTypeLabel,
    activeMonthsValue,
    locationValue,
    normalizedAchievements,
    normalizedWebsiteLink,
    normalizedFacebookLink,
    scheduleSlots,
    scheduleSpecialCases,
    mainImage,
    mainImageUrl,
    galleryImages,
  } = useCourseDetailView({ course, locale: i18n.language, t })
  useShkoliPageBackground()
  const {
    isDesktop,
    isSideNavExpanded,
    setIsSideNavExpanded,
    sideNavWidth,
    navIconClassName,
    sideNavItemClassName,
    sideNavIconClassName,
    sideNavToggleClassName,
    sideNavContainerClassName,
    sideNavListClassName,
  } = useCourseDetailLayout({ hasCourse: Boolean(course) })
  const { activeTab, onSelectTab } = useCourseDetailTabs()
  const {
    selectedLecturer,
    isOpen: isLecturerReviewsModalOpen,
    openModal: openLecturerReviewsModal,
    closeModal: closeLecturerReviewsModal,
  } = useCourseLecturerReviewsModal()

  const sideNavItems = useMemo(
    () =>
      getCourseDetailSideNavItems({
        t,
        courseId,
        canEditCourse,
        navIconClassName,
      }),
    [t, courseId, canEditCourse, navIconClassName],
  )

  const pageTitle = course?.name
    ? `${course.name} | ${t('app.title')}`
    : `${t('pages.shkoli.detail.title')} | ${t('app.title')}`
  const courseErrorMessage = courseError ? t(courseError.messageKey) : null
  const lecturersErrorMessage = lecturersError
    ? t(lecturersError.messageKey)
    : null
  const lyceumErrorMessage = lyceumError ? t(lyceumError.messageKey) : null

  return (
    <section className="-mb-8 -mx-4 -mt-8 sm:-mb-10 sm:-mx-6 sm:-mt-10 lg:-mx-12 lg:-mt-10">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      {!isValidId ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
          role="alert"
        >
          {t('pages.shkoli.detail.invalidId')}
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          <div className="h-48 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-16 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-60 animate-pulse rounded-2xl bg-slate-200" />
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
            {t('pages.shkoli.detail.loading')}
          </div>
        </div>
      ) : courseErrorMessage ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
          role="alert"
        >
          {courseErrorMessage}
        </div>
      ) : !course ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          {t('pages.shkoli.detail.notFound')}
        </div>
      ) : (
        <CourseDetailContent
          course={course}
          sideNavItems={sideNavItems}
          isDesktop={isDesktop}
          isSideNavExpanded={isSideNavExpanded}
          sideNavWidth={sideNavWidth}
          navIconClassName={navIconClassName}
          sideNavItemClassName={sideNavItemClassName}
          sideNavIconClassName={sideNavIconClassName}
          sideNavToggleClassName={sideNavToggleClassName}
          sideNavContainerClassName={sideNavContainerClassName}
          sideNavListClassName={sideNavListClassName}
          setIsSideNavExpanded={setIsSideNavExpanded}
          canEditCourse={canEditCourse}
          isDeletingCourse={isDeletingCourse}
          onDeleteCourse={() => {
            void onDeleteCourse()
          }}
          courseName={courseName}
          courseTypeLabel={courseTypeLabel}
          hasCourseType={hasCourseType}
          courseDescription={courseDescription}
          ageGroups={ageGroups}
          priceValue={priceValue}
          executionTypeLabel={executionTypeLabel}
          activeMonthsValue={activeMonthsValue}
          locationValue={locationValue}
          normalizedAchievements={normalizedAchievements}
          normalizedWebsiteLink={normalizedWebsiteLink}
          normalizedFacebookLink={normalizedFacebookLink}
          scheduleSlots={scheduleSlots}
          scheduleSpecialCases={scheduleSpecialCases}
          fallbackValue={fallbackValue}
          mainImage={mainImage}
          mainImageUrl={mainImageUrl}
          galleryImages={galleryImages}
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          lecturers={lecturers}
          isLecturersLoading={isLecturersLoading}
          lecturersErrorMessage={lecturersErrorMessage}
          lyceumId={lyceumId}
          lyceum={lyceum}
          isLyceumLoading={isLyceumLoading}
          lyceumErrorMessage={lyceumErrorMessage}
          locale={i18n.language}
          onOpenLecturerReviews={openLecturerReviewsModal}
          t={t}
        />
      )}
      {isLecturerReviewsModalOpen &&
      selectedLecturer &&
      isValidId ? (
        <CourseLecturerReviewsModal
          lecturer={selectedLecturer}
          lyceumId={lyceumId}
          onClose={closeLecturerReviewsModal}
        />
      ) : null}
    </section>
  )
}

export default CourseDetailPage
