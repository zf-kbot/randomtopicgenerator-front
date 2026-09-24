// GA4 SPA route-change pageview tracking.
// The base gtag loader + config lives in nuxt.config.ts app.head (rendered into every
// prerendered HTML <head>), so the initial pageview fires before hydration.
// This plugin only sends an additional page_view on client-side navigations
// (Nuxt static sites become an SPA after hydration → no full reload on locale/path change).
export default defineNuxtPlugin(() => {
  const router = useRouter()
  let isFirst = true

  router.afterEach((to) => {
    // Skip the initial navigation — the head script already sent the first page_view.
    if (isFirst) {
      isFirst = false
      return
    }
    if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
      const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag
      gtag('event', 'page_view', {
        page_path: to.fullPath,
        page_title: document.title,
        page_location: window.location.href
      })
    }
  })
})
