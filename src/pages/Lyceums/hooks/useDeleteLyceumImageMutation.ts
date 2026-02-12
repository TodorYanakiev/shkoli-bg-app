import { useMutation } from "@tanstack/react-query";

import { deleteLyceumImage } from "../../../services/lyceums";
import type { ApiError } from "../../../types/api";

type DeleteLyceumImagePayload = {
  lyceumId: number;
  imageId: number;
};

export const deleteLyceumImageMutationKey = [
  "lyceums",
  "images",
  "delete",
] as const;

export const useDeleteLyceumImageMutation = () =>
  useMutation<void, ApiError, DeleteLyceumImagePayload>({
    mutationKey: deleteLyceumImageMutationKey,
    mutationFn: ({ lyceumId, imageId }) => deleteLyceumImage(lyceumId, imageId),
    retry: false,
  });
