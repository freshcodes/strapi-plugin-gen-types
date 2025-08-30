import { test, describe } from 'node:test'
import assert from 'node:assert'
import { getEnabledOptionalTypes } from './optional-types'

describe('getEnabledOptionalTypes', () => {
  test('returns all type definitions when true', () => {
    const result = getEnabledOptionalTypes(true)
    assert.ok(result.includes('StrapiIconField'))
    assert.ok(result.includes('StrapiLinkField'))
    assert.ok(result.includes('StrapiCountryField'))
  })

  test('returns empty string when false', () => {
    const result = getEnabledOptionalTypes(false)
    assert.strictEqual(result, '')
  })

  test('returns empty string when undefined', () => {
    const result = getEnabledOptionalTypes(undefined)
    assert.strictEqual(result, '')
  })

  test('returns specific type definitions when array provided', () => {
    const result = getEnabledOptionalTypes(['iconhub', 'link-field'])
    assert.ok(result.includes('StrapiIconField'))
    assert.ok(result.includes('StrapiLinkField'))
    assert.ok(!result.includes('StrapiCountryField'))
  })

  test('returns single type definition when single item array provided', () => {
    const result = getEnabledOptionalTypes(['country-select'])
    assert.ok(!result.includes('StrapiIconField'))
    assert.ok(!result.includes('StrapiLinkField'))
    assert.ok(result.includes('StrapiCountryField'))
  })
})
