export type CurrentUser = {
  id?: number
  firstname?: string
  lastname?: string
  firstName?: string
  lastName?: string
  username?: string
  email?: string
  role?: 'USER' | 'ADMIN'
  administratedLyceumId?: number
  enabled?: boolean
}

export type ChangePasswordRequest = {
  currentPassword: string
  newPassword: string
  confirmationPassword: string
}
