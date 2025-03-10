import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite({ target: "react", autoCodeSplitting: true }), react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@/": path.resolve(__dirname, "./src/"),
      "@/ui": path.resolve(__dirname, "./src/components/ui"),
      "@/queries": path.resolve(__dirname, "./src/queries"),
      "@/providers": path.resolve(__dirname, "./src/providers"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/lib/utils": path.resolve(__dirname, "./src/lib/utils"),
      "@/lib": path.resolve(__dirname, "./src/lib"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/helpers": path.resolve(__dirname, "./src/helpers"),
    },
  },
});
