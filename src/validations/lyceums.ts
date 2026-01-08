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

const optionalTextField = z.string().trim()

const getOptionalNumberField = (t: TFunction) =>
  z.string().trim().refine(
    (value) => value === '' || Number.isFinite(Number(value)),
    {
      message: t('validation.number'),
    },
  )

const getOptionalEmailField = (t: TFunction) =>
  z.string().trim().email(t('validation.email')).or(z.literal(''))

export const getLyceumUpdateSchema = (t: TFunction) =>
  z.object({
    name: z.string().trim().min(1, t('validation.required')),
    town: z.string().trim().min(1, t('validation.required')),
    address: optionalTextField,
    region: optionalTextField,
    municipality: optionalTextField,
    phone: optionalTextField,
    email: getOptionalEmailField(t),
    urlToLibrariesSite: optionalTextField,
    chitalishtaUrl: optionalTextField,
    chairman: optionalTextField,
    secretary: optionalTextField,
    status: optionalTextField,
    bulstat: optionalTextField,
    registrationNumber: getOptionalNumberField(t),
    latitude: getOptionalNumberField(t),
    longitude: getOptionalNumberField(t),
  })

export type LyceumUpdateFormValues = z.infer<
  ReturnType<typeof getLyceumUpdateSchema>
>
