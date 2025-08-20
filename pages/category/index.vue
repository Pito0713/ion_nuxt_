<template>
  <LayoutsPage>
    <UForm :state="form" :schema="schema" @submit="createPost">
      <UFormField label="狀態" name="status">
        <UInputMenu v-model="form.status" :items="items" />
        <UIModal v-model="showModal" title="新增tag" open-title=" Modal">
          <template #default>
            <UButton label='新增tag' color="neutral" variant="subtle" />
          </template>
          <template #body>
            <UInput v-model="addTag" />
          </template>
          <template #footer>
            <UButton color="primary" @click="handleConfirm">確認</UButton>
          </template>
        </UIModal>
      </UFormField>
      <UFormField label="標題" name="title">
        <UInput v-model="form.title" />
      </UFormField>
      <client-only>
        <TiptapEditor v-model="content" />
      </client-only>
      <UButton type="submit" color="neutral" variant="outline">送出</UButton>
    </UForm>
  </LayoutsPage>
</template>

<script setup>
import { ref } from 'vue'
import TiptapEditor from '~/components/common/TiptapEditor.vue'
import { z } from 'zod'
import UIModal from '~/components/common/UIModal.vue'

const showModal = ref(false)
const addTag = ref('AOi')

function handleConfirm() {
  console.log('確認操作')
  showModal.value = false
}

// 表單初始值
const form = ref({
  status: { label: 'Todo' },
  title: ''
})

// 下拉選單選項
const items = ref([
  { label: 'Backlog' },
  { label: 'Todo' },
  { label: 'In Progress' },
  { label: 'Done' }
])

// 驗證規則
const schema = z.object({
  status: z.object({
    label: z.string().nonempty('請選擇狀態')
  }),
  title: z.string().nonempty('標題必填')
})

const content = ref('<p>Im running Tiptap with Vue.js. 🎉</p>')

async function createPost() {
  try {
    const created = await useApiFetch('/blogs', {
      method: 'POST',
      body: {}
    })
    console.log('created', created)
  } catch (err) {
    console.error(err, '發生錯誤，請稍後再試。')
  } finally {
    console.log('OK')
  }
}
</script>
