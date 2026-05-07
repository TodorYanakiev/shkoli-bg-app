import { useEffect, useMemo, useState } from 'react'

type UseLyceumDetailLayoutOptions = {
  hasLyceum: boolean
}

export const useLyceumDetailLayout = ({
  hasLyceum,
}: UseLyceumDetailLayoutOptions) => {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(min-width: 1024px)').matches
  })
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(false)

  const sideNavWidth = !isDesktop
    ? '0px'
    : isSideNavExpanded
      ? '16rem'
      : '4.75rem'

  const navIconClassName = 'h-5 w-5'
  const sideNavBaseButtonClassName =
    'group inline-flex items-center rounded-lg text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 lg:text-sm'
  const sideNavItemClassName = useMemo(
    () =>
      [
        sideNavBaseButtonClassName,
        isSideNavExpanded
          ? 'w-full justify-start gap-3 px-3 py-1'
          : 'h-11 w-11 justify-center',
      ].join(' '),
    [sideNavBaseButtonClassName, isSideNavExpanded],
  )
  const sideNavIconClassName =
    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-brand transition group-hover:border-brand/30'
  const sideNavToggleClassName = useMemo(
    () =>
      [
        sideNavBaseButtonClassName,
        'mt-2',
        isSideNavExpanded
          ? 'w-full justify-start gap-3 px-3 py-1'
          : 'h-11 w-11 justify-center',
      ].join(' '),
    [sideNavBaseButtonClassName, isSideNavExpanded],
  )
  const sideNavContainerClassName = useMemo(
    () =>
      [
        'flex h-full w-full flex-col gap-3 px-2 py-4',
        isSideNavExpanded ? 'items-stretch' : 'items-center',
      ].join(' '),
    [isSideNavExpanded],
  )
  const sideNavListClassName = useMemo(
    () =>
      [
        'flex flex-1 flex-col gap-2 overflow-y-auto',
        isSideNavExpanded ? 'pr-1' : 'pr-0',
      ].join(' '),
    [isSideNavExpanded],
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(min-width: 1024px)')
    const handleChange = () => {
      setIsDesktop(media.matches)
      if (!media.matches) {
        setIsSideNavExpanded(false)
      }
    }

    handleChange()

    if (media.addEventListener) {
      media.addEventListener('change', handleChange)
      return () => media.removeEventListener('change', handleChange)
    }

    media.addListener(handleChange)
    return () => media.removeListener(handleChange)
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement

    if (!hasLyceum || !isDesktop) {
      root.style.removeProperty('--page-sidebar-offset')
      return
    }

    root.style.setProperty('--page-sidebar-offset', sideNavWidth)

    return () => {
      root.style.removeProperty('--page-sidebar-offset')
    }
  }, [hasLyceum, sideNavWidth, isDesktop])

  return {
    isDesktop,
    isSideNavExpanded,
    setIsSideNavExpanded,
    sideNavWidth,
    navIconClassName,
    sideNavItemClassName,
    sideNavIconClassName,
    sideNavToggleClassName,
    sideNavContainerClassName,
    sideNavListClassName,
  }
}
