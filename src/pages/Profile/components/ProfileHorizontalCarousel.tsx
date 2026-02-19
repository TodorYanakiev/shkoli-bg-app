import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

const EDGE_THRESHOLD = 4
const SCROLL_STEP_RATIO = 0.9

type ProfileHorizontalCarouselProps<T> = {
  items: T[]
  getItemKey: (item: T, index: number) => string | number
  renderItem: (item: T, index: number) => ReactNode
  previousLabel: string
  nextLabel: string
  itemClassName?: string
}

const ProfileHorizontalCarousel = <T,>({
  items,
  getItemKey,
  renderItem,
  previousLabel,
  nextLabel,
  itemClassName,
}: ProfileHorizontalCarouselProps<T>) => {
  const trackRef = useRef<HTMLUListElement | null>(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(items.length > 1)
  const hasMultipleItems = items.length > 1

  const updateScrollState = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    const maxScrollLeft = track.scrollWidth - track.clientWidth
    setCanScrollPrev(track.scrollLeft > EDGE_THRESHOLD)
    setCanScrollNext(maxScrollLeft - track.scrollLeft > EDGE_THRESHOLD)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const handleScroll = () => updateScrollState()
    handleScroll()

    track.addEventListener('scroll', handleScroll, { passive: true })

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', handleScroll)
      return () => {
        track.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleScroll)
      }
    }

    const observer = new ResizeObserver(handleScroll)
    observer.observe(track)

    return () => {
      track.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [items.length, updateScrollState])

  const handleScrollBy = useCallback(
    (direction: -1 | 1) => {
      const track = trackRef.current
      if (!track) return

      track.scrollBy({
        left: track.clientWidth * SCROLL_STEP_RATIO * direction,
        behavior: 'smooth',
      })
    },
    [],
  )

  const resolvedItemClassName = useMemo(
    () =>
      ['w-full shrink-0 snap-start', itemClassName ?? ''].join(' ').trim(),
    [itemClassName],
  )

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-emerald-50/60 via-white to-slate-50/90 p-3 sm:p-4">
      <div className="space-y-3">
        <div className="flex min-h-9 items-center justify-end gap-2">
          {hasMultipleItems ? (
            <>
              <button
                type="button"
                onClick={() => handleScrollBy(-1)}
                aria-label={previousLabel}
                disabled={!canScrollPrev}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-300"
              >
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path
                    d="M12.5 4.5L7 10l5.5 5.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleScrollBy(1)}
                aria-label={nextLabel}
                disabled={!canScrollNext}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-300"
              >
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path
                    d="M7.5 4.5L13 10l-5.5 5.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          ) : null}
        </div>

        <ul
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item, index) => (
            <li key={getItemKey(item, index)} className={resolvedItemClassName}>
              {renderItem(item, index)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ProfileHorizontalCarousel
