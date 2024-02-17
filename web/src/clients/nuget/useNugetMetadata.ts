import { useQuery, useQueryClient } from '@tanstack/react-query'
import { PackageSource } from '../../contracts'
import { useNugetServiceIndex } from './useNugetServiceIndex'
import { useRegistrationIndex } from './useRegistrationIndex'
import { fetchPackageVersionMetadata } from './api'

export const useNugetMetadata = (
  source: PackageSource | null,
  packageName: string | null,
  selectedVersion: string | null
) => {
  const searchUrl = useNugetServiceIndex(source)
  const { status, data } = useRegistrationIndex(source, packageName, searchUrl)
  const client = useQueryClient()
  return useQuery({
    queryKey: ['nuget', 'package-metadata', source?.url, packageName, selectedVersion],
    enabled: status === 'success',
    staleTime: 10 * 60 * 1000, // 10min
    queryFn: () =>
      data && selectedVersion && source
        ? fetchPackageVersionMetadata(source, client, data, selectedVersion)
        : null
  })
}
