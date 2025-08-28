// composables/useHook.ts
import { computed } from 'vue'

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

interface Tag {
  uuid: string
  label: string
  tagCount: number
}

type BlogResp = { data: Blog[]; status: number; totalCount: number }
type TagResp  = { data: Tag[];  status: number; }

export function useHook() {
  const { $sanitize } = useNuxtApp()
  const route = useRoute()

  // 分頁狀態
  // useRoute 拿 query 參數
  const page = ref( Number(useRoute().query.page ?? 1) || 1 )
  const pageSize = ref( Number(useRoute().query.pageSize ?? 10) || 10 )

  // ----------------------------------------------------
  // SSR fetch
  // ----------------------------------------------------
  const { data: blogResp, pending: blogPending } = useApiFetch<BlogResp>('/blogs', {
    query: computed(() => ({ page: page.value, pageSize: page.value ? pageSize.value : 10 })),
    key: computed(() => `blogs:list:${page.value}:${pageSize.value}`),
    // 或者用 watch 明確指定：
    // watch: [page, pageSize],
    dedupe: 'defer', // 重疊請求去重（避免同時兩發）
  })
  const { data: tagResp, pending: tagPending } =
    useApiFetch<TagResp>('/tags', { key: computed(() => `tags:list:${page.value}:${pageSize.value}`), dedupe: 'defer' })

  // ----------------------------------------------------
  // 資料解拆封
  // ----------------------------------------------------
  // 在這裡做 sanitize（不改動原資料，回傳一份處理後的）
  const blogInfo = computed<Blog[]>(() => {
    const rows = blogResp.value?.data ?? []
    return rows.map((b) => ({
      ...b,
      textContent: $sanitize(b.textContent, {
        // 可選：限制允許的標籤/屬性，依需求調整
        ALLOWED_TAGS: [
          'h1','h2','h3','h4','h5','h6',
          'p','blockquote','pre','code','br',
          'ul','ol','li','strong','em','a','hr'
        ],
        ALLOWED_ATTR: ['href','title','target','rel'],
        FORBID_TAGS: ['script','style','iframe'],
        FORBID_ATTR: ['onerror','onload','onclick']
      })
    }))
  })

  const blogTotalCount = computed(() => blogResp.value?.totalCount ?? 0)
  const tagInfo  = computed<Tag[]>(() => tagResp.value?.data ?? [])
  const tagReady = computed(() => !tagPending.value && tagInfo.value.length > 0)
  // 讓 3D 元件在資料更新時重掛載（避免拿到空資料就初始化）：
  const canvasKey = computed(() => `tags-${tagInfo.value.length}`)

  
  const router = useRouter()
  watch([page, pageSize], ([p, s]) => {
  // 價值一樣就不要 replace（避免無謂導航）
  const qp = String(p)
  const qs = String(s)
  if (route.query.page === qp && route.query.pageSize === qs) return

  router.replace({
    query: { ...route.query, page: qp, pageSize: qs }
  })
      window.scrollTo({ top: 0, behavior: 'smooth' }) //換頁滾回頂部
},{ flush: 'post' })



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
  }
}
