import type { TFunction } from 'i18next'
import { z } from 'zod'

export const getLyceumLecturerSchema = (t: TFunction) =>
  z.object({
    email: z
      .string()
      .trim()
      .min(1, t('validation.required'))
      .email(t('validation.email')),
  })

export type LyceumLecturerFormValues = z.infer<
  ReturnType<typeof getLyceumLecturerSchema>
>
