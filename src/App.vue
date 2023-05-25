<script lang="ts" setup>
import { useTheme } from "@/hooks/useTheme"
import EN from "element-plus/lib/locale/lang/en"

const { initTheme } = useTheme()

/** Initialize the theme */
initTheme()
/** Set the language of Element Plus to English */
const locale = EN
</script>

<template>
  <ElConfigProvider :locale="locale">
    <router-view />
  </ElConfigProvider>
</template>
