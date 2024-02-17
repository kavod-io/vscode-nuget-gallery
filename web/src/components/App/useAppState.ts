import { useCallback, useState } from 'react'
import { WebviewApi } from 'vscode-webview'
import {
  PackageInfo,
  useAutocomplete,
  useNugetMetadata,
  useNugetService
} from '../../clients/nuget'
import { Project } from '../../contracts'
import { useComms } from './useComms'
import { useSearchFilter } from './useSearchFilter'

const useAppState = (vscode: WebviewApi<unknown>) => {
  const [selectedPackage, setSelectedPackage] = useState<PackageInfo | null>(null)
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)

  const {
    projects,
    nugetSources,
    requestReloadProjects,
    requestInstall,
    requestUninstall,
    requestReloadSources
  } = useComms(vscode)

  const searchFilter = useSearchFilter(nugetSources)
  const { currentSource, debouncedSearchString, searchString, includePrerelease } = searchFilter

  const {
    data: packageData,
    isFetched: packagesIsFetched,
    refetch: refreshPackages,
    status: packageStatus,
    fetchNextPage: loadMorePackages
  } = useNugetService(currentSource, debouncedSearchString, includePrerelease)

  // NOTE we use the actual search string (current value of control)
  const { data: autocompleteOptions } = useAutocomplete(
    currentSource,
    searchString,
    includePrerelease
  )

  const { data: packageMetadata, status: packageMetadataStatus } = useNugetMetadata(
    currentSource,
    selectedPackage?.id ?? null,
    selectedVersion
  )

  const packageChanged = (value: PackageInfo | null) => {
    const newSelectedVersion = value?.version ?? null
    console.log({ message: 'package changed', package: value, newSelectedVersion })
    setSelectedPackage(value)
    setSelectedVersion(newSelectedVersion)
  }

  const refreshProjects = useCallback(() => {
    requestReloadProjects()
  }, [requestReloadProjects])

  const refreshSources = useCallback(() => {
    requestReloadSources()
  }, [requestReloadSources])

  const install = (projects: Project[], version: string) => {
    if (currentSource && selectedPackage) {
      requestInstall(selectedPackage, projects, version, currentSource.name)
    } else {
      // TODO handle invalid state.
    }
  }

  const uninstall = (projects: Project[]) => {
    if (selectedPackage) {
      requestUninstall(selectedPackage, projects)
    } else {
      // TODO handle invalid state.
    }
  }

  const changeSelectedVersion = (version: string | null) => {
    console.log({ message: 'selected version changed', version, selectedPackage })
    if (version) {
      if (!selectedPackage) {
        console.log({ message: 'Tried to select a version when there is no selected package.' })
        setSelectedVersion(null)
        return
      }
      if (!selectedPackage.versions.some((x) => x.version === version)) {
        console.error('Tried to select a version that is not available for the selected package.')
        return
      }
    }
    setSelectedVersion(version)
  }

  return {
    ...searchFilter,

    autocompleteOptions,

    nugetSources,
    refreshSources,

    projects,
    refreshProjects,

    packages: packageData && packagesIsFetched ? packageData.pages.flatMap((x) => x) : [],
    loadMorePackages,
    selectedPackage,
    packageStatus,
    refreshPackages,
    packageChanged,
    install,
    uninstall,

    packageMetadata: packageMetadata?.catalogEntry ?? null,
    packageMetadataStatus,
    selectedVersion,
    changeSelectedVersion
  }
}

export default useAppState
