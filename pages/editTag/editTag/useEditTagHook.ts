
import { useImageKitUpload } from '~/composables/useImageKitUpload'
export function useEditTagHook(props: { tagInfo: { uuid: string
  label: string
  tagCount: number
  imgURL?: string | null
  imgFileId?: string | null } } ) {
  const toast = useToast()
  const coverInputRef = ref<HTMLInputElement | null>(null)
  const pickedFile = ref<File | null>(null)
  const previewUrl = ref<string | null>(null)
  const originalUrl = ref<string>(props.tagInfo.imgURL ?? '')
  const MAX = 10 * 1024 * 1024 // 10MB
  const showUrl = computed(() => previewUrl.value || originalUrl.value || '')
  const hasPicked = computed(() => !!pickedFile.value)

  function openPicker() {
    coverInputRef.value?.click()
  }
  function onPick(e: Event) {
    const target = e.target as HTMLInputElement
    const files = target.files?.[0] ?? null
    if (!files) return
    if (!/^image\//.test(files.type)) {
      alert('僅支援圖片格式（JPG/PNG/WebP/AVIF）')
      target.value = ''
      return
    }
    if (files.size > MAX) {
      alert('檔案上限 10MB')
      target.value = ''
      return
    }
    // 設定預覽
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    pickedFile.value = files
    previewUrl.value = URL.createObjectURL(files)
  }

  function resetCover() {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
    pickedFile.value = null
    if (coverInputRef.value) coverInputRef.value.value = ''
  }

  const showModal = ref(false)
  const pending = ref(false)
  // 表單狀態
  const state = reactive({
    label: props.tagInfo.label ?? ''
  })

  async function submit() {
    // 基本驗證
    if (!state.label.trim()) {
      alert('請輸入名稱')
      return
    }

    pending.value = true
    try {
      let nextUrl = originalUrl.value

      // 若使用者選了新圖，先直傳 ImageKit
      if (pickedFile.value) {
        const { url } = await useImageKitUpload(pickedFile.value, '/tags')
        nextUrl = url
      }
      const res:{status: number} = await useApiAsync(
        `/tags/${props.tagInfo.uuid}`, 
        { 
          method: 'POST',
          body: {
            label: state.label,
            imgURL: nextUrl
          }
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

      // 更新本地原始資料、清掉暫存檔，對父層發事件
      originalUrl.value = nextUrl
      resetCover()
      showModal.value = false
    } catch (err: unknown) {
      console.error(err)
      // alert(err?.message ?? '儲存失敗')
    } finally {
      pending.value = false
    }
  }

  onBeforeUnmount(() => {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  })

  return {
    coverInputRef,
    showModal,
    pending,
    state,

    showUrl,
    hasPicked,
    MAX,

    openPicker,
    onPick,
    resetCover,
    submit,
  }
}
