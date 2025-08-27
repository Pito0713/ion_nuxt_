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
  const page = ref( Number(useRoute().query.page ?? 1) || 1 )
  const pageSize = ref( Number(useRoute().query.pageSize ?? 10) || 10 )

  // ----------------------------------------------------
  // SSR
  // ----------------------------------------------------
  // SSR fetch
  const { data: blogResp, pending: blogPending } =
  useApiFetch<BlogResp>(() => `/blogs?page=${page.value}&pageSize=${pageSize.value}`, {
    key: () => `blogs:list:${page.value}:${pageSize.value}`,
  })
  // SSR fetch
  const { data: tagResp, pending: tagPending } =
    useApiFetch<TagResp>('/tags')

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

  const router = useRouter()
  watch([page, pageSize], () => {
    router.replace({ query: { ...route.query, page: String(page.value), pageSize: String(pageSize.value) } })
    window.scrollTo({ top: 0, behavior: 'smooth' }) //換頁滾回頂部
  })

  return {
    page,
    pageSize,
    blogInfo,
    blogTotalCount,
    tagInfo,
    blogPending,
    tagPending,
    tagReady,
  }
}
