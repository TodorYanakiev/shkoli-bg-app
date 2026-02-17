import type { TFunction } from 'i18next'
import { z } from 'zod'

export const getAdminUserEditSchema = (t: TFunction) =>
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

export type AdminUserEditFormValues = z.infer<
  ReturnType<typeof getAdminUserEditSchema>
>

