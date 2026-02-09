import { useMemo } from 'react'
import {
  useController,
  type Control,
  type FieldErrors,
} from 'react-hook-form'
import type { TFunction } from 'i18next'

import type { CourseFilterFormValues } from '../validations/courseFilterSchema'

type CoursePriceRangeSliderProps = {
  control: Control<CourseFilterFormValues>
  errors: FieldErrors<CourseFilterFormValues>
  locale: string
  t: TFunction
}

const PRICE_MIN = 0
const PRICE_MAX = 300
const PRICE_STEP = 5

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const parseNumber = (value: string, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const CoursePriceRangeSlider = ({
  control,
  errors,
  locale,
  t,
}: CoursePriceRangeSliderProps) => {
  const { field: minField } = useController({
    control,
    name: 'minPrice',
  })
  const { field: maxField } = useController({
    control,
    name: 'maxPrice',
  })
  const minRaw = String(minField.value ?? '')
  const maxRaw = String(maxField.value ?? '')
  const hasMin = minRaw.trim() !== ''
  const hasMax = maxRaw.trim() !== ''

  const minValue = hasMin
    ? clamp(parseNumber(minRaw, PRICE_MIN), PRICE_MIN, PRICE_MAX)
    : PRICE_MIN
  const maxValue = hasMax
    ? clamp(parseNumber(maxRaw, PRICE_MAX), minValue, PRICE_MAX)
    : PRICE_MAX

  const formatter = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }),
    [locale],
  )

  const leftPercent =
    ((minValue - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100
  const rightPercent =
    ((maxValue - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100

  const handleMinChange = (value: number) => {
    const normalized = Math.min(value, maxValue)
    const nextMin =
      normalized <= PRICE_MIN ? '' : String(normalized)
    minField.onChange(nextMin)
    if (value > maxValue) {
      const nextMax =
        normalized >= PRICE_MAX ? '' : String(normalized)
      maxField.onChange(nextMax)
    }
  }

  const handleMaxChange = (value: number) => {
    const normalized = Math.max(value, minValue)
    const nextMax =
      normalized >= PRICE_MAX ? '' : String(normalized)
    maxField.onChange(nextMax)
    if (value < minValue) {
      const nextMin =
        normalized <= PRICE_MIN ? '' : String(normalized)
      minField.onChange(nextMin)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-3 py-2 shadow-sm">
      <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-slate-600">
        <span>
          {t('pages.shkoli.list.filters.priceFrom')}{' '}
          <span className="text-emerald-800">
            {formatter.format(minValue)}
          </span>
        </span>
        <span>
          {t('pages.shkoli.list.filters.priceTo')}{' '}
          <span className="text-emerald-800">
            {formatter.format(maxValue)}
          </span>
        </span>
      </div>
      <div className="relative mt-2 h-5">
        <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-slate-200" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-emerald-500/80"
          style={{
            left: `${leftPercent}%`,
            width: `${rightPercent - leftPercent}%`,
          }}
        />
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={PRICE_STEP}
          value={minValue}
          onChange={(event) =>
            handleMinChange(Number(event.target.value))
          }
          className="price-range-input z-20"
          aria-label={t('pages.shkoli.list.filters.priceFrom')}
        />
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={PRICE_STEP}
          value={maxValue}
          onChange={(event) =>
            handleMaxChange(Number(event.target.value))
          }
          className="price-range-input z-30"
          aria-label={t('pages.shkoli.list.filters.priceTo')}
        />
      </div>
      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
        <span>{formatter.format(PRICE_MIN)}</span>
        <span>{formatter.format(PRICE_MAX)}</span>
      </div>
      {errors.minPrice ? (
        <p className="mt-2 text-xs text-rose-600">
          {errors.minPrice.message}
        </p>
      ) : null}
      {errors.maxPrice ? (
        <p className="mt-1 text-xs text-rose-600">
          {errors.maxPrice.message}
        </p>
      ) : null}
    </div>
  )
}
