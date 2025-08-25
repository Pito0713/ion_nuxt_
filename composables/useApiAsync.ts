
export function useApiAsync<T>(
  url: string,
  options: object
) {
  const config = useRuntimeConfig()
  // const token = useCookie<string | null>('token')

  return $fetch<T>(
    url,
    {
      baseURL: config.public.baseURL,
      credentials: 'include',
      headers: {
        // ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
      },
      ...options
    })
}
