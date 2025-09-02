// composables/useHook.ts
interface Blog {
  id: string
  title: string
  text: string
  createTime: string
  updateTime: string | null
  userUUID: string
  blogCounts: number
  tags: string[] | null
  textContent: string
}

type BlogResp = { data: Blog; status: number; }
export function useHook() {
  const { $sanitize } = useNuxtApp()   // HTML Sanitize
  // ----------------------------------------------------
  // stateMent
  // ----------------------------------------------------
  // 分頁狀態 useRoute 拿 query 參數
  const route = useRoute()
  const blogId = route.params.id
  // ----------------------------------------------------
  // SSR fetch
  // ----------------------------------------------------
  const { data: blogResp, pending: blogPending } = useApiFetch<BlogResp>(`/blogs/${blogId}`, {
    dedupe: 'defer', // 重疊請求去重（避免同時兩發）
  })

  // ----------------------------------------------------
  // 資料解拆封
  // ----------------------------------------------------
  // 在這裡做 sanitize（不改動原資料，回傳一份處理後的）
  const blogInfo = computed<Blog | null>(() => {
    if (!blogResp.value?.data) return null
    return {
      ...blogResp.value.data,
      textContent: $sanitize(blogResp.value.data.textContent, {
        // 允許的標籤與屬性
        ALLOWED_TAGS: [
          'h1','h2','h3','h4','h5','h6',
          'p','blockquote','pre','code','br',
          'ul','ol','li','strong','em','a','hr'
        ],
        ALLOWED_ATTR: ['href','title','target','rel'],
        // 限制的標籤與屬性
        FORBID_TAGS: ['script','style','iframe'],
        FORBID_ATTR: ['onerror','onload','onclick']
      })
    }
  })

  // ----------------------------------------------------
  // 其他
  // ----------------------------------------------------
  // 日期格式化
  const fmt = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' })

  return {
    blogInfo,
    blogPending,
    fmt,
  }
}
