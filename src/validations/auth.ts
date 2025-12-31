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

export const getRegisterSchema = (t: TFunction) =>
  z
    .object({
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
      password: z.string().min(8, t('validation.passwordMin')),
      repeatedPassword: z.string().min(1, t('validation.required')),
    })
    .refine((values) => values.password === values.repeatedPassword, {
      message: t('validation.passwordMatch'),
      path: ['repeatedPassword'],
    })

export type RegisterFormValues = z.infer<ReturnType<typeof getRegisterSchema>>
