export type UserIdentity = {
  id?: number
  firstname?: string
  lastname?: string
  firstName?: string
  lastName?: string
  username?: string
  email?: string
}

export type CurrentUser = UserIdentity & {
  role?: 'USER' | 'ADMIN'
  administratedLyceumId?: number
  enabled?: boolean
}

export type UserResponse = UserIdentity & {
  role?: 'USER' | 'ADMIN'
  administratedLyceumId?: number
  lecturedCourseIds?: number[]
  lecturedLyceumIds?: number[]
  enabled?: boolean
}

export type ChangePasswordRequest = {
  currentPassword: string
  newPassword: string
  confirmationPassword: string
}
