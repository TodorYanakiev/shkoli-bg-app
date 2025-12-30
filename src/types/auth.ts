export type AuthenticationRequest = {
  email: string
  password: string
}

export type AuthenticationResponse = {
  access_token?: string
  refresh_token?: string
}

export type AuthTokens = {
  accessToken?: string
  refreshToken?: string
}
