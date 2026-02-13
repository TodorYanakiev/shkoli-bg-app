import type { TFunction } from "i18next";
import type { ChangeEvent } from "react";

import { LYCEUM_IMAGE_ALLOWED_MIME_TYPES } from "../../../../constants/lyceums";
import { getInputClassName } from "./lyceumEditFormStyles";
import { formatImageSize } from "../services/lyceumEditImageUtils";
import {
  getPendingImageStatusClassName,
  getPendingImageStatusLabel,
} from "../services/lyceumEditImageStatus";
import type { PendingLyceumImage } from "../types";

type LyceumEditMainImageUploadCardProps = {
  label: string;
  image: PendingLyceumImage | null;
  error: string | null;
  isSubmitting: boolean;
  onSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  onAltTextChange: (value: string) => void;
  t: TFunction;
};

export const LyceumEditMainImageUploadCard = ({
  label,
  image,
  error,
  isSubmitting,
  onSelect,
  onRemove,
  onAltTextChange,
  t,
}: LyceumEditMainImageUploadCardProps) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4">
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      {image ? (
        <button
          type="button"
          onClick={onRemove}
          disabled={isSubmitting}
          className="text-xs font-semibold text-rose-600 transition hover:text-rose-700 disabled:cursor-not-allowed disabled:text-rose-300"
        >
          {t("pages.lyceums.edit.images.remove")}
        </button>
      ) : null}
    </div>
    <input
      type="file"
      accept={LYCEUM_IMAGE_ALLOWED_MIME_TYPES.join(",")}
      onChange={onSelect}
      disabled={isSubmitting}
      className="mt-3 w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
    />
    {error ? (
      <span className="mt-1 text-xs font-medium text-rose-600">{error}</span>
    ) : null}
    {image ? (
      <div className="mt-4 flex gap-3">
        <img
          src={image.previewUrl}
          alt={t("pages.lyceums.edit.images.previewAlt")}
          className="h-20 w-20 rounded-xl border border-slate-200 object-cover"
        />
        <div className="flex-1 space-y-2">
          <label className="text-xs font-medium text-slate-600">
            {t("pages.lyceums.edit.images.altTextLabel")}
            <input
              type="text"
              value={image.altText}
              onChange={(event) => onAltTextChange(event.target.value)}
              disabled={isSubmitting}
              className={getInputClassName(false)}
              placeholder={t("pages.lyceums.edit.images.altTextPlaceholder")}
            />
          </label>
          <div className="flex flex-wrap gap-2 text-xs text-slate-500">
            {image.width && image.height ? (
              <span>
                {image.width}x{image.height}px
              </span>
            ) : null}
            <span>{formatImageSize(image.file.size)}</span>
            <span>{image.mimeType || image.file.type}</span>
          </div>
          <p
            className={`text-xs font-medium ${getPendingImageStatusClassName(
              image,
            )}`}
          >
            {getPendingImageStatusLabel(image, t)}
          </p>
          {image.status === "uploading" ? (
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-brand transition-all"
                style={{
                  width: `${image.progress}%`,
                }}
              />
            </div>
          ) : null}
        </div>
      </div>
    ) : (
      <p className="mt-2 text-xs text-slate-500">
        {t("pages.lyceums.edit.images.none")}
      </p>
    )}
  </div>
);
