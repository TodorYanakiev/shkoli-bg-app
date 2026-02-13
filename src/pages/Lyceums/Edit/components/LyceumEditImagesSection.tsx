import type { TFunction } from "i18next";
import type { ChangeEvent } from "react";

import type { LyceumImageResponse } from "../../../../types/lyceums";
import { LyceumEditExistingImages } from "./LyceumEditExistingImages";
import { LyceumEditFormSection } from "./LyceumEditFormSection";
import { LyceumEditUploadImages } from "./LyceumEditUploadImages";
import type { PendingLyceumImage } from "../types";

type LyceumEditImagesSectionProps = {
  lyceumImages: LyceumImageResponse[];
  mainImages: LyceumImageResponse[];
  existingGalleryImages: LyceumImageResponse[];
  isImagesLoading: boolean;
  imagesErrorMessage: string | null;
  imageActionErrorMessage: string | null;
  isDeletePending: boolean;
  isSubmitting: boolean;
  onDeleteExistingImage: (image: LyceumImageResponse) => void;
  allowedImageTypesLabel: string;
  mainImage: PendingLyceumImage | null;
  galleryImages: PendingLyceumImage[];
  mainImageError: string | null;
  galleryImageError: string | null;
  onMainImageSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  onGallerySelect: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveMainImage: () => void;
  onRemoveGalleryImage: (id: string) => void;
  onUpdateMainAltText: (value: string) => void;
  onUpdateGalleryAltText: (id: string, value: string) => void;
  t: TFunction;
};

export const LyceumEditImagesSection = ({
  lyceumImages,
  mainImages,
  existingGalleryImages,
  isImagesLoading,
  imagesErrorMessage,
  imageActionErrorMessage,
  isDeletePending,
  isSubmitting,
  onDeleteExistingImage,
  allowedImageTypesLabel,
  mainImage,
  galleryImages,
  mainImageError,
  galleryImageError,
  onMainImageSelect,
  onGallerySelect,
  onRemoveMainImage,
  onRemoveGalleryImage,
  onUpdateMainAltText,
  onUpdateGalleryAltText,
  t,
}: LyceumEditImagesSectionProps) => (
  <LyceumEditFormSection title={t("pages.lyceums.edit.images.title")}>
    <LyceumEditExistingImages
      lyceumImages={lyceumImages}
      mainImages={mainImages}
      existingGalleryImages={existingGalleryImages}
      isImagesLoading={isImagesLoading}
      imagesErrorMessage={imagesErrorMessage}
      isDeletePending={isDeletePending}
      isSubmitting={isSubmitting}
      onDeleteExistingImage={onDeleteExistingImage}
      t={t}
    />
    {imageActionErrorMessage ? (
      <p className="mt-3 text-sm text-rose-600">{imageActionErrorMessage}</p>
    ) : null}
    <LyceumEditUploadImages
      allowedImageTypesLabel={allowedImageTypesLabel}
      mainImage={mainImage}
      galleryImages={galleryImages}
      mainImageError={mainImageError}
      galleryImageError={galleryImageError}
      onMainImageSelect={onMainImageSelect}
      onGallerySelect={onGallerySelect}
      onRemoveMainImage={onRemoveMainImage}
      onRemoveGalleryImage={onRemoveGalleryImage}
      onUpdateMainAltText={onUpdateMainAltText}
      onUpdateGalleryAltText={onUpdateGalleryAltText}
      isSubmitting={isSubmitting}
      t={t}
    />
  </LyceumEditFormSection>
);
