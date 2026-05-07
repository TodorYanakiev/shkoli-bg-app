import type { TFunction } from 'i18next'
import { z } from 'zod'

const SHORT_FIELD_MAX_LENGTH = 255
const MESSAGE_MAX_LENGTH = 5000

export const getFeedbackSchema = (t: TFunction) =>
  z.object({
    fullName: z
      .string()
      .trim()
      .min(1, t('validation.required'))
      .max(
        SHORT_FIELD_MAX_LENGTH,
        t('validation.maxLength', { count: SHORT_FIELD_MAX_LENGTH }),
      ),
    email: z
      .string()
      .trim()
      .min(1, t('validation.required'))
      .email(t('validation.email'))
      .max(
        SHORT_FIELD_MAX_LENGTH,
        t('validation.maxLength', { count: SHORT_FIELD_MAX_LENGTH }),
      ),
    title: z
      .string()
      .trim()
      .min(1, t('validation.required'))
      .max(
        SHORT_FIELD_MAX_LENGTH,
        t('validation.maxLength', { count: SHORT_FIELD_MAX_LENGTH }),
      ),
    message: z
      .string()
      .trim()
      .min(1, t('validation.required'))
      .max(
        MESSAGE_MAX_LENGTH,
        t('validation.maxLength', { count: MESSAGE_MAX_LENGTH }),
      ),
  })

export type FeedbackFormValues = z.infer<ReturnType<typeof getFeedbackSchema>>
