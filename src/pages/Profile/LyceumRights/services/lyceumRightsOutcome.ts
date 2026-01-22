import type { RequestOutcome } from '../types'

const EMAIL_SENT_PREFIX = 'We have sent you an email at'
const ALREADY_ADMIN_MESSAGE = 'You already administrate this lyceum.'
const MISSING_EMAIL_MESSAGE =
  'We could not reach the lyceum via email. Please contact us.'
const NOT_FOUND_MESSAGE =
  'We are sorry, we could not find such lyceum. Please contact us.'

export const parseRequestOutcome = (message: string): RequestOutcome => {
  const normalized = message.trim()

  if (normalized.startsWith(EMAIL_SENT_PREFIX)) {
    const emailMatch = normalized.match(/email at\s+([^\s]+)\s+with/i)
    return { type: 'emailSent', email: emailMatch?.[1] }
  }
  if (normalized === ALREADY_ADMIN_MESSAGE) {
    return { type: 'alreadyAdmin' }
  }
  if (normalized === MISSING_EMAIL_MESSAGE) {
    return { type: 'missingEmail' }
  }
  if (normalized === NOT_FOUND_MESSAGE) {
    return { type: 'notFound' }
  }
  return { type: 'unknown' }
}

export const getRequestOutcomeMessageKey = (
  outcome: RequestOutcome,
): string | null => {
  switch (outcome.type) {
    case 'alreadyAdmin':
      return 'pages.profile.lyceumRights.request.outcomes.alreadyAdmin'
    case 'alreadyAdminOther':
      return 'pages.profile.lyceumRights.request.outcomes.alreadyAdminOther'
    case 'missingEmail':
      return 'pages.profile.lyceumRights.request.outcomes.missingEmail'
    case 'notFound':
      return 'pages.profile.lyceumRights.request.outcomes.notFound'
    case 'unknown':
      return 'pages.profile.lyceumRights.request.outcomes.unknown'
    default:
      return null
  }
}

export const getRequestOutcomeClassName = (outcome: RequestOutcome) => {
  if (outcome.type === 'alreadyAdmin' || outcome.type === 'alreadyAdminOther') {
    return 'border-rose-300 bg-rose-50 text-rose-800 border-l-rose-400'
  }
  return 'border-amber-300 bg-amber-50 text-amber-900 border-l-amber-400'
}
