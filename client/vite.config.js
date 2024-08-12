import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/server": {
        target: "http://localhost:3000",
        secure: true,
        open: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Adjust the chunk size warning limit
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Create separate chunks for each dependency in node_modules
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
          if (id.includes("src/pages")) {
            // Create separate chunks for each page in the src/pages directory
            return id
              .toString()
              .split("src/pages/")[1]
              .split("/")[0]
              .toString();
          }
          if (id.includes("src/components")) {
            // Create separate chunks for each component in the src/components directory
            return id
              .toString()
              .split("src/components/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
});
