import type { TFunction } from "i18next";
import type { ChangeEvent } from "react";

import { LYCEUM_IMAGE_MAX_SIZE_MB } from "../../../../constants/lyceums";
import type { PendingLyceumImage } from "../types";
import { LyceumEditGalleryUpload } from "./LyceumEditGalleryUpload";
import { LyceumEditMainImageUploadCard } from "./LyceumEditMainImageUploadCard";

type LyceumEditUploadImagesProps = {
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
  isSubmitting: boolean;
  t: TFunction;
};

export const LyceumEditUploadImages = ({
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
  isSubmitting,
  t,
}: LyceumEditUploadImagesProps) => (
  <div className="mt-6">
    <p className="text-sm text-slate-600">
      {t("pages.lyceums.edit.images.helper", {
        size: LYCEUM_IMAGE_MAX_SIZE_MB,
        formats: allowedImageTypesLabel,
      })}
    </p>
    <div className="pt-2">
      <LyceumEditMainImageUploadCard
        label={t("pages.lyceums.edit.images.mainLabel")}
        image={mainImage}
        error={mainImageError}
        isSubmitting={isSubmitting}
        onSelect={onMainImageSelect}
        onRemove={onRemoveMainImage}
        onAltTextChange={onUpdateMainAltText}
        t={t}
      />
    </div>
    <LyceumEditGalleryUpload
      galleryImages={galleryImages}
      galleryImageError={galleryImageError}
      onGallerySelect={onGallerySelect}
      onRemoveGalleryImage={onRemoveGalleryImage}
      onUpdateGalleryAltText={onUpdateGalleryAltText}
      isSubmitting={isSubmitting}
      t={t}
    />
  </div>
);
