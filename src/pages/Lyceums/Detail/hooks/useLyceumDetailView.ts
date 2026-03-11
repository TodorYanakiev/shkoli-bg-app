import { useMemo } from 'react'
import type { TFunction } from 'i18next'

import type {
  LyceumImageResponse,
  LyceumResponse,
} from '../../../../types/lyceums'
import {
  getLyceumImageByRole,
  resolveLyceumImageUrl,
} from '../../../../utils/lyceumImages'
import type { OverviewDetail } from '../types'

type UseLyceumDetailViewOptions = {
  lyceum?: LyceumResponse
  lyceumImages: LyceumImageResponse[]
  t: TFunction
}

type LyceumDetailView = {
  fallbackValue: string
  lyceumName: string
  heroLocation: string
  pageTitle: string
  overviewDetails: OverviewDetail[]
  mainImage?: LyceumImageResponse
  mainImageUrl: string | null
  galleryImages: LyceumImageResponse[]
}

const normalizeExternalLink = (value?: string) => {
  if (!value) {
    return null
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  return `https://${trimmed}`
}

export const useLyceumDetailView = ({
  lyceum,
  lyceumImages,
  t,
}: UseLyceumDetailViewOptions): LyceumDetailView =>
  useMemo(() => {
    const fallbackValue = t('pages.lyceums.detail.notProvided')
    const lyceumName = lyceum?.name ?? t('pages.lyceums.detail.title')
    const heroLocation = [lyceum?.town, lyceum?.address]
      .filter(Boolean)
      .join(', ')
    const pageTitle = lyceum?.name
      ? `${lyceum.name} | ${t('app.title')}`
      : `${t('pages.lyceums.detail.title')} | ${t('app.title')}`
    const urlToLibrariesSite = lyceum?.urlToLibrariesSite?.trim() ?? ''
    const chitalishtaUrl = lyceum?.chitalishtaUrl?.trim() ?? ''
    const overviewDetails: OverviewDetail[] = [
      {
        label: t('pages.lyceums.detail.fields.phone'),
        value: lyceum?.phone ?? fallbackValue,
      },
      {
        label: t('pages.lyceums.detail.fields.email'),
        value: lyceum?.email ?? fallbackValue,
      },
      {
        label: t('pages.lyceums.detail.fields.urlToLibrariesSite'),
        value: urlToLibrariesSite || fallbackValue,
        href: normalizeExternalLink(urlToLibrariesSite) ?? undefined,
      },
      {
        label: t('pages.lyceums.detail.fields.chitalishtaUrl'),
        value: chitalishtaUrl || fallbackValue,
        href: normalizeExternalLink(chitalishtaUrl) ?? undefined,
      },
      {
        label: t('pages.lyceums.detail.fields.chairman'),
        value: lyceum?.chairman ?? fallbackValue,
      },
      {
        label: t('pages.lyceums.detail.fields.secretary'),
        value: lyceum?.secretary ?? fallbackValue,
      },
    ]
    const mainImage =
      getLyceumImageByRole(lyceumImages, 'MAIN') ??
      lyceum?.mainImage
    const mainImageUrl = resolveLyceumImageUrl(mainImage)
    const galleryImages = lyceumImages.filter(
      (image) => image.role === 'GALLERY',
    )

    return {
      fallbackValue,
      lyceumName,
      heroLocation,
      pageTitle,
      overviewDetails,
      mainImage,
      mainImageUrl,
      galleryImages,
    }
  }, [lyceum, lyceumImages, t])
