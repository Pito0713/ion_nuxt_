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

  //  分頁狀態
  const page = ref(1)
  const pageSize = ref(10)

  // 不用 await，直接拿到 refs
  const { data: blogResp, pending: blogPending} =
    useApiFetch<BlogResp>('/blogs', { key: 'blogs:list' })

  const { data: tagResp,  pending: tagPending} =
    useApiFetch<TagResp>('/tags',  { key: 'tags:list'  })

  // 用 computed 把形狀「剝殼」成最終要給 UI 用的資料
  const blogInfo = computed<Blog[]>(() => blogResp.value?.data ?? [])
  const blogTotalCount = computed(() => blogResp.value?.totalCount ?? 0)
  const tagInfo  = computed<Tag[]>(()  => tagResp.value?.data  ?? [])
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
