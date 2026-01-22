import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { CourseDetailGallerySection } from './components/CourseDetailGallerySection'
import { CourseDetailHeader } from './components/CourseDetailHeader'
import { CourseDetailLecturersSection } from './components/CourseDetailLecturersSection'
import { CourseDetailLyceumSection } from './components/CourseDetailLyceumSection'
import { CourseDetailOverviewSection } from './components/CourseDetailOverviewSection'
import { CourseDetailScheduleSection } from './components/CourseDetailScheduleSection'
import { CourseDetailSideNav } from './components/CourseDetailSideNav'
import { getCourseDetailSideNavItems } from './components/courseDetailSideNavItems'
import { useCourseDetailData } from './hooks/useCourseDetailData'
import { useCourseDetailLayout } from './hooks/useCourseDetailLayout'
import { useCourseDetailView } from './hooks/useCourseDetailView'

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

  const {
    fallbackValue,
    courseName,
    courseTypeLabel,
    hasCourseType,
    courseDescription,
    ageGroups,
    courseDetails,
    normalizedAchievements,
    normalizedWebsiteLink,
    normalizedFacebookLink,
    scheduleSlots,
    scheduleSpecialCases,
    logoImage,
    mainImage,
    logoImageUrl,
    mainImageUrl,
    galleryImages,
  } = useCourseDetailView({ course, locale: i18n.language, t })

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
  const subtitle = hasCourseType
    ? courseTypeLabel
    : t('pages.shkoli.detail.subtitle')
  const courseErrorMessage = courseError ? t(courseError.messageKey) : null
  const lecturersErrorMessage = lecturersError
    ? t(lecturersError.messageKey)
    : null
  const lyceumErrorMessage = lyceumError ? t(lyceumError.messageKey) : null

  return (
    <section className="space-y-6">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <CourseDetailHeader title={courseName} subtitle={subtitle} t={t} />
      {!isValidId ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
          role="alert"
        >
          {t('pages.shkoli.detail.invalidId')}
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
          </div>
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
        <div className="relative">
          <CourseDetailSideNav
            items={sideNavItems}
            isDesktop={isDesktop}
            isSideNavExpanded={isSideNavExpanded}
            sideNavWidth={sideNavWidth}
            navIconClassName={navIconClassName}
            sideNavItemClassName={sideNavItemClassName}
            sideNavIconClassName={sideNavIconClassName}
            sideNavToggleClassName={sideNavToggleClassName}
            sideNavContainerClassName={sideNavContainerClassName}
            sideNavListClassName={sideNavListClassName}
            onToggle={() => setIsSideNavExpanded((prev) => !prev)}
            t={t}
          />
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
            <div className="space-y-6">
              <CourseDetailOverviewSection
                courseName={courseName}
                courseTypeLabel={courseTypeLabel}
                showCourseTypeBadge={hasCourseType}
                courseDescription={courseDescription}
                ageGroups={ageGroups}
                courseDetails={courseDetails}
                normalizedAchievements={normalizedAchievements}
                normalizedWebsiteLink={normalizedWebsiteLink}
                normalizedFacebookLink={normalizedFacebookLink}
                logoImage={logoImage}
                mainImage={mainImage}
                logoImageUrl={logoImageUrl}
                mainImageUrl={mainImageUrl}
                t={t}
              />
              <CourseDetailScheduleSection
                scheduleSlots={scheduleSlots}
                scheduleSpecialCases={scheduleSpecialCases}
                fallbackValue={fallbackValue}
                locale={i18n.language}
                t={t}
              />
              <CourseDetailLecturersSection
                lecturers={lecturers}
                isLecturersLoading={isLecturersLoading}
                lecturersErrorMessage={lecturersErrorMessage}
                fallbackValue={fallbackValue}
                t={t}
              />
            </div>
            <div className="space-y-6">
              <CourseDetailLyceumSection
                lyceumId={lyceumId}
                lyceum={lyceum}
                isLyceumLoading={isLyceumLoading}
                lyceumErrorMessage={lyceumErrorMessage}
                fallbackValue={fallbackValue}
                t={t}
              />
              <CourseDetailGallerySection
                galleryImages={galleryImages}
                courseName={courseName}
                t={t}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default CourseDetailPage
