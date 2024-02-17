import { Project } from '../../contracts'

interface ProjectItemProps {
  selected: boolean
  selectedChange: (value: boolean) => void

  /**
   * The current project this item relates to.
   */
  project: Project

  /**
   * The version of the selected package that is installed in this project.  Null if not installed.
   */
  version: string | null

  install: (project: Project) => void
  uninstall: (project: Project) => void
}

const ProjectItem = ({
  selected,
  selectedChange,
  project,
  version,
  install,
  uninstall
}: ProjectItemProps) => {
  const Version = () => {
    if (version) {
      return (
        <span>
          <span className="version-badge">{version} </span>
          <a onClick={() => uninstall(project)}>
            <u>Uninstall</u>
          </a>
        </span>
      )
    } else {
      return (
        <span>
          <span>
            <a onClick={() => install(project)}>
              <u>Install</u>
            </a>
          </span>
        </span>
      )
    }
  }

  return (
    <div className="projects-list-item">
      <input type="checkbox" checked={selected} onChange={() => selectedChange(!selected)} />
      <span>{project.projectName}</span>
      <Version />
    </div>
  )
}

export default ProjectItem
