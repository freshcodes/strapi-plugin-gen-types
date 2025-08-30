export interface StrapiSchema {
  kind: string
  collectionName: string
  info: {
    singularName: string
    pluralName: string
    displayName: string
    description?: string
  }
  options?: {
    draftAndPublish?: boolean
  }
  pluginOptions?: {
    i18n?: {
      localized: boolean
    }
  }
  attributes: Record<string, StrapiAttribute>
}

export interface StrapiAttribute {
  type: string
  required?: boolean
  default?: unknown
  enum?: string[]
  multiple?: boolean
  allowedTypes?: string[]
  target?: string
  relation?: string
  component?: string
  repeatable?: boolean
  components?: string[]
  customField?: string
}

export interface InterfaceGenerationResult {
  interfaceString: string
  imports: string[]
}

export interface ComponentInfo {
  modelName: string
  schema: StrapiSchema
  filePath: string
  componentPath: string
}

export interface ContentTypeInfo {
  modelName: string
  schema: StrapiSchema
  filePath: string
}
