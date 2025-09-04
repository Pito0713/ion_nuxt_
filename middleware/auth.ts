export default defineNuxtRouteMiddleware(async () => {
  // 讀 cookie（非 HttpOnly）：
  const userUUID = useCookie<string | null>('userUUID')

  // 若是 HttpOnly，改呼叫你的 session API：
  // const { authed } = await $fetch('/api/session')

  const ok = Boolean(userUUID.value) // 或 Boolean(authed)
  if (!ok) return navigateTo('/main?page=1&pageSize=10', { replace: true })
})
