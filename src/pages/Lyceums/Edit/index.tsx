import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import SeoHead from "../../../components/ui/SeoHead";
import { useCurrentLocale } from "../../../hooks/useCurrentLocale";
import LyceumLecturerManager from "./components/LyceumLecturerManager";
import { LyceumEditForm } from "./components/LyceumEditForm";
import { LyceumEditHeader } from "./components/LyceumEditHeader";
import { useLyceumEditData } from "./hooks/useLyceumEditData";
import { useLyceumEditForm } from "./hooks/useLyceumEditForm";
import { useLyceumEditImages } from "./hooks/useLyceumEditImages";
import { useLyceumEditSubmit } from "./hooks/useLyceumEditSubmit";
import { useLyceumEditView } from "./hooks/useLyceumEditView";
import { getLyceumImagesError } from "./services/lyceumEditErrors";

const LyceumEditPage = () => {
  const { t } = useTranslation();
  const locale = useCurrentLocale();
  const { id } = useParams<{ id: string }>();
  const lyceumId = Number(id);
  const isValidId = Number.isFinite(lyceumId);

  const {
    lyceum,
    hasEditAccess,
    lyceumImages,
    mainImages,
    existingGalleryImages,
    isLoading,
    isImagesLoading,
    loadError,
    imagesError,
  } = useLyceumEditData({ lyceumId, isValidId });
  const { pageTitle, summaryItems } = useLyceumEditView({
    lyceum,
    hasEditAccess,
    t,
  });
  const { form } = useLyceumEditForm({ lyceum, t });
  const {
    mainImage,
    galleryImages,
    mainImageError,
    galleryImageError,
    allowedImageTypesLabel,
    isUploadingImages,
    isDeletePending,
    imageActionError,
    handleMainImageSelect,
    handleGallerySelect,
    removeMainImage,
    removeGalleryImage,
    updateMainAltText,
    updateGalleryAltText,
    uploadLyceumImages,
    deleteExistingImages,
    handleDeleteExistingImage,
    markImageError,
  } = useLyceumEditImages({ lyceumId, isValidId, t });
  const { onSubmit, isSubmitting, submitError } = useLyceumEditSubmit({
    lyceumId,
    isValidId,
    mainImage,
    mainImages,
    uploadLyceumImages,
    deleteExistingImages,
    markImageError,
    isUploadingImages,
    t,
  });

  const loadErrorMessage = loadError ? t(loadError.messageKey) : null;
  const imagesErrorState = getLyceumImagesError(imagesError);
  const imagesErrorMessage = imagesErrorState
    ? t(imagesErrorState.messageKey)
    : null;
  const imageActionErrorMessage = imageActionError
    ? t(imageActionError.messageKey)
    : null;
  const updateErrorMessage = submitError ? t(submitError.messageKey) : null;
  const backLink = isValidId ? `/lyceums/${lyceumId}` : "/lyceums";
  const badgeLabel = lyceum?.name ?? null;

  return (
    <section className="relative space-y-6 pb-10">
      <SeoHead
        title={pageTitle}
        description={t("pages.lyceums.edit.subtitle")}
        canonicalPath={isValidId ? `/lyceums/${lyceumId}/edit` : "/lyceums"}
        locale={locale}
        forceNoindex
      />
      <div className="pointer-events-none absolute -top-10 right-8 h-28 w-28 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute left-0 top-16 h-24 w-24 rounded-full bg-emerald-200/40 blur-3xl" />
      <LyceumEditHeader
        backLink={backLink}
        title={t("pages.lyceums.edit.title")}
        subtitle={t("pages.lyceums.edit.subtitle")}
        badgeLabel={badgeLabel ?? undefined}
        summaryItems={summaryItems}
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
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          {t("pages.lyceums.edit.loading")}
        </div>
      ) : loadErrorMessage ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
          role="alert"
        >
          {loadErrorMessage}
        </div>
      ) : !lyceum ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          {t("pages.lyceums.edit.notFound")}
        </div>
      ) : !hasEditAccess ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
          role="alert"
        >
          {t("errors.auth.forbidden")}
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-start">
          <LyceumEditForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            updateErrorMessage={updateErrorMessage}
            lyceumId={lyceumId}
            lyceumImages={lyceumImages}
            mainImages={mainImages}
            existingGalleryImages={existingGalleryImages}
            isImagesLoading={isImagesLoading}
            imagesErrorMessage={imagesErrorMessage}
            imageActionErrorMessage={imageActionErrorMessage}
            isDeletePending={isDeletePending}
            onDeleteExistingImage={handleDeleteExistingImage}
            allowedImageTypesLabel={allowedImageTypesLabel}
            mainImage={mainImage}
            galleryImages={galleryImages}
            mainImageError={mainImageError}
            galleryImageError={galleryImageError}
            onMainImageSelect={handleMainImageSelect}
            onGallerySelect={handleGallerySelect}
            onRemoveMainImage={removeMainImage}
            onRemoveGalleryImage={removeGalleryImage}
            onUpdateMainAltText={updateMainAltText}
            onUpdateGalleryAltText={updateGalleryAltText}
            t={t}
          />
          <div className="lg:sticky lg:top-24">
            <LyceumLecturerManager lyceumId={lyceumId} />
          </div>
        </div>
      )}
    </section>
  );
};

export default LyceumEditPage;
