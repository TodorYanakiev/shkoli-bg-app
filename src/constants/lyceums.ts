export const LYCEUM_TOWNS = [
  "БУРГАС",
  "ВАРНА",
  "ПЛОВДИВ",
  "СОФИЯ",
] as const;

export type LyceumTown = (typeof LYCEUM_TOWNS)[number];

export const LYCEUM_IMAGE_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const LYCEUM_IMAGE_MAX_SIZE_MB = 5;

export const LYCEUM_IMAGE_MAX_SIZE_BYTES =
  LYCEUM_IMAGE_MAX_SIZE_MB * 1024 * 1024;
