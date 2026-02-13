import { useMutation } from "@tanstack/react-query";

import { registerLyceumImage } from "../../../services/lyceums";
import type { ApiError } from "../../../types/api";
import type {
  LyceumImageRequest,
  LyceumImageResponse,
} from "../../../types/lyceums";

type RegisterLyceumImagePayload = {
  lyceumId: number;
  data: LyceumImageRequest;
};

export const registerLyceumImageMutationKey = [
  "lyceums",
  "images",
  "register",
] as const;

export const useRegisterLyceumImageMutation = () =>
  useMutation<LyceumImageResponse, ApiError, RegisterLyceumImagePayload>({
    mutationKey: registerLyceumImageMutationKey,
    mutationFn: ({ lyceumId, data }) => registerLyceumImage(lyceumId, data),
    retry: false,
  });
