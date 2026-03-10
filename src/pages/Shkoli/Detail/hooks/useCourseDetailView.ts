import { useMemo } from 'react'
import type { TFunction } from 'i18next'

import courseMainPlaceholder from '../../../../assets/course-main-placeholder.svg'
import type {
  CourseImageResponse,
  CourseResponse,
  CourseScheduleSlot,
  CourseScheduleSpecialCase,
} from '../../../../types/courses'
import {
  getCourseImageByRole,
  resolveCourseImageUrl,
} from '../../../../utils/courseImages'
import type { CourseDetailValue } from '../types'
import {
  formatPrice,
  getTrimmedString,
} from '../services/courseDetailFormatters'

type UseCourseDetailViewOptions = {
  course?: CourseResponse
  courseImages?: CourseImageResponse[]
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
  executionTypeLabel: string | null
  activeMonthsValue: string | null
  locationValue: string
  normalizedAchievements: string | null
  normalizedWebsiteLink: string | null
  normalizedFacebookLink: string | null
  courseDetails: CourseDetailValue[]
  scheduleSlots: CourseScheduleSlot[]
  scheduleSpecialCases: CourseScheduleSpecialCase[]
  mainImage?: CourseImageResponse
  mainImageUrl: string
  galleryImages: CourseImageResponse[]
}

export const useCourseDetailView = ({
  course,
  courseImages = [],
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
        ? formatPrice(course.price, locale)
        : fallbackValue
    const executionTypeLabel = course?.executionType
      ? t(`courses.executionTypes.${course.executionType}`)
      : null
    const activeStartMonthLabel = course?.activeStartMonth
      ? t(`courses.months.${course.activeStartMonth}`)
      : null
    const activeEndMonthLabel = course?.activeEndMonth
      ? t(`courses.months.${course.activeEndMonth}`)
      : null
    const activeMonthsValue =
      activeStartMonthLabel && activeEndMonthLabel
        ? activeStartMonthLabel === activeEndMonthLabel
          ? activeStartMonthLabel
          : `${activeStartMonthLabel} - ${activeEndMonthLabel}`
        : null
    const trimmedAddress = getTrimmedString(course?.address)
    const locationValue = trimmedAddress ?? fallbackValue
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
      executionTypeLabel
        ? {
            label: t('pages.shkoli.detail.fields.executionType'),
            value: executionTypeLabel,
          }
        : null,
      activeMonthsValue
        ? {
            label: t('pages.shkoli.detail.fields.activeMonths'),
            value: activeMonthsValue,
          }
        : null,
    ].filter(Boolean) as CourseDetailValue[]

    const scheduleSlots = course?.schedule?.slots ?? []
    const scheduleSpecialCases = course?.schedule?.specialCases ?? []

    const mainImage =
      course?.mainImage ??
      getCourseImageByRole(courseImages, 'MAIN')
    const mainImageUrl =
      resolveCourseImageUrl(mainImage) ?? courseMainPlaceholder
    const galleryImages = courseImages.filter(
      (image) => image.role === 'GALLERY',
    )

    return {
      fallbackValue,
      courseName,
      courseTypeLabel,
      hasCourseType,
      courseDescription,
      ageGroups,
      priceValue,
      executionTypeLabel,
      activeMonthsValue,
      locationValue,
      normalizedAchievements,
      normalizedWebsiteLink,
      normalizedFacebookLink,
      courseDetails,
      scheduleSlots,
      scheduleSpecialCases,
      mainImage,
      mainImageUrl,
      galleryImages,
    }
  }, [course, courseImages, locale, t])
}
