import { useCallback, useEffect, useState } from 'react'
import { PackageSource } from '../../contracts'

const debounceDelay = 750

export const useSearchFilter = (nugetSources: PackageSource[]) => {
  const [searchString, setSearchString] = useState<string>('')
  const [debouncedSearchString, setDebouncedSearchString] = useState<string>('')
  const [includePrerelease, setIncludePrerelease] = useState(false)
  const [currentSource, setCurrentSource] = useState<PackageSource | null>(null)

  // This useEffect block debounces just the text search filter.  Changing the prerelease flag or Nuget source
  // should trigger an immediate refetch of packages.
  // However, changing those values will NOT stop a pending debounced text value from occurring.
  useEffect(() => {
    const debounceTimer: NodeJS.Timeout | undefined = setTimeout(() => {
      setDebouncedSearchString(searchString)
    }, debounceDelay)

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
    }
  }, [searchString])

  // This useEffect block makes sure that when we receive nuget sources that the current source is populated.
  useEffect(() => {
    if (!currentSource && nugetSources?.length > 0) {
      setCurrentSource(nugetSources[0])
    }
  }, [currentSource, nugetSources])

  const updateSearchString = useCallback((value: string) => {
    setSearchString(value)
  }, [])

  return {
    currentSource,
    setCurrentSource,

    searchString,
    updateSearchString,
    debouncedSearchString,

    includePrerelease,
    setIncludePrerelease
  }
}
