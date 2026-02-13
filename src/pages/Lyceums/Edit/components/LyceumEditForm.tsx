import type { TFunction } from "i18next";
import type { ChangeEvent } from "react";
import type { UseFormReturn } from "react-hook-form";

import type { LyceumImageResponse } from "../../../../types/lyceums";
import type { LyceumUpdateFormValues } from "../validations/lyceumUpdateSchema";
import { LyceumEditBasicsSection } from "./LyceumEditBasicsSection";
import { LyceumEditContactsSection } from "./LyceumEditContactsSection";
import { LyceumEditFormActions } from "./LyceumEditFormActions";
import { LyceumEditImagesSection } from "./LyceumEditImagesSection";
import { LyceumEditLeadershipSection } from "./LyceumEditLeadershipSection";
import { LyceumEditLinksSection } from "./LyceumEditLinksSection";
import { LyceumEditLocationSection } from "./LyceumEditLocationSection";
import type { PendingLyceumImage } from "../types";

type LyceumEditFormProps = {
  form: UseFormReturn<LyceumUpdateFormValues>;
  onSubmit: (values: LyceumUpdateFormValues) => void;
  isSubmitting: boolean;
  updateErrorMessage: string | null;
  lyceumId: number;
  lyceumImages: LyceumImageResponse[];
  mainImages: LyceumImageResponse[];
  existingGalleryImages: LyceumImageResponse[];
  isImagesLoading: boolean;
  imagesErrorMessage: string | null;
  imageActionErrorMessage: string | null;
  isDeletePending: boolean;
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

export const LyceumEditForm = ({
  form,
  onSubmit,
  isSubmitting,
  updateErrorMessage,
  lyceumId,
  lyceumImages,
  mainImages,
  existingGalleryImages,
  isImagesLoading,
  imagesErrorMessage,
  imageActionErrorMessage,
  isDeletePending,
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
}: LyceumEditFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-6 rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6 lg:p-8"
      aria-busy={isSubmitting}
    >
      <LyceumEditBasicsSection register={register} errors={errors} t={t} />
      <LyceumEditLocationSection register={register} errors={errors} t={t} />
      <LyceumEditContactsSection register={register} errors={errors} t={t} />
      <LyceumEditLinksSection register={register} errors={errors} t={t} />
      <LyceumEditLeadershipSection register={register} errors={errors} t={t} />
      <LyceumEditImagesSection
        lyceumImages={lyceumImages}
        mainImages={mainImages}
        existingGalleryImages={existingGalleryImages}
        isImagesLoading={isImagesLoading}
        imagesErrorMessage={imagesErrorMessage}
        imageActionErrorMessage={imageActionErrorMessage}
        isDeletePending={isDeletePending}
        isSubmitting={isSubmitting}
        onDeleteExistingImage={onDeleteExistingImage}
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
        t={t}
      />
      {updateErrorMessage ? (
        <div
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
          role="alert"
        >
          {updateErrorMessage}
        </div>
      ) : null}
      <LyceumEditFormActions
        lyceumId={lyceumId}
        isSubmitting={isSubmitting}
        t={t}
      />
    </form>
  );
};
