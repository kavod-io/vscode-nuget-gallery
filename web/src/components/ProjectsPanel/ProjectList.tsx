import _ from 'lodash'
import { PackageInfo } from '../../clients/nuget'
import { Project } from '../../contracts'
import Loader from '../Loader'
import { Status } from '../types'
import ProjectItem from './ProjectItem'

interface ProjectListProps {
  projects: Project[]
  status: Status
  install: (project: Project) => void
  uninstall: (project: Project) => void
  selectedPackage: PackageInfo | null
  selectedProjects: Project[]
  setProjectIsSelected: (project: Project, selected: boolean) => void
}

const ProjectList = ({
  projects,
  status,
  install,
  uninstall,
  selectedProjects,
  selectedPackage,
  setProjectIsSelected
}: ProjectListProps) => {
  if (status === 'pending') {
    return <Loader />
  }

  const Projects = () =>
    projects.map((p, i) => {
      const version =
        selectedPackage !== null
          ? p.packages.find((x) => x.id === selectedPackage.id)?.version ?? null
          : null

      return (
        <ProjectItem
          project={p}
          install={() => install(p)}
          uninstall={() => uninstall(p)}
          selected={_.includes(selectedProjects, p)}
          selectedChange={(v) => setProjectIsSelected(p, v)}
          version={version}
          key={i}
        />
      )
    })

  return (
    <div className="projects-list">
      <Projects />
    </div>
  )
}

export { ProjectList }
