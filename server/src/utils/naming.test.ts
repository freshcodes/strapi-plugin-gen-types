import { test, describe } from 'node:test'
import assert from 'node:assert'
import { formatInterfaceName, formatComponentName, getModelNameFromTarget } from './naming'

describe('formatInterfaceName', () => {
  test('formats basic content type names', () => {
    assert.strictEqual(formatInterfaceName('article'), 'StrapiArticle')
    assert.strictEqual(formatInterfaceName('user-profile'), 'StrapiUserProfile')
  })

  test('formats component names with category', () => {
    assert.strictEqual(
      formatInterfaceName('rich-text-blocks', true, 'blocks.rich-text-blocks'),
      'StrapiBlocksRichTextBlocks',
    )
    assert.strictEqual(
      formatInterfaceName('hero-banner', true, 'layout.hero-banner'),
      'StrapiLayoutHeroBanner',
    )
  })

  test('falls back to basic format for components without path', () => {
    assert.strictEqual(formatInterfaceName('hero-banner', true), 'StrapiHeroBanner')
  })

  test('handles non-component with componentPath (ignores path)', () => {
    assert.strictEqual(formatInterfaceName('article', false, 'blocks.something'), 'StrapiArticle')
  })
})

describe('formatComponentName', () => {
  test('formats component identifiers', () => {
    assert.strictEqual(formatComponentName('blocks.rich-text'), 'StrapiBlocksRichText')
    assert.strictEqual(formatComponentName('layout.hero-banner'), 'StrapiLayoutHeroBanner')
    assert.strictEqual(formatComponentName('forms.contact-form'), 'StrapiFormsContactForm')
  })

  test('handles single part component names', () => {
    assert.strictEqual(formatComponentName('button'), 'StrapiButton')
  })

  test('handles multiple dots', () => {
    assert.strictEqual(
      formatComponentName('deeply.nested.component'),
      'StrapiDeeplyNestedComponent',
    )
  })
})

describe('getModelNameFromTarget', () => {
  test('extracts model name from API targets', () => {
    assert.strictEqual(getModelNameFromTarget('api::article.article'), 'StrapiArticle')
    assert.strictEqual(
      getModelNameFromTarget('api::user-profile.user-profile'),
      'StrapiUserProfile',
    )
  })

  test('extracts model name from plugin targets', () => {
    assert.strictEqual(getModelNameFromTarget('plugin::users-permissions.user'), 'StrapiUser')
    assert.strictEqual(getModelNameFromTarget('plugin::upload.file'), 'StrapiFile')
  })

  test('handles simple target strings', () => {
    assert.strictEqual(getModelNameFromTarget('article'), 'StrapiArticle')
    assert.strictEqual(getModelNameFromTarget('user-profile'), 'StrapiUserProfile')
  })

  test('handles deeply nested targets', () => {
    assert.strictEqual(
      getModelNameFromTarget('api::blog.category.sub-category'),
      'StrapiSubCategory',
    )
  })
})
