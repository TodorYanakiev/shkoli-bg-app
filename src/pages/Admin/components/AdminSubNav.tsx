import { useTranslation } from 'react-i18next'
import { NavLink, type NavLinkRenderProps } from 'react-router-dom'

import { useAdminNavItems } from '../hooks/useAdminNavItems'

const tabClassName = ({ isActive }: NavLinkRenderProps) =>
  [
    'inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm',
    isActive
      ? 'bg-brand text-white shadow-sm'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  ].join(' ')

export const AdminSubNav = () => {
  const { t } = useTranslation()
  const items = useAdminNavItems()

  return (
    <nav
      aria-label={t('pages.admin.navLabel')}
      className="flex items-center gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-sm lg:hidden"
    >
      {items.map((item) => (
        <NavLink key={item.id} to={item.to} className={tabClassName}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
