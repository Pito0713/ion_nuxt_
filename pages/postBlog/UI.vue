<script setup lang="ts">
import { ref } from 'vue'
import TiptapEditor from '~/components/common/TiptapEditor.vue'
import UIModal from '~/components/common/UIModal.vue'
import type { InputMenuItem } from '@nuxt/ui'
import { z } from 'zod'

const emit = defineEmits<{
  (e: 'create_post'): void
  (e: 'update:addTagValue', v: string): void
}>()


const props = defineProps<{
  items: InputMenuItem[],
  addTagValue: string
}>()

const showModal = ref(false)


const form = ref({ status: { label: 'Todo' }, title: '' })
const schema = z.object({
  status: z.object({ label: z.string().nonempty('請選擇狀態') }),
  title: z.string().nonempty('標題必填')
})
const content = ref('<p>Im running Tiptap with Vue.js. 🎉</p>')

</script>

<template>
  <LayoutsPage>
    <UIModal v-model="showModal" title="新增tag" open-title=" Modal">
      <template #default>
        <UButton label="新增tag" color="neutral" variant="subtle" />
      </template>

      <template #body>
        <UInput :model-value="props.addTagValue" @update:model-value="emit('update:addTagValue', $event)" />
      </template>

      <template #footer>
        <!-- 一定要加 type="button"，不然在 <form> 裡會變 submit -->
        <UButton type="button" color="primary" @click="emit('create_post')">確認</UButton>
      </template>
    </UIModal>
    <UForm :state="form" :schema="schema">
      <UFormField label="狀態" name="status">
        <UInputMenu v-model="form.status" :items="props.items" />

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
