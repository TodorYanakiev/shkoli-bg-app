import type { TFunction } from 'i18next'

import type {
  CourseResponse,
  CourseScheduleSlot,
  CourseScheduleSpecialCase,
  CourseImageResponse,
} from '../../../../types/courses'
import type { LyceumResponse } from '../../../../types/lyceums'
import type { UserResponse } from '../../../../types/users'
import { CourseReviewsSection } from '../../../Reviews/components/CourseReviewsSection'
import type { CourseDetailTabKey } from '../types'
import { CourseDetailGallerySection } from './CourseDetailGallerySection'
import { CourseDetailLecturersSection } from './CourseDetailLecturersSection'
import { CourseDetailOverviewTab } from './CourseDetailOverviewTab'
import { CourseDetailScheduleSection } from './CourseDetailScheduleSection'

type CourseDetailTabPanelsProps = {
  activeTab: CourseDetailTabKey
  course: CourseResponse
  courseName: string
  courseDescription: string
  normalizedAchievements: string | null
  fallbackValue: string
  locationValue: string
  lyceumId?: number
  lyceum?: LyceumResponse
  isLyceumLoading: boolean
  lyceumErrorMessage: string | null
  scheduleSlots: CourseScheduleSlot[]
  scheduleSpecialCases: CourseScheduleSpecialCase[]
  locale: string
  galleryImages: CourseImageResponse[]
  lecturers?: UserResponse[]
  isLecturersLoading: boolean
  lecturersErrorMessage: string | null
  onOpenLecturerReviews: (lecturer: UserResponse) => void
  onOpenReviewEditor: () => void
  reviewEditorTriggerId: string
  t: TFunction
}

export const CourseDetailTabPanels = ({
  activeTab,
  course,
  courseName,
  courseDescription,
  normalizedAchievements,
  fallbackValue,
  locationValue,
  lyceumId,
  lyceum,
  isLyceumLoading,
  lyceumErrorMessage,
  scheduleSlots,
  scheduleSpecialCases,
  locale,
  galleryImages,
  lecturers,
  isLecturersLoading,
  lecturersErrorMessage,
  onOpenLecturerReviews,
  onOpenReviewEditor,
  reviewEditorTriggerId,
  t,
}: CourseDetailTabPanelsProps) => (
  <div>
    {activeTab === 'overview' ? (
      <CourseDetailOverviewTab
        courseDescription={courseDescription}
        normalizedAchievements={normalizedAchievements}
        fallbackValue={fallbackValue}
        locationValue={locationValue}
        lyceumId={lyceumId}
        lyceum={lyceum}
        isLyceumLoading={isLyceumLoading}
        lyceumErrorMessage={lyceumErrorMessage}
        t={t}
      />
    ) : null}
    {activeTab === 'schedule' ? (
      <CourseDetailScheduleSection
        scheduleSlots={scheduleSlots}
        scheduleSpecialCases={scheduleSpecialCases}
        fallbackValue={fallbackValue}
        locale={locale}
        t={t}
      />
    ) : null}
    {activeTab === 'gallery' ? (
      <CourseDetailGallerySection
        galleryImages={galleryImages}
        courseName={courseName}
        t={t}
      />
    ) : null}
    {activeTab === 'lecturers' ? (
      <CourseDetailLecturersSection
        lecturers={lecturers}
        isLecturersLoading={isLecturersLoading}
        lecturersErrorMessage={lecturersErrorMessage}
        fallbackValue={fallbackValue}
        onOpenLecturerReviews={onOpenLecturerReviews}
        t={t}
      />
    ) : null}
    {activeTab === 'reviews' ? (
      <div className="space-y-5">
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={onOpenReviewEditor}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-brand/35 hover:text-brand"
          >
            {t('pages.shkoli.detail.actions.writeReview')}
          </button>
        </div>
        <CourseReviewsSection
          courseId={course.id}
          averageRating={course.averageRating ?? null}
          hideTitle
          editorTriggerButtonId={reviewEditorTriggerId}
          className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5"
        />
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={onOpenReviewEditor}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-brand/35 hover:text-brand"
          >
            {t('pages.shkoli.detail.actions.writeReview')}
          </button>
        </div>
      </div>
    ) : null}
  </div>
)
