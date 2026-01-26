import type { ReactNode } from 'react'

import { fieldsetClassName, legendClassName } from './lyceumEditFormStyles'

type LyceumEditFormSectionProps = {
  title: string
  children: ReactNode
}

export const LyceumEditFormSection = ({
  title,
  children,
}: LyceumEditFormSectionProps) => (
  <fieldset className={fieldsetClassName}>
    <legend className={legendClassName}>{title}</legend>
    {children}
  </fieldset>
)
