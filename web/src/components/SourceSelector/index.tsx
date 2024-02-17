import { ChangeEventHandler } from 'react'
import { PackageSource } from '../../contracts'

import './SourceSelector.scss'

interface SourceSelectorProps {
  sources: PackageSource[]
  currentSource: PackageSource | null
  sourceChanged: (source: PackageSource) => void
}

const SourceSelector = ({ sources, currentSource, sourceChanged }: SourceSelectorProps) => {
  if (sources.length === 0) {
    return (
      <div>
        <div className="source-selector">No Sources</div>
      </div>
    )
  }

  const handleSourceChanged: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const index = parseInt(e.target.value)
    const source = sources[index]
    sourceChanged(source)
  }

  const selectedValue = currentSource ? sources.indexOf(currentSource) : 0

  return (
    <div>
      <select className="source-selector" onChange={handleSourceChanged} value={selectedValue}>
        {sources.map((s, i) => (
          <option key={s.name} value={i}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SourceSelector
