import { toPascalCase } from './strings'

/**
 * Format interface name for components, including the category
 */
export function formatInterfaceName(
  modelName: string,
  isComponent = false,
  componentPath = '',
): string {
  const prefix = 'Strapi'

  if (isComponent && componentPath) {
    // Extract category from component path (e.g., "blocks.rich-text-blocks" -> "blocks")
    const parts = componentPath.split('.')
    const category = toPascalCase(parts[0]) // "blocks" -> "Blocks"
    const name = toPascalCase(modelName) // "rich-text-blocks" -> "RichTextBlocks"
    return `${prefix}${category}${name}`
  }

  const formatted = toPascalCase(modelName)
  return `${prefix}${formatted}`
}

/**
 * Format component name from component identifier
 */
export function formatComponentName(componentId: string): string {
  const parts = componentId.split('.')
  const formatted = parts.map((part) => toPascalCase(part)).join('')
  return `Strapi${formatted}`
}

/**
 * Get model name from target string
 */
export function getModelNameFromTarget(target: string): string {
  const parts = target.split('.')
  const modelName = parts[parts.length - 1]
  return `Strapi${toPascalCase(modelName)}`
}
