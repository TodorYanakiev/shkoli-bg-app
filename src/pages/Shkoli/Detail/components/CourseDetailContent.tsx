import type { TFunction } from 'i18next'

import type {
  CourseResponse,
  CourseScheduleSlot,
  CourseScheduleSpecialCase,
  CourseImageResponse,
} from '../../../../types/courses'
import type { LyceumResponse } from '../../../../types/lyceums'
import type { UserResponse } from '../../../../types/users'
import { useCourseReviews } from '../../../Reviews/hooks/useCourseReviews'
import type { SideNavItem, CourseDetailTabKey } from '../types'
import { useCourseDetailDecisionValues } from '../hooks/useCourseDetailDecisionValues'
import { useCourseDetailReviewActions } from '../hooks/useCourseDetailReviewActions'
import { CourseDetailDecisionStrip } from './CourseDetailDecisionStrip'
import { CourseDetailHeroBand } from './CourseDetailHeroBand'
import { CourseDetailSideNav } from './CourseDetailSideNav'
import { CourseDetailTabPanels } from './CourseDetailTabPanels'
import { CourseDetailTabs } from './CourseDetailTabs'

type CourseDetailContentProps = {
  course: CourseResponse
  sideNavItems: SideNavItem[]
  isDesktop: boolean
  isSideNavExpanded: boolean
  sideNavWidth: string
  navIconClassName: string
  sideNavItemClassName: string
  sideNavIconClassName: string
  sideNavToggleClassName: string
  sideNavContainerClassName: string
  sideNavListClassName: string
  setIsSideNavExpanded: (value: boolean | ((prev: boolean) => boolean)) => void
  canEditCourse: boolean
  isDeletingCourse: boolean
  onDeleteCourse: () => void
  courseName: string
  courseTypeLabel: string
  hasCourseType: boolean
  courseDescription: string
  ageGroups: string[]
  priceValue: string
  executionTypeLabel: string | null
  locationValue: string
  normalizedAchievements: string | null
  normalizedWebsiteLink: string | null
  normalizedFacebookLink: string | null
  scheduleSlots: CourseScheduleSlot[]
  scheduleSpecialCases: CourseScheduleSpecialCase[]
  fallbackValue: string
  mainImage?: CourseImageResponse
  mainImageUrl: string
  galleryImages: CourseImageResponse[]
  activeTab: CourseDetailTabKey
  onSelectTab: (tab: CourseDetailTabKey) => void
  lecturers?: UserResponse[]
  isLecturersLoading: boolean
  lecturersErrorMessage: string | null
  lyceumId?: number
  lyceum?: LyceumResponse
  isLyceumLoading: boolean
  lyceumErrorMessage: string | null
  locale: string
  onOpenLecturerReviews: (lecturer: UserResponse) => void
  t: TFunction
}

export const CourseDetailContent = ({
  course,
  sideNavItems,
  isDesktop,
  isSideNavExpanded,
  sideNavWidth,
  navIconClassName,
  sideNavItemClassName,
  sideNavIconClassName,
  sideNavToggleClassName,
  sideNavContainerClassName,
  sideNavListClassName,
  setIsSideNavExpanded,
  canEditCourse,
  isDeletingCourse,
  onDeleteCourse,
  courseName,
  courseTypeLabel,
  hasCourseType,
  courseDescription,
  ageGroups,
  priceValue,
  executionTypeLabel,
  locationValue,
  normalizedAchievements,
  normalizedWebsiteLink,
  normalizedFacebookLink,
  scheduleSlots,
  scheduleSpecialCases,
  fallbackValue,
  mainImage,
  mainImageUrl,
  galleryImages,
  activeTab,
  onSelectTab,
  lecturers,
  isLecturersLoading,
  lecturersErrorMessage,
  lyceumId,
  lyceum,
  isLyceumLoading,
  lyceumErrorMessage,
  locale,
  onOpenLecturerReviews,
  t,
}: CourseDetailContentProps) => {
  const reviewsQuery = useCourseReviews(course.id, {
    enabled: Boolean(course.id),
  })
  const reviewsCount = reviewsQuery.data?.length ?? 0

  const { scheduleDuration, scheduleFactValue } =
    useCourseDetailDecisionValues({
      scheduleSlots,
      fallbackValue,
      t,
    })
  const lyceumLocationValue = [lyceum?.town, lyceum?.address]
    .filter(Boolean)
    .join(', ')
  const resolvedLocationValue = lyceumLocationValue || locationValue
  const resolvedDurationValue =
    scheduleDuration === fallbackValue ? null : scheduleDuration
  const { reviewEditorTriggerId, openReviewsTab, openReviewEditor } =
    useCourseDetailReviewActions({ onSelectTab })
  const openOverviewTab = () => {
    onSelectTab('overview')

    if (typeof window === 'undefined') return

    window.setTimeout(() => {
      const overviewSection = document.getElementById('course-overview')
      overviewSection?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 0)
  }

  return (
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
        canDeleteCourse={canEditCourse}
        isDeletingCourse={isDeletingCourse}
        onDeleteCourse={onDeleteCourse}
        onToggle={() => setIsSideNavExpanded((prev) => !prev)}
        t={t}
      />

      <div className="w-full overflow-hidden border border-slate-200 bg-white">
        <div className="flex flex-col lg:h-[calc(100dvh-var(--topnav-height,76px)-2px)] lg:overflow-hidden">
          <CourseDetailHeroBand
            courseName={courseName}
            courseTypeLabel={courseTypeLabel}
            hasCourseType={hasCourseType}
            averageRating={course.averageRating ?? null}
            reviewsCount={reviewsCount}
            ageGroups={ageGroups}
            description={courseDescription}
            pricePrimary={priceValue}
            priceSecondary={executionTypeLabel}
            mainImage={mainImage}
            mainImageUrl={mainImageUrl}
            onOpenReviewsTab={openReviewsTab}
            onOpenOverviewTab={openOverviewTab}
            className="min-h-0 flex-1"
            t={t}
          />
          <CourseDetailDecisionStrip
            websiteLink={normalizedWebsiteLink}
            facebookLink={normalizedFacebookLink}
            scheduleValue={scheduleFactValue}
            durationValue={resolvedDurationValue}
            locationValue={resolvedLocationValue}
            onOpenReviews={openReviewEditor}
            t={t}
          />
        </div>
        <CourseDetailTabs
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          t={t}
        />
        <div className="px-8 py-7">
          <CourseDetailTabPanels
            activeTab={activeTab}
            course={course}
            courseName={courseName}
            courseDescription={courseDescription}
            normalizedAchievements={normalizedAchievements}
            fallbackValue={fallbackValue}
            locationValue={locationValue}
            lyceumId={lyceumId}
            lyceum={lyceum}
            isLyceumLoading={isLyceumLoading}
            lyceumErrorMessage={lyceumErrorMessage}
            scheduleSlots={scheduleSlots}
            scheduleSpecialCases={scheduleSpecialCases}
            locale={locale}
            galleryImages={galleryImages}
            lecturers={lecturers}
            isLecturersLoading={isLecturersLoading}
            lecturersErrorMessage={lecturersErrorMessage}
            onOpenLecturerReviews={onOpenLecturerReviews}
            reviewEditorTriggerId={reviewEditorTriggerId}
            t={t}
          />
        </div>
      </div>
    </div>
  )
}
