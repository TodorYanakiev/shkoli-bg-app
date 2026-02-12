import type { ApiError } from "../../../../types/api";
import type { AppError } from "../../../../types/appError";

export const isApiError = (value: unknown): value is ApiError =>
  typeof value === "object" &&
  value !== null &&
  "status" in value &&
  "kind" in value;

const mapApiError = (error: ApiError, fallbackKey: string): AppError => {
  if (error.kind === "network") {
    return {
      type: "network",
      status: error.status,
      messageKey: "errors.network",
    };
  }
  if (error.kind === "unauthorized") {
    return {
      type: "auth",
      status: error.status,
      messageKey: "errors.auth.forbidden",
    };
  }
  if (error.kind === "forbidden") {
    return {
      type: "forbidden",
      status: error.status,
      messageKey: "errors.auth.forbidden",
    };
  }
  if (error.status === 404) {
    return {
      type: "notFound",
      status: error.status,
      messageKey: fallbackKey,
    };
  }
  if (error.status >= 500) {
    return {
      type: "server",
      status: error.status,
      messageKey: fallbackKey,
    };
  }
  return {
    type: "unknown",
    status: error.status,
    messageKey: fallbackKey,
  };
};

const toAppError = (
  error: ApiError | null,
  fallbackKey: string,
): AppError | null => (error ? mapApiError(error, fallbackKey) : null);

export const getLyceumLoadError = (error: ApiError | null) =>
  toAppError(error, "pages.lyceums.detail.loadFailed");

export const getLyceumUpdateError = (error: ApiError | null) =>
  toAppError(error, "errors.lyceums.updateFailed");

export const getLyceumImagesError = (error: ApiError | null) =>
  toAppError(error, "pages.lyceums.edit.images.error");

export const getLyceumImageActionError = (error: ApiError | null) =>
  toAppError(error, "errors.generic");
