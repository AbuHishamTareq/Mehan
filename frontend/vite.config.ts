import fs from "fs";
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import mkcert from "vite-plugin-mkcert";

// Update these if your mkcert generated different filenames
const CERT_DIR = `${process.env.HOME}/.config/Herd/certs`;
const CERT_KEY = path.join(CERT_DIR, "mehan.test+1-key.pem");
const CERT_FILE = path.join(CERT_DIR, "mehan.test+1.pem");

export default defineConfig({
  server: {
    host: "mehan.test", // must match certificate CN
    port: 3000,
    https: {
      key: fs.readFileSync(CERT_KEY),
      cert: fs.readFileSync(CERT_FILE),
    },
    proxy: {
      // Proxy all Laravel backend requests securely
      "/api": {
        target: "https://mehan.test",
        changeOrigin: true,
        secure: true, // ensure HTTPS
      },
      "/sanctum": {
        target: "https://mehan.test",
        changeOrigin: true,
        secure: true,
      },
    },
    hmr: {
      protocol: "wss",
      host: "mehan.test", // must match HTTPS host
      port: 3000,
    },
  },
  plugins: [react(), mkcert()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
