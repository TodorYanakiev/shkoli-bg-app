import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { LyceumDetailCoursesSection } from "./components/LyceumDetailCoursesSection";
import { LyceumDetailGallerySection } from "./components/LyceumDetailGallerySection";
import { LyceumDetailHeader } from "./components/LyceumDetailHeader";
import { LyceumDetailInfoSection } from "./components/LyceumDetailInfoSection";
import { LyceumDetailLecturersSection } from "./components/LyceumDetailLecturersSection";
import { LyceumDetailSideNav } from "./components/LyceumDetailSideNav";
import LyceumLecturerInviteModal from "./components/LyceumLecturerInviteModal";
import LyceumLecturerReviewsModal from "./components/LyceumLecturerReviewsModal";
import { getLyceumDetailSideNavItems } from "./components/lyceumDetailSideNavItems";
import { useLyceumDetailCarousels } from "./hooks/useLyceumDetailCarousels";
import { useLyceumDetailData } from "./hooks/useLyceumDetailData";
import { useLyceumDetailLayout } from "./hooks/useLyceumDetailLayout";
import { useLyceumLecturerReviewsModal } from "./hooks/useLyceumLecturerReviewsModal";
import { useLyceumDetailView } from "./hooks/useLyceumDetailView";
import { useLyceumInviteModal } from "./hooks/useLyceumInviteModal";
import { LyceumReviewsSection } from "../../Reviews/components/LyceumReviewsSection";

const LyceumDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const lyceumId = Number(id);
  const isValidId = Number.isFinite(lyceumId);

  const {
    lyceum,
    courses,
    lecturers,
    lyceumImages,
    courseLecturersById,
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
  } = useLyceumDetailData({ lyceumId, isValidId });

  const {
    fallbackValue,
    lyceumName,
    heroLocation,
    pageTitle,
    overviewDetails,
    mainImage,
    mainImageUrl,
    galleryImages,
  } = useLyceumDetailView({ lyceum, lyceumImages, t });

  const coursesCount = courses?.length ?? 0;
  const lecturersCount = lecturers?.length ?? 0;
  const galleryCount = galleryImages.length;
  const { coursesCarousel, lecturersCarousel } = useLyceumDetailCarousels({
    coursesCount,
    lecturersCount,
  });

  const {
    inviteModalId,
    isInviteModalOpen,
    openInviteModal,
    closeInviteModal,
  } = useLyceumInviteModal({ canInviteLecturer });
  const {
    selectedLecturer,
    isOpen: isLecturerReviewsModalOpen,
    openModal: openLecturerReviewsModal,
    closeModal: closeLecturerReviewsModal,
  } = useLyceumLecturerReviewsModal();

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
  } = useLyceumDetailLayout({ hasLyceum: Boolean(lyceum) });

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
  );

  const title = lyceum?.name ?? t("pages.lyceums.detail.title");
  const subtitle = heroLocation || t("pages.lyceums.detail.subtitle");
  const lyceumErrorMessage = lyceumError ? t(lyceumError.messageKey) : null;
  const coursesErrorMessage = coursesError ? t(coursesError.messageKey) : null;
  const lecturersErrorMessage = lecturersError
    ? t(lecturersError.messageKey)
    : null;
  const lyceumImagesErrorMessage = lyceumImagesError
    ? t(lyceumImagesError.messageKey)
    : null;

  return (
    <section className="space-y-6 -mt-8 sm:mt-0">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <LyceumDetailHeader
        title={title}
        subtitle={subtitle}
        averageRating={lyceum?.averageRating ?? null}
        t={t}
      />
      {!isValidId ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
          role="alert"
        >
          {t("pages.lyceums.detail.invalidId")}
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />
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
          {t("pages.lyceums.detail.notFound")}
        </div>
      ) : (
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
          <div className="space-y-6">
            <LyceumDetailInfoSection
              title={title}
              heroLocation={heroLocation}
              fallbackValue={fallbackValue}
              averageRating={lyceum.averageRating ?? null}
              coursesCount={coursesCount}
              lecturersCount={lecturersCount}
              galleryCount={galleryCount}
              overviewDetails={overviewDetails}
              mainImage={mainImage}
              mainImageUrl={mainImageUrl}
              isImagesLoading={isLyceumImagesLoading}
              t={t}
            />
            <LyceumDetailGallerySection
              galleryImages={galleryImages}
              lyceumName={lyceumName}
              isImagesLoading={isLyceumImagesLoading}
              imagesErrorMessage={lyceumImagesErrorMessage}
              t={t}
            />
            <LyceumDetailCoursesSection
              courses={courses}
              coursesCount={coursesCount}
              isCoursesLoading={isCoursesLoading}
              coursesErrorMessage={coursesErrorMessage}
              courseLecturersById={courseLecturersById}
              fallbackValue={fallbackValue}
              carousel={coursesCarousel}
              t={t}
            />
            <LyceumReviewsSection
              lyceumId={lyceumId}
              averageRating={lyceum.averageRating ?? null}
            />
            <LyceumDetailLecturersSection
              lecturers={lecturers}
              lecturersCount={lecturersCount}
              isLecturersLoading={isLecturersLoading}
              lecturersErrorMessage={lecturersErrorMessage}
              fallbackValue={fallbackValue}
              carousel={lecturersCarousel}
              onOpenLecturerReviews={openLecturerReviewsModal}
              t={t}
            />
          </div>
        </div>
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
  );
};

export default LyceumDetailPage;
