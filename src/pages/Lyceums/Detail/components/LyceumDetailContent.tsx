import type { TFunction } from 'i18next'
import { useCallback, useMemo } from 'react'

import type { BreadcrumbItem } from '../../../../components/ui/Breadcrumbs'
import type { CourseResponse } from '../../../../types/courses'
import type { LyceumImageResponse, LyceumResponse } from '../../../../types/lyceums'
import type { UserResponse } from '../../../../types/users'
import { useLoginRedirectToCurrentPage } from '../../../../hooks/useLoginRedirectToCurrentPage'
import { useShareAction } from '../../../../hooks/useShareAction'
import { useLyceumReviews } from '../../../Reviews/hooks/useLyceumReviews'
import { useLyceumSubscriptionActions } from '../hooks/useLyceumSubscriptionActions'
import { useLyceumDetailReviewActions } from '../hooks/useLyceumDetailReviewActions'
import type { LyceumDetailTabKey, OverviewDetail, SideNavItem } from '../types'
import { LyceumDetailDecisionStrip } from './LyceumDetailDecisionStrip'
import { LyceumDetailHeroBand } from './LyceumDetailHeroBand'
import { LyceumDetailSideNav } from './LyceumDetailSideNav'
import { LyceumDetailTabPanels } from './LyceumDetailTabPanels'
import { LyceumDetailTabs } from './LyceumDetailTabs'

type LyceumDetailContentProps = {
  lyceumId: number
  lyceum: LyceumResponse
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
  canViewSubscribers: boolean
  canViewStatistics: boolean
  lyceumName: string
  heroLocation: string
  fallbackValue: string
  overviewDetails: OverviewDetail[]
  mainImage?: LyceumImageResponse
  mainImageUrl: string | null
  galleryImages: LyceumImageResponse[]
  courses?: CourseResponse[]
  isCoursesLoading: boolean
  coursesErrorMessage: string | null
  lecturers?: UserResponse[]
  isLecturersLoading: boolean
  lecturersErrorMessage: string | null
  isLyceumImagesLoading: boolean
  lyceumImagesErrorMessage: string | null
  activeTab: LyceumDetailTabKey
  onSelectTab: (tab: LyceumDetailTabKey) => void
  onOpenSubscribers: () => void
  onOpenLecturerReviews: (lecturer: UserResponse) => void
  t: TFunction
}

export const LyceumDetailContent = ({
  lyceumId,
  lyceum,
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
  canViewSubscribers,
  canViewStatistics,
  lyceumName,
  heroLocation,
  fallbackValue,
  overviewDetails,
  mainImage,
  mainImageUrl,
  galleryImages,
  courses,
  isCoursesLoading,
  coursesErrorMessage,
  lecturers,
  isLecturersLoading,
  lecturersErrorMessage,
  isLyceumImagesLoading,
  lyceumImagesErrorMessage,
  activeTab,
  onSelectTab,
  onOpenSubscribers,
  onOpenLecturerReviews,
  t,
}: LyceumDetailContentProps) => {
  const reviewsQuery = useLyceumReviews(lyceum.id, {
    enabled: Boolean(lyceum.id),
  })
  const reviewsCount = reviewsQuery.data?.length ?? 0
  const {
    isAuthenticated,
    isSubscribed,
    actionError: subscriptionError,
    isPending: isSubscriptionPending,
    onToggleSubscription,
  } = useLyceumSubscriptionActions(lyceumId)
  const redirectToLogin = useLoginRedirectToCurrentPage()
  const { isSharing, onShare } = useShareAction({
    entityType: 'lyceum',
    entityId: lyceum.id,
  })
  const coursesCount = courses?.length ?? 0
  const lecturersCount = lecturers?.length ?? 0
  const locationValue = heroLocation || fallbackValue
  const courseTypeLabels = useMemo(() => {
    const labels = new Set<string>()

    courses?.forEach((course) => {
      if (!course.type) {
        return
      }

      labels.add(
        t(`courses.types.${course.type}`, {
          defaultValue: course.type,
        }),
      )
    })

    return Array.from(labels).slice(0, 4)
  }, [courses, t])
  const { reviewEditorTriggerId, openReviewsTab, openReviewEditor } =
    useLyceumDetailReviewActions({ onSelectTab })
  const subscriptionErrorMessage = subscriptionError
    ? t(subscriptionError.messageKey)
    : null
  const subscriptionTooltip = isSubscribed
    ? null
    : t('pages.lyceums.detail.actions.subscribeTooltip', {
        name: lyceumName,
      })
  const handleOpenReviewAction = useCallback(() => {
    if (!isAuthenticated) {
      redirectToLogin()
      return
    }

    openReviewEditor()
  }, [isAuthenticated, openReviewEditor, redirectToLogin])

  return (
    <div className="relative">
      <LyceumDetailSideNav
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

      <div className="w-full overflow-hidden border border-slate-200 bg-white">
        <div className="flex flex-col lg:h-[calc(100dvh-var(--topnav-height,76px)-2px)] lg:overflow-hidden">
          <LyceumDetailHeroBand
            breadcrumbs={breadcrumbs}
            lyceumName={lyceumName}
            heroLabel={t('pages.lyceums.detail.heroLabel')}
            heroLocation={heroLocation}
            averageRating={lyceum.averageRating ?? null}
            reviewsCount={reviewsCount}
            courseTypeLabels={courseTypeLabels}
            phoneValue={lyceum.phone ?? null}
            emailValue={lyceum.email ?? null}
            fallbackValue={fallbackValue}
            mainImage={mainImage}
            mainImageUrl={mainImageUrl}
            onOpenReviewsTab={openReviewsTab}
            className="min-h-0 flex-1"
            t={t}
          />
          <LyceumDetailDecisionStrip
            coursesCount={coursesCount}
            lecturersCount={lecturersCount}
            locationValue={locationValue}
            isSubscribed={isSubscribed}
            isSubscriptionPending={isSubscriptionPending}
            subscriptionErrorMessage={subscriptionErrorMessage}
            subscriptionTooltip={subscriptionTooltip}
            canViewSubscribers={canViewSubscribers}
            isSharePending={isSharing}
            onSubscriptionAction={() => {
              void onToggleSubscription()
            }}
            onShare={() => {
              void onShare()
            }}
            onOpenSubscribers={onOpenSubscribers}
            onOpenReviews={handleOpenReviewAction}
            t={t}
          />
        </div>
        <LyceumDetailTabs
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          canViewStatistics={canViewStatistics}
          t={t}
        />
        <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
          <LyceumDetailTabPanels
            activeTab={activeTab}
            lyceumId={lyceumId}
            lyceum={lyceum}
            lyceumName={lyceumName}
            heroLocation={heroLocation}
            fallbackValue={fallbackValue}
            overviewDetails={overviewDetails}
            courses={courses}
            isCoursesLoading={isCoursesLoading}
            coursesErrorMessage={coursesErrorMessage}
            galleryImages={galleryImages}
            isLyceumImagesLoading={isLyceumImagesLoading}
            lyceumImagesErrorMessage={lyceumImagesErrorMessage}
            lecturers={lecturers}
            isLecturersLoading={isLecturersLoading}
            lecturersErrorMessage={lecturersErrorMessage}
            canViewStatistics={canViewStatistics}
            onOpenLecturerReviews={onOpenLecturerReviews}
            reviewEditorTriggerId={reviewEditorTriggerId}
            t={t}
          />
        </div>
      </div>
    </div>
  )
}
