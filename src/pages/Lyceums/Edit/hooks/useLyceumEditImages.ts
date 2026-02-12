import { useMemo } from "react";
import type { TFunction } from "i18next";

import { LYCEUM_IMAGE_ALLOWED_MIME_TYPES } from "../../../../constants/lyceums";
import { useLyceumEditImageSelection } from "./useLyceumEditImageSelection";
import { useLyceumEditImageState } from "./useLyceumEditImageState";
import { useLyceumEditImageUpload } from "./useLyceumEditImageUpload";

type UseLyceumEditImagesOptions = {
  lyceumId: number;
  isValidId: boolean;
  t: TFunction;
};

export const useLyceumEditImages = ({
  lyceumId,
  isValidId,
  t,
}: UseLyceumEditImagesOptions) => {
  const imageState = useLyceumEditImageState();
  const allowedImageTypesLabel = useMemo(
    () =>
      LYCEUM_IMAGE_ALLOWED_MIME_TYPES.map((type) =>
        type.replace("image/", "").toUpperCase(),
      ).join(", "),
    [],
  );

  const { handleMainImageSelect, handleGallerySelect } =
    useLyceumEditImageSelection({
      t,
      allowedImageTypesLabel,
      replaceMainImage: imageState.replaceMainImage,
      addGalleryImages: imageState.addGalleryImages,
      setMainImageError: imageState.setMainImageError,
      setGalleryImageError: imageState.setGalleryImageError,
    });

  const {
    uploadLyceumImages,
    deleteExistingImages,
    handleDeleteExistingImage,
    isUploadingImages,
    isDeletePending,
    imageActionError,
  } = useLyceumEditImageUpload({
    lyceumId,
    isValidId,
    t,
    mainImage: imageState.mainImage,
    galleryImages: imageState.galleryImages,
    updateImageState: imageState.updateImageState,
  });

  return {
    mainImage: imageState.mainImage,
    galleryImages: imageState.galleryImages,
    mainImageError: imageState.mainImageError,
    galleryImageError: imageState.galleryImageError,
    allowedImageTypesLabel,
    isUploadingImages,
    isDeletePending,
    imageActionError,
    handleMainImageSelect,
    handleGallerySelect,
    removeMainImage: imageState.removeMainImage,
    removeGalleryImage: imageState.removeGalleryImage,
    updateMainAltText: imageState.updateMainAltText,
    updateGalleryAltText: imageState.updateGalleryAltText,
    uploadLyceumImages,
    deleteExistingImages,
    handleDeleteExistingImage,
    markImageError: imageState.markImageError,
  };
};
