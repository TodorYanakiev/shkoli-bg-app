import { Link } from 'react-router-dom'

import { useLocalizedPath } from '../../hooks/useLocalizedPath'

export type BreadcrumbItem = {
  label: string
  path?: string
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
  ariaLabel: string
  className?: string
}

const Breadcrumbs = ({
  items,
  ariaLabel,
  className,
}: BreadcrumbsProps) => {
  const localizedPath = useLocalizedPath()

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-xs text-slate-600">
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1

          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
              {item.path && !isLastItem ? (
                <Link
                  to={localizedPath(item.path)}
                  className="hover:text-brand hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLastItem ? 'page' : undefined}
                  className={isLastItem ? 'font-semibold text-slate-800' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLastItem ? <span aria-hidden="true">/</span> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs

