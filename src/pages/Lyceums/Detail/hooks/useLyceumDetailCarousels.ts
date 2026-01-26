import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  MAX_VISIBLE_COURSES,
  MAX_VISIBLE_LECTURERS,
} from '../services/lyceumDetailCarousel'
import type { CarouselState } from '../types'
import { useCarouselMetrics } from './useCarouselMetrics'

type UseLyceumDetailCarouselsOptions = {
  coursesCount: number
  lecturersCount: number
}

type LyceumDetailCarousels = {
  coursesCarousel: CarouselState
  lecturersCarousel: CarouselState
}

export const useLyceumDetailCarousels = ({
  coursesCount,
  lecturersCount,
}: UseLyceumDetailCarouselsOptions): LyceumDetailCarousels => {
  const coursesMetrics = useCarouselMetrics(
    coursesCount,
    MAX_VISIBLE_COURSES,
  )
  const lecturersMetrics = useCarouselMetrics(
    lecturersCount,
    MAX_VISIBLE_LECTURERS,
  )
  const [courseStartIndex, setCourseStartIndex] = useState(0)
  const [lecturerStartIndex, setLecturerStartIndex] = useState(0)

  useEffect(() => {
    const maxStartIndex = Math.max(
      0,
      coursesCount - coursesMetrics.perView,
    )
    setCourseStartIndex((prev) => Math.min(prev, maxStartIndex))
  }, [coursesCount, coursesMetrics.perView])

  useEffect(() => {
    const maxStartIndex = Math.max(
      0,
      lecturersCount - lecturersMetrics.perView,
    )
    setLecturerStartIndex((prev) => Math.min(prev, maxStartIndex))
  }, [lecturersCount, lecturersMetrics.perView])

  const maxCourseStartIndex = Math.max(
    0,
    coursesCount - coursesMetrics.perView,
  )
  const clampedCourseStartIndex = Math.min(
    courseStartIndex,
    maxCourseStartIndex,
  )
  const courseOffset = coursesMetrics.step * clampedCourseStartIndex
  const canGoPrevCourse = clampedCourseStartIndex > 0
  const canGoNextCourse = clampedCourseStartIndex < maxCourseStartIndex

  const maxLecturerStartIndex = Math.max(
    0,
    lecturersCount - lecturersMetrics.perView,
  )
  const clampedLecturerStartIndex = Math.min(
    lecturerStartIndex,
    maxLecturerStartIndex,
  )
  const lecturerOffset =
    lecturersMetrics.step * clampedLecturerStartIndex
  const canGoPrevLecturer = clampedLecturerStartIndex > 0
  const canGoNextLecturer =
    clampedLecturerStartIndex < maxLecturerStartIndex

  const handleCoursePrev = useCallback(() => {
    setCourseStartIndex((prev) => Math.max(0, prev - 1))
  }, [])
  const handleCourseNext = useCallback(() => {
    setCourseStartIndex((prev) =>
      Math.min(maxCourseStartIndex, prev + 1),
    )
  }, [maxCourseStartIndex])
  const handleLecturerPrev = useCallback(() => {
    setLecturerStartIndex((prev) => Math.max(0, prev - 1))
  }, [])
  const handleLecturerNext = useCallback(() => {
    setLecturerStartIndex((prev) =>
      Math.min(maxLecturerStartIndex, prev + 1),
    )
  }, [maxLecturerStartIndex])

  const coursesCarousel = useMemo<CarouselState>(
    () => ({
      offset: courseOffset,
      canGoPrev: canGoPrevCourse,
      canGoNext: canGoNextCourse,
      startIndex: clampedCourseStartIndex,
      perView: coursesMetrics.perView,
      trackRef: coursesMetrics.trackRef,
      cardRef: coursesMetrics.cardRef,
      onPrev: handleCoursePrev,
      onNext: handleCourseNext,
    }),
    [
      courseOffset,
      canGoPrevCourse,
      canGoNextCourse,
      clampedCourseStartIndex,
      coursesMetrics.perView,
      coursesMetrics.trackRef,
      coursesMetrics.cardRef,
      handleCoursePrev,
      handleCourseNext,
    ],
  )

  const lecturersCarousel = useMemo<CarouselState>(
    () => ({
      offset: lecturerOffset,
      canGoPrev: canGoPrevLecturer,
      canGoNext: canGoNextLecturer,
      startIndex: clampedLecturerStartIndex,
      perView: lecturersMetrics.perView,
      trackRef: lecturersMetrics.trackRef,
      cardRef: lecturersMetrics.cardRef,
      onPrev: handleLecturerPrev,
      onNext: handleLecturerNext,
    }),
    [
      lecturerOffset,
      canGoPrevLecturer,
      canGoNextLecturer,
      clampedLecturerStartIndex,
      lecturersMetrics.perView,
      lecturersMetrics.trackRef,
      lecturersMetrics.cardRef,
      handleLecturerPrev,
      handleLecturerNext,
    ],
  )

  return { coursesCarousel, lecturersCarousel }
}
