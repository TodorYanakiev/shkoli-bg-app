import { useMemo } from 'react'

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

  return {
    lecturedCourses: normalizedLecturedCourses,
    isLecturedCoursesLoading,
    lecturedCoursesError,
  }
}
