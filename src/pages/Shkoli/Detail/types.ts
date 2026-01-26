import type { ReactNode } from 'react'

export type ScheduleBadge = {
  label: string
  value: string
  kind: 'dayOfWeek' | 'dayOfMonth' | 'recurrence'
}

export type SideNavItem =
  | {
      key: string
      label: string
      icon: ReactNode
      href: string
      to?: never
    }
  | {
      key: string
      label: string
      icon: ReactNode
      to: string
      href?: never
    }

export type CourseDetailValue = {
  label: string
  value: string
}
