import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React ecosystem - core bundle
          'react-vendor': [
            'react',
            'react-dom',
            'react-router-dom',
          ],

          // UI libraries - Radix UI components
          'radix-vendor': [
            '@radix-ui/react-avatar',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-icons',
          ],

          // Calendar heavy libs - only loaded when needed
          'calendar-vendor': [
            'react-big-calendar',
            'moment',
          ],

          // Animation library
          'animation-vendor': [
            'framer-motion',
          ],

          // Icons
          'icons-vendor': [
            'lucide-react',
          ],

          // Utilities
          'utils-vendor': [
            'axios',
            'clsx',
            'tailwind-merge',
            'class-variance-authority',
            'sonner',
          ],
        },
      },
    },
    // Increase chunk size warning limit to 600kb (after optimization)
    chunkSizeWarningLimit: 600,
  },
})
