import type { TFunction } from 'i18next'
import { z } from 'zod'

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
