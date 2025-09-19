// composables/useHook.ts
interface Blog {
  id: string
  title: string
  text: string
  createTime: string
  updateTime: string | null
  userUUID: string
  blogCounts: number
  previewText: string | null
  tag: { imgURL: string; label: string } | null
  textContent: string
}

interface Tag {
  uuid: string
  label: string
  tagCount: number
}

type BlogResp = { data: Blog[]; status: number; totalCount: number }
type TagResp  = { data: Tag[];  status: number; }

export function useHook() {
  const { $sanitize } = useNuxtApp()   // HTML Sanitize
  
  // ----------------------------------------------------
  // stateMent
  // ----------------------------------------------------
  // 分頁狀態 useRoute 拿 query 參數
  const route = useRoute()
  const page = ref( Number(useRoute().query.page ?? 1) || 1 )
  const pageSize = ref( Number(useRoute().query.pageSize ?? 10) || 10 )

  // ----------------------------------------------------
  // SSR fetch
  // ----------------------------------------------------
  const { data: blogResp, pending: blogPending } = useApiFetch<BlogResp>('/blogs', {
    query: computed(() => ({ page: page.value, pageSize: page.value ? pageSize.value : 10 })),
    key: computed(() => `blogs:list:${page.value}:${pageSize.value}`),
    dedupe: 'defer', // 重疊請求去重（避免同時兩發）
  })
  const { data: tagResp, pending: tagPending } = useApiFetch<TagResp>('/tags', { 
    key: computed(() => `tags:list:${page.value}:${pageSize.value}`), 
    dedupe: 'defer' 
  })

  // ----------------------------------------------------
  // 資料解拆封
  // ----------------------------------------------------
  // 在這裡做 sanitize（不改動原資料，回傳一份處理後的）
  const blogInfo = computed<Blog[]>(() => {
    const rows = blogResp.value?.data ?? []
    return rows.map((_value) => ({
      ..._value,
      textContent: $sanitize(_value.textContent, {
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
    }))
  })
  
  // SSR 資料進行宣告
  const blogTotalCount = computed(() => blogResp.value?.totalCount ?? 0)
  const tagInfo  = computed<Tag[]>(() => tagResp.value?.data ?? [])
  const tagReady = computed(() => !tagPending.value && tagInfo.value.length > 0)
  const canvasKey = computed(() => `tags-${tagInfo.value.length}`)

  // ----------------------------------------------------
  // 資料監聽變化（同步 query 參數）
  // ----------------------------------------------------
  const router = useRouter()
  watch([page, pageSize], ([newPage, newPageSize]) => {
    // value 如果一樣就 return
    const queryNewPage = String(newPage)
    const queryNewPageSize = String(newPageSize)
    if (route.query.page === queryNewPage && route.query.pageSize === queryNewPageSize) return

    // 更新 query 參數
    router.replace({
      query: { ...route.query, page: queryNewPage, pageSize: queryNewPageSize }
    })
    window.scrollTo({ top: 0, behavior: 'smooth' }) //滾回頂部
  },{ flush: 'post' }) // 等 DOM 更新後再執行

  // ----------------------------------------------------
  // 其他
  // ----------------------------------------------------
  // 日期格式化
  function formatDate(_value: Date | string): string {
    const date = new Date(_value);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  return {
    page,
    pageSize,
    blogInfo,
    blogTotalCount,
    tagInfo,
    canvasKey,
    blogPending,
    tagPending,
    tagReady,
    formatDate,
  }
}
