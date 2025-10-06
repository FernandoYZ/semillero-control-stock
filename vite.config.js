import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
      },
      manifest: {
        name: "Control de Stock",
        short_name: "StockApp",
        description: "Gestión de productos, ventas, pedidos y proveedores.",
        theme_color: "#45f882",
        background_color: "#ffffff",
        display: "standalone",
        start_url: ".",
        icons: [
          {
            src: "icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
