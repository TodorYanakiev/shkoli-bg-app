import { useCallback } from 'react'
import type { TFunction } from 'i18next'

import type {
  CourseResponse,
  CourseScheduleSlot,
  CourseScheduleSpecialCase,
  CourseImageResponse,
} from '../../../../types/courses'
import type { BreadcrumbItem } from '../../../../components/ui/Breadcrumbs'
import type { LyceumResponse } from '../../../../types/lyceums'
import type { UserResponse } from '../../../../types/users'
import { useLoginRedirectToCurrentPage } from '../../../../hooks/useLoginRedirectToCurrentPage'
import { useCourseReviews } from '../../../Reviews/hooks/useCourseReviews'
import type { SideNavItem, CourseDetailTabKey } from '../types'
import { useCourseDetailDecisionValues } from '../hooks/useCourseDetailDecisionValues'
import { useCourseDetailReviewActions } from '../hooks/useCourseDetailReviewActions'
import { useCourseSubscriptionActions } from '../hooks/useCourseSubscriptionActions'
import { CourseDetailDecisionStrip } from './CourseDetailDecisionStrip'
import { CourseDetailHeroBand } from './CourseDetailHeroBand'
import { CourseDetailSideNav } from './CourseDetailSideNav'
import { CourseDetailTabPanels } from './CourseDetailTabPanels'
import { CourseDetailTabs } from './CourseDetailTabs'

type CourseDetailContentProps = {
  course: CourseResponse
  breadcrumbs: BreadcrumbItem[]
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
  canViewSubscribers: boolean
  isDeletingCourse: boolean
  onDeleteCourse: () => void
  courseName: string
  courseTypeLabel: string
  hasCourseType: boolean
  courseDescription: string
  ageGroups: string[]
  priceValue: string
  executionTypeLabel: string | null
  activeMonthsValue: string | null
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
  isCourseImagesLoading: boolean
  courseImagesErrorMessage: string | null
  activeTab: CourseDetailTabKey
  onSelectTab: (tab: CourseDetailTabKey) => void
  onOpenSubscribers: () => void
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
  breadcrumbs,
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
  canViewSubscribers,
  isDeletingCourse,
  onDeleteCourse,
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
  fallbackValue,
  mainImage,
  mainImageUrl,
  galleryImages,
  isCourseImagesLoading,
  courseImagesErrorMessage,
  activeTab,
  onSelectTab,
  onOpenSubscribers,
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
  const {
    isAuthenticated,
    isSubscribed,
    actionError: subscriptionError,
    isPending: isSubscriptionPending,
    onToggleSubscription,
  } = useCourseSubscriptionActions(course.id)
  const redirectToLogin = useLoginRedirectToCurrentPage()

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
  const subscriptionErrorMessage = subscriptionError
    ? t(subscriptionError.messageKey)
    : null
  const subscriptionTooltip = isSubscribed
    ? null
    : t('pages.shkoli.detail.actions.subscribeTooltip', {
        name: courseName,
      })
  const handleOpenReviewAction = useCallback(() => {
    if (!isAuthenticated) {
      redirectToLogin()
      return
    }

    openReviewEditor()
  }, [isAuthenticated, openReviewEditor, redirectToLogin])
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
            breadcrumbs={breadcrumbs}
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
            activeMonthsValue={activeMonthsValue}
            isSubscribed={isSubscribed}
            isSubscriptionPending={isSubscriptionPending}
            subscriptionErrorMessage={subscriptionErrorMessage}
            subscriptionTooltip={subscriptionTooltip}
            canViewSubscribers={canViewSubscribers}
            onSubscriptionAction={() => {
              void onToggleSubscription()
            }}
            onOpenSubscribers={onOpenSubscribers}
            onOpenReviews={handleOpenReviewAction}
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
            isCourseImagesLoading={isCourseImagesLoading}
            courseImagesErrorMessage={courseImagesErrorMessage}
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
