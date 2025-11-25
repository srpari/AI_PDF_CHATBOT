import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/AI_PDF_CHATBOT/",
  plugins: [react()],
})
