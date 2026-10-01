<script setup lang="ts">
const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

// i18n 的 switchLocalePath 对非默认 locale 会吐出无尾斜杠的路径（如 /zh），
// 但本站点所有路由强制带尾斜杠（/zh/），且预渲染产物也是 /zh/。
// 这里统一补齐，避免 Cloudflare Pages 上 /zh 404 或客户端路由不匹配。
function withTrailingSlash(p: string): string {
  return p === '/' || p.endsWith('/') ? p : `${p}/`
}

// 下拉切换：SSG 静态页之间直接整页跳转，不做客户端路由
function onChange(e: Event) {
  const code = (e.target as HTMLSelectElement).value
  window.location.href = withTrailingSlash(switchLocalePath(code))
}

const locales = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'ru', label: 'Русский' }
]
</script>

<template>
  <select class="lang-select" :value="locale" aria-label="Language" @change="onChange">
    <option v-for="l in locales" :key="l.code" :value="l.code">{{ l.label }}</option>
  </select>
</template>
