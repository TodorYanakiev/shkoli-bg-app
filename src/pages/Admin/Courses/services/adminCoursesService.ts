import httpClient from '../../../../services/httpClient'
import type { AdminCourseFilterQuery, AdminPageCourseResponse } from '../types'

const buildFilterParams = (query: AdminCourseFilterQuery) => {
  const params = new URLSearchParams()
  params.set('page', String(query.page))
  params.set('size', String(query.size))

  if (query.sort) {
    params.append('sort', query.sort)
  }

  query.courseTypes?.forEach((type) => {
    params.append('courseTypes', type)
  })

  query.ageGroups?.forEach((group) => {
    params.append('ageGroups', group)
  })

  query.dayOfWeek?.forEach((day) => {
    params.append('dayOfWeek', day)
  })

  if (query.town) {
    params.set('town', query.town)
  }

  if (query.startTimeFrom) {
    params.set('startTimeFrom', query.startTimeFrom)
  }

  if (query.startTimeTo) {
    params.set('startTimeTo', query.startTimeTo)
  }

  if (query.minPrice != null) {
    params.set('minPrice', String(query.minPrice))
  }

  if (query.maxPrice != null) {
    params.set('maxPrice', String(query.maxPrice))
  }

  return params
}

export const fetchAdminCourses = async (
  query: AdminCourseFilterQuery,
): Promise<AdminPageCourseResponse> => {
  const response = await httpClient.get<AdminPageCourseResponse>(
    '/api/v1/courses/filter',
    { params: buildFilterParams(query) },
  )
  return response.data
}
