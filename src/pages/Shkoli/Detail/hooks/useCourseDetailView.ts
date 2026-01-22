import { useMemo } from 'react'
import type { TFunction } from 'i18next'

import courseLogoPlaceholder from '../../../../assets/course-logo-placeholder.svg'
import courseMainPlaceholder from '../../../../assets/course-main-placeholder.svg'
import type { CourseResponse, CourseImageResponse } from '../../../../types/courses'
import {
  getPreferredCourseImage,
  resolveCourseImageUrl,
} from '../../../../utils/courseImages'
import type { CourseDetailValue } from '../types'
import {
  formatPrice,
  getTrimmedString,
} from '../services/courseDetailFormatters'

type UseCourseDetailViewOptions = {
  course?: CourseResponse
  locale: string
  t: TFunction
}

type CourseDetailView = {
  fallbackValue: string
  courseName: string
  courseTypeLabel: string
  hasCourseType: boolean
  courseDescription: string
  ageGroups: string[]
  priceValue: string
  normalizedAchievements: string | null
  normalizedWebsiteLink: string | null
  normalizedFacebookLink: string | null
  courseDetails: CourseDetailValue[]
  scheduleSlots: NonNullable<CourseResponse['schedule']>['slots']
  scheduleSpecialCases: NonNullable<CourseResponse['schedule']>['specialCases']
  logoImage?: CourseImageResponse
  mainImage?: CourseImageResponse
  logoImageUrl: string
  mainImageUrl: string
  galleryImages: CourseImageResponse[]
}

export const useCourseDetailView = ({
  course,
  locale,
  t,
}: UseCourseDetailViewOptions): CourseDetailView => {
  return useMemo(() => {
    const fallbackValue = t('pages.shkoli.detail.notProvided')
    const courseName = course?.name ?? t('pages.shkoli.detail.title')
    const courseTypeLabel = course?.type
      ? t(`courses.types.${course.type}`)
      : fallbackValue
    const hasCourseType = Boolean(course?.type)
    const courseDescription =
      course?.description ?? t('pages.shkoli.detail.descriptionPlaceholder')
    const ageGroups = course?.ageGroupList ?? []
    const priceValue =
      typeof course?.price === 'number'
        ? formatPrice(course.price, locale, t)
        : fallbackValue
    const trimmedAddress = getTrimmedString(course?.address)
    const normalizedAchievements = getTrimmedString(course?.achievements)
    const normalizedWebsiteLink = getTrimmedString(course?.websiteLink)
    const normalizedFacebookLink = getTrimmedString(course?.facebookLink)
    const courseDetails = [
      typeof course?.price === 'number'
        ? {
            label: t('pages.shkoli.detail.fields.price'),
            value: priceValue,
          }
        : null,
      trimmedAddress
        ? {
            label: t('pages.shkoli.detail.fields.address'),
            value: trimmedAddress,
          }
        : null,
    ].filter(Boolean) as CourseDetailValue[]

    const scheduleSlots = course?.schedule?.slots ?? []
    const scheduleSpecialCases = course?.schedule?.specialCases ?? []

    const mainImage = getPreferredCourseImage(course?.images, 'MAIN')
    const logoImage = getPreferredCourseImage(course?.images, 'LOGO')
    const mainImageUrl =
      resolveCourseImageUrl(mainImage) ?? courseMainPlaceholder
    const logoImageUrl =
      resolveCourseImageUrl(logoImage) ?? courseLogoPlaceholder
    const galleryImages =
      course?.images?.filter((image) => image.role === 'GALLERY') ?? []

    return {
      fallbackValue,
      courseName,
      courseTypeLabel,
      hasCourseType,
      courseDescription,
      ageGroups,
      priceValue,
      normalizedAchievements,
      normalizedWebsiteLink,
      normalizedFacebookLink,
      courseDetails,
      scheduleSlots,
      scheduleSpecialCases,
      logoImage,
      mainImage,
      logoImageUrl,
      mainImageUrl,
      galleryImages,
    }
  }, [course, locale, t])
}
