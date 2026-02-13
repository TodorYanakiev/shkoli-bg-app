import { z } from 'zod'

export const getLyceumFilterSchema = () =>
  z.object({
    town: z.string().trim(),
  })

export type LyceumFilterFormValues = z.infer<
  ReturnType<typeof getLyceumFilterSchema>
>
