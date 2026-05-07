export type FeedbackRequest = {
  fullName: string
  email: string
  title: string
  message: string
}

export type FeedbackResponse = FeedbackRequest & {
  id: number
  read: boolean
  createdAt: string
}

export type FeedbackReadFilter = 'all' | 'read' | 'unread'

export type FeedbackSortField =
  | 'id'
  | 'fullName'
  | 'email'
  | 'title'
  | 'read'
  | 'createdAt'

export type FeedbackSortDirection = 'asc' | 'desc'

export type FeedbackSortParam =
  `${FeedbackSortField},${FeedbackSortDirection}`

export type FeedbackPageQuery = {
  page?: number
  size?: number
  filter?: FeedbackReadFilter
  sort?: FeedbackSortParam
}

export type PageFeedbackResponse = {
  content: FeedbackResponse[]
  number: number
  size: number
  totalElements: number
  totalPages: number
}
