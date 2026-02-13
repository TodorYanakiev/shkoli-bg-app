import type { LyceumResponse } from '../../types/lyceums'

export type LyceumFilterState = {
  town?: string
  page: number
}

export type LyceumFilterQuery = {
  page: number
  size: number
  town?: string
}

export type SortObject = {
  empty?: boolean
  sorted?: boolean
  unsorted?: boolean
}

export type PageableObject = {
  offset?: number
  sort?: SortObject
  paged?: boolean
  pageSize?: number
  pageNumber?: number
  unpaged?: boolean
}

export type PageLyceumResponse = {
  totalPages: number
  totalElements: number
  size: number
  content: LyceumResponse[]
  number: number
  sort?: SortObject
  first: boolean
  last: boolean
  numberOfElements: number
  pageable?: PageableObject
  empty: boolean
}
