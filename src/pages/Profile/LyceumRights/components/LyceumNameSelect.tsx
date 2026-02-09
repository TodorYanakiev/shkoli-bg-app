import { useEffect, useMemo, useRef, useState } from 'react'

import { getInputClassName } from './lyceumRightsFormStyles'
import LyceumNameSelectList from './LyceumNameSelectList'

type LyceumNameSelectProps = {
  id: string
  value: string
  options: readonly string[]
  placeholder: string
  disabled?: boolean
  hasError?: boolean
  describedById?: string
  onChange: (value: string) => void
  onBlur?: () => void
}

const LyceumNameSelect = ({
  id,
  value,
  options,
  placeholder,
  disabled = false,
  hasError = false,
  describedById,
  onChange,
  onBlur,
}: LyceumNameSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const hasOptions = options.length > 0
  const normalizedValue = value.trim().toLowerCase()
  const selectedIndex = useMemo(
    () =>
      options.findIndex(
        (option) => option.trim().toLowerCase() === normalizedValue,
      ),
    [options, normalizedValue],
  )
  const listId = `${id}-listbox`
  const activeId =
    isOpen && highlightedIndex >= 0 ? `${id}-option-${highlightedIndex}` : undefined

  useEffect(() => {
    if (disabled || !isFocused) {
      setIsOpen(false)
      return
    }
    if (hasOptions) {
      setIsOpen(true)
    }
  }, [disabled, hasOptions, isFocused])

  useEffect(() => {
    if (!isOpen) return
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (!wrapperRef.current?.contains(target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(-1)
      return
    }
    setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0)
  }, [isOpen, selectedIndex])

  const handleInputFocus = () => {
    setIsFocused(true)
    if (disabled || !hasOptions) return
    setIsOpen(true)
  }

  const handleInputBlur = () => {
    setIsFocused(false)
    setIsOpen(false)
    onBlur?.()
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
    if (!disabled) {
      setIsOpen(true)
    }
  }

  const handleSelect = (option: string) => {
    onChange(option)
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return
    if (event.key === 'ArrowDown') {
      if (options.length === 0) return
      event.preventDefault()
      setIsOpen(true)
      setHighlightedIndex((prev) => (prev < 0 ? 0 : (prev + 1) % options.length))
      return
    }
    if (event.key === 'ArrowUp') {
      if (options.length === 0) return
      event.preventDefault()
      setIsOpen(true)
      setHighlightedIndex((prev) =>
        prev < 0 ? options.length - 1 : (prev - 1 + options.length) % options.length,
      )
      return
    }
    if (event.key === 'Enter') {
      if (!isOpen) return
      if (highlightedIndex < 0 || highlightedIndex >= options.length) return
      event.preventDefault()
      handleSelect(options[highlightedIndex])
      return
    }
    if (event.key === 'Escape') {
      if (isOpen) {
        event.preventDefault()
        setIsOpen(false)
      }
      return
    }
    if (event.key === 'Tab') {
      setIsOpen(false)
    }
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        ref={inputRef}
        id={id}
        type="text"
        autoComplete="organization"
        placeholder={placeholder}
        value={value}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={activeId}
        aria-invalid={hasError || undefined}
        aria-describedby={describedById}
        disabled={disabled}
        className={getInputClassName(hasError, 'pr-10')}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <span
        className={[
          'pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand transition-transform',
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
      {isOpen && hasOptions ? (
        <LyceumNameSelectList
          id={id}
          value={value}
          options={options}
          highlightedIndex={highlightedIndex}
          onHoverOption={setHighlightedIndex}
          onSelect={handleSelect}
        />
      ) : null}
    </div>
  )
}

export default LyceumNameSelect
