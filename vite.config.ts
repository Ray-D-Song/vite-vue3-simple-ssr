import { URL, fileURLToPath } from 'node:url'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { presetIcons, presetWind } from 'unocss'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		UnoCSS({
			presets: [
				presetIcons(),
				presetWind(),
			],
		}),
		vue(),
		vueJsx(),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	server: {
		port: 80,
	},
	build: {
		outDir: './dist/client',
	},
})
