import { test, describe } from 'node:test'
import assert from 'node:assert'
import config from './index'
import type { PluginConfig } from '../types/config'

describe('config validator', () => {
  test('accepts valid minimal config', () => {
    const validConfig: PluginConfig = {
      outputPath: '/path/to/types.ts',
    }

    assert.doesNotThrow(() => {
      config.validator(validConfig)
    })
  })

  test('accepts valid full config', () => {
    const validConfig: PluginConfig = {
      outputPath: '/path/to/types.ts',
      additionalTypes: 'export type CustomType = string',
      customFieldMappings: {
        'plugin::test.field': 'TestType',
      },
      debug: true,
      generationDelay: 2000,
    }

    assert.doesNotThrow(() => {
      config.validator(validConfig)
    })
  })

  test('rejects invalid outputPath', () => {
    const invalidConfig = {
      outputPath: 123,
    } as unknown as PluginConfig

    assert.throws(
      () => {
        config.validator(invalidConfig)
      },
      {
        message: 'gen-types: outputPath must be a string',
      },
    )
  })

  test('rejects invalid additionalTypes', () => {
    const invalidConfig: PluginConfig = {
      outputPath: '/path/to/types.ts',
      additionalTypes: 123 as unknown as string,
    }

    assert.throws(
      () => {
        config.validator(invalidConfig)
      },
      {
        message: 'gen-types: additionalTypes must be a string',
      },
    )
  })

  test('rejects invalid customFieldMappings - not object', () => {
    const invalidConfig: PluginConfig = {
      outputPath: '/path/to/types.ts',
      customFieldMappings: [] as unknown as Record<string, string>,
    }

    assert.throws(
      () => {
        config.validator(invalidConfig)
      },
      {
        message: 'gen-types: customFieldMappings must be an object',
      },
    )
  })

  test('rejects invalid customFieldMappings - invalid values', () => {
    const invalidConfig: PluginConfig = {
      outputPath: '/path/to/types.ts',
      customFieldMappings: {
        'plugin::test.field': 123,
      } as unknown as Record<string, string>,
    }

    assert.throws(
      () => {
        config.validator(invalidConfig)
      },
      {
        message:
          'gen-types: customFieldMappings must be an object with string keys and string values',
      },
    )
  })

  test('rejects invalid debug', () => {
    const invalidConfig: PluginConfig = {
      outputPath: '/path/to/types.ts',
      debug: 'true' as unknown as boolean,
    }

    assert.throws(
      () => {
        config.validator(invalidConfig)
      },
      {
        message: 'gen-types: debug must be a boolean',
      },
    )
  })

  test('rejects invalid generationDelay', () => {
    const invalidConfig: PluginConfig = {
      outputPath: '/path/to/types.ts',
      generationDelay: '1000' as unknown as number,
    }

    assert.throws(
      () => {
        config.validator(invalidConfig)
      },
      {
        message: 'gen-types: generationDelay must be a number',
      },
    )
  })

  test('has proper default config', () => {
    assert.ok(typeof config.default.outputPath === 'string')
    assert.ok(typeof config.default.additionalTypes === 'string')
    assert.ok(typeof config.default.customFieldMappings === 'object')
    assert.strictEqual(Object.keys(config.default.customFieldMappings).length, 0) // Empty by default
    assert.ok(typeof config.default.debug === 'boolean')
    assert.ok(typeof config.default.generationDelay === 'number')
  })
})
