import type { StrapiSchema, InterfaceGenerationResult } from '../types/strapi'
import { escapeStringForTypeScript } from '../utils/strings'
import { formatInterfaceName } from '../utils/naming'
import { getComponentPath } from '../utils/files'
import { generateTypeForAttribute, getNullability } from './attributes'

/**
 * Generate TypeScript interface from Strapi schema
 */
export function generateInterfaceFromSchema(
  modelName: string,
  schema: StrapiSchema,
  isComponent = false,
  filePath = '',
  customFieldMappings: Record<string, string> = {},
  enabledOptionalMappings: Record<string, string> = {},
): InterfaceGenerationResult {
  let componentPath = ''
  if (isComponent && filePath) {
    componentPath = getComponentPath(filePath)
  }

  const interfaceName = formatInterfaceName(modelName, isComponent, componentPath)
  let interfaceString = `export interface ${interfaceName}`

  if (!isComponent) {
    interfaceString += ' extends API.Document'
  }

  interfaceString += ' {\n'

  if (isComponent) {
    interfaceString += `  __component: '${escapeStringForTypeScript(componentPath)}'\n`
  }

  interfaceString += '  id: number\n'

  // Add attributes
  Object.entries(schema.attributes || {}).forEach(([key, attribute]) => {
    const tsType = generateTypeForAttribute(attribute, customFieldMappings, enabledOptionalMappings)
    const nullability = getNullability(attribute)

    interfaceString += `  ${key}${nullability.optional ? '?' : ''}: ${tsType}${
      nullability.nullable ? ' | null' : ''
    }\n`
  })

  // Add i18n fields for localized content types
  if (!isComponent && schema.pluginOptions?.i18n?.localized) {
    interfaceString += '  locale: string\n'
    interfaceString += `  localizations?: ${interfaceName}[]\n`
  }

  interfaceString += '}\n\n'

  return { interfaceString, imports: [] }
}
