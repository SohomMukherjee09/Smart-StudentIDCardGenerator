import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: "0.0.0.0",
    allowedHosts: [
      "3958774a-e355-4d9c-9a47-1292d27375e1-00-22f50djdpvgki.sisko.replit.dev",
    ],
  },
});
