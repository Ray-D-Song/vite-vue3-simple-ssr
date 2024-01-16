import { defineConfig } from 'unocss'
import { presetIcons, presetWind } from 'unocss'

export default defineConfig({
  presets: [
    presetIcons(),
    presetWind()
  ]
})