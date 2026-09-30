<script setup lang="ts">
const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

// i18n 的 switchLocalePath 对非默认 locale 会吐出无尾斜杠的路径（如 /zh），
// 但本站点所有路由强制带尾斜杠（/zh/），且预渲染产物也是 /zh/。
// 这里统一补齐，避免 Cloudflare Pages 上 /zh 404 或客户端路由不匹配。
function withTrailingSlash(p: string): string {
  return p === '/' || p.endsWith('/') ? p : `${p}/`
}

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'zh', label: '中文' },
  { code: 'es', label: 'ES' },
  { code: 'de', label: 'DE' },
  { code: 'fr', label: 'FR' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'ru', label: 'Русский' }
]
</script>

<template>
  <div class="lang-switch">
    <a
      v-for="l in locales"
      :key="l.code"
      :href="withTrailingSlash(switchLocalePath(l.code))"
      :class="{ active: locale === l.code }"
      :aria-current="locale === l.code ? 'true' : undefined"
    >{{ l.label }}</a>
  </div>
</template>
