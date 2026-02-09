type LyceumNameSelectListProps = {
  id: string
  value: string
  options: readonly string[]
  highlightedIndex: number
  onHoverOption: (index: number) => void
  onSelect: (option: string) => void
}

const getOptionClassName = (isActive: boolean, isSelected: boolean) =>
  [
    'relative flex w-full items-center justify-between rounded-full px-4 py-2 text-left text-sm font-semibold transition',
    isActive || isSelected
      ? 'bg-gradient-to-r from-brand/20 via-brand/30 to-brand/20 text-brand-dark shadow-inner'
      : 'text-slate-700 hover:bg-brand/10 hover:text-brand-dark',
  ].join(' ')

const LyceumNameSelectList = ({
  id,
  value,
  options,
  highlightedIndex,
  onHoverOption,
  onSelect,
}: LyceumNameSelectListProps) => (
  <ul
    id={`${id}-listbox`}
    role="listbox"
    className="absolute z-50 mt-2 max-h-72 w-full space-y-1 overflow-auto rounded-3xl border border-slate-200 bg-white/95 px-2 py-2 pb-3 shadow-xl ring-1 ring-black/5 backdrop-blur scroll-pb-3"
  >
    {options.map((option, index) => {
      const isSelected = option === value
      const isActive = index === highlightedIndex
      return (
        <li
          key={option}
          id={`${id}-option-${index}`}
          role="option"
          aria-selected={isSelected}
        >
          <button
            type="button"
            className={getOptionClassName(isActive, isSelected)}
            onMouseDown={(event) => event.preventDefault()}
            onMouseEnter={() => onHoverOption(index)}
            onClick={() => onSelect(option)}
          >
            <span>{option}</span>
            {isSelected ? (
              <span className="h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
            ) : null}
          </button>
        </li>
      )
    })}
  </ul>
)

export default LyceumNameSelectList
