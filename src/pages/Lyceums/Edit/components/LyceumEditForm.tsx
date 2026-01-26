import type { TFunction } from 'i18next'
import type { UseFormReturn } from 'react-hook-form'

import type { LyceumUpdateFormValues } from '../validations/lyceumUpdateSchema'
import { LyceumEditBasicsSection } from './LyceumEditBasicsSection'
import { LyceumEditContactsSection } from './LyceumEditContactsSection'
import { LyceumEditFormActions } from './LyceumEditFormActions'
import { LyceumEditLeadershipSection } from './LyceumEditLeadershipSection'
import { LyceumEditLinksSection } from './LyceumEditLinksSection'
import { LyceumEditLocationSection } from './LyceumEditLocationSection'

type LyceumEditFormProps = {
  form: UseFormReturn<LyceumUpdateFormValues>
  onSubmit: (values: LyceumUpdateFormValues) => void
  isSubmitting: boolean
  updateErrorMessage: string | null
  lyceumId: number
  t: TFunction
}

export const LyceumEditForm = ({
  form,
  onSubmit,
  isSubmitting,
  updateErrorMessage,
  lyceumId,
  t,
}: LyceumEditFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-6 rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6 lg:p-8"
      aria-busy={isSubmitting}
    >
      <LyceumEditBasicsSection register={register} errors={errors} t={t} />
      <LyceumEditLocationSection register={register} errors={errors} t={t} />
      <LyceumEditContactsSection register={register} errors={errors} t={t} />
      <LyceumEditLinksSection register={register} errors={errors} t={t} />
      <LyceumEditLeadershipSection register={register} errors={errors} t={t} />
      {updateErrorMessage ? (
        <div
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
          role="alert"
        >
          {updateErrorMessage}
        </div>
      ) : null}
      <LyceumEditFormActions
        lyceumId={lyceumId}
        isSubmitting={isSubmitting}
        t={t}
      />
    </form>
  )
}
