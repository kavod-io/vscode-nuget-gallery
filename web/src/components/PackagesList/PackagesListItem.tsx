import { useEffect, useState } from 'react'
import { PackageInfo } from '../../clients/nuget'

interface PackagesListItemProps {
  packageInfo: PackageInfo
  isSelected: boolean
  onClick: () => void
}

const defaultIconUrl = 'https://www.nuget.org/Content/gallery/img/default-package-icon.svg'

const PackagesListItem = ({ packageInfo, isSelected, onClick }: PackagesListItemProps) => {
  const [iconUrl, setIconUrl] = useState<string>(packageInfo.iconUrl || defaultIconUrl)

  useEffect(() => {
    setIconUrl(packageInfo.iconUrl || defaultIconUrl)
  }, [packageInfo.iconUrl])

  const handleIconError = () => {
    if (iconUrl !== defaultIconUrl) {
      setIconUrl(defaultIconUrl)
    }
  }

  const classNames = isSelected ? 'packages-list-item selected' : 'packages-list-item'

  return (
    <div className={classNames} onClick={onClick}>
      <img src={iconUrl} onError={handleIconError} />
      <div className="package-header">
        <span className="title">{packageInfo.id}</span>
        {' by '}
        {packageInfo.authors}
      </div>
      <div className="package-version">{packageInfo.version}</div>
      <div className="package-description">{packageInfo.summary}</div>
      <div className="package-description">{packageInfo.description}</div>
    </div>
  )
}

export default PackagesListItem
