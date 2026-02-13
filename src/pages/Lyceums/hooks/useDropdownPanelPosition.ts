import { useLayoutEffect, useState, type RefObject } from 'react'

type PanelStyles = {
  top: number
  left: number
  width: number
  maxHeight: number
}

const getPanelPosition = (target: HTMLElement | null): PanelStyles | null => {
  if (!target || typeof window === 'undefined') return null

  const rect = target.getBoundingClientRect()
  const gap = 8
  const viewportPadding = 16
  const maxHeight = 288
  const minHeight = 140
  const spaceBelow = window.innerHeight - rect.bottom - viewportPadding
  const spaceAbove = rect.top - viewportPadding
  const openDown = spaceBelow >= minHeight || spaceBelow >= spaceAbove
  const availableSpace = openDown ? spaceBelow : spaceAbove
  const panelMaxHeight = Math.min(
    maxHeight,
    Math.max(availableSpace, minHeight),
  )
  const maxLeft = Math.max(
    viewportPadding,
    window.innerWidth - viewportPadding - rect.width,
  )
  const left = Math.min(Math.max(rect.left, viewportPadding), maxLeft)
  const top = openDown
    ? rect.bottom + gap
    : Math.max(viewportPadding, rect.top - gap - panelMaxHeight)

  return {
    top,
    left,
    width: rect.width,
    maxHeight: panelMaxHeight,
  }
}

export const useDropdownPanelPosition = (
  isOpen: boolean,
  targetRef: RefObject<HTMLElement>,
) => {
  const [panelStyles, setPanelStyles] = useState<PanelStyles | null>(null)

  useLayoutEffect(() => {
    if (!isOpen || typeof window === 'undefined') {
      setPanelStyles(null)
      return
    }

    const update = () => {
      setPanelStyles(getPanelPosition(targetRef.current))
    }

    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [isOpen, targetRef])

  return panelStyles
}
