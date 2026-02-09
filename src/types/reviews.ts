export type ReviewResponse = {
  id?: number
  rating?: number
  comment?: string
  userId?: number
  createdAt?: string
  deletedAt?: string
}

export type ReviewRequest = {
  rating: number
  comment?: string
}

export type ReviewUpdateRequest = {
  rating?: number
  comment?: string
}
