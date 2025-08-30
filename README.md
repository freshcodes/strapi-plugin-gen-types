# Strapi Generate Types Plugin

🤖 This plugin is pretty much written by AI and is very specific to our use-case/setup with the [Strapi Client](https://github.com/strapi/client).

## Installation

```bash
npm install @fresh.codes/strapi-plugin-gen-types
```

## Configuration

Add the plugin configuration to your `config/plugins.js` or `config/plugins.ts`:

```javascript
export default ({ env }) => ({
  // ... other plugins
  'gen-types': {
    enabled: env('NODE_ENV') === 'development',
    config: {
      // Path where the generated types file should be output
      outputPath: '../web/src/services/strapi/types.ts',

      // Optional: Enable built-in optional field types
      // true = enable all, array = enable specific ones, false/undefined = disable all
      enableOptionalFields: ['iconhub', 'link-field'], // or true for all

      // Optional: Additional custom types to include in the generated file
      additionalTypes: `
        // Your custom types here
        export interface MyCustomFieldType {
          id: string
          name: string
        }
      `,

      // Optional: Custom field mappings for handling custom Strapi fields
      // These will override any optional field mappings if there's a conflict
      customFieldMappings: {
        'plugin::my-custom-plugin.my-field': 'MyCustomFieldType',
      },

      // Optional: Enable debug logging (default: false)
      debug: true,

      // Optional: Delay in milliseconds before generating types (default: 1000)
      generationDelay: 2000,
    },
  },
})
```

## Generated Types

The plugin generates TypeScript interfaces for:

### Base Types

- `StrapiImage` - Image files with format variations
- `StrapiFile` - General file uploads
- `StrapiUser` - User entities
- `StrapiRole` - User roles
- `StrapiRichTextBlocksNode[]` - Rich text blocks (Strapi v5 blocks editor)

### Available Optional Custom Field Types (when enabled)

- `StrapiIconField` - IconHub plugin fields (`enableOptionalFields: ['iconhub']`)
- `StrapiLinkField` - Link field plugin fields (`enableOptionalFields: ['link-field']`)
- `StrapiCountryField` - Country Select plugin fields (`enableOptionalFields: ['country-select']`)

### Your Content Types

- All your API content types as `StrapiYourContentType`
- All your components as `StrapiCategoryComponentName`
- Proper relation handling
- i18n localization fields when enabled

### Example Generated Interface

```typescript
export interface StrapiArticle extends API.Document {
  id: number
  title: string
  content: StrapiRichTextBlocksNode[]
  featuredImage?: StrapiImage | null
  author: StrapiUser
  categories: StrapiCategory[]
  publishedAt?: string | null
  locale: string
  localizations?: StrapiArticle[]
}
```

#### Example Usage

```
import type { API } from '@strapi/client
import { strapi } from '@strapi/client'

const client = strapi({
  baseURL: new URL('/api', STRAPI_BASE_URL).toString(),
  auth: STRAPI_TOKEN,
})

const collectionClient = client.collection('articles')
const response = (await collectionClient.find({
  pagination: {
    page: 1,
    pageSize: 10,
    withCount: true,
  },
  populate: ['featuredImage'],
})) as API.DocumentResponseCollection<StrapiArticle>
// response.data: StrapiArticle[]
```

## License

[ISC License](LICENSE)
