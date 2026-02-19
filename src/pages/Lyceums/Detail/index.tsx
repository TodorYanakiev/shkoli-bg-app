import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { LyceumDetailContent } from './components/LyceumDetailContent'
import { getLyceumDetailSideNavItems } from './components/lyceumDetailSideNavItems'
import LyceumLecturerInviteModal from './components/LyceumLecturerInviteModal'
import LyceumLecturerReviewsModal from './components/LyceumLecturerReviewsModal'
import { useLyceumDetailData } from './hooks/useLyceumDetailData'
import { useLyceumDetailLayout } from './hooks/useLyceumDetailLayout'
import { useLyceumDetailTabs } from './hooks/useLyceumDetailTabs'
import { useLyceumDetailView } from './hooks/useLyceumDetailView'
import { useLyceumInviteModal } from './hooks/useLyceumInviteModal'
import { useLyceumLecturerReviewsModal } from './hooks/useLyceumLecturerReviewsModal'
import { useShkoliPageBackground } from '../../Shkoli/hooks/useShkoliPageBackground'

const LyceumDetailPage = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const lyceumId = Number(id)
  const isValidId = Number.isFinite(lyceumId)

  const {
    lyceum,
    courses,
    lecturers,
    lyceumImages,
    lyceumError,
    coursesError,
    lecturersError,
    lyceumImagesError,
    isLoading,
    isCoursesLoading,
    isLecturersLoading,
    isLyceumImagesLoading,
    canEditLyceum,
    canAddCourse,
    canInviteLecturer,
  } = useLyceumDetailData({ lyceumId, isValidId })

  const {
    fallbackValue,
    lyceumName,
    heroLocation,
    pageTitle,
    overviewDetails,
    mainImage,
    mainImageUrl,
    galleryImages,
  } = useLyceumDetailView({ lyceum, lyceumImages, t })
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
  } = useLyceumDetailLayout({ hasLyceum: Boolean(lyceum) })
  const { activeTab, onSelectTab } = useLyceumDetailTabs()
  const {
    inviteModalId,
    isInviteModalOpen,
    openInviteModal,
    closeInviteModal,
  } = useLyceumInviteModal({ canInviteLecturer })
  const {
    selectedLecturer,
    isOpen: isLecturerReviewsModalOpen,
    openModal: openLecturerReviewsModal,
    closeModal: closeLecturerReviewsModal,
  } = useLyceumLecturerReviewsModal()

  const sideNavItems = useMemo(
    () =>
      getLyceumDetailSideNavItems({
        t,
        lyceumId,
        canAddCourse,
        canInviteLecturer,
        canEditLyceum,
        navIconClassName,
        inviteModalId,
        onInviteLecturer: openInviteModal,
      }),
    [
      t,
      lyceumId,
      canAddCourse,
      canInviteLecturer,
      canEditLyceum,
      navIconClassName,
      inviteModalId,
      openInviteModal,
    ],
  )

  const lyceumErrorMessage = lyceumError ? t(lyceumError.messageKey) : null
  const coursesErrorMessage = coursesError ? t(coursesError.messageKey) : null
  const lecturersErrorMessage = lecturersError
    ? t(lecturersError.messageKey)
    : null
  const lyceumImagesErrorMessage = lyceumImagesError
    ? t(lyceumImagesError.messageKey)
    : null

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
          {t('pages.lyceums.detail.invalidId')}
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          <div className="h-48 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-16 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-60 animate-pulse rounded-2xl bg-slate-200" />
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
            {t('pages.lyceums.detail.loadFailed')}
          </div>
        </div>
      ) : lyceumErrorMessage ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
          role="alert"
        >
          {lyceumErrorMessage}
        </div>
      ) : !lyceum ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          {t('pages.lyceums.detail.notFound')}
        </div>
      ) : (
        <LyceumDetailContent
          lyceumId={lyceumId}
          lyceum={lyceum}
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
          lyceumName={lyceumName}
          heroLocation={heroLocation}
          fallbackValue={fallbackValue}
          overviewDetails={overviewDetails}
          mainImage={mainImage}
          mainImageUrl={mainImageUrl}
          galleryImages={galleryImages}
          courses={courses}
          isCoursesLoading={isCoursesLoading}
          coursesErrorMessage={coursesErrorMessage}
          lecturers={lecturers}
          isLecturersLoading={isLecturersLoading}
          lecturersErrorMessage={lecturersErrorMessage}
          isLyceumImagesLoading={isLyceumImagesLoading}
          lyceumImagesErrorMessage={lyceumImagesErrorMessage}
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          onOpenLecturerReviews={openLecturerReviewsModal}
          t={t}
        />
      )}
      {isInviteModalOpen && canInviteLecturer && isValidId ? (
        <LyceumLecturerInviteModal
          lyceumId={lyceumId}
          modalId={inviteModalId}
          onClose={closeInviteModal}
        />
      ) : null}
      {isLecturerReviewsModalOpen && selectedLecturer && isValidId ? (
        <LyceumLecturerReviewsModal
          lecturer={selectedLecturer}
          lyceumId={lyceumId}
          onClose={closeLecturerReviewsModal}
        />
      ) : null}
    </section>
  )
}

export default LyceumDetailPage
