import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "react",
      devTarget: "es2020",
      tsDecorators: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: "globalThis",
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            return "vendor";
            // TODO - Consider splitting out vendor chunks
            // const packageName = id.split("node_modules/")[1].split("/")[0];
            // return `vendor_${packageName}`;
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Adjust the limit as needed
  },
});
