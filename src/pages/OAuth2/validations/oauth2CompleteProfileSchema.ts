import type { TFunction } from 'i18next'
import { z } from 'zod'

import type { OAuth2PendingFieldName } from '../types'

export const getOAuth2CompleteProfileSchema = (
  t: TFunction,
  missingFields: OAuth2PendingFieldName[],
) => {
  const requiresEmail = missingFields.includes('email')
  const requiresFirstname = missingFields.includes('firstname')
  const requiresLastname = missingFields.includes('lastname')
  const emailSchema = z.string().email(t('validation.email'))

  return z
    .object({
      username: z
        .string()
        .trim()
        .min(3, t('validation.usernameMin'))
        .max(50, t('validation.usernameMax')),
      email: z.string().trim(),
      firstname: z.string().trim(),
      lastname: z.string().trim(),
      description: z.string().trim().max(500, t('validation.descriptionMax')),
    })
    .superRefine((values, context) => {
      if (requiresEmail && values.email.length === 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['email'],
          message: t('validation.required'),
        })
      }

      if (values.email.length > 0 && !emailSchema.safeParse(values.email).success) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['email'],
          message: t('validation.email'),
        })
      }

      if (requiresFirstname && values.firstname.length === 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['firstname'],
          message: t('validation.required'),
        })
      }

      if (requiresLastname && values.lastname.length === 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['lastname'],
          message: t('validation.required'),
        })
      }
    })
}
