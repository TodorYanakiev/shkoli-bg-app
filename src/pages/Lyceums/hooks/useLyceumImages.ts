import { useQuery } from "@tanstack/react-query";

import { getLyceumImages } from "../../../services/lyceums";
import type { ApiError } from "../../../types/api";
import type { LyceumImageResponse } from "../../../types/lyceums";

export const lyceumImagesQueryKey = (id?: number) =>
  ["lyceums", "images", id] as const;

type UseLyceumImagesOptions = {
  enabled?: boolean;
};

export const useLyceumImages = (
  id?: number,
  options: UseLyceumImagesOptions = {},
) =>
  useQuery<LyceumImageResponse[], ApiError>({
    queryKey: lyceumImagesQueryKey(id),
    queryFn: () => getLyceumImages(id as number),
    enabled: Boolean(id) && (options.enabled ?? true),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
