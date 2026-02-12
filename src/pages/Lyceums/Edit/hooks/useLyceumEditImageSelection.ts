import type { ChangeEvent } from "react";
import type { TFunction } from "i18next";

import {
  LYCEUM_IMAGE_ALLOWED_MIME_TYPES,
  LYCEUM_IMAGE_MAX_SIZE_BYTES,
  LYCEUM_IMAGE_MAX_SIZE_MB,
} from "../../../../constants/lyceums";
import {
  createImageId,
  loadImageDimensions,
} from "../services/lyceumEditImageUtils";
import type { PendingLyceumImage } from "../types";

type UseLyceumEditImageSelectionOptions = {
  t: TFunction;
  allowedImageTypesLabel: string;
  replaceMainImage: (image: PendingLyceumImage | null) => void;
  addGalleryImages: (images: PendingLyceumImage[]) => void;
  setMainImageError: (message: string | null) => void;
  setGalleryImageError: (message: string | null) => void;
};

const validateImageFile = (
  file: File,
  t: TFunction,
  allowedImageTypesLabel: string,
) => {
  if (
    !LYCEUM_IMAGE_ALLOWED_MIME_TYPES.includes(
      file.type as (typeof LYCEUM_IMAGE_ALLOWED_MIME_TYPES)[number],
    )
  ) {
    return t("validation.imageType", {
      formats: allowedImageTypesLabel,
    });
  }
  if (file.size > LYCEUM_IMAGE_MAX_SIZE_BYTES) {
    return t("validation.imageSize", {
      size: LYCEUM_IMAGE_MAX_SIZE_MB,
    });
  }
  return null;
};

const createPendingImage = async (
  file: File,
  role: "MAIN" | "GALLERY",
): Promise<PendingLyceumImage> => {
  const previewUrl = URL.createObjectURL(file);
  try {
    const { width, height } = await loadImageDimensions(previewUrl);
    return {
      id: createImageId(),
      role,
      file,
      previewUrl,
      altText: "",
      width,
      height,
      mimeType: file.type,
      status: "idle",
      progress: 0,
    };
  } catch (error) {
    URL.revokeObjectURL(previewUrl);
    throw error;
  }
};

export const useLyceumEditImageSelection = ({
  t,
  allowedImageTypesLabel,
  replaceMainImage,
  addGalleryImages,
  setMainImageError,
  setGalleryImageError,
}: UseLyceumEditImageSelectionOptions) => {
  const handleMainImageSelect = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const errorMessage = validateImageFile(file, t, allowedImageTypesLabel);
    if (errorMessage) {
      setMainImageError(errorMessage);
      return;
    }

    try {
      const pendingImage = await createPendingImage(file, "MAIN");
      replaceMainImage(pendingImage);
      setMainImageError(null);
    } catch {
      setMainImageError(t("pages.lyceums.edit.images.loadError"));
    }
  };

  const handleGallerySelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    const validFiles = files.filter((file) => {
      const errorMessage = validateImageFile(file, t, allowedImageTypesLabel);
      if (errorMessage) {
        setGalleryImageError(errorMessage);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    try {
      const pendingImages = await Promise.all(
        validFiles.map((file) => createPendingImage(file, "GALLERY")),
      );
      addGalleryImages(pendingImages);
      setGalleryImageError(null);
    } catch {
      setGalleryImageError(t("pages.lyceums.edit.images.loadError"));
    }
  };

  return {
    handleMainImageSelect,
    handleGallerySelect,
  };
};
