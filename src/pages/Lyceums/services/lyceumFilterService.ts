import httpClient from '../../../services/httpClient'
import type { LyceumFilterQuery, PageLyceumResponse } from '../types'

export const filterLyceums = async (query: LyceumFilterQuery) => {
  const params = new URLSearchParams()
  params.set('page', query.page.toString())
  params.set('size', query.size.toString())

  if (query.town) {
    params.set('town', query.town)
  }

  const response = await httpClient.get<PageLyceumResponse>(
    '/api/v1/lyceums/filter',
    { params },
  )

  return response.data
}
