import { defineConfig, presetAttributify, presetUno } from "unocss"

export default defineConfig({
  /** exclude */
  exclude: ["node_modules"],
  /** 预设 */
  presets: [
    /** Attributed schema & Valueless attribute schema */
    presetAttributify(),
    /** 默认预设 */
    presetUno()
  ],
  /** custom rules */
  rules: [["uno-padding-20", { padding: "20px" }]],
  /** custom shortcut */
  shortcuts: {
    "uno-wh-full": "w-full h-full",
    "uno-flex-center": "flex justify-center items-center",
    "uno-flex-x-center": "flex justify-center",
    "uno-flex-y-center": "flex items-center"
  }
})
