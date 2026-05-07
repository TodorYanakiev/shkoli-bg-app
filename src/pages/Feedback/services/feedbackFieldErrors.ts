import type { TFunction } from 'i18next'
import type { UseFormSetError } from 'react-hook-form'

import type { ApiError } from '../../../types/api'
import type { FeedbackFormValues } from '../../../validations/feedback'

const feedbackFields: Array<keyof FeedbackFormValues> = [
  'fullName',
  'email',
  'title',
  'message',
]

const isFeedbackFormField = (
  field: string,
): field is keyof FeedbackFormValues =>
  feedbackFields.includes(field as keyof FeedbackFormValues)

const maxLengthByField: Record<keyof FeedbackFormValues, number> = {
  fullName: 255,
  email: 255,
  title: 255,
  message: 5000,
}

const getServerFieldMessage = (
  field: keyof FeedbackFormValues,
  rawMessage: string,
  t: TFunction,
) => {
  const normalizedMessage = rawMessage.toLowerCase()

  if (
    normalizedMessage.includes('blank') ||
    normalizedMessage.includes('required') ||
    normalizedMessage.includes('must not be null')
  ) {
    return t('validation.required')
  }

  if (field === 'email' && normalizedMessage.includes('email')) {
    return t('validation.email')
  }

  if (
    normalizedMessage.includes('max') ||
    normalizedMessage.includes('size') ||
    normalizedMessage.includes(String(maxLengthByField[field]))
  ) {
    return t('validation.maxLength', { count: maxLengthByField[field] })
  }

  return rawMessage
}

type ApplyFeedbackFieldErrorsParams = {
  error: ApiError
  setError: UseFormSetError<FeedbackFormValues>
  t: TFunction
}

export const applyFeedbackServerFieldErrors = ({
  error,
  setError,
  t,
}: ApplyFeedbackFieldErrorsParams) => {
  let hasMappedFieldError = false

  Object.entries(error.fieldErrors ?? {}).forEach(([field, message]) => {
    if (!isFeedbackFormField(field)) return

    setError(field, {
      type: 'server',
      message: getServerFieldMessage(field, message, t),
    })
    hasMappedFieldError = true
  })

  return hasMappedFieldError
}
