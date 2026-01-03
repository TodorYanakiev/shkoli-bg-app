import type { TFunction } from 'i18next'
import { z } from 'zod'

export const getLyceumRightsRequestSchema = (t: TFunction) =>
  z.object({
    lyceumName: z.string().trim().min(1, t('validation.required')),
    town: z.string().trim().min(1, t('validation.required')),
  })

export type LyceumRightsRequestFormValues = z.infer<
  ReturnType<typeof getLyceumRightsRequestSchema>
>

export const getLyceumRightsVerificationSchema = (t: TFunction) =>
  z.object({
    verificationCode: z.string().trim().min(1, t('validation.required')),
  })

export type LyceumRightsVerificationFormValues = z.infer<
  ReturnType<typeof getLyceumRightsVerificationSchema>
>
