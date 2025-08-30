# AGENTS.md

## Project Overview

This is a Strapi v5 plugin called "gen-types" that auto-generates TypeScript types after Strapi startup. The plugin scans Strapi schema files and generates TypeScript interfaces for content types and components.

## Build and Development Commands

- `npm run build` - Build the plugin using strapi-plugin build
- `npm test` - Run tests using tsx test runner
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier

## Architecture

### Core Components

1. **Bootstrap** (`server/src/bootstrap.ts`): Plugin lifecycle hook that triggers type generation after Strapi server starts listening. Uses configurable delay to ensure Strapi's type generation is complete.

2. **TypeGenerator** (`server/src/services/type-generator.ts`): Main service class that handles:
   - Schema file discovery from `src/api` and `src/components` directories
   - Loading and parsing JSON schema files
   - Generating TypeScript interfaces via the generators
   - Writing output to configured path

3. **Generators** (`server/src/generators/`):
   - `interfaces.ts` - Core interface generation logic
   - `templates.ts` - Base types and file header generation
   - `attributes.ts` - Attribute type mapping logic

4. **Configuration** (`server/src/config/`):
   - `index.ts` - Plugin configuration with validation
   - `optional-custom-fields.ts` - Optional field mappings for Strapi plugins
   - `optional-types.ts` - TypeScript type definitions for Strapi plugin custom fields

### Key Features

- **Optional Field Types**: Configurable support for Strapi plugins via `enableOptionalFields` config
- **Custom Field Mappings**: Maps custom Strapi fields to specific TypeScript types
- **Component Support**: Generates types for both content types and reusable components
- **Built-in Types**: Provides base types for images, files, users, rich text blocks
- **Debug Mode**: Configurable logging for development
- **Generation Delay**: Configurable delay to ensure Strapi initialization is complete

### Type Generation Flow

1. Bootstrap hook waits for Strapi server to start listening
2. After configurable delay, TypeGenerator service is invoked
3. Schema files are discovered in `src/api` and `src/components`
4. JSON schemas are loaded and parsed
5. TypeScript interfaces are generated using the generators
6. Output file is written to the configured path

### Directory Structure

- `server/src/bootstrap.ts` - Plugin lifecycle hook
- `server/src/services/` - Core services including TypeGenerator
- `server/src/generators/` - Type generation logic and templates
- `server/src/config/` - Configuration and optional field mappings
- `server/src/types/` - TypeScript type definitions
- `server/src/utils/` - Utility functions for file operations and naming

### Testing

Tests use the tsx test runner and are located alongside source files with `.test.ts` suffix. The plugin includes tests for:

- Configuration validation
- Optional field type generation
- Attribute type generation
- Naming utilities
- String manipulation utilities
