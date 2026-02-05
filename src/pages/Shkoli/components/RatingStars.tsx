type RatingStarsProps = {
  rating?: number
  max?: number
  showValue?: boolean
  className?: string
  ariaLabel?: string
}

export const RatingStars = ({
  rating = 5,
  max = 5,
  showValue = true,
  className,
  ariaLabel,
}: RatingStarsProps) => {
  const safeRating = Math.min(Math.max(rating, 0), max)

  return (
    <div
      className={`flex items-center gap-1 ${className ?? ''}`.trim()}
      aria-label={ariaLabel ?? `${safeRating}/${max}`}
    >
      {Array.from({ length: max }, (_, index) => {
        const isActive = index < safeRating
        return (
          <svg
            key={`star-${index}`}
            viewBox="0 0 20 20"
            className={`h-3.5 w-3.5 ${
              isActive ? 'text-amber-400' : 'text-slate-300'
            }`}
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M10 1.5l2.47 4.99 5.5.8-3.98 3.88.94 5.49L10 14.9l-4.93 2.57.94-5.49L2.03 7.29l5.5-.8L10 1.5z" />
          </svg>
        )
      })}
      {showValue ? (
        <span className="text-xs font-semibold text-amber-600">
          {safeRating}/{max}
        </span>
      ) : null}
    </div>
  )
}
