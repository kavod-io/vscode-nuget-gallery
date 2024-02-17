import { CatalogEntry } from '../../clients/nuget'
import { Dependency, DependencyGroup } from '../../clients/nuget/types'
import Loader from '../Loader'
import { Status } from '../types'

const PackageMetaDataDisplay = ({
  statusPackageMetadata,
  packageMetadata
}: {
  statusPackageMetadata: Status
  packageMetadata: CatalogEntry | null
}) => {
  if (statusPackageMetadata === 'pending') {
    return <Loader />
  }

  if (statusPackageMetadata === 'error') {
    console.log({ statusPackageMetadata, packageMetadata })
    return (
      <div>
        <h4>Error loading package metadata</h4>
      </div>
    )
  }

  if (packageMetadata === null) {
    return (
      <div>
        <h4>No package metadata found.</h4>
      </div>
    )
  }

  const License = () => {
    const text =
      packageMetadata.license !== undefined && packageMetadata.license !== ''
        ? packageMetadata.license
        : 'View license'

    return (
      <a target="_blank" href={packageMetadata.licenseUrl}>
        {text}
      </a>
    )
  }

  const Project = () => {
    if (packageMetadata.projectUrl !== undefined && packageMetadata.projectUrl !== '') {
      return (
        <a target="_blank" href={packageMetadata.projectUrl}>
          {packageMetadata.projectUrl.slice(0, 85)}
        </a>
      )
    }
    return <span>Not available</span>
  }

  const Dependencies = () => {
    if (!packageMetadata.dependencyGroups || packageMetadata.dependencyGroups.length === 0) {
      return (
        <ul>
          <li>No dependencies</li>
        </ul>
      )
    }

    const Dep = ({ dependency }: { dependency: Dependency }) => {
      return (
        <li key={dependency.id}>
          {dependency.id} {dependency.range}
        </li>
      )
    }

    const Group = ({ group }: { group: DependencyGroup }) => {
      const dependencies = group.dependencies ? (
        group.dependencies.map((d) => <Dep dependency={d} key={d.id} />)
      ) : (
        <li>No dependencies</li>
      )

      return (
        <li key={group.targetFramework}>
          {group.targetFramework}
          <ul>{dependencies}</ul>
        </li>
      )
    }

    const groups = packageMetadata.dependencyGroups.map((g) => (
      <Group group={g} key={g.targetFramework} />
    ))
    return <ul>{groups}</ul>
  }

  return (
    <div id="package-description-container">
      <div className="package-description">
        <h2 className="title-description">Description</h2>
        <p>{packageMetadata.description}</p>
        <table className="table">
          <tbody>
            <tr>
              <td>Open in:</td>
              <td>
                <a target="_blank" href="packageMetadata.nugetUrl">
                  nuget.org
                </a>
              </td>
            </tr>
            <tr>
              <td>Version:</td>
              <td>{packageMetadata.version}</td>
            </tr>
            <tr>
              <td>Date Published:</td>
              <td>{packageMetadata.datePublished}</td>
            </tr>
            <tr>
              <td>Author(s):</td>
              <td>{packageMetadata.authors}</td>
            </tr>
            <tr>
              <td>License:</td>
              <td>
                <License />
              </td>
            </tr>
            <tr>
              <td>Project Url:</td>
              <td>
                <Project />
              </td>
            </tr>
            <tr>
              <td>Tags:</td>
              <td>{packageMetadata.tags}</td>
            </tr>
          </tbody>
        </table>

        <h2 className="title-description">Dependencies</h2>
        <Dependencies />
      </div>
    </div>
  )
}

export { PackageMetaDataDisplay }
