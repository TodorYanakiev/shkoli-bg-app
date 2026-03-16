export type OAuth2PendingFieldName =
  | 'username'
  | 'email'
  | 'firstname'
  | 'lastname'

export type OAuth2CallbackErrorCode = 'missing_data' | 'invalid_data' | 'error'

export type OAuth2CallbackResult =
  | {
      state: 'complete'
      accessToken: string
      refreshToken: string
    }
  | {
      state: 'pending'
      registrationToken: string
      missingFields: OAuth2PendingFieldName[]
    }
  | {
      state: 'error'
      errorCode: OAuth2CallbackErrorCode
      messageKey: string
    }

export type OAuth2CompleteRegistrationRequest = {
  registrationToken: string
  username: string
  email?: string
  firstname?: string
  lastname?: string
  description?: string
}

export type OAuth2CompleteProfileFormValues = {
  username: string
  email: string
  firstname: string
  lastname: string
  description: string
}
