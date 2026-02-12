import type { LyceumImageRole } from "../../../types/lyceums";

export type LyceumEditSummaryItem = {
  label: string;
  value: string;
};

export type PendingLyceumImageStatus =
  | "idle"
  | "uploading"
  | "uploaded"
  | "error";

export type PendingLyceumImage = {
  id: string;
  role: LyceumImageRole;
  file: File;
  previewUrl: string;
  altText: string;
  width?: number;
  height?: number;
  mimeType?: string;
  status: PendingLyceumImageStatus;
  progress: number;
  error?: string;
};

export type LyceumImageUploadResult = {
  uploadedCount: number;
  failedCount: number;
};

export type LyceumImageDeleteResult = {
  ok: boolean;
  deleted: number;
  errorMessage?: string;
};
