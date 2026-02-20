import { Helmet } from 'react-helmet-async'

import { env } from '../../services/env'
import {
  buildBreadcrumbSchema,
  buildOrganizationSchema,
  buildWebsiteSchema,
  getHreflangAlternates,
  getRobotsContent,
  toAbsoluteUrl,
  type SeoBreadcrumb,
} from '../../services/seo'
import type { LanguageCode } from '../../utils/language'
import { stripLocalePrefix, toLocalizedPath } from '../../utils/localizedPath'

type SeoHeadProps = {
  title: string
  description: string
  canonicalPath: string
  locale: LanguageCode
  imagePath?: string
  type?: 'website' | 'article'
  forceNoindex?: boolean
  searchParams?: URLSearchParams
  breadcrumbs?: SeoBreadcrumb[]
  structuredData?: Record<string, unknown>[]
  prevPath?: string
  nextPath?: string
  preloadImage?: boolean
}

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value)

const resolveImageUrl = (imagePath?: string) => {
  if (!imagePath) {
    return toAbsoluteUrl(env.seoDefaultImagePath)
  }

  return isAbsoluteUrl(imagePath) ? imagePath : toAbsoluteUrl(imagePath)
}

const SeoHead = ({
  title,
  description,
  canonicalPath,
  locale,
  imagePath,
  type = 'website',
  forceNoindex,
  searchParams,
  breadcrumbs = [],
  structuredData = [],
  prevPath,
  nextPath,
  preloadImage = false,
}: SeoHeadProps) => {
  const normalizedCanonicalPath = toLocalizedPath(
    stripLocalePrefix(canonicalPath),
    locale,
  )
  const canonicalUrl = toAbsoluteUrl(normalizedCanonicalPath)
  const previewImageUrl = resolveImageUrl(imagePath)
  const robots = getRobotsContent(
    normalizedCanonicalPath,
    searchParams,
    forceNoindex,
  )
  const hreflangAlternates = getHreflangAlternates(normalizedCanonicalPath)
  const baseSchemas: Record<string, unknown>[] = [
    buildOrganizationSchema(),
    buildWebsiteSchema(locale),
  ]

  if (breadcrumbs.length > 0) {
    baseSchemas.push(buildBreadcrumbSchema(locale, breadcrumbs))
  }

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={env.siteName} />
      <meta property="og:locale" content={locale === 'bg' ? 'bg_BG' : 'en_US'} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={previewImageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={previewImageUrl} />
      <link rel="canonical" href={canonicalUrl} />
      {preloadImage ? (
        <link rel="preload" as="image" href={previewImageUrl} />
      ) : null}
      {prevPath ? <link rel="prev" href={toAbsoluteUrl(prevPath)} /> : null}
      {nextPath ? <link rel="next" href={toAbsoluteUrl(nextPath)} /> : null}
      {hreflangAlternates.map((alternate) => (
        <link
          key={`${alternate.hrefLang}-${alternate.href}`}
          rel="alternate"
          hrefLang={alternate.hrefLang}
          href={alternate.href}
        />
      ))}
      {env.googleSiteVerification ? (
        <meta
          name="google-site-verification"
          content={env.googleSiteVerification}
        />
      ) : null}
      {[...baseSchemas, ...structuredData].map((schema, index) => (
        <script
          key={`schema-${index}`}
          type="application/ld+json"
        >
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}

export default SeoHead
