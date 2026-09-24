<template>
  <div class="wrap">
    <header class="site-header">
      <h1>{{ t('site.title') }}</h1>
      <p>{{ t('site.tagline') }}</p>
      <LocaleSwitcher />
    </header>
    <TopicGenerator />
    <footer class="site-footer">{{ t('footer') }}</footer>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
