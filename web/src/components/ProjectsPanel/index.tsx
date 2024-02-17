import { CatalogEntry, PackageInfo } from '../../clients/nuget'
import { Project } from '../../contracts'
import { Status } from '../types'
import { PackageMetaDataDisplay } from './PackageMetaDataDisplay'
import { ProjectList } from './ProjectList'
import { useProjects } from './useProjects'

import './ProjectsPanel.scss'

interface ProjectsPanelProps {
  projects: Project[]
  selectedPackage: PackageInfo | null
  selectedVersion: string | null
  packageMetadata: CatalogEntry | null
  status: Status
  install: (projects: Project[], version: string) => void
  uninstall: (projects: Project[]) => void
  refreshProjects: () => void
  changeSelectedVersion: (newVersion: string | null) => void
}

const ProjectsPanel = ({
  projects,
  selectedPackage,
  selectedVersion,
  packageMetadata,
  status,
  install,
  uninstall,
  refreshProjects,
  changeSelectedVersion
}: ProjectsPanelProps) => {
  const { canInstall, canUninstall, projectLoadingStatus, selectedProjects, setProjectIsSelected } =
    useProjects(projects, selectedPackage, selectedVersion)

  const handleInstall = (projects: Project[]) => {
    if (selectedVersion) install(projects, selectedVersion)
  }

  const VersionSelector = () => {
    if (selectedPackage) {
      const options = selectedPackage.versions.reverse().map((v) => (
        <option key={v.version} value={v.version}>
          {v.version}
        </option>
      ))
      return (
        <select
          className="package-version-selector"
          onChange={(e) => changeSelectedVersion(e.target.value)}
          value={selectedVersion ?? ''}
        >
          {options}
        </select>
      )
    }
    return <select className="package-version-selector" disabled />
  }

  return (
    <div className="projects-panel">
      <div className="projects-panel-header">
        <button onClick={refreshProjects}>Refresh</button>
        <span className="title">{selectedPackage?.id}</span> by
        {selectedPackage?.authors}
      </div>

      <ProjectList
        projects={projects}
        status={projectLoadingStatus}
        install={(p) => handleInstall([p])}
        uninstall={(p) => uninstall([p])}
        selectedPackage={selectedPackage}
        setProjectIsSelected={setProjectIsSelected}
        selectedProjects={selectedProjects}
      />

      <div className="package-version-container">
        <VersionSelector />
        <button disabled={!canInstall()} onClick={() => handleInstall(selectedProjects)}>
          Install
        </button>
        <button disabled={!canUninstall()} onClick={() => uninstall(selectedProjects)}>
          Uninstall
        </button>
      </div>

      <PackageMetaDataDisplay packageMetadata={packageMetadata} statusPackageMetadata={status} />
    </div>
  )
}

export default ProjectsPanel
