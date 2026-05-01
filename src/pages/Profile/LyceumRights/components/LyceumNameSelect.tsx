import TownSelect from './TownSelect'

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

const LyceumNameSelect = (props: LyceumNameSelectProps) => (
  <TownSelect {...props} />
)

export default LyceumNameSelect
