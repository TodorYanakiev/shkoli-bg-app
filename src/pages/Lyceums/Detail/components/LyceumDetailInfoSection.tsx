import type { TFunction } from "i18next";

import placeholderImage from "../../../../assets/lyceum-placeholder.svg";
import { RatingStars } from "../../../../components/ui/RatingStars";
import type { LyceumImageResponse } from "../../../../types/lyceums";
import type { OverviewDetail } from "../types";

type LyceumDetailInfoSectionProps = {
  title: string;
  heroLocation: string;
  fallbackValue: string;
  averageRating?: number | null;
  coursesCount: number;
  lecturersCount: number;
  galleryCount: number;
  overviewDetails: OverviewDetail[];
  mainImage?: LyceumImageResponse;
  mainImageUrl: string | null;
  isImagesLoading: boolean;
  t: TFunction;
};

export const LyceumDetailInfoSection = ({
  title,
  heroLocation,
  fallbackValue,
  averageRating,
  coursesCount,
  lecturersCount,
  galleryCount,
  overviewDetails,
  mainImage,
  mainImageUrl,
  isImagesLoading,
  t,
}: LyceumDetailInfoSectionProps) => {
  const showImageLoader = isImagesLoading && !mainImageUrl

  return (
    <div
      id="lyceum-info"
      className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
    <div className="grid gap-4 lg:gap-0 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="p-5 sm:p-6 lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">
          {t("pages.lyceums.detail.heroLabel")}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">
          {heroLocation || fallbackValue}
        </p>
        <div className="mt-2">
          {typeof averageRating === "number" &&
          Number.isFinite(averageRating) ? (
            <RatingStars
              rating={averageRating}
              ariaLabel={t("pages.lyceums.detail.averageRatingLabel", {
                rating: averageRating.toFixed(1),
                max: 5,
              })}
            />
          ) : (
            <span className="text-xs font-medium text-slate-500">
              {t("pages.lyceums.detail.noRating")}
            </span>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="#lyceum-courses"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-800 transition hover:border-brand/30 hover:text-brand"
          >
            {t("pages.lyceums.detail.overviewLinks.courses", {
              count: coursesCount,
            })}
          </a>
          <a
            href="#lyceum-lecturers"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-800 transition hover:border-brand/30 hover:text-brand"
          >
            {t("pages.lyceums.detail.overviewLinks.lecturers", {
              count: lecturersCount,
            })}
          </a>
          <a
            href="#lyceum-gallery"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-800 transition hover:border-brand/30 hover:text-brand"
          >
            {t("pages.lyceums.detail.overviewLinks.gallery", {
              count: galleryCount,
            })}
          </a>
        </div>
        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          {overviewDetails.map((item) => (
            <div key={item.label} className="space-y-1">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {item.label}
              </dt>
              <dd className="font-medium text-slate-900">
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block max-w-full truncate text-brand underline hover:text-brand-dark"
                    title={item.href}
                  >
                    {item.value}
                  </a>
                ) : (
                  item.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="relative">
        {showImageLoader ? (
          <div className="flex h-full min-h-60 animate-pulse items-center justify-center bg-slate-200 text-xs font-medium text-slate-500">
            {t("pages.lyceums.detail.images.loading")}
          </div>
        ) : (
          <img
            src={mainImageUrl ?? placeholderImage}
            alt={
              mainImage?.altText ??
              t("pages.lyceums.detail.images.mainAlt", {
                name: title,
              })
            }
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(event) => {
              const target = event.currentTarget;
              target.onerror = null;
              target.src = placeholderImage;
            }}
          />
        )}
      </div>
    </div>
  </div>
  )
};
