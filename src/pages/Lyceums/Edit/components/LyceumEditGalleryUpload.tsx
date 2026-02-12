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

type LyceumEditGalleryUploadProps = {
  galleryImages: PendingLyceumImage[];
  galleryImageError: string | null;
  onGallerySelect: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveGalleryImage: (id: string) => void;
  onUpdateGalleryAltText: (id: string, value: string) => void;
  isSubmitting: boolean;
  t: TFunction;
};

export const LyceumEditGalleryUpload = ({
  galleryImages,
  galleryImageError,
  onGallerySelect,
  onRemoveGalleryImage,
  onUpdateGalleryAltText,
  isSubmitting,
  t,
}: LyceumEditGalleryUploadProps) => (
  <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-700">
          {t("pages.lyceums.edit.images.galleryLabel")}
        </p>
        <p className="text-xs text-slate-500">
          {t("pages.lyceums.edit.images.galleryHint")}
        </p>
      </div>
      <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900">
        {t("pages.lyceums.edit.images.addGallery")}
        <input
          type="file"
          accept={LYCEUM_IMAGE_ALLOWED_MIME_TYPES.join(",")}
          multiple
          onChange={onGallerySelect}
          disabled={isSubmitting}
          className="sr-only"
        />
      </label>
    </div>
    {galleryImageError ? (
      <span className="mt-1 text-xs font-medium text-rose-600">
        {galleryImageError}
      </span>
    ) : null}
    {galleryImages.length === 0 ? (
      <p className="mt-3 text-xs text-slate-500">
        {t("pages.lyceums.edit.images.galleryEmpty")}
      </p>
    ) : (
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {galleryImages.map((image, index) => (
          <div
            key={image.id}
            className="rounded-xl border border-slate-200 p-3"
          >
            <div className="flex items-start gap-3">
              <img
                src={image.previewUrl}
                alt={t("pages.lyceums.edit.images.previewAlt")}
                className="h-16 w-16 rounded-lg border border-slate-200 object-cover"
              />
              <div className="flex-1 space-y-2">
                <p className="text-xs font-semibold text-slate-600">
                  {t("pages.lyceums.edit.images.galleryItem", {
                    index: index + 1,
                  })}
                </p>
                <label className="text-xs font-medium text-slate-600">
                  {t("pages.lyceums.edit.images.altTextLabel")}
                  <input
                    type="text"
                    value={image.altText}
                    onChange={(event) =>
                      onUpdateGalleryAltText(image.id, event.target.value)
                    }
                    disabled={isSubmitting}
                    className={getInputClassName(false)}
                    placeholder={t(
                      "pages.lyceums.edit.images.altTextPlaceholder",
                    )}
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
              <button
                type="button"
                onClick={() => onRemoveGalleryImage(image.id)}
                disabled={isSubmitting}
                className="text-xs font-semibold text-rose-600 transition hover:text-rose-700 disabled:cursor-not-allowed disabled:text-rose-300"
              >
                {t("pages.lyceums.edit.images.remove")}
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
