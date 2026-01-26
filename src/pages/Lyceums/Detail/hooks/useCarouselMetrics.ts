import { useEffect, useRef, useState } from 'react'

import type { CarouselMetrics } from '../types'

export const useCarouselMetrics = (
  itemsCount: number,
  fallbackPerView: number,
): CarouselMetrics => {
  const [step, setStep] = useState(0)
  const [perView, setPerView] = useState(fallbackPerView)
  const trackRef = useRef<HTMLUListElement | null>(null)
  const cardRef = useRef<HTMLLIElement | null>(null)

  useEffect(() => {
    const track = trackRef.current
    const firstCard = cardRef.current
    if (!track || !firstCard) return

    const updateMetrics = () => {
      const styles = getComputedStyle(track)
      const gapValue = Number.parseFloat(
        styles.columnGap || styles.gap || '0',
      )
      const columnsValue = Number.parseInt(
        styles.getPropertyValue('--carousel-cols'),
        10,
      )
      const cardWidth = firstCard.getBoundingClientRect().width
      const gap = Number.isFinite(gapValue) ? gapValue : 0

      if (Number.isFinite(cardWidth) && cardWidth > 0) {
        setStep(cardWidth + gap)
      }

      if (Number.isFinite(columnsValue) && columnsValue > 0) {
        setPerView(columnsValue)
      } else {
        setPerView(fallbackPerView)
      }
    }

    updateMetrics()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateMetrics)
      return () => window.removeEventListener('resize', updateMetrics)
    }

    const observer = new ResizeObserver(updateMetrics)
    observer.observe(track)
    observer.observe(firstCard)
    return () => observer.disconnect()
  }, [itemsCount, fallbackPerView])

  return { step, perView, trackRef, cardRef }
}
