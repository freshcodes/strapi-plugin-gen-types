/**
 * Optional type definitions
 * These are enabled via the plugin's enableOptionalFields config
 */

const ICONHUB_TYPES = `
// IconHub Plugin Types
export interface StrapiIconField {
  iconName: string // e.g. "mdi:home"
  iconData: string // Raw SVG string
  width?: number // Optional width
  height?: number // Optional height
}
`

const LINK_FIELD_TYPES = `
// Link Field Plugin Types
export interface StrapiLinkFieldRelatedData {
  id?: number | null
  url?: string | null
  title?: string | null
  name?: string | null
  slug?: string | null
  [key: string]: unknown
}

export interface StrapiLinkField {
  openInNewTab?: boolean | null
  linkType?: 'url' | 'file' | string | null
  relatedData?: StrapiLinkFieldRelatedData | null
  text?: string | null
  url?: string | null
}
`

const COUNTRY_SELECT_TYPES = `
// Country Select Plugin Types
export type StrapiCountryField = string // ISO 3166-1 alpha-2 country codes (e.g., "US", "CA", "GB")
`

/**
 * Get enabled optional type definitions based on config
 */
export function getEnabledOptionalTypes(
  enableOptionalFields: boolean | string[] | undefined,
): string {
  if (enableOptionalFields === true) {
    // Enable all optional types
    return ICONHUB_TYPES + LINK_FIELD_TYPES + COUNTRY_SELECT_TYPES
  }

  if (Array.isArray(enableOptionalFields)) {
    // Enable specific optional types
    let types = ''

    for (const fieldType of enableOptionalFields) {
      switch (fieldType) {
        case 'iconhub':
          types += ICONHUB_TYPES
          break
        case 'link-field':
          types += LINK_FIELD_TYPES
          break
        case 'country-select':
          types += COUNTRY_SELECT_TYPES
          break
      }
    }

    return types
  }

  return ''
}
