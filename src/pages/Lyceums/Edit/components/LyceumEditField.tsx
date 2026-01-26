import type { FieldError, UseFormRegister } from 'react-hook-form'

import type { LyceumUpdateFormValues } from '../validations/lyceumUpdateSchema'
import { getInputClassName } from './lyceumEditFormStyles'

type LyceumEditFieldProps = {
  id: string
  name: keyof LyceumUpdateFormValues
  label: string
  placeholder: string
  type?: string
  step?: string
  register: UseFormRegister<LyceumUpdateFormValues>
  error?: FieldError
}

export const LyceumEditField = ({
  id,
  name,
  label,
  placeholder,
  type = 'text',
  step,
  register,
  error,
}: LyceumEditFieldProps) => {
  const errorId = error ? `${id}-error` : undefined

  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-slate-800">
        {label}
      </label>
      <input
        id={id}
        type={type}
        step={step}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        className={getInputClassName(Boolean(error))}
        {...register(name)}
      />
      {error ? (
        <p id={errorId} className="mt-1 text-xs text-rose-600" role="alert">
          {error.message}
        </p>
      ) : null}
    </div>
  )
}
