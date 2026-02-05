import httpClient from '../../../services/httpClient'
import type { CourseFilterQuery, PageCourseResponse } from '../types'

export const filterCourses = async (query: CourseFilterQuery) => {
  const params = new URLSearchParams()
  params.set('page', query.page.toString())
  params.set('size', query.size.toString())

  if (query.sort) {
    params.append('sort', query.sort)
  }

  query.courseTypes?.forEach((type) => {
    params.append('courseTypes', type)
  })

  query.ageGroups?.forEach((group) => {
    params.append('ageGroups', group)
  })

  if (query.minPrice != null) {
    params.set('minPrice', query.minPrice.toString())
  }

  if (query.maxPrice != null) {
    params.set('maxPrice', query.maxPrice.toString())
  }

  const response = await httpClient.get<PageCourseResponse>(
    '/api/v1/courses/filter',
    { params },
  )

  return response.data
}
