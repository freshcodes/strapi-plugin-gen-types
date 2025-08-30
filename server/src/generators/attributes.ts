import type { StrapiAttribute } from '../types/strapi'
import { escapeStringForTypeScript } from '../utils/strings'
import { formatComponentName, getModelNameFromTarget } from '../utils/naming'
import { getCustomFieldType } from '../config/optional-custom-fields'

/**
 * Get nullability info for an attribute
 */
export function getNullability(attribute: StrapiAttribute): {
  optional: boolean
  nullable: boolean
} {
  const isRequired = attribute.required === true
  const hasDefault = attribute.default !== undefined

  return {
    optional: !isRequired && !hasDefault,
    nullable: isRequired, // Required fields can be null in draft mode
  }
}

/**
 * Generate TypeScript type for a Strapi attribute
 */
export function generateTypeForAttribute(
  attribute: StrapiAttribute,
  customFieldMappings: Record<string, string> = {},
  enabledOptionalMappings: Record<string, string> = {},
): string {
  switch (attribute.type) {
    case 'string':
    case 'text':
    case 'email':
    case 'password':
    case 'uid':
      return 'string'

    case 'richtext':
      return 'StrapiMarkdownField' // markdown editor

    case 'blocks':
      // This is the new blocks editor type in Strapi v5
      return 'StrapiRichTextBlocksNode[]'

    case 'number':
    case 'integer':
    case 'biginteger':
    case 'float':
    case 'decimal':
      return 'number'

    case 'boolean':
      return 'boolean'

    case 'date':
    case 'datetime':
    case 'time':
      return 'string'

    case 'json':
      return 'unknown'

    case 'enumeration':
      if (attribute.enum && Array.isArray(attribute.enum)) {
        return attribute.enum.map((val) => `'${escapeStringForTypeScript(val)}'`).join(' | ')
      }
      return 'string'

    case 'media': {
      // Check allowedTypes to determine the appropriate type
      const allowedTypes = attribute.allowedTypes || ['images', 'files', 'videos', 'audios']

      const hasImages = allowedTypes.includes('images')
      const hasOthers = allowedTypes.some((type) => ['files', 'videos', 'audios'].includes(type))

      let baseType: string
      if (hasImages && hasOthers) {
        baseType = 'StrapiImage | StrapiFile'
      } else if (hasImages) {
        baseType = 'StrapiImage'
      } else {
        baseType = 'StrapiFile'
      }

      if (attribute.multiple) {
        return `(${baseType})[]`
      }
      return baseType
    }

    case 'relation':
      if (attribute.target) {
        const relatedModel = getModelNameFromTarget(attribute.target)
        if (attribute.relation === 'oneToMany' || attribute.relation === 'manyToMany') {
          return `${relatedModel}[]`
        }
        return relatedModel
      }
      return 'unknown'

    case 'component':
      if (attribute.component) {
        const componentName = formatComponentName(attribute.component)
        if (attribute.repeatable) {
          return `${componentName}[]`
        }
        return componentName
      }
      return 'unknown'

    case 'dynamiczone':
      if (attribute.components && Array.isArray(attribute.components)) {
        const componentTypes = attribute.components.map((comp) => formatComponentName(comp))
        return `(${componentTypes.join(' | ')})[]`
      }
      return 'unknown[]'

    case 'customField':
      if (attribute.customField) {
        const tsType = getCustomFieldType(
          attribute.customField,
          customFieldMappings,
          enabledOptionalMappings,
        )
        if (tsType) {
          return tsType
        }

        console.warn(`Unknown custom field type: ${attribute.customField}`)
        return 'unknown'
      }
      return 'unknown'

    default:
      console.warn(`Unknown field type: ${attribute.type}`)
      return 'unknown'
  }
}
