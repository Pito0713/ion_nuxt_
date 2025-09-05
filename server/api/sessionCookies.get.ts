export default defineEventHandler((event) => {
  const cookie = getCookie(event, 'userUUID')
  return { authed: cookie }
})
