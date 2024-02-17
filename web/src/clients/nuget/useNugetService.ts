import { useInfiniteQuery } from '@tanstack/react-query'
import { PackageSource } from '../../contracts'
import { useNugetServiceIndex } from './useNugetServiceIndex'
import { fetchNugetPackages } from './api'

export const pageSize = 20

const useNugetService = (
  source: PackageSource | null,
  query: string,
  includePrerelease: boolean
) => {
  const searchUrl = useNugetServiceIndex(source)
  return useInfiniteQuery({
    queryKey: ['nuget', 'packages', source?.url, query, includePrerelease],
    initialPageParam: 0,
    enabled: !!searchUrl,
    staleTime: 10 * 60 * 1000, // 10min
    queryFn: ({ pageParam }) =>
      source && searchUrl?.queryServiceUrl
        ? fetchNugetPackages(
            source,
            searchUrl?.queryServiceUrl,
            query,
            includePrerelease,
            pageParam
          )
        : [],
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined
      }
      return lastPageParam + 1
    },
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined
      }
      return firstPageParam - 1
    }
  })
}

export { useNugetService }
