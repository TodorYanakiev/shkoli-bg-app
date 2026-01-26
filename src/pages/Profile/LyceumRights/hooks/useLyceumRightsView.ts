import type { ApiError } from '../../../../types/api'
import type { RequestOutcome } from '../types'
import {
  getRequestRightsErrorKey,
  getVerifyRightsErrorKey,
} from '../services/lyceumRightsErrors'

type UseLyceumRightsViewOptions = {
  requestOutcome: RequestOutcome | null
  requestError: ApiError | null
  verifyError: ApiError | null
}

export const useLyceumRightsView = ({
  requestOutcome,
  requestError,
  verifyError,
}: UseLyceumRightsViewOptions) => {
  const requestErrorKey = getRequestRightsErrorKey(requestError)
  const verifyErrorKey = getVerifyRightsErrorKey(verifyError)
  const isRequestLocked =
    requestOutcome?.type === 'alreadyAdmin' ||
    requestOutcome?.type === 'alreadyAdminOther'
  const hasRequested = requestOutcome?.type === 'emailSent'
  const shouldShowRequestError =
    Boolean(requestErrorKey) && requestOutcome?.type !== 'alreadyAdminOther'

  return {
    requestErrorKey,
    verifyErrorKey,
    isRequestLocked,
    hasRequested,
    shouldShowRequestError,
  }
}
