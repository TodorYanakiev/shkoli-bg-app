import { env } from "../../../../services/env";
import type {
  LyceumImageResponse,
  LyceumImageRole,
} from "../../../../types/lyceums";

export const createImageId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const sanitizeFileName = (fileName: string) =>
  fileName
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "-");

export const buildLyceumImageS3Key = (
  lyceumId: number,
  role: LyceumImageRole,
  fileName: string,
  orderIndex?: number,
) => {
  const prefix = env.s3LyceumAllowedPrefix || "lyceums/";
  const normalizedPrefix = prefix.endsWith("/") ? prefix : `${prefix}/`;
  const safeName = sanitizeFileName(fileName);
  const timestamp = Date.now();
  const indexSuffix =
    role === "GALLERY" && typeof orderIndex === "number"
      ? `-${orderIndex + 1}`
      : "";
  return `${normalizedPrefix}${lyceumId}/${role.toLowerCase()}${indexSuffix}-${timestamp}-${safeName}`;
};

export const loadImageDimensions = (url: string) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.width, height: image.height });
    image.onerror = () => reject(new Error("invalid_image"));
    image.src = url;
  });

export const formatImageSize = (size: number) =>
  `${(size / (1024 * 1024)).toFixed(2)} MB`;

export const getExistingImageKey = (
  image: LyceumImageResponse,
  index: number,
) =>
  image.id ?? image.url ?? image.s3Key ?? `${image.role ?? "image"}-${index}`;
