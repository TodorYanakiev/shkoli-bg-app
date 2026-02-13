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

export const getUpdateUserSchema = (t: TFunction) =>
  z.object({
    firstname: z.string().trim().min(1, t('validation.required')),
    lastname: z.string().trim().min(1, t('validation.required')),
    username: z
      .string()
      .trim()
      .min(3, t('validation.usernameMin'))
      .max(50, t('validation.usernameMax')),
    email: z
      .string()
      .trim()
      .min(1, t('validation.required'))
      .email(t('validation.email')),
    description: z.string().max(500, t('validation.descriptionMax')).optional(),
  })

export type UpdateUserFormValues = z.infer<
  ReturnType<typeof getUpdateUserSchema>
>
