import { useTranslation } from 'react-i18next'

import {
  AdminCoursesIcon,
  AdminLyceumsIcon,
  AdminUsersIcon,
} from '../components/AdminNavIcons'
import { getAdminTabPath } from '../services/adminPaths'
import type { AdminNavItem } from '../types'

export const useAdminNavItems = (): AdminNavItem[] => {
  const { t } = useTranslation()

  return [
    {
      id: 'courses',
      label: t('pages.admin.tabs.courses'),
      to: getAdminTabPath('courses'),
      Icon: AdminCoursesIcon,
    },
    {
      id: 'lyceums',
      label: t('pages.admin.tabs.lyceums'),
      to: getAdminTabPath('lyceums'),
      Icon: AdminLyceumsIcon,
    },
    {
      id: 'users',
      label: t('pages.admin.tabs.users'),
      to: getAdminTabPath('users'),
      Icon: AdminUsersIcon,
    },
  ]
}
