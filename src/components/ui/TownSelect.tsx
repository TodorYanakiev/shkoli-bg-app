import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { createPortal } from 'react-dom'

type TownSelectProps = {
  id: string
  value: string
  options: readonly string[]
  placeholder: string
  emptyOptionLabel?: string
  variant?: 'form' | 'filter'
  disabled?: boolean
  hasError?: boolean
  describedById?: string
  onChange: (value: string) => void
  onBlur?: () => void
}

type TownSelectOption = {
  value: string
  label: string
}

const TownSelect = ({
  id,
  value,
  options,
  placeholder,
  emptyOptionLabel,
  variant = 'form',
  disabled = false,
  hasError = false,
  describedById,
  onChange,
  onBlur,
}: TownSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const listRef = useRef<HTMLUListElement | null>(null)
  const [panelStyles, setPanelStyles] = useState<{
    top: number
    left: number
    width: number
    maxHeight: number
  } | null>(null)
  const selectOptions = useMemo<TownSelectOption[]>(() => {
    const townOptions = options.map((option) => ({
      value: option,
      label: option,
    }))

    if (!emptyOptionLabel) return townOptions

    return [
      {
        value: '',
        label: emptyOptionLabel,
      },
      ...townOptions,
    ]
  }, [emptyOptionLabel, options])
  const selectedIndex = useMemo(
    () => selectOptions.findIndex((option) => option.value === value),
    [selectOptions, value],
  )
  const listId = `${id}-listbox`
  const activeId =
    isOpen && highlightedIndex >= 0
      ? `${id}-option-${highlightedIndex}`
      : undefined

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (!wrapperRef.current) return
      if (
        wrapperRef.current.contains(target) ||
        listRef.current?.contains(target)
      ) {
        return
      }
      setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  useLayoutEffect(() => {
    if (!isOpen) {
      setPanelStyles(null)
      return
    }

    const updatePanelPosition = () => {
      if (!wrapperRef.current) return
      const rect = wrapperRef.current.getBoundingClientRect()
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

      setPanelStyles({
        top,
        left,
        width: rect.width,
        maxHeight: panelMaxHeight,
      })
    }

    updatePanelPosition()
    window.addEventListener('resize', updatePanelPosition)
    window.addEventListener('scroll', updatePanelPosition, true)
    return () => {
      window.removeEventListener('resize', updatePanelPosition)
      window.removeEventListener('scroll', updatePanelPosition, true)
    }
  }, [isOpen, selectOptions.length])

  useEffect(() => {
    if (!isOpen) return
    setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0)
  }, [isOpen, selectedIndex])

  const handleToggle = () => {
    if (disabled) return
    setIsOpen((prev) => !prev)
  }

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setIsOpen(true)
      setHighlightedIndex((prev) => {
        if (selectOptions.length === 0) return -1
        const next = prev < 0 ? 0 : (prev + 1) % selectOptions.length
        return next
      })
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setIsOpen(true)
      setHighlightedIndex((prev) => {
        if (selectOptions.length === 0) return -1
        const next =
          prev < 0
            ? selectOptions.length - 1
            : (prev - 1 + selectOptions.length) % selectOptions.length
        return next
      })
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
        return
      }
      if (highlightedIndex >= 0 && highlightedIndex < selectOptions.length) {
        handleSelect(selectOptions[highlightedIndex].value)
      }
      return
    }
    if (event.key === 'Escape') {
      if (isOpen) {
        event.preventDefault()
        setIsOpen(false)
      }
    }
  }

  const isFilterVariant = variant === 'filter'

  const triggerClassName = isFilterVariant
    ? [
        'flex h-11 w-full items-center gap-3 rounded-full border px-4 py-2 text-left shadow-sm transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200',
        disabled
          ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 shadow-none'
          : 'cursor-pointer border-slate-200/80 bg-white/80 hover:border-emerald-200',
        hasError ? 'border-rose-300' : '',
      ].join(' ')
    : [
        'flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-md transition',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
        disabled
          ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 shadow-none'
          : 'cursor-pointer bg-gradient-to-br from-white via-white to-brand/5 text-slate-900',
        hasError
          ? 'border-rose-300'
          : isOpen
            ? 'border-brand/40 ring-2 ring-brand/15'
            : 'border-slate-200 hover:border-brand/30',
      ].join(' ')

  const optionClassName = (isActive: boolean, isSelected: boolean) =>
    isFilterVariant
      ? [
          'flex w-full items-center justify-between rounded-lg px-2 py-1 text-left text-sm transition',
          isActive || isSelected
            ? 'bg-emerald-50 text-emerald-800'
            : 'text-slate-700 hover:bg-emerald-50/80',
        ].join(' ')
      : [
          'relative flex w-full items-center justify-between rounded-full px-4 py-2 text-left text-sm font-semibold transition',
          isActive || isSelected
            ? 'bg-gradient-to-r from-brand/20 via-brand/30 to-brand/20 text-brand-dark shadow-inner'
            : 'text-slate-700 hover:bg-brand/10 hover:text-brand-dark',
        ].join(' ')

  const listClassName = isFilterVariant
    ? 'fixed z-[80] overflow-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-lg'
    : 'fixed z-[80] space-y-1 overflow-auto rounded-3xl border border-slate-200 bg-white/95 px-2 py-2 pb-3 shadow-xl ring-1 ring-black/5 backdrop-blur scroll-pb-3'

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={activeId}
        aria-invalid={hasError || undefined}
        aria-describedby={describedById}
        className={triggerClassName}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
      >
        {isFilterVariant ? (
          <svg
            viewBox="0 0 20 20"
            className="h-4 w-4 shrink-0 text-emerald-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <path
              d="M10 2.5c-2.9 0-5.2 2.2-5.2 5 0 3.5 4.2 8.5 5.2 8.5s5.2-5 5.2-8.5c0-2.8-2.3-5-5.2-5z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="10" cy="7.5" r="1.8" />
          </svg>
        ) : null}
        <span
          className={
            isFilterVariant
              ? `min-w-0 flex-1 truncate text-sm font-medium ${
                  value ? 'text-slate-700' : 'text-slate-500'
                }`
              : value
                ? 'text-slate-900'
                : 'text-slate-400'
          }
        >
          {value || placeholder}
        </span>
        <span
          className={[
            'flex items-center transition-transform',
            isFilterVariant ? 'text-slate-400' : 'text-brand',
            isOpen ? 'rotate-180' : 'rotate-0',
          ].join(' ')}
          aria-hidden="true"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20">
            <path
              d="M5.5 7.5l4.5 4.5 4.5-4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {isOpen && panelStyles && typeof document !== 'undefined'
        ? createPortal(
            <ul
              id={listId}
              role="listbox"
              ref={listRef}
              className={listClassName}
              style={{
                top: panelStyles.top,
                left: panelStyles.left,
                width: panelStyles.width,
                maxHeight: panelStyles.maxHeight,
              }}
            >
              {selectOptions.map((option, index) => {
                const isSelected = option.value === value
                const isActive = index === highlightedIndex
                return (
                  <li
                    key={option.value || '__empty-town-option'}
                    id={`${id}-option-${index}`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <button
                      type="button"
                      className={optionClassName(isActive, isSelected)}
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      onClick={() => handleSelect(option.value)}
                    >
                      <span>{option.label}</span>
                      {isSelected ? (
                        <span
                          className="h-2 w-2 rounded-full bg-brand"
                          aria-hidden="true"
                        />
                      ) : null}
                    </button>
                  </li>
                )
              })}
            </ul>,
            document.body,
          )
        : null}
    </div>
  )
}

export default TownSelect
