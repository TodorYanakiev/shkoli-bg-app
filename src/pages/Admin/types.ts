import type { ComponentType } from 'react'

export type AdminTabId = 'courses' | 'lyceums' | 'users' | 'feedback'

export type AdminTab = {
  id: AdminTabId
  label: string
  to: string
}

export type AdminNavItem = AdminTab & {
  Icon: ComponentType<{ className?: string }>
}

export type AdminReviewEntityType = 'course' | 'lyceum' | 'user'

export type AdminReviewEntity = {
  type: AdminReviewEntityType
  id: number
  name?: string
  averageRating?: number | null
}
