import type { TFunction } from "i18next";

import type { PendingLyceumImage } from "../types";

export const getPendingImageStatusLabel = (
  pendingImage: PendingLyceumImage,
  t: TFunction,
) => {
  if (pendingImage.status === "uploading") {
    return t("pages.lyceums.edit.images.status.progress", {
      progress: pendingImage.progress,
    });
  }
  if (pendingImage.status === "uploaded") {
    return t("pages.lyceums.edit.images.status.uploaded");
  }
  if (pendingImage.status === "error") {
    return pendingImage.error ?? t("pages.lyceums.edit.images.status.error");
  }
  return t("pages.lyceums.edit.images.status.pending");
};

export const getPendingImageStatusClassName = (
  pendingImage: PendingLyceumImage,
) => {
  if (pendingImage.status === "error") return "text-rose-600";
  if (pendingImage.status === "uploaded") return "text-emerald-600";
  return "text-slate-500";
};
