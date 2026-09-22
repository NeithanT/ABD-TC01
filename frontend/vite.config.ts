import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const requiredEnvs = [
    'VITE_BACKEND_ROUTE',
    'VITE_AUTHORITY',
    'VITE_CLIENT_ID',
    'VITE_TIMEOUT_TIME',
  ];

  const missing = requiredEnvs.filter((key) => !env[key] && !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `\n[BUILD ERROR] Faltan variables de ambiente:\n ${missing.join('\n   - ')}\n`
    );
  }

  return {
    plugins: [react()],
  };
})
