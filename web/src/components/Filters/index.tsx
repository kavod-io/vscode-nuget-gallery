import { ChangeEvent, MouseEventHandler } from 'react'

import './Filters.scss'

interface FiltersProps {
  filter: string
  includePrerelease: boolean
  autocompleteOptions: string[]
  filterChanged: (filter: string) => void
  refresh: () => void
  prereleaseChanged: () => void
}

const Filters = ({
  filter,
  includePrerelease,
  //autocompleteOptions, TODO need to implement a control that can display autocomplate options
  prereleaseChanged,
  refresh,
  filterChanged
}: FiltersProps) => {
  const onFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    filterChanged(event.target.value)
  }

  const onFilterButtonClicked: MouseEventHandler<HTMLButtonElement> = () => {
    refresh()
  }

  return (
    <div>
      <input className="filterBox" onChange={onFilterChange} value={filter} />
      <button onClick={onFilterButtonClicked}>Filter</button>
      <input
        className="prereleaseBox"
        type="checkbox"
        checked={includePrerelease}
        onChange={prereleaseChanged}
      />
      <span>Prerelease</span>
    </div>
  )
}

export default Filters
