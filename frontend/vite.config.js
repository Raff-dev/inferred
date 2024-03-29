import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        exclude: [],
    },
    server: {
        host: true,
        port: 3000, // This is the port which we will use in docker
    },
});
