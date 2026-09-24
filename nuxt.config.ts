// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },

  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap'
  ],

  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'zh', name: '中文', file: 'zh.json' }
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
          content: 'Generate random topics for conversations, writing, debates, and speeches. 500+ curated topics across 16 categories.'
        }
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
