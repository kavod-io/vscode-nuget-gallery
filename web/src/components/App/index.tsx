import { useEffect } from 'react'
import { WebviewApi } from 'vscode-webview'
import Filters from '../Filters'
import PackagesList from '../PackagesList'
import ProjectsPanel from '../ProjectsPanel'
import SourceSelector from '../SourceSelector'
import useAppState from './useAppState'

import './App.scss'

interface AppProps {
  vscode: WebviewApi<unknown>
}

const App = ({ vscode }: AppProps) => {
  const {
    autocompleteOptions,

    currentSource,
    nugetSources,
    setCurrentSource,
    refreshSources,

    projects,
    refreshProjects,

    packages,
    selectedPackage,
    packageStatus,
    refreshPackages,
    loadMorePackages,
    packageChanged,
    install,
    uninstall,

    searchString,
    updateSearchString,

    includePrerelease,
    setIncludePrerelease,

    packageMetadata,
    packageMetadataStatus,
    selectedVersion,
    changeSelectedVersion
  } = useAppState(vscode)

  useEffect(() => {
    refreshSources()
    refreshProjects()
  }, [refreshProjects, refreshSources])

  const Projects = () => {
    if (selectedPackage === null) {
      return null
    }

    return (
      <div id="package-info">
        <ProjectsPanel
          refreshProjects={refreshProjects}
          projects={projects}
          selectedPackage={selectedPackage}
          install={install}
          uninstall={uninstall}
          selectedVersion={selectedVersion}
          packageMetadata={packageMetadata}
          status={packageMetadataStatus}
          changeSelectedVersion={changeSelectedVersion}
        />
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <Filters
          filter={searchString}
          includePrerelease={includePrerelease}
          autocompleteOptions={autocompleteOptions ?? []}
          filterChanged={updateSearchString}
          refresh={refreshPackages}
          prereleaseChanged={() => setIncludePrerelease((x) => !x)}
        />
        <SourceSelector
          currentSource={currentSource}
          sources={nugetSources}
          sourceChanged={setCurrentSource}
        />
      </div>
      <div className="packages-list">
        <PackagesList
          packages={packages}
          loadMorePackages={loadMorePackages}
          selectedPackage={selectedPackage}
          status={packageStatus}
          packageChanged={packageChanged}
        />
      </div>
      <Projects />
    </div>
  )
}

export default App
