import type { ComponentType } from 'react'

export type AdminTabId = 'courses' | 'lyceums' | 'users'

export type AdminTab = {
  id: AdminTabId
  label: string
  to: string
}

export type AdminNavItem = AdminTab & {
  Icon: ComponentType<{ className?: string }>
}
