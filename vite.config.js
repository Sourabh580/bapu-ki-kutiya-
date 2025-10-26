import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // 👈 FIX: ensures assets load correctly on Render
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
