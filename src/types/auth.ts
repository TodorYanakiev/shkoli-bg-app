export type AuthenticationRequest = {
  email: string
  password: string
}

export type AuthenticationResponse = {
  access_token?: string
  refresh_token?: string
}

export type RegisterRequest = {
  firstname: string
  lastname: string
  email: string
  password: string
  repeatedPassword: string
  username: string
  description?: string
}

export type ForgotPasswordRequest = {
  email: string
}

export type PasswordResetCodeVerificationRequest = {
  email: string
  verificationCode: string
}

export type ResetForgottenPasswordRequest = {
  email: string
  verificationCode: string
  newPassword: string
  confirmationPassword: string
}

export type AuthTokens = {
  accessToken?: string
  refreshToken?: string
}
