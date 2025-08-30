import type { Core } from '@strapi/strapi'
import type { DefaultPluginConfig } from '../types/config'
import { TypeGenerator } from './type-generator'

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  generateTypes() {
    const config: DefaultPluginConfig = strapi.config.get('plugin::gen-types')
    const generator = new TypeGenerator(strapi, config)
    generator.generateTypes()
  },
})

export default service
