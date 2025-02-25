import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [react(), dts(),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "3DConfiguratorComponentLibrary",
      formats: ["es", "cjs", "umd"],
      fileName: (format: string) => `index.${format}.js`
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM"
        }
      }
    }
  }
});
