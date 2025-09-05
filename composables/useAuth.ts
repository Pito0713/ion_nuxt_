import { getCookie } from 'h3'
export async function useAuth() {
  const authed = useState<string | null>('authed', () => null)
  if (authed.value !== null) return { authed }
  if (import.meta.server) {
    const event = useRequestEvent()
    const config = useRuntimeConfig()
    const cookie = event ? getCookie(event, 'userUUID') : null
    if (!cookie) {
      authed.value = null
      return { authed }
    }

    type Res = { data: object; status: number }
    try {
      const res = await $fetch<Res>(`/users/${cookie}`, {
        baseURL: config.public.baseURL
      })
      
      if(res.status === 1 ) authed.value =  cookie 
      else authed.value =  null
    } catch {
      authed.value = null
    }
  }

  if (import.meta.client && authed.value) {
    const config = useRuntimeConfig()
    try {
      await $fetch(`/users/${authed.value}`, { baseURL: config.public.baseURL })
    } catch {
      authed.value = null
    }
  }

  return { authed }
}

