import fs from 'fs'
import path from 'path'

/**
 * Walk a directory and return an array of schema.json file paths (for API content types)
 */
export function walkDirectoryForSchemas(dir: string): string[] {
  let results: string[] = []

  if (!fs.existsSync(dir)) {
    return results
  }

  const list = fs.readdirSync(dir)

  list.forEach((file) => {
    const filePath = path.resolve(dir, file)
    const stat = fs.statSync(filePath)

    if (stat && stat.isDirectory()) {
      results = results.concat(walkDirectoryForSchemas(filePath))
    } else if (file === 'schema.json') {
      results.push(filePath)
    }
  })

  return results
}

/**
 * Walk components directory and return component JSON files
 */
export function walkDirectoryForComponents(dir: string): string[] {
  let results: string[] = []

  if (!fs.existsSync(dir)) {
    return results
  }

  const list = fs.readdirSync(dir)

  list.forEach((file) => {
    const filePath = path.resolve(dir, file)
    const stat = fs.statSync(filePath)

    if (stat && stat.isDirectory()) {
      // Look for JSON files in component subdirectories
      results = results.concat(walkDirectoryForComponents(filePath))
    } else if (file.endsWith('.json') && file !== 'schema.json') {
      // Component files are named like "rich-text-blocks.json"
      results.push(filePath)
    }
  })

  return results
}

/**
 * Get component path from file path
 */
export function getComponentPath(filePath: string): string {
  // Extract category and component name from file path
  // e.g., "src/components/blocks/rich-text-blocks.json" -> "blocks.rich-text-blocks"
  const relativePath = path.relative(path.join(process.cwd(), 'src/components'), filePath)
  const parts = relativePath.split(path.sep)
  const category = parts[0] // "blocks"
  const componentName = path.basename(parts[parts.length - 1], '.json') // "rich-text-blocks"
  return `${category}.${componentName}`
}
