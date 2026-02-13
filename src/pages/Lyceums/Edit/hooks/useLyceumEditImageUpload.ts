import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { TFunction } from "i18next";

import { uploadFileToS3 } from "../../../../services/s3";
import type {
  LyceumImageResponse,
  LyceumImageRole,
} from "../../../../types/lyceums";
import { lyceumDetailQueryKey } from "../../hooks/useLyceum";
import { useDeleteLyceumImageMutation } from "../../hooks/useDeleteLyceumImageMutation";
import { lyceumImagesQueryKey } from "../../hooks/useLyceumImages";
import { useRegisterLyceumImageMutation } from "../../hooks/useRegisterLyceumImageMutation";
import { normalizeOptionalText } from "../services/lyceumEditFormUtils";
import {
  getLyceumImageActionError,
  isApiError,
} from "../services/lyceumEditErrors";
import { buildLyceumImageS3Key } from "../services/lyceumEditImageUtils";
import type {
  LyceumImageDeleteResult,
  LyceumImageUploadResult,
  PendingLyceumImage,
} from "../types";

type UseLyceumEditImageUploadOptions = {
  lyceumId: number;
  isValidId: boolean;
  t: TFunction;
  mainImage: PendingLyceumImage | null;
  galleryImages: PendingLyceumImage[];
  updateImageState: (id: string, updates: Partial<PendingLyceumImage>) => void;
};

export const useLyceumEditImageUpload = ({
  lyceumId,
  isValidId,
  t,
  mainImage,
  galleryImages,
  updateImageState,
}: UseLyceumEditImageUploadOptions) => {
  const queryClient = useQueryClient();
  const registerImageMutation = useRegisterLyceumImageMutation();
  const deleteImageMutation = useDeleteLyceumImageMutation();
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const isS3AccessDeniedError = (error: unknown) => {
    if (typeof error !== "object" || error === null) return false;
    const possibleName = (error as { name?: unknown }).name;
    if (possibleName === "AccessDenied") return true;

    const metadata = (error as { $metadata?: unknown }).$metadata;
    if (
      typeof metadata === "object" &&
      metadata !== null &&
      (metadata as { httpStatusCode?: unknown }).httpStatusCode === 403
    ) {
      return true;
    }

    return false;
  };

  const getImageUploadErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
      if (
        error.message === "s3_config_missing" ||
        error.message === "s3_bucket_missing"
      ) {
        return t("errors.lyceums.imageConfigMissing");
      }
    }

    if (isS3AccessDeniedError(error)) {
      return t("errors.lyceums.imageAccessDenied");
    }

    if (isApiError(error)) {
      if (error.status === 409) {
        return t("errors.lyceums.imageDuplicate");
      }
      if (error.kind === "network") {
        return t("errors.network");
      }
      if (error.kind === "unauthorized" || error.kind === "forbidden") {
        return t("errors.auth.forbidden");
      }
    }

    return t("errors.lyceums.imageUploadFailed");
  };

  const uploadLyceumImages = async (
    selectedLyceumId: number,
    options: { skipRoles?: Set<LyceumImageRole> } = {},
  ): Promise<LyceumImageUploadResult> => {
    const { skipRoles } = options;
    const images: PendingLyceumImage[] = [
      ...(mainImage ? [mainImage] : []),
      ...galleryImages,
    ].filter((image) => !skipRoles || !skipRoles.has(image.role));

    if (images.length === 0) {
      return { uploadedCount: 0, failedCount: 0 };
    }

    setIsUploadingImages(true);
    let uploadedCount = 0;
    let failedCount = 0;

    try {
      for (const image of images) {
        updateImageState(image.id, {
          status: "uploading",
          progress: 0,
          error: undefined,
        });

        try {
          const orderIndex =
            image.role === "GALLERY"
              ? galleryImages.findIndex((item) => item.id === image.id)
              : undefined;
          const s3Key = buildLyceumImageS3Key(
            selectedLyceumId,
            image.role,
            image.file.name,
            orderIndex,
          );
          await uploadFileToS3({
            file: image.file,
            key: s3Key,
            onProgress: (progress) => updateImageState(image.id, { progress }),
          });

          await registerImageMutation.mutateAsync({
            lyceumId: selectedLyceumId,
            data: {
              s3Key,
              role: image.role,
              altText: normalizeOptionalText(image.altText),
              width: image.width,
              height: image.height,
              mimeType: image.mimeType,
              orderIndex:
                image.role === "GALLERY" && orderIndex != null
                  ? orderIndex
                  : undefined,
            },
          });

          updateImageState(image.id, {
            status: "uploaded",
            progress: 100,
          });
          uploadedCount += 1;
        } catch (error) {
          updateImageState(image.id, {
            status: "error",
            error: getImageUploadErrorMessage(error),
          });
          failedCount += 1;
        }
      }
    } finally {
      setIsUploadingImages(false);
    }

    return { uploadedCount, failedCount };
  };

  const getDeleteErrorMessage = (error: unknown) => {
    if (isApiError(error)) {
      return getLyceumImageActionError(error)?.messageKey ?? "errors.generic";
    }
    return "errors.generic";
  };

  const deleteExistingImages = async (
    selectedLyceumId: number,
    imagesToDelete: LyceumImageResponse[],
  ): Promise<LyceumImageDeleteResult> => {
    const deletable = imagesToDelete.filter(
      (image): image is LyceumImageResponse & { id: number } =>
        typeof image.id === "number",
    );

    if (deletable.length === 0) {
      return { ok: true, deleted: 0 };
    }

    for (const image of deletable) {
      try {
        await deleteImageMutation.mutateAsync({
          lyceumId: selectedLyceumId,
          imageId: image.id,
        });
      } catch (error) {
        const messageKey = getDeleteErrorMessage(error);
        return {
          ok: false,
          deleted: 0,
          errorMessage: t(messageKey),
        };
      }
    }

    return { ok: true, deleted: deletable.length };
  };

  const handleDeleteExistingImage = (image: LyceumImageResponse) => {
    if (!image.id || !isValidId) return;
    deleteImageMutation.mutate(
      { lyceumId, imageId: image.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: lyceumImagesQueryKey(lyceumId),
          });
          queryClient.invalidateQueries({
            queryKey: lyceumDetailQueryKey(lyceumId),
          });
        },
      },
    );
  };

  const imageActionError = getLyceumImageActionError(
    deleteImageMutation.error ?? null,
  );

  return {
    uploadLyceumImages,
    deleteExistingImages,
    handleDeleteExistingImage,
    isUploadingImages,
    isDeletePending: deleteImageMutation.isPending,
    imageActionError,
  };
};
