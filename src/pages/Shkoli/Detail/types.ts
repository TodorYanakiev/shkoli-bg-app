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
      onClick?: never
      controlsId?: never
    }
  | {
      key: string
      label: string
      icon: ReactNode
      to: string
      href?: never
      onClick?: never
      controlsId?: never
    }
  | {
      key: string
      label: string
      icon: ReactNode
      onClick: () => void
      controlsId?: string
      href?: never
      to?: never
    }

export type CourseDetailValue = {
  label: string
  value: string
}

export type CourseDetailTabKey =
  | 'overview'
  | 'schedule'
  | 'gallery'
  | 'lecturers'
  | 'statistics'
  | 'reviews'
