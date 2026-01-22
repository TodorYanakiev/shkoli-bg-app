export type RequestOutcomeType =
  | 'emailSent'
  | 'alreadyAdmin'
  | 'alreadyAdminOther'
  | 'missingEmail'
  | 'notFound'
  | 'unknown'

export type RequestOutcome = {
  type: RequestOutcomeType
  email?: string
}
