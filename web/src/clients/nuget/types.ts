export interface PackageInfo {
  '@id': string // url
  id: string // package ID

  /**
   * Latest version for this package
   */
  version: string

  /**
   * Package title, use id instead.
   */
  title: string
  description: string
  summary: string
  iconUrl: string
  authors: string[]
  tags: string[]
  projectUrl: string
  licenseUrl: string

  versions: PackageVersion[]
}

export interface PackageVersion {
  version: string
  downloads: number
  '@id': string // url
}

export interface NugetMetadataResponse {
  version: string
  resources: Resource[]
}

export interface Resource {
  '@id': string // url
  '@type': string
  comment: string
}

export interface SearchQueryServiceResponse {
  totalHits: number
  data: PackageInfo[]
}

export interface RegistrationIndexResponse {
  '@id': string // url pointing to self.
  items: RegistrationPage[]
}

export interface RegistrationPage {
  '@id': string // url pointing to self.

  /**
   * If this property is not present then it is necessary to use the '@id' property to access the
   * package registration.
   */
  items: PackageRegistration[] | undefined
  count: number
  lower: string
  upper: string
}

export interface PackageRegistration {
  catalogEntry: CatalogEntry
}

export interface CatalogEntry {
  '@id': string // url pointing to self.
  id: string
  version: string
  dependencyGroups: DependencyGroup[] | undefined
  description: string
  datePublished: string
  authors: string
  licenseUrl: string
  license: string
  projectUrl: string
  tags: string[]
}

export interface DependencyGroup {
  targetFramework: string
  dependencies: Dependency[]
}

export interface Dependency {
  id: string
  range: string
}

/**
 * The parameters used to perform a full package search and autocomplete.
 */
export interface SearchParameters {
  q: string
  skip: number
  take: number
  prerelease: 'true' | 'false'
  semVerLevel: '2.0'
}

export interface AutocompleteResponse {
  totalHits: number
  data: string[]
}
