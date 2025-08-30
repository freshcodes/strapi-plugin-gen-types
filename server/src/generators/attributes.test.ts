import { test, describe } from 'node:test'
import assert from 'node:assert'
import { generateTypeForAttribute, getNullability } from './attributes'
import type { StrapiAttribute } from '../types/strapi'

describe('getNullability', () => {
  test('required field without default', () => {
    const attr: StrapiAttribute = { type: 'string', required: true }
    const result = getNullability(attr)
    assert.strictEqual(result.optional, false)
    assert.strictEqual(result.nullable, true) // Required fields can be null in draft mode
  })

  test('optional field without default', () => {
    const attr: StrapiAttribute = { type: 'string' }
    const result = getNullability(attr)
    assert.strictEqual(result.optional, true)
    assert.strictEqual(result.nullable, false)
  })

  test('field with default value', () => {
    const attr: StrapiAttribute = { type: 'string', default: 'test' }
    const result = getNullability(attr)
    assert.strictEqual(result.optional, false)
    assert.strictEqual(result.nullable, false)
  })
})

describe('generateTypeForAttribute', () => {
  test('basic string types', () => {
    assert.strictEqual(generateTypeForAttribute({ type: 'string' }), 'string')
    assert.strictEqual(generateTypeForAttribute({ type: 'text' }), 'string')
    assert.strictEqual(generateTypeForAttribute({ type: 'email' }), 'string')
    assert.strictEqual(generateTypeForAttribute({ type: 'uid' }), 'string')
  })

  test('numeric types', () => {
    assert.strictEqual(generateTypeForAttribute({ type: 'number' }), 'number')
    assert.strictEqual(generateTypeForAttribute({ type: 'integer' }), 'number')
    assert.strictEqual(generateTypeForAttribute({ type: 'float' }), 'number')
  })

  test('other basic types', () => {
    assert.strictEqual(generateTypeForAttribute({ type: 'boolean' }), 'boolean')
    assert.strictEqual(generateTypeForAttribute({ type: 'date' }), 'string')
    assert.strictEqual(generateTypeForAttribute({ type: 'json' }), 'unknown')
  })

  test('rich text types', () => {
    assert.strictEqual(generateTypeForAttribute({ type: 'richtext' }), 'StrapiMarkdownField')
    assert.strictEqual(generateTypeForAttribute({ type: 'blocks' }), 'StrapiRichTextBlocksNode[]')
  })

  test('enumeration types', () => {
    const attr: StrapiAttribute = {
      type: 'enumeration',
      enum: ['draft', 'published', 'archived'],
    }
    const result = generateTypeForAttribute(attr)
    assert.strictEqual(result, "'draft' | 'published' | 'archived'")
  })

  test('media types - images only', () => {
    const attr: StrapiAttribute = {
      type: 'media',
      allowedTypes: ['images'],
    }
    assert.strictEqual(generateTypeForAttribute(attr), 'StrapiImage')
  })

  test('media types - files only', () => {
    const attr: StrapiAttribute = {
      type: 'media',
      allowedTypes: ['files'],
    }
    assert.strictEqual(generateTypeForAttribute(attr), 'StrapiFile')
  })

  test('media types - mixed', () => {
    const attr: StrapiAttribute = {
      type: 'media',
      allowedTypes: ['images', 'files'],
    }
    assert.strictEqual(generateTypeForAttribute(attr), 'StrapiImage | StrapiFile')
  })

  test('media types - multiple', () => {
    const attr: StrapiAttribute = {
      type: 'media',
      allowedTypes: ['images'],
      multiple: true,
    }
    assert.strictEqual(generateTypeForAttribute(attr), '(StrapiImage)[]')
  })

  test('relation types', () => {
    const oneToOne: StrapiAttribute = {
      type: 'relation',
      target: 'api::article.article',
      relation: 'oneToOne',
    }
    assert.strictEqual(generateTypeForAttribute(oneToOne), 'StrapiArticle')

    const oneToMany: StrapiAttribute = {
      type: 'relation',
      target: 'api::category.category',
      relation: 'oneToMany',
    }
    assert.strictEqual(generateTypeForAttribute(oneToMany), 'StrapiCategory[]')
  })

  test('component types', () => {
    const single: StrapiAttribute = {
      type: 'component',
      component: 'blocks.hero-banner',
    }
    assert.strictEqual(generateTypeForAttribute(single), 'StrapiBlocksHeroBanner')

    const repeatable: StrapiAttribute = {
      type: 'component',
      component: 'blocks.text-block',
      repeatable: true,
    }
    assert.strictEqual(generateTypeForAttribute(repeatable), 'StrapiBlocksTextBlock[]')
  })

  test('dynamic zone types', () => {
    const attr: StrapiAttribute = {
      type: 'dynamiczone',
      components: ['blocks.hero-banner', 'blocks.text-block'],
    }
    const result = generateTypeForAttribute(attr)
    assert.strictEqual(result, '(StrapiBlocksHeroBanner | StrapiBlocksTextBlock)[]')
  })

  test('custom field types - custom mappings', () => {
    const customMappings = {
      'plugin::color-picker.color': 'ColorField',
    }

    const attr: StrapiAttribute = {
      type: 'customField',
      customField: 'plugin::color-picker.color',
    }

    const result = generateTypeForAttribute(attr, customMappings)
    assert.strictEqual(result, 'ColorField')
  })

  test('unknown types', () => {
    const attr = { type: 'unknown-type' } as StrapiAttribute
    assert.strictEqual(generateTypeForAttribute(attr), 'unknown')
  })
})
