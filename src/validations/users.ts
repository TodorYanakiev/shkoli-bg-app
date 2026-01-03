import type { TFunction } from 'i18next'
import { z } from 'zod'

export const getChangePasswordSchema = (t: TFunction) =>
  z
    .object({
      currentPassword: z.string().min(1, t('validation.required')),
      newPassword: z.string().min(8, t('validation.passwordMin')),
      confirmationPassword: z.string().min(1, t('validation.required')),
    })
    .refine((values) => values.newPassword === values.confirmationPassword, {
      message: t('validation.passwordMatch'),
      path: ['confirmationPassword'],
    })

export type ChangePasswordFormValues = z.infer<
  ReturnType<typeof getChangePasswordSchema>
>
