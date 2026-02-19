import { Link } from 'react-router-dom'

import { useLocalizedPath } from '../../../hooks/useLocalizedPath'

type TopNavBrandProps = {
  logoSrc: string
  logoAlt: string
  title: string
}

export const TopNavBrand = ({
  logoSrc,
  logoAlt,
  title,
}: TopNavBrandProps) => {
  const localizedPath = useLocalizedPath()

  return (
    <Link
      to={localizedPath('/shkoli')}
      className="group flex items-center gap-3"
      aria-label={title}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 ring-1 ring-brand/20 shadow-sm transition group-hover:bg-brand/15">
        <img
          src={logoSrc}
          alt={logoAlt}
          className="h-7 w-7 object-contain"
          loading="lazy"
        />
      </span>
      <span className="text-base font-semibold text-brand">{title}</span>
    </Link>
  )
}
