// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: '/',
    head: {
        title: "ion-nuxt",
        meta: [
            { name: 'viewport', content: 'width=device-width, initial-scale=1' }
        ],
        link: [],
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxt/fonts',
    '@nuxtjs/color-mode',
    '@tresjs/nuxt',
  ],
  runtimeConfig: {
        public: {
            baseURL: process.env.API_BASE,
        },
    },
  css: ['~/assets/css/tailwind.css'],
  typescript: {
    typeCheck: true
  },
  nitro: {
    routeRules: {
      '/': { redirect: '/main' },
    }
  },
  colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storage: 'localStorage', // or 'sessionStorage' or 'cookie'
    storageKey: 'nuxt-color-mode'
  },
})