import type { TFunction } from 'i18next'
import { z } from 'zod'

import { LYCEUM_TOWNS } from '../constants/lyceums'

const isLyceumTown = (value: string) =>
  LYCEUM_TOWNS.includes(value as (typeof LYCEUM_TOWNS)[number])

export const getLyceumRightsRequestSchema = (t: TFunction) =>
  z.object({
    lyceumName: z.string().trim().min(1, t('validation.required')),
    town: z
      .string()
      .trim()
      .min(1, t('validation.required'))
      .refine(isLyceumTown, {
        message: t('validation.invalidOption'),
      }),
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
