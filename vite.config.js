import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        signup: resolve(__dirname, 'src/views/SignUp.html'),
        dashboard: resolve(__dirname, 'src/views/Dashboard.html'),
        modal: resolve(__dirname, 'src/views/Modal.html'),
      }
    }
  }
})