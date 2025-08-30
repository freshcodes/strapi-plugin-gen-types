import { test, describe } from 'node:test'
import assert from 'node:assert'
import { getCustomFieldType, getEnabledOptionalMappings } from './optional-custom-fields'

describe('getCustomFieldType', () => {
  test('returns user mapping when provided', () => {
    const userMappings = {
      'plugin::strapi-plugin-iconhub.iconhub': 'MyCustomIconType',
    }

    const result = getCustomFieldType('plugin::strapi-plugin-iconhub.iconhub', userMappings)
    assert.strictEqual(result, 'MyCustomIconType')
  })

  test('returns optional mapping when enabled', () => {
    const enabledOptionalMappings = {
      'plugin::strapi-plugin-iconhub.iconhub': 'StrapiIconField',
    }

    const result = getCustomFieldType(
      'plugin::strapi-plugin-iconhub.iconhub',
      {},
      enabledOptionalMappings,
    )
    assert.strictEqual(result, 'StrapiIconField')
  })

  test('returns null when mapping not found', () => {
    const result = getCustomFieldType('plugin::unknown.field')
    assert.strictEqual(result, null)
  })

  test('prioritizes user mappings over optional mappings', () => {
    const userMappings = {
      'plugin::country-select.country': 'CountryCode',
    }
    const enabledOptionalMappings = {
      'plugin::country-select.country': 'StrapiCountryField',
    }

    const result = getCustomFieldType(
      'plugin::country-select.country',
      userMappings,
      enabledOptionalMappings,
    )
    assert.strictEqual(result, 'CountryCode')
  })

  test('returns null without any mappings', () => {
    const result = getCustomFieldType('plugin::strapi-plugin-iconhub.iconhub')
    assert.strictEqual(result, null)
  })
})

describe('getEnabledOptionalMappings', () => {
  test('returns all mappings when true', () => {
    const result = getEnabledOptionalMappings(true)
    const expected = {
      'plugin::strapi-plugin-iconhub.iconhub': 'StrapiIconField',
      'plugin::link-field.link-field': 'StrapiLinkField',
      'plugin::country-select.country': 'StrapiCountryField',
    }
    assert.deepStrictEqual(result, expected)
  })

  test('returns empty object when false', () => {
    const result = getEnabledOptionalMappings(false)
    assert.deepStrictEqual(result, {})
  })

  test('returns empty object when undefined', () => {
    const result = getEnabledOptionalMappings(undefined)
    assert.deepStrictEqual(result, {})
  })

  test('returns specific mappings when array provided', () => {
    const result = getEnabledOptionalMappings(['iconhub', 'link-field'])
    const expected = {
      'plugin::strapi-plugin-iconhub.iconhub': 'StrapiIconField',
      'plugin::link-field.link-field': 'StrapiLinkField',
    }
    assert.deepStrictEqual(result, expected)
  })

  test('returns single mapping when single item array provided', () => {
    const result = getEnabledOptionalMappings(['country-select'])
    const expected = {
      'plugin::country-select.country': 'StrapiCountryField',
    }
    assert.deepStrictEqual(result, expected)
  })
})
