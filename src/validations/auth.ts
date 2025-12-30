import type { TFunction } from 'i18next'
import { z } from 'zod'

export const getLoginSchema = (t: TFunction) =>
  z.object({
    email: z
      .string()
      .trim()
      .min(1, t('validation.required'))
      .email(t('validation.email')),
    password: z.string().min(1, t('validation.required')),
  })

export type LoginFormValues = z.infer<ReturnType<typeof getLoginSchema>>
