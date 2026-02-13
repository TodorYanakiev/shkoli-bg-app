import { useMemo } from "react";

import { useUserProfile } from "../../../Profile/hooks/useUserProfile";
import { useLyceum } from "../../hooks/useLyceum";
import { useLyceumImages } from "../../hooks/useLyceumImages";
import { getLyceumLoadError } from "../services/lyceumEditErrors";
import type { AppError } from "../../../../types/appError";
import type { ApiError } from "../../../../types/api";
import type {
  LyceumImageResponse,
  LyceumResponse,
} from "../../../../types/lyceums";

type UseLyceumEditDataOptions = {
  lyceumId: number;
  isValidId: boolean;
};

type LyceumEditData = {
  lyceum?: LyceumResponse;
  hasEditAccess: boolean;
  lyceumImages: LyceumImageResponse[];
  mainImages: LyceumImageResponse[];
  existingGalleryImages: LyceumImageResponse[];
  isLoading: boolean;
  isImagesLoading: boolean;
  loadError: AppError | null;
  imagesError: ApiError | null;
};

export const useLyceumEditData = ({
  lyceumId,
  isValidId,
}: UseLyceumEditDataOptions): LyceumEditData => {
  const {
    data: lyceum,
    isLoading: isLyceumLoading,
    error: lyceumError,
  } = useLyceum(lyceumId, { enabled: isValidId });
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useUserProfile();

  const hasEditAccess =
    user?.role === "ADMIN" || user?.administratedLyceumId === lyceumId;

  const {
    data: lyceumImages = [],
    isLoading: isImagesLoading,
    error: imagesError,
  } = useLyceumImages(lyceumId, {
    enabled: isValidId && hasEditAccess,
  });

  const { mainImages, existingGalleryImages } = useMemo(() => {
    const main = lyceumImages.filter((image) => image.role === "MAIN");
    const gallery = [...lyceumImages]
      .filter((image) => image.role === "GALLERY")
      .sort(
        (a, b) =>
          (a.orderIndex ?? Number.MAX_SAFE_INTEGER) -
          (b.orderIndex ?? Number.MAX_SAFE_INTEGER),
      );

    return {
      mainImages: main,
      existingGalleryImages: gallery,
    };
  }, [lyceumImages]);

  const isLoading = isLyceumLoading || isUserLoading;
  const loadError = getLyceumLoadError(lyceumError ?? userError ?? null);

  return {
    lyceum,
    hasEditAccess,
    lyceumImages,
    mainImages,
    existingGalleryImages,
    isLoading,
    isImagesLoading,
    loadError,
    imagesError: imagesError ?? null,
  };
};
