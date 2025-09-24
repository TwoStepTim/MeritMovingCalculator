import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // base is optional for lib builds; harmless to set
  base: '/MeritMovingCalculator/',
  build: {
    outDir: 'docs',            // <- GitHub Pages serves from /docs
    lib: {
      entry: './src/mount.js', // exposes window.MeritCalc
      name: 'MeritCalc',
      formats: ['iife'],
      fileName: () => 'move-calculator.js'
    },
    rollupOptions: { treeshake: true }
  }
})
