import fs from 'fs'
import path from 'path'
import type { Core } from '@strapi/strapi'
import type { DefaultPluginConfig } from '../types/config'
import type { StrapiSchema, ComponentInfo, ContentTypeInfo } from '../types/strapi'
import { walkDirectoryForSchemas, walkDirectoryForComponents } from '../utils/files'
import { generateFileHeader, generateBaseTypes } from '../generators/templates'
import { generateInterfaceFromSchema } from '../generators/interfaces'
import { getEnabledOptionalMappings } from '../config/optional-custom-fields'
import { getEnabledOptionalTypes } from '../config/optional-types'

export class TypeGenerator {
  private strapi: Core.Strapi
  private config: DefaultPluginConfig

  constructor(strapi: Core.Strapi, config: DefaultPluginConfig) {
    this.strapi = strapi
    this.config = config
  }

  /**
   * Generate TypeScript types from Strapi schema files
   */
  public generateTypes(): void {
    const apiDir = path.join(process.cwd(), 'src/api')
    const componentsDir = path.join(process.cwd(), 'src/components')

    if (this.config.debug) {
      console.log('🔍 Looking for schemas in:')
      console.log(`  API: ${apiDir}`)
      console.log(`  Components: ${componentsDir}`)
    }

    const { schemaFiles, componentSchemaFiles } = this.discoverSchemaFiles(apiDir, componentsDir)

    const components = this.loadComponents(componentSchemaFiles)
    const contentTypes = this.loadContentTypes(schemaFiles)

    // Get enabled optional field mappings
    const enabledOptionalMappings = getEnabledOptionalMappings(this.config.enableOptionalFields)
    const enabledOptionalTypes = getEnabledOptionalTypes(this.config.enableOptionalFields)

    if (this.config.debug && Object.keys(enabledOptionalMappings).length > 0) {
      console.log('🔧 Enabled optional field mappings:')
      Object.entries(enabledOptionalMappings).forEach(([field, type]) => {
        console.log(`  ${field} → ${type}`)
      })
    }

    let output = generateFileHeader()
    output += generateBaseTypes(this.strapi)

    // Add enabled optional types
    if (enabledOptionalTypes) {
      output += enabledOptionalTypes + '\n'
    }

    // Add additional types if configured
    if (this.config.additionalTypes) {
      output += `${this.config.additionalTypes}\n\n`
    }

    // Generate component interfaces
    components.forEach((component) => {
      if (this.config.debug) {
        console.log(`🧩 Processing component: ${component.modelName}`)
      }
      const interfaceData = generateInterfaceFromSchema(
        component.modelName,
        component.schema,
        true,
        component.filePath,
        this.config.customFieldMappings,
        enabledOptionalMappings,
      )
      output += interfaceData.interfaceString
    })

    // Generate content type interfaces
    contentTypes.forEach((contentType) => {
      if (this.config.debug) {
        console.log(`📄 Processing content type: ${contentType.modelName}`)
      }
      const interfaceData = generateInterfaceFromSchema(
        contentType.modelName,
        contentType.schema,
        false,
        '',
        this.config.customFieldMappings,
        enabledOptionalMappings,
      )
      output += interfaceData.interfaceString
    })

    this.writeTypesFile(output)

    console.log(`✅ Types generated successfully at ${this.config.outputPath}`)
    console.log(
      `📊 Generated ${contentTypes.length} content types and ${components.length} components`,
    )
  }

  private discoverSchemaFiles(
    apiDir: string,
    componentsDir: string,
  ): {
    schemaFiles: string[]
    componentSchemaFiles: string[]
  } {
    let schemaFiles: string[] = []
    let componentSchemaFiles: string[] = []

    if (fs.existsSync(apiDir)) {
      schemaFiles = walkDirectoryForSchemas(apiDir)
      if (this.config.debug) {
        console.log(`📁 Found ${schemaFiles.length} API schema files:`)
        schemaFiles.forEach((file) => console.log(`  - ${path.relative(process.cwd(), file)}`))
      }
    }

    if (fs.existsSync(componentsDir)) {
      componentSchemaFiles = walkDirectoryForComponents(componentsDir)
      if (this.config.debug) {
        console.log(`🧩 Found ${componentSchemaFiles.length} component schema files:`)
        componentSchemaFiles.forEach((file) =>
          console.log(`  - ${path.relative(process.cwd(), file)}`),
        )
      }
    }

    return { schemaFiles, componentSchemaFiles }
  }

  private loadComponents(componentSchemaFiles: string[]): ComponentInfo[] {
    return componentSchemaFiles.map((schemaFile) => {
      const schemaJson = fs.readFileSync(schemaFile, 'utf-8')
      const schema: StrapiSchema = JSON.parse(schemaJson)
      const modelName = path.basename(schemaFile, '.json')

      return {
        modelName,
        schema,
        filePath: schemaFile,
        componentPath: '', // Will be computed in generateInterfaceFromSchema
      }
    })
  }

  private loadContentTypes(schemaFiles: string[]): ContentTypeInfo[] {
    return schemaFiles.map((schemaFile) => {
      const schemaJson = fs.readFileSync(schemaFile, 'utf-8')
      const schema: StrapiSchema = JSON.parse(schemaJson)
      const modelName = path.basename(path.dirname(schemaFile))

      return {
        modelName,
        schema,
        filePath: schemaFile,
      }
    })
  }

  private writeTypesFile(output: string): void {
    const outputDir = path.dirname(this.config.outputPath)

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    fs.writeFileSync(this.config.outputPath, output)
  }
}
