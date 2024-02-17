import { PackageInfo } from '../../clients/nuget'
import Loader from '../Loader'
import { Status } from '../types'
import PackagesListItem from './PackagesListItem'

import './PackagesList.scss'

interface PackagesListProps {
  status: Status
  packages: PackageInfo[]
  loadMorePackages: () => void
  selectedPackage: PackageInfo | null
  packageChanged: (info: PackageInfo) => void
}

const PackagesList = ({
  packages,
  status,
  selectedPackage,
  packageChanged,
  loadMorePackages
}: PackagesListProps) => {
  if (status === 'pending') {
    return <Loader />
  }
  if (status === 'error') {
    return (
      <div>
        <h4>Error</h4>
      </div>
    )
  }

  if (status === 'success') {
    if (!packages || packages.length === 0) {
      return (
        <div className="packages-list-container">
          <h4>No packages found</h4>
        </div>
      )
    }

    const list = packages.map((p, i) => (
      <PackagesListItem
        packageInfo={p}
        key={i}
        isSelected={selectedPackage == p}
        onClick={() => packageChanged(p)}
      />
    ))

    return (
      <div className="packages-list-container">
        <div>{list}</div>
        <button onClick={loadMorePackages}>Load More</button>
      </div>
    )
  }
}

export default PackagesList
