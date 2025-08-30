/**
 * Optional custom field mappings
 * These are enabled via the plugin's enableOptionalFields config
 */
const ICONHUB_CUSTOM_FIELD = {
  'plugin::strapi-plugin-iconhub.iconhub': 'StrapiIconField',
}

const LINK_FIELD_CUSTOM_FIELD = {
  'plugin::link-field.link-field': 'StrapiLinkField',
}

const COUNTRY_SELECT_CUSTOM_FIELD = {
  'plugin::country-select.country': 'StrapiCountryField',
}

/**
 * Get enabled optional field mappings based on config
 */
export function getEnabledOptionalMappings(
  enableOptionalFields: boolean | string[] | undefined,
): Record<string, string> {
  if (enableOptionalFields === true) {
    // Enable all optional fields
    return {
      ...ICONHUB_CUSTOM_FIELD,
      ...LINK_FIELD_CUSTOM_FIELD,
      ...COUNTRY_SELECT_CUSTOM_FIELD,
    }
  }

  if (Array.isArray(enableOptionalFields)) {
    // Enable specific optional fields
    const mappings: Record<string, string> = {}

    for (const fieldType of enableOptionalFields) {
      switch (fieldType) {
        case 'iconhub':
          Object.assign(mappings, ICONHUB_CUSTOM_FIELD)
          break
        case 'link-field':
          Object.assign(mappings, LINK_FIELD_CUSTOM_FIELD)
          break
        case 'country-select':
          Object.assign(mappings, COUNTRY_SELECT_CUSTOM_FIELD)
          break
      }
    }

    return mappings
  }

  return {}
}

/**
 * Get the TypeScript type for a custom field
 * Checks user mappings first, then optional field mappings if enabled
 */
export function getCustomFieldType(
  customField: string,
  userMappings: Record<string, string> = {},
  enabledOptionalMappings: Record<string, string> = {},
): string | null {
  // First check user-provided mappings
  if (userMappings[customField]) {
    return userMappings[customField]
  }

  // Then check enabled optional mappings
  if (enabledOptionalMappings[customField]) {
    return enabledOptionalMappings[customField]
  }

  return null
}
