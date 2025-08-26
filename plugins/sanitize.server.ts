// plugins/sanitize.server.ts
import DOMPurify from 'isomorphic-dompurify'
export default defineNuxtPlugin(() => {
  return { provide: { sanitize: (html: string) => DOMPurify.sanitize(html) } }
})