<template>
  <div class="wrap">
    <header class="site-header">
      <h1>{{ t('site.title') }}</h1>
      <p>{{ t('site.tagline') }}</p>
      <LocaleSwitcher />
    </header>
    <TopicGenerator />
    <footer class="site-footer">
      <p>{{ t('footer') }} · <span class="build-info">build <code>{{ build.commit }}</code> · {{ buildTimeUtc }}</span></p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const appConfig = useAppConfig() as any
const build = appConfig.build ?? { commit: 'unknown', time: '' }
const buildTimeUtc = computed(() => {
  if (!build.time) return ''
  return new Date(build.time).toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
})
</script>

<style scoped>
.site-footer {
  margin-top: 1.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(124, 58, 237, 0.15);
  text-align: center;
  color: #6b7280;
  font-size: 0.85rem;
}
.site-footer .build-info {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.78rem;
  color: #9ca3af;
}
.site-footer .build-info code {
  background: rgba(124, 58, 237, 0.08);
  padding: 0.05rem 0.35rem;
  border-radius: 4px;
  color: #7c3aed;
}
</style>
