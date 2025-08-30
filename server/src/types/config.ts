/** Available optional field types that can be enabled */
export type OptionalFieldType = 'iconhub' | 'link-field' | 'country-select'

export interface PluginConfig {
  /** Path where the generated types file should be output */
  outputPath: string
  /** Additional custom types to include in the generated file */
  additionalTypes?: string
  /** Custom field mappings for handling custom Strapi fields */
  customFieldMappings?: Record<string, string>
  /** Enable optional field types: true for all, array for specific ones */
  enableOptionalFields?: boolean | OptionalFieldType[]
  /** Whether to include debug logging */
  debug?: boolean
  /** Delay in milliseconds before generating types after server starts */
  generationDelay?: number
}

export interface DefaultPluginConfig extends Required<PluginConfig> {
  additionalTypes: string
  customFieldMappings: Record<string, string>
  enableOptionalFields: boolean | OptionalFieldType[]
  debug: boolean
  generationDelay: number
}
