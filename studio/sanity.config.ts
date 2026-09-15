import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {muxInput} from 'sanity-plugin-mux-input'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'Portfolio',

  projectId: '11hecj8j',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool(), muxInput()],

  schema: {
    types: schemaTypes,
  },
})
