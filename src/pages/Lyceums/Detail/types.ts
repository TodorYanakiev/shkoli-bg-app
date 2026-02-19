import type { ReactNode, RefObject } from 'react'

export type OverviewDetail = {
  label: string
  value: string
  href?: string
}

export type CarouselMetrics = {
  step: number
  perView: number
  trackRef: RefObject<HTMLUListElement>
  cardRef: RefObject<HTMLLIElement>
}

export type CarouselState = {
  offset: number
  canGoPrev: boolean
  canGoNext: boolean
  startIndex: number
  perView: number
  trackRef: RefObject<HTMLUListElement>
  cardRef: RefObject<HTMLLIElement>
  onPrev: () => void
  onNext: () => void
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

export type LyceumDetailTabKey =
  | 'overview'
  | 'courses'
  | 'gallery'
  | 'lecturers'
  | 'reviews'
