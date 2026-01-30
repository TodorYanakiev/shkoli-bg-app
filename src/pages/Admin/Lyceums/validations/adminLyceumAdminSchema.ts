import type { TFunction } from 'i18next'
import { z } from 'zod'

export const getAdminLyceumAdminSchema = (t: TFunction) =>
  z.object({
    email: z
      .string()
      .trim()
      .min(1, t('validation.required'))
      .email(t('validation.email')),
  })

export type AdminLyceumAdminFormValues = z.infer<
  ReturnType<typeof getAdminLyceumAdminSchema>
>
