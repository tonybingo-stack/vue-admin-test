/// <reference types="vitest" />

import { type ConfigEnv, type UserConfigExport, loadEnv } from "vite"
import path, { resolve } from "path"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import { createSvgIconsPlugin } from "vite-plugin-svg-icons"
import svgLoader from "vite-svg-loader"
import UnoCSS from "unocss/vite"

/** Configuration Item Documentation：https://cn.vitejs.dev/config */
export default (configEnv: ConfigEnv): UserConfigExport => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd()) as ImportMetaEnv
  const { VITE_PUBLIC_PATH } = viteEnv
  return {
    /** Modify according to the actual situation when packaging base */
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        /** @ symbol pointing to src Table of contents */
        "@": resolve(__dirname, "./src")
      }
    },
    server: {
      port: 3006,
      open: true,
      proxy: {
        '/api': {
          target: 'http://dev.api.xxx.com', // 后端接口的域名
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      /** Eliminate warnings for bundle sizes exceeding 500kb */
      chunkSizeWarningLimit: 2000,
      /** Vite 2.6.x and above need to configure minify: "terser", terserOptions to take effect */
      minify: "terser",
      /** Remove console.log, debugger and comments when bundling code */
      terserOptions: {
        compress: {
          drop_console: false,
          drop_debugger: true,
          pure_funcs: ["console.log"]
        },
        format: {
          /** delete comment */
          comments: false
        }
      },
      /** Static resource directory after packaging */
      assetsDir: "static"
    },
    /** Vite plug-in */
    plugins: [
      vue(),
      vueJsx(),
      /** Convert SVG static images to Vue components */
      svgLoader({ defaultImport: "url" }),
      /** SVG */
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/icons/svg")],
        symbolId: "icon-[dir]-[name]"
      }),
      /** UnoCSS */
      UnoCSS()
    ],
  }
}
