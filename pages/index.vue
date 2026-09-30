<template>
  <div class="wrap">
    <header class="site-header">
      <h1>{{ t('site.title') }}</h1>
      <p>{{ t('site.tagline') }}</p>
      <LocaleSwitcher />
    </header>
    <TopicGenerator />
    <main class="seo-content">
      <section class="seo-block">
        <h2>{{ t('seo.intro.h2') }}</h2>
        <p>{{ t('seo.intro.p1') }}</p>
        <p>{{ t('seo.intro.p2') }}</p>
      </section>

      <section class="seo-block">
        <h2>{{ t('seo.how.h2') }}</h2>
        <ol class="how-steps">
          <li v-for="(step, i) in howSteps" :key="i">
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </li>
        </ol>
      </section>

      <section class="seo-block">
        <h2>{{ t('seo.useCases.h2') }}</h2>
        <div class="uc-grid">
          <div v-for="(uc, i) in useCaseItems" :key="i" class="uc-card">
            <h3>{{ uc.title }}</h3>
            <p>{{ uc.text }}</p>
          </div>
        </div>
      </section>

      <section class="seo-block">
        <h2>{{ t('seo.faq.h2') }}</h2>
        <details v-for="(item, i) in faqItems" :key="i" class="faq-item">
          <summary>{{ item.q }}</summary>
          <p>{{ item.a }}</p>
        </details>
      </section>
    </main>
    <footer class="site-footer">
      <p>{{ t('footer') }} · <span class="build-info">build <code>{{ build.commit }}</code> · {{ buildTimeUtc }}</span></p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocaleHead } from '#i18n'

const { t, tm } = useI18n()
const appConfig = useAppConfig() as any
const build = appConfig.build ?? { commit: 'unknown', time: '' }
const buildTimeUtc = computed(() => {
  if (!build.time) return ''
  return new Date(build.time).toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
})

// SEO head：随语言的 title/description + canonical/hreflang（由 useLocaleHead 生成）
useSeoMeta({
  title: () => t('seo.head.title'),
  description: () => t('seo.head.description'),
  ogTitle: () => t('seo.head.title'),
  ogDescription: () => t('seo.head.description'),
  ogType: 'website'
})
const localeHead = useLocaleHead()
useHead(() => localeHead.value)

// 列表型文案取原始 message 数组（含 fallback）
const rawList = (key: string) => (tm(key) as any[] | undefined) ?? []
const howSteps = computed(() => rawList('seo.how.steps'))
const useCaseItems = computed(() => rawList('seo.useCases.items'))
const faqItems = computed(() => rawList('seo.faq.items'))

// 结构化数据：WebApplication + FAQPage（SSG 时内联进 HTML）
const SITE_URL = 'https://randomtopicgenerator.io'
const LANGS = ['en', 'zh', 'es', 'de', 'fr', 'ja', 'ko', 'ru']
const jsonLd = computed(() => {
  const webApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t('site.title'),
    url: SITE_URL,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    description: t('seo.head.description'),
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    inLanguage: LANGS
  }
  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.value.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a }
    }))
  }
  return JSON.stringify([webApp, faqPage])
})
useHead({
  script: [
    { type: 'application/ld+json', innerHTML: jsonLd }
  ]
})
</script>

<style scoped>
.seo-content {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  text-align: left;
}
.seo-block h2 {
  font-size: 1.25rem;
  color: #4c1d95;
  margin-bottom: 0.6rem;
}
.seo-block p {
  color: #4b5563;
  line-height: 1.65;
  margin-bottom: 0.5rem;
}
.how-steps {
  list-style: none;
  counter-reset: step;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.how-steps li {
  counter-increment: step;
  background: rgba(124, 58, 237, 0.05);
  border: 1px solid rgba(124, 58, 237, 0.12);
  border-radius: 10px;
  padding: 0.75rem 1rem 0.75rem 3rem;
  position: relative;
}
.how-steps li::before {
  content: counter(step);
  position: absolute;
  left: 0.85rem;
  top: 0.85rem;
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 50%;
  background: #7c3aed;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}
.how-steps h3 {
  font-size: 0.95rem;
  color: #4c1d95;
  margin-bottom: 0.2rem;
}
.how-steps p {
  font-size: 0.9rem;
  margin: 0;
}
.uc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.75rem;
}
.uc-card {
  background: rgba(124, 58, 237, 0.05);
  border: 1px solid rgba(124, 58, 237, 0.12);
  border-radius: 10px;
  padding: 0.85rem 1rem;
}
.uc-card h3 {
  font-size: 0.95rem;
  color: #4c1d95;
  margin-bottom: 0.25rem;
}
.uc-card p {
  font-size: 0.9rem;
  margin: 0;
}
.faq-item {
  border: 1px solid rgba(124, 58, 237, 0.12);
  border-radius: 10px;
  background: rgba(124, 58, 237, 0.03);
  margin-bottom: 0.5rem;
  overflow: hidden;
}
.faq-item summary {
  cursor: pointer;
  padding: 0.7rem 1rem;
  font-weight: 600;
  color: #4c1d95;
  font-size: 0.95rem;
}
.faq-item[open] summary {
  border-bottom: 1px solid rgba(124, 58, 237, 0.12);
}
.faq-item p {
  padding: 0.7rem 1rem;
  margin: 0;
  font-size: 0.9rem;
}
</style>
