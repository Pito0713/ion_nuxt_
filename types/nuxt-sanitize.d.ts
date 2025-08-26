// types/nuxt-sanitize.d.ts
import type { Config } from 'isomorphic-dompurify'

declare module '#app' {
  interface NuxtApp {
    $sanitize: (html: string, opts?: Config) => string
  }
}

export {}
