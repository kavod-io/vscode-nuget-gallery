// https://learn.microsoft.com/en-us/nuget/api/service-index
// https://api.nuget.org/v3/index.json produces NugetMetadata

import { useQuery } from '@tanstack/react-query'
import { PackageSource } from '../../contracts'
import { fetchPackageMetadata } from './api'

export const useRegistrationIndex = (
  source: PackageSource | null,
  packageName: string | null,
  searchUrl: { queryServiceUrl: string | undefined; metadataUrl: string | undefined } | null
) => {
  return useQuery({
    queryKey: ['nuget', 'package-metadata', source?.url, packageName],
    enabled: !!searchUrl,
    staleTime: 10 * 60 * 1000, // 10min
    queryFn: () =>
      source && searchUrl?.metadataUrl && packageName
        ? fetchPackageMetadata(source, searchUrl?.metadataUrl, packageName)
        : null
  })
}
