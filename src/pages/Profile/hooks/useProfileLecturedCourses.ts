import { useEffect, useMemo, useState } from 'react'

import { useLecturedCourses } from './useLecturedCourses'

type UseProfileLecturedCoursesOptions = {
  lecturerId?: number
  enabled: boolean
}

export const useProfileLecturedCourses = ({
  lecturerId,
  enabled,
}: UseProfileLecturedCoursesOptions) => {
  const {
    data: lecturedCourses = [],
    isLoading: isLecturedCoursesLoading,
    error: lecturedCoursesError,
  } = useLecturedCourses(lecturerId, { enabled })

  const normalizedLecturedCourses = useMemo(() => {
    if (lecturedCourses.length === 0) return []
    const unique = new Map<number, (typeof lecturedCourses)[number]>()
    const withoutId: typeof lecturedCourses = []
    lecturedCourses.forEach((course) => {
      if (typeof course.id === 'number') {
        if (!unique.has(course.id)) {
          unique.set(course.id, course)
        }
      } else {
        withoutId.push(course)
      }
    })
    return [...unique.values(), ...withoutId]
  }, [lecturedCourses])

  const lecturedCoursesCount = normalizedLecturedCourses.length
  const [lecturedCourseIndex, setLecturedCourseIndex] = useState(0)
  const activeLecturedCourse =
    normalizedLecturedCourses[lecturedCourseIndex] ?? null

  useEffect(() => {
    if (lecturedCourseIndex >= lecturedCoursesCount) {
      setLecturedCourseIndex(0)
    }
  }, [lecturedCourseIndex, lecturedCoursesCount])

  const handleLecturedCoursePrevious = () => {
    if (lecturedCoursesCount <= 1) return
    setLecturedCourseIndex((prev) =>
      (prev - 1 + lecturedCoursesCount) % lecturedCoursesCount,
    )
  }

  const handleLecturedCourseNext = () => {
    if (lecturedCoursesCount <= 1) return
    setLecturedCourseIndex((prev) => (prev + 1) % lecturedCoursesCount)
  }

  return {
    lecturedCoursesCount,
    lecturedCourseIndex,
    activeLecturedCourse,
    isLecturedCoursesLoading,
    lecturedCoursesError,
    showCourseControls: lecturedCoursesCount > 1,
    handleLecturedCoursePrevious,
    handleLecturedCourseNext,
  }
}
