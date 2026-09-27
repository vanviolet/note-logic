import { alphaTab } from "@coderline/alphatab-vite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  server: {
    port: 3030,
    proxy: {
      "/api": {
        target: process.env.VITE_APP_URL || "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [tailwindcss(), alphaTab(), reactRouter(), tsconfigPaths()],
  build: {
    target: "esnext",
    minify: "esbuild",
    rollupOptions: {
      treeshake: {
        moduleSideEffects: "no-external",
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
        preset: "smallest",
      },
      output: {
        manualChunks: undefined,
      },
    },
  },
  esbuild: {
    drop: mode === "production" ? ["console", "debugger"] : [],
    legalComments: "none",
  },
}));
