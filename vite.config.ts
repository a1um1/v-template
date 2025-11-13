import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import packageConfig from "./package.json";
import { nitro } from "nitro/vite";

const config = defineConfig({
  plugins: [
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    nitro({ preset: "bun" })
  ],
  define: {
    __APP_VERSION__: JSON.stringify(packageConfig.version),
  }
})

export default config
