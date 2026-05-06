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

export const getForgotPasswordRequestSchema = (t: TFunction) =>
  z.object({
    email: z
      .string()
      .trim()
      .min(1, t('validation.required'))
      .email(t('validation.email')),
  })

export type ForgotPasswordRequestFormValues = z.infer<
  ReturnType<typeof getForgotPasswordRequestSchema>
>

export const getPasswordResetCodeVerificationSchema = (t: TFunction) =>
  z.object({
    verificationCode: z
      .string()
      .trim()
      .min(1, t('validation.required'))
      .regex(/^\d{6}$/, t('validation.verificationCode')),
  })

export type PasswordResetCodeVerificationFormValues = z.infer<
  ReturnType<typeof getPasswordResetCodeVerificationSchema>
>

export const getResetForgottenPasswordSchema = (t: TFunction) =>
  z
    .object({
      newPassword: z.string().min(8, t('validation.passwordMin')),
      confirmationPassword: z.string().min(1, t('validation.required')),
    })
    .refine((values) => values.newPassword === values.confirmationPassword, {
      message: t('validation.passwordMatch'),
      path: ['confirmationPassword'],
    })

export type ResetForgottenPasswordFormValues = z.infer<
  ReturnType<typeof getResetForgottenPasswordSchema>
>

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
      description: z
        .string()
        .trim()
        .max(500, t('validation.descriptionMax')),
      email: z
        .string()
        .trim()
        .min(1, t('validation.required'))
        .email(t('validation.email')),
      password: z.string().min(8, t('validation.passwordMin')),
      repeatedPassword: z.string().min(1, t('validation.required')),
      acceptLegalDocuments: z.boolean().refine((isAccepted) => isAccepted, {
        message: t('validation.acceptLegalDocuments'),
      }),
    })
    .refine((values) => values.password === values.repeatedPassword, {
      message: t('validation.passwordMatch'),
      path: ['repeatedPassword'],
    })

export type RegisterFormValues = z.infer<ReturnType<typeof getRegisterSchema>>
