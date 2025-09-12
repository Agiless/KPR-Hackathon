import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allows your Vite dev server to be accessed by your ngrok URL
    allowedHosts: [
      '5f61061fa018.ngrok-free.app' 
    ],
    proxy: {
  "/api": {
    target: "http://127.0.0.1:8000",
    changeOrigin: true,
    secure: false,
   // removes /api
  },
}

  }
})