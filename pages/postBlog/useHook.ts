export function useHook() {

  // ---- hook ----
  const toast = useToast()
  // ---- statement ----
  const addTagValue = ref('') //  value for tag addinput
  const tagItems = ref<{ label: string, uuid: string }[]>([]) // tag items for select
  const form = ref({ tag: { label: '', uuid: '' }, title: '', content: '🎉' })
  // ---- Interface ----
  type Tag = { id: string; uuid: string; label: string }
  type TagResp = { data: Tag[]; status: number }

  // @API POST /tags  新增標籤
  async function createTags() {
    const payload = { label: addTagValue.value }
    if (!payload.label) return
    const res:TagResp = await useApiAsync(
      '/tags', 
      { method: 'POST', body: payload }
    )
    if(res.status === 1) {
      getTags() // 重新取得標籤
      toast.add({ 
			title:'success', 
			description: 'tag_success',
			color: 'success',
			close: {
				color: 'primary',
				variant: 'outline',
				class: 'rounded-full'
			}})
    }
  }

  // @API GET /tags  取得標籤
  async function getTags() {
    const res:TagResp = await useApiAsync(
      '/tags', 
      { method: 'GET' }
    )
    if(res.status === 1) {
      tagItems.value = (res?.data ?? []).map(e => ({ label: e.label, uuid: e.uuid }))
    }
  }

  // @API GET /tags  取得標籤
  async function postBlogs() {
    const payload = {
      tag: form.value.tag,
      title: form.value.title,
      textContent: form.value.content
    }
    if (!payload.tag.label || !payload.title ) return;
    const res:{status: number} = await useApiAsync(
      '/blogs', 
      { 
        method: 'POST',
        body: payload
      }
    )
    if(res.status === 1) {
      toast.add({ 
			title:'success', 
			description: 'Blogs_success',
			color: 'success',
			close: {
				color: 'primary',
				variant: 'outline',
				class: 'rounded-full'
			}})
    }
  }

  async function formSubmit() {
    postBlogs()
  }

  // SSR
  const { data: resp } = useApiFetch<TagResp>('/tags')
  tagItems.value = (resp.value?.data ?? []).map(e => ({ label: e.label, uuid: e.uuid }))
  return { createTags, getTags, formSubmit, tagItems, addTagValue,form }
}
