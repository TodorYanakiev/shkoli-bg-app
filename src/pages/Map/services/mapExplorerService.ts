import httpClient from '../../../services/httpClient'
import type {
  MapCourseFilterQuery,
  MapLyceumFilterQuery,
  PageCourseResponse,
  PageLyceumResponse,
} from '../types'

const MAP_QUERY_PAGE_SIZE = 100

const normalizeOptionalText = (value?: string) => {
  const trimmed = value?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : undefined
}

const normalizeOptionalNumber = (value?: number) =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined

const appendArrayParam = <T extends string>(
  params: URLSearchParams,
  key: string,
  values?: T[],
) => {
  values?.forEach((value) => {
    params.append(key, value)
  })
}

type PagedQuery = {
  page: number
  size: number
}

const getLyceumsPage = async (
  query: MapLyceumFilterQuery,
  paging: PagedQuery,
) => {
  const params = new URLSearchParams()
  params.set('page', paging.page.toString())
  params.set('size', paging.size.toString())

  const town = normalizeOptionalText(query.town)
  if (town) {
    params.set('town', town)
  }

  const latitude = normalizeOptionalNumber(query.latitude)
  if (latitude != null) {
    params.set('latitude', latitude.toString())
  }

  const longitude = normalizeOptionalNumber(query.longitude)
  if (longitude != null) {
    params.set('longitude', longitude.toString())
  }

  const response = await httpClient.get<PageLyceumResponse>(
    '/api/v1/lyceums/filter',
    { params },
  )

  return response.data
}

const getCoursesPage = async (
  query: MapCourseFilterQuery,
  paging: PagedQuery,
) => {
  const params = new URLSearchParams()
  params.set('page', paging.page.toString())
  params.set('size', paging.size.toString())

  const town = normalizeOptionalText(query.town)
  if (town) {
    params.set('town', town)
  }

  appendArrayParam(params, 'courseTypes', query.courseTypes)
  appendArrayParam(params, 'ageGroups', query.ageGroups)
  appendArrayParam(params, 'dayOfWeek', query.dayOfWeek)

  if (query.startTimeFrom) {
    params.set('startTimeFrom', query.startTimeFrom)
  }

  if (query.startTimeTo) {
    params.set('startTimeTo', query.startTimeTo)
  }

  if (query.minPrice != null) {
    params.set('minPrice', query.minPrice.toString())
  }

  if (query.maxPrice != null) {
    params.set('maxPrice', query.maxPrice.toString())
  }

  if (query.sort) {
    params.append('sort', query.sort)
  }

  const response = await httpClient.get<PageCourseResponse>(
    '/api/v1/courses/filter',
    { params },
  )

  return response.data
}

export const fetchAllLyceumsForMap = async (
  query: MapLyceumFilterQuery,
) => {
  const firstPage = await getLyceumsPage(query, {
    page: 0,
    size: MAP_QUERY_PAGE_SIZE,
  })

  if (firstPage.totalPages <= 1) {
    return firstPage.content
  }

  const remainingRequests = Array.from(
    { length: firstPage.totalPages - 1 },
    (_, index) =>
      getLyceumsPage(query, {
        page: index + 1,
        size: MAP_QUERY_PAGE_SIZE,
      }),
  )

  const remainingPages = await Promise.all(remainingRequests)

  return [firstPage, ...remainingPages].flatMap((page) => page.content)
}

export const fetchAllCoursesForMap = async (
  query: MapCourseFilterQuery,
) => {
  const firstPage = await getCoursesPage(query, {
    page: 0,
    size: MAP_QUERY_PAGE_SIZE,
  })

  if (firstPage.totalPages <= 1) {
    return firstPage.content
  }

  const remainingRequests = Array.from(
    { length: firstPage.totalPages - 1 },
    (_, index) =>
      getCoursesPage(query, {
        page: index + 1,
        size: MAP_QUERY_PAGE_SIZE,
      }),
  )

  const remainingPages = await Promise.all(remainingRequests)

  return [firstPage, ...remainingPages].flatMap((page) => page.content)
}
