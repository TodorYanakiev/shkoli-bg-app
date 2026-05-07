import type { TFunction } from 'i18next'

import type { CourseResponse } from '../../../../types/courses'
import type { LyceumImageResponse, LyceumResponse } from '../../../../types/lyceums'
import type { UserResponse } from '../../../../types/users'
import { LyceumReviewsSection } from '../../../Reviews/components/LyceumReviewsSection'
import type { LyceumDetailTabKey, OverviewDetail } from '../types'
import { LyceumDetailCoursesSection } from './LyceumDetailCoursesSection'
import { LyceumDetailGallerySection } from './LyceumDetailGallerySection'
import { LyceumDetailLecturersSection } from './LyceumDetailLecturersSection'
import { LyceumDetailOverviewTab } from './LyceumDetailOverviewTab'
import { LyceumStatisticsSection } from './LyceumStatisticsSection'

type LyceumDetailTabPanelsProps = {
  activeTab: LyceumDetailTabKey
  lyceumId: number
  lyceum?: LyceumResponse
  lyceumName: string
  heroLocation: string
  fallbackValue: string
  overviewDetails: OverviewDetail[]
  courses?: CourseResponse[]
  isCoursesLoading: boolean
  coursesErrorMessage: string | null
  galleryImages: LyceumImageResponse[]
  isLyceumImagesLoading: boolean
  lyceumImagesErrorMessage: string | null
  lecturers?: UserResponse[]
  isLecturersLoading: boolean
  lecturersErrorMessage: string | null
  canViewStatistics: boolean
  onOpenLecturerReviews: (lecturer: UserResponse) => void
  reviewEditorTriggerId: string
  t: TFunction
}

export const LyceumDetailTabPanels = ({
  activeTab,
  lyceumId,
  lyceum,
  lyceumName,
  heroLocation,
  fallbackValue,
  overviewDetails,
  courses,
  isCoursesLoading,
  coursesErrorMessage,
  galleryImages,
  isLyceumImagesLoading,
  lyceumImagesErrorMessage,
  lecturers,
  isLecturersLoading,
  lecturersErrorMessage,
  canViewStatistics,
  onOpenLecturerReviews,
  reviewEditorTriggerId,
  t,
}: LyceumDetailTabPanelsProps) => (
  <div>
    {activeTab === 'overview' ? (
      <LyceumDetailOverviewTab
        lyceum={lyceum}
        heroLocation={heroLocation}
        fallbackValue={fallbackValue}
        overviewDetails={overviewDetails}
        t={t}
      />
    ) : null}
    {activeTab === 'courses' ? (
      <LyceumDetailCoursesSection
        courses={courses}
        isCoursesLoading={isCoursesLoading}
        coursesErrorMessage={coursesErrorMessage}
        t={t}
      />
    ) : null}
    {activeTab === 'gallery' ? (
      <LyceumDetailGallerySection
        galleryImages={galleryImages}
        lyceumName={lyceumName}
        isImagesLoading={isLyceumImagesLoading}
        imagesErrorMessage={lyceumImagesErrorMessage}
        t={t}
      />
    ) : null}
    {activeTab === 'lecturers' ? (
      <LyceumDetailLecturersSection
        lecturers={lecturers}
        isLecturersLoading={isLecturersLoading}
        lecturersErrorMessage={lecturersErrorMessage}
        fallbackValue={fallbackValue}
        onOpenLecturerReviews={onOpenLecturerReviews}
        t={t}
      />
    ) : null}
    {activeTab === 'statistics' && canViewStatistics ? (
      <LyceumStatisticsSection lyceumId={lyceumId} />
    ) : null}
    {activeTab === 'reviews' ? (
      <div>
        <LyceumReviewsSection
          lyceumId={lyceumId}
          averageRating={lyceum?.averageRating ?? null}
          editorTriggerButtonId={reviewEditorTriggerId}
          className="scroll-mt-24"
        />
      </div>
    ) : null}
  </div>
)
