<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'

const file = ref<File | null>(null)
const pending = ref(false)
const Schema = z.object({
  file: z
    .custom<File>()
    .refine(f => !f || f.size <= 10 * 1024 * 1024, '檔案上限 10MB')
    .refine(f => !f || /^image\//.test(f.type), '僅支援圖片')
})

function onPick(e: Event) {
  const t = e.target as HTMLInputElement
  file.value = t.files?.[0] ?? null
}

async function submit() {
  const parse = Schema.safeParse({ file: file.value ?? undefined })
  if (!parse.success) return console.log(parse.error.format())

  pending.value = true
  try {
    if (file.value) {
      await useImageKitUpload(file.value)
    }

  } catch (err: unknown) {
    console.error(err)
    alert('建立失敗')
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <UForm @submit.prevent="submit" :state="{}">
    <input type="file" accept="image/*" @change="onPick" />
    <UButton type="submit" :loading="pending">新增</UButton>
  </UForm>
</template>
