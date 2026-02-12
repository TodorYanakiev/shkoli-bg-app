import type { TFunction } from "i18next";

import placeholderImage from "../../../../assets/lyceum-placeholder.svg";
import type { LyceumImageResponse } from "../../../../types/lyceums";
import { resolveLyceumImageUrl } from "../../../../utils/lyceumImages";

type LyceumDetailGallerySectionProps = {
  galleryImages: LyceumImageResponse[];
  lyceumName: string;
  isImagesLoading: boolean;
  imagesErrorMessage: string | null;
  t: TFunction;
};

export const LyceumDetailGallerySection = ({
  galleryImages,
  lyceumName,
  isImagesLoading,
  imagesErrorMessage,
  t,
}: LyceumDetailGallerySectionProps) => (
  <div
    id="lyceum-gallery"
    className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
  >
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <h3 className="text-sm font-semibold text-slate-900">
        {t("pages.lyceums.detail.sections.gallery")}
      </h3>
      <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
        {t("pages.lyceums.detail.countLabel", { count: galleryImages.length })}
      </span>
    </div>
    {isImagesLoading ? (
      <div className="mt-4 animate-pulse rounded-2xl border border-dashed border-slate-200 bg-slate-100 p-4 text-sm text-slate-600">
        {t("pages.lyceums.detail.images.loading")}
      </div>
    ) : imagesErrorMessage ? (
      <div
        className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
        role="alert"
      >
        {imagesErrorMessage}
      </div>
    ) : galleryImages.length > 0 ? (
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {galleryImages.map((image, index) => {
          const imageUrl = resolveLyceumImageUrl(image) ?? placeholderImage;
          return (
            <div
              key={image.id ?? `${imageUrl}-${index}`}
              className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70"
            >
              <img
                src={imageUrl}
                alt={
                  image.altText ??
                  t("pages.lyceums.detail.images.galleryAlt", {
                    name: lyceumName,
                    index: index + 1,
                  })
                }
                className="h-40 w-full object-cover"
                loading="lazy"
                onError={(event) => {
                  const target = event.currentTarget;
                  target.onerror = null;
                  target.src = placeholderImage;
                }}
              />
            </div>
          );
        })}
      </div>
    ) : (
      <p className="mt-3 text-sm text-slate-600">
        {t("pages.lyceums.detail.galleryEmpty")}
      </p>
    )}
  </div>
);
