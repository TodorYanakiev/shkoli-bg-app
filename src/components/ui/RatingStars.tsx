type RatingStarsProps = {
  rating?: number
  max?: number
  showValue?: boolean
  className?: string
  ariaLabel?: string
  valueClassName?: string
}

const clampRating = (rating: number, max: number) =>
  Math.min(Math.max(rating, 0), max)

const formatRatingValue = (rating: number) =>
  Number.isInteger(rating) ? `${rating}` : rating.toFixed(1)

export const RatingStars = ({
  rating = 0,
  max = 5,
  showValue = true,
  className,
  ariaLabel,
  valueClassName,
}: RatingStarsProps) => {
  const safeRating = clampRating(rating, max)

  return (
    <div
      className={`flex items-center gap-1 ${className ?? ''}`.trim()}
      aria-label={ariaLabel ?? `${safeRating}/${max}`}
    >
      {Array.from({ length: max }, (_, index) => {
        const fillPercent = clampRating(safeRating - index, 1) * 100

        return (
          <span
            key={`star-${index}`}
            className="relative inline-block h-3.5 w-3.5"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 20 20"
              className="h-3.5 w-3.5 text-slate-300"
              fill="currentColor"
            >
              <path d="M10 1.5l2.47 4.99 5.5.8-3.98 3.88.94 5.49L10 14.9l-4.93 2.57.94-5.49L2.03 7.29l5.5-.8L10 1.5z" />
            </svg>
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercent}%` }}
            >
              <svg
                viewBox="0 0 20 20"
                className="h-3.5 w-3.5 text-amber-400"
                fill="currentColor"
              >
                <path d="M10 1.5l2.47 4.99 5.5.8-3.98 3.88.94 5.49L10 14.9l-4.93 2.57.94-5.49L2.03 7.29l5.5-.8L10 1.5z" />
              </svg>
            </span>
          </span>
        )
      })}
      {showValue ? (
        <span className={valueClassName ?? 'text-xs font-semibold text-amber-600'}>
          {formatRatingValue(safeRating)}/{max}
        </span>
      ) : null}
    </div>
  )
}
