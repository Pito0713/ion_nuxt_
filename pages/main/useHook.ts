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

  // 分頁狀態
  const page = ref(1)
  const pageSize = ref(10)

  const { data: blogResp, pending: blogPending } =
    useApiFetch<BlogResp>('/blogs', { key: 'blogs:list' })

  const { data: tagResp, pending: tagPending } =
    useApiFetch<TagResp>('/tags', { key: 'tags:list' })

  // ✅ 在這裡做 sanitize（不改動原資料，回傳一份處理後的）
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
