import { useState } from 'react'
import { PackageInfo } from '../../clients/nuget'
import { Project } from '../../contracts'
import { Status } from '../types'

const useProjects = (
  projects: Project[],
  selectedPackage: PackageInfo | null,
  selectedVersion: string | null
) => {
  const [selectedProjects, setSelectedProjects] = useState<Project[]>([])
  // TODO add UseEffect to handle updating our selected projects if projects changes.

  const setProjectIsSelected = (project: Project, selected: boolean) => {
    if (selected && !selectedProjects.find((p) => p === project)) {
      setSelectedProjects((x) => x.concat(project))
    } else if (!selected && selectedProjects.find((p) => p === project)) {
      setSelectedProjects((x) => x.filter((y) => y !== project))
    }
  }

  const canInstall = () => {
    return (
      selectedProjects &&
      selectedProjects.length > 0 &&
      selectedProjects.every((p) => {
        const version = p.packages.find((p) => p.id === selectedPackage?.id)?.version
        return !version || (selectedVersion !== null && version !== selectedVersion)
      })
    )
  }

  const canUninstall = () => {
    return (
      selectedProjects &&
      selectedProjects.length > 0 &&
      selectedProjects.every((p) => {
        const version = p.packages.find((p) => p.id === selectedPackage?.id)?.version
        return version && version === selectedVersion
      })
    )
  }

  const projectLoadingStatus: Status = !projects ? 'pending' : 'success'

  return {
    canInstall,
    canUninstall,
    projectLoadingStatus,
    selectedProjects,
    setProjectIsSelected
  }
}

export { useProjects }
