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

export type CurrentUser = UserIdentity & {
  role?: 'USER' | 'ADMIN'
  administratedLyceumId?: number
  lecturedCourseIds?: number[]
  lecturedLyceumIds?: number[]
  enabled?: boolean
  averageRating?: number
}

export type UserResponse = UserIdentity & {
  role?: 'USER' | 'ADMIN'
  administratedLyceumId?: number
  lecturedCourseIds?: number[]
  lecturedLyceumIds?: number[]
  enabled?: boolean
  averageRating?: number
}

export type ChangePasswordRequest = {
  currentPassword: string
  newPassword: string
  confirmationPassword: string
}
