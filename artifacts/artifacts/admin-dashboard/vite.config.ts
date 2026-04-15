import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// Import your other plugins here...

// Define this outside the config for clarity
const replitPlugins = (process.env.REPL_ID && process.env.NODE_ENV !== "production")
  ? [
      await import("@replit/vite-plugin-cartographer").then((m) => m.cartographer({ root: path.resolve(import.meta.dirname, "..") })),
      await import("@replit/vite-plugin-dev-banner").then((m) => m.devBanner()),
    ]
  : [];

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    // add your tailwind and runtime plugins here
    ...replitPlugins,
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: "dist", 
    emptyOutDir: true,
  },
  server: {
    port: Number(process.env.PORT) || 8080,
    host: "0.0.0.0",
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "http://localhost:8088",
        changeOrigin: true,
      },
    },
  },
});
