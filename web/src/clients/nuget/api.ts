import { QueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { compareSemVer } from 'semver-parser'
import { Credentials, PackageSource } from '../../contracts'
import {
  AutocompleteResponse,
  NugetMetadataResponse,
  PackageRegistration,
  RegistrationIndexResponse,
  RegistrationPage,
  SearchParameters,
  SearchQueryServiceResponse
} from './types'
import { pageSize } from './useNugetService'

const fetchAutocomplete = async (
  { credentials }: PackageSource,
  autocompleteUrl: string,
  query: string,
  includePrerelease: boolean
) => {
  if (!autocompleteUrl || autocompleteUrl === '') {
    return []
  }

  const response = await axios.get<AutocompleteResponse>(autocompleteUrl, {
    params: {
      q: query,
      skip: 0,
      take: 10,
      prerelease: includePrerelease ? 'true' : 'false',
      semVerLevel: '2.0'
    } as SearchParameters,
    headers: { Authorization: getAuthenticationHeader(credentials) }
  })

  return response.data.data
}

const fetchPackageVersionMetadata = async (
  { credentials }: PackageSource,
  client: QueryClient,
  pages: RegistrationPage[],
  selectedVersion: string
): Promise<PackageRegistration | null> => {
  const page = pages.find((x) => {
    try {
      return (
        compareSemVer(selectedVersion, x.lower, false) >= 0 &&
        compareSemVer(selectedVersion, x.upper, false) <= 0
      )
    } catch (error) {
      console.error({ message: 'error: parsing version', page: x, error })

      // we are going to return false here until we write a better parser that
      // can handle bad semantic versions.
      return false
    }
  })

  if (!page) {
    console.log({
      message: 'unable to match registration page using semver',
      pages,
      selectedVersion,
      lower: pages.map((p) => compareSemVer(selectedVersion, p.lower)),
      upper: pages.map((p) => compareSemVer(selectedVersion, p.upper))
    })
    // TODO not sure how to handle.
    return null
  }

  if (page.items) {
    const item = page.items.find((y) => y.catalogEntry.version === selectedVersion)
    if (!item) {
      console.log({
        message: 'registration items present but could not find a matching version',
        page
      })
    }
    return item ?? null
  } else {
    const response = await client.fetchQuery({
      queryKey: ['nuget', 'metadata-items', page['@id']],
      queryFn: () =>
        axios.get<RegistrationPage>(page['@id'], {
          headers: { Authorization: getAuthenticationHeader(credentials) }
        }),
      staleTime: 10 * 60 * 1000 // 10min
    })

    if (response.status >= 200 && response.status < 300 && response.data.items) {
      return response.data.items.find((y) => y.catalogEntry.version === selectedVersion) ?? null
    }

    console.log({
      message: 'Failed to request registration page',
      response,
      '@id': page['@id']
    })
    return null
  }
}

const fetchNugetPackages = async (
  { credentials }: PackageSource,
  searchUrl: string,
  query: string,
  includePrerelease: boolean,
  page: number
) => {
  const { data } = await axios.get<SearchQueryServiceResponse>(searchUrl, {
    method: 'get',
    params: {
      q: query,
      skip: page * pageSize,
      take: pageSize,
      prerelease: includePrerelease ? 'true' : 'false',
      semVerLevel: '2.0'
    } as SearchParameters,
    headers: { Authorization: getAuthenticationHeader(credentials) }
  })

  return data.data
}

const fetchSearchQueryServiceUrl = async ({ url, credentials }: PackageSource) => {
  const result = await axios.get<NugetMetadataResponse>(url, {
    method: 'get',
    headers: { Authorization: getAuthenticationHeader(credentials) }
  })
  const queryServiceUrl = result.data.resources.find((r) =>
    r['@type'].startsWith('SearchQueryService')
  )?.['@id']
  const metadataUrl = result.data.resources.find((r) =>
    r['@type'].startsWith('RegistrationsBaseUrl')
  )?.['@id']
  const autocompleteUrl = result.data.resources.find((r) =>
    r['@type'].startsWith('SearchAutocompleteService')
  )?.['@id']

  return {
    queryServiceUrl,
    metadataUrl,
    autocompleteUrl
  }
}

const fetchPackageMetadata = async (
  { credentials }: PackageSource,
  metadataUrl: string,
  packageName: string
) => {
  // this call retrieves all version information for the given package.  We can then look up the data we want.
  const response = await axios.get<RegistrationIndexResponse>(
    `${packageName.toLowerCase()}/index.json`,
    {
      method: 'get',
      baseURL: metadataUrl,
      headers: { Authorization: getAuthenticationHeader(credentials) }
    }
  )
  return response.data.items
}

const getAuthenticationHeader = (credentials: Credentials | null) =>
  credentials ? `Basic ${btoa(`${credentials.username}:${credentials.password}`)}` : undefined

export {
  fetchAutocomplete,
  fetchNugetPackages,
  fetchPackageMetadata,
  fetchPackageVersionMetadata,
  fetchSearchQueryServiceUrl
}
