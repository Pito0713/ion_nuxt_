// composables/useHook.ts
type Blog = {
  id: string
  title: string
}
interface Tag {
  uuid: string
  label: string
  tagCount: number,
  blogs: Blog[]
}

type TagResp  = { data: Tag[];  status: number; }

export function useHook() {
  // ----------------------------------------------------
  // SSR fetch
  // ----------------------------------------------------
  const { data: tagResp, pending: tagPending } = useApiFetch<TagResp>('/tags', { 
    key: computed(() => `tags:list`), 
    dedupe: 'defer' 
  })

  // ----------------------------------------------------
  // 資料解拆封
  // ----------------------------------------------------
  // SSR 資料進行宣告
  const tagInfo  = computed<Tag[]>(() => tagResp.value?.data ?? [])
  const tagReady = computed(() => !tagPending.value && tagInfo.value.length > 0)
  
  return {
    tagInfo,
    tagPending,
    tagReady,
  }
}
