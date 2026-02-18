export type UserImageRole = 'LOGO' | 'MAIN' | 'GALLERY'

export type UserImageRequest = {
  s3Key?: string
  url?: string
  altText?: string
  width?: number
  height?: number
  mimeType?: string
}

export type UserImageResponse = {
  id?: number
  s3Key?: string
  url?: string
  role?: UserImageRole
  altText?: string
  width?: number
  height?: number
  mimeType?: string
  orderIndex?: number
  userId?: number
}

export type UserIdentity = {
  id?: number
  firstname?: string
  lastname?: string
  firstName?: string
  lastName?: string
  username?: string
  email?: string
  description?: string
  profileImage?: UserImageResponse
}

export type UserRole = 'USER' | 'ADMIN'

export type CurrentUser = UserIdentity & {
  role?: UserRole
  administratedLyceumId?: number
  lecturedCourseIds?: number[]
  lecturedLyceumIds?: number[]
  enabled?: boolean
  averageRating?: number
}

export type UserResponse = UserIdentity & {
  role?: UserRole
  administratedLyceumId?: number
  lecturedCourseIds?: number[]
  lecturedLyceumIds?: number[]
  enabled?: boolean
  averageRating?: number
}

export type UsersPageQuery = {
  page?: number
  size?: number
}

export type PageUserResponse = {
  totalPages: number
  totalElements: number
  size: number
  content: UserResponse[]
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
}

export type ChangePasswordRequest = {
  currentPassword: string
  newPassword: string
  confirmationPassword: string
}

export type UserUpdateRequest = {
  firstname: string
  lastname: string
  email: string
  username: string
  description?: string
}

export type UserRoleUpdateRequest = {
  role: UserRole
}
