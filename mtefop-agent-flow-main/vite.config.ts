import { defineConfig, type UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const config: UserConfig = {
  server: {
    host: "localhost",
    port: 5173,
    https: false, // ✅ boolean accepté par le type UserConfig
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
};

export default defineConfig(config);
