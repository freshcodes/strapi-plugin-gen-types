import path from 'path'
import type { DefaultPluginConfig, PluginConfig, OptionalFieldType } from '../types/config'

const defaultConfig: DefaultPluginConfig = {
  outputPath: path.join(process.cwd(), 'src/types/strapi.ts'),
  additionalTypes: '',
  customFieldMappings: {},
  enableOptionalFields: false,
  debug: false,
  generationDelay: 1000,
}

export default {
  default: defaultConfig,
  validator(config: PluginConfig) {
    if (typeof config.outputPath !== 'string') {
      throw new Error('gen-types: outputPath must be a string')
    }

    if (config.additionalTypes && typeof config.additionalTypes !== 'string') {
      throw new Error('gen-types: additionalTypes must be a string')
    }

    if (
      config.customFieldMappings &&
      (typeof config.customFieldMappings !== 'object' || Array.isArray(config.customFieldMappings))
    ) {
      throw new Error('gen-types: customFieldMappings must be an object')
    }

    if (config.customFieldMappings) {
      for (const [customField, tsType] of Object.entries(config.customFieldMappings)) {
        if (typeof customField !== 'string' || typeof tsType !== 'string') {
          throw new Error(
            'gen-types: customFieldMappings must be an object with string keys and string values',
          )
        }
      }
    }

    if (config.debug && typeof config.debug !== 'boolean') {
      throw new Error('gen-types: debug must be a boolean')
    }

    if (config.generationDelay && typeof config.generationDelay !== 'number') {
      throw new Error('gen-types: generationDelay must be a number')
    }

    if (config.enableOptionalFields !== undefined) {
      if (typeof config.enableOptionalFields === 'boolean') {
        // Boolean is valid
      } else if (Array.isArray(config.enableOptionalFields)) {
        const validTypes: OptionalFieldType[] = ['iconhub', 'link-field', 'country-select']
        for (const fieldType of config.enableOptionalFields) {
          if (!validTypes.includes(fieldType as OptionalFieldType)) {
            throw new Error(
              `gen-types: invalid enableOptionalFields value '${fieldType}'. Valid options: ${validTypes.join(', ')}`,
            )
          }
        }
      } else {
        throw new Error('gen-types: enableOptionalFields must be a boolean or array of field types')
      }
    }
  },
}
