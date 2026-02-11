import { defineConfig } from 'vite'

export default defineConfig({
  base: '/debbandwinnie.com/',
  build: {
    outDir: 'public',
  },
  publicDir: 'static',
})
