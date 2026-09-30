// https://nuxt.com/docs/api/configuration/nuxt-config
import { execSync } from 'node:child_process'

// 构建信息：commit（CF 构建取 CF_PAGES_COMMIT_SHA，本地回退 git）、构建时间
// 写入 appConfig，SSG 时内联进页面，便于核对线上版本。
function getBuildCommit(): string {
  const sha = process.env.CF_PAGES_COMMIT_SHA
  if (sha) return sha.slice(0, 7)
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return 'unknown'
  }
}

const buildInfo = {
  commit: getBuildCommit(),
  time: new Date().toISOString()
}

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },

  appConfig: {
    build: buildInfo
  },

  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap'
  ],

  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'zh', name: '中文', file: 'zh.json' },
      { code: 'es', name: 'Español', file: 'es.json' },
      { code: 'de', name: 'Deutsch', file: 'de.json' },
      { code: 'fr', name: 'Français', file: 'fr.json' },
      { code: 'ja', name: '日本語', file: 'ja.json' },
      { code: 'ko', name: '한국어', file: 'ko.json' },
      { code: 'ru', name: 'Русский', file: 'ru.json' }
    ],
    langDir: 'locales',
    strategy: 'prefix_except_default',
    // 关闭浏览器语言自动检测：否则 zh 浏览器访问 / 会被客户端弹回 /zh/，导致"切不回英文"
    detectBrowserLanguage: false,
    baseUrl: 'https://randomtopicgenerator.io'
  },

  sitemap: {
    siteUrl: 'https://randomtopicgenerator.io',
    // TODO: 增强 i18n hreflang（xhtml:link 交替链接）— 待 @nuxtjs/sitemap v8 与 i18n 集成细调
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Random Topic Generator',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Generate random Topics, Questions, and Words for conversations, writing, debates, and speeches. 17 categories, three modes, endless practice.'
        },
        { name: 'theme-color', content: '#7C3AED' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/icon-192.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
      ],
      script: [
        { src: 'https://www.googletagmanager.com/gtag/js?id=G-HXX3LLPPQP', async: true },
        {
          innerHTML:
            "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-HXX3LLPPQP');"
        }
      ]
    }
  }
})
