import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  base: "/AR_plane_detection/",
  plugins: [react(), basicSsl()],
  server: {
    https: true,
    host: true,
  },
});
