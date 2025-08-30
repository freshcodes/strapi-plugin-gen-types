import type { Core } from '@strapi/strapi'
import type { DefaultPluginConfig } from './types/config'

const bootstrap = ({ strapi }: { strapi: Core.Strapi }) => {
  // Hook into the server lifecycle after Strapi has fully loaded
  strapi.server.httpServer.on('listening', () => {
    const config: DefaultPluginConfig = strapi.config.get('plugin::gen-types')

    // Add a configurable delay to ensure Strapi's type generation is complete
    setTimeout(() => {
      console.log('🔄 Regenerating TypeScript types...')
      try {
        const service = strapi.plugin('gen-types').service('service')
        service.generateTypes()
        console.log('✅ TypeScript types regenerated successfully')
      } catch (error) {
        console.error('❌ Failed to regenerate TypeScript types:', error)
      }
    }, config.generationDelay)
  })
}

export default bootstrap
