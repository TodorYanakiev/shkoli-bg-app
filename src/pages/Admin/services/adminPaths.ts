import type { AdminTabId } from '../types'

export const ADMIN_BASE_PATH = '/admin'

export const getAdminTabPath = (tab: AdminTabId) =>
  `${ADMIN_BASE_PATH}/${tab}`
