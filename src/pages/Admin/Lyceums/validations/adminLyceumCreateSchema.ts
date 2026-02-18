import type { TFunction } from 'i18next'
import { z } from 'zod'

import { LYCEUM_TOWNS } from '../../../../constants/lyceums'

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

const isLyceumTown = (value: string) =>
  LYCEUM_TOWNS.includes(value as (typeof LYCEUM_TOWNS)[number])

const getRequiredTownField = (t: TFunction) =>
  z
    .string()
    .trim()
    .min(1, t('validation.required'))
    .refine((value) => isLyceumTown(value), {
      message: t('validation.invalidOption'),
    })

const getOptionalRegionField = (t: TFunction) =>
  z.string().trim().refine((value) => value === '' || isLyceumTown(value), {
    message: t('validation.invalidOption'),
  })

export const getAdminLyceumCreateSchema = (t: TFunction) =>
  z.object({
    name: z.string().trim().min(1, t('validation.required')),
    chitalishtaUrl: optionalTextField,
    status: optionalTextField,
    bulstat: optionalTextField,
    chairman: optionalTextField,
    secretary: optionalTextField,
    phone: optionalTextField,
    town: getRequiredTownField(t),
    region: getOptionalRegionField(t),
    municipality: optionalTextField,
    address: optionalTextField,
    urlToLibrariesSite: optionalTextField,
    registrationNumber: getOptionalNumberField(t),
    longitude: getOptionalNumberField(t),
    latitude: getOptionalNumberField(t),
    email: getOptionalEmailField(t),
  })

export type AdminLyceumCreateFormValues = z.infer<
  ReturnType<typeof getAdminLyceumCreateSchema>
>
