export function useHook() {
  const addTagValue = ref('AOi')
  const items = ref([{ label: 'Backlog' }, { label: 'Todo' }, { label: 'In Progress' }, { label: 'Done' }])
  async function createPost() {
    const res = await useApiAsync(
      '/tags', 
      { method: 'POST', body: { label: addTagValue.value } }
    )
    console.log('API response:', res)
  }
  type Tag = { id: string; uuid: string; label: string }
  type TagResp = { data: Tag[]; status: number }
  const { data: resp } = useApiFetch<TagResp>('/tags')
  items.value = (resp.value?.data ?? []).map(t => ({ label: t.label }))
  return { createPost, items, addTagValue }
}
