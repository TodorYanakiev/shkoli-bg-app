import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { TFunction } from "i18next";

import { useToast } from "../../../../components/feedback/ToastContext";
import { useLocalizedNavigate } from "../../../../hooks/useLocalizedNavigate";
import type {
  LyceumImageResponse,
  LyceumImageRole,
} from "../../../../types/lyceums";
import { lyceumDetailQueryKey } from "../../hooks/useLyceum";
import { lyceumImagesQueryKey } from "../../hooks/useLyceumImages";
import { useUpdateLyceumMutation } from "../../hooks/useUpdateLyceumMutation";
import { buildLyceumUpdatePayload } from "../services/lyceumEditFormUtils";
import { getLyceumUpdateError } from "../services/lyceumEditErrors";
import type { PendingLyceumImage } from "../types";
import type { AppError } from "../../../../types/appError";
import type { LyceumUpdateFormValues } from "../validations/lyceumUpdateSchema";

type UseLyceumEditSubmitOptions = {
  lyceumId: number;
  isValidId: boolean;
  mainImage: PendingLyceumImage | null;
  mainImages: LyceumImageResponse[];
  uploadLyceumImages: (
    lyceumId: number,
    options?: { skipRoles?: Set<LyceumImageRole> },
  ) => Promise<{ uploadedCount: number; failedCount: number }>;
  deleteExistingImages: (
    lyceumId: number,
    imagesToDelete: LyceumImageResponse[],
  ) => Promise<{ ok: boolean; deleted: number; errorMessage?: string }>;
  markImageError: (id: string, message: string) => void;
  isUploadingImages: boolean;
  t: TFunction;
};

type LyceumEditSubmitState = {
  onSubmit: (values: LyceumUpdateFormValues) => void;
  isSubmitting: boolean;
  submitError: AppError | null;
};

export const useLyceumEditSubmit = ({
  lyceumId,
  isValidId,
  mainImage,
  mainImages,
  uploadLyceumImages,
  deleteExistingImages,
  markImageError,
  isUploadingImages,
  t,
}: UseLyceumEditSubmitOptions): LyceumEditSubmitState => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useLocalizedNavigate();
  const mutation = useUpdateLyceumMutation();

  const onSubmit = useCallback(
    (values: LyceumUpdateFormValues) => {
      if (!isValidId) return;

      const payload = buildLyceumUpdatePayload(values);

      mutation.mutate(
        { id: lyceumId, payload },
        {
          onSuccess: async (data) => {
            queryClient.setQueryData(lyceumDetailQueryKey(lyceumId), data);

            const skipRoles = new Set<LyceumImageRole>();
            let didDeleteImages = false;

            if (mainImage) {
              const deleteResult = await deleteExistingImages(
                lyceumId,
                mainImages,
              );
              if (!deleteResult.ok) {
                const errorMessage =
                  deleteResult.errorMessage ?? t("errors.generic");
                skipRoles.add("MAIN");
                markImageError(mainImage.id, errorMessage);
                showToast({
                  message: errorMessage,
                  tone: "error",
                });
              } else if (deleteResult.deleted > 0) {
                didDeleteImages = true;
              }
            }

            const imageResult = await uploadLyceumImages(lyceumId, {
              skipRoles,
            });
            const hasImageChanges =
              didDeleteImages || imageResult.uploadedCount > 0;

            if (hasImageChanges) {
              queryClient.invalidateQueries({
                queryKey: lyceumImagesQueryKey(lyceumId),
              });
              queryClient.invalidateQueries({
                queryKey: lyceumDetailQueryKey(lyceumId),
              });
            }

            showToast({
              message: t("feedback.lyceums.updateSuccess"),
              tone: "success",
            });

            if (imageResult.failedCount > 0) {
              showToast({
                message: t("errors.lyceums.imagesUploadFailed"),
                tone: "error",
              });
            }

            navigate(`/lyceums/${lyceumId}`, { replace: true });
          },
        },
      );
    },
    [
      isValidId,
      mutation,
      lyceumId,
      queryClient,
      mainImage,
      deleteExistingImages,
      mainImages,
      t,
      markImageError,
      showToast,
      uploadLyceumImages,
      navigate,
    ],
  );

  const submitError = getLyceumUpdateError(mutation.error ?? null);

  return {
    onSubmit,
    isSubmitting: mutation.isPending || isUploadingImages,
    submitError,
  };
};
