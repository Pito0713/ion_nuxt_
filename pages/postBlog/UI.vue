<script setup lang="ts">
import { ref } from 'vue'
import TiptapEditor from '~/components/common/TiptapEditor.vue'
import UIModal from '~/components/common/UIModal.vue'
import type { InputMenuItem } from '@nuxt/ui'
import { z } from 'zod'

const emit = defineEmits<{
  (e: 'create-tags' | 'form-submit'): void
  (e: 'update:addTagValue', value: string): void
  (e: 'update:form', value: { title: string, content: string, tag: InputMenuItem }): void
}>()

const props = defineProps<{
  tagItems: InputMenuItem[],
  addTagValue: string
  form: {
    tag: string,
    title: string,
    content: string
  }
}>()

const showModal = ref(false)
const schema = z.object({
  tag: z.string().nonempty('請選擇狀態'),
  title: z.string().nonempty('標題必填'),
})

const create_tags = () => {
  emit('create-tags')
  showModal.value = false
}
</script>

<template>
  <LayoutsPage>
    <UIModal v-model="showModal" title="新增tag" open-title=" Modal">
      <template #default>
        <UButton label="新增tag" color="neutral" variant="subtle" />
      </template>
      <template #body>
        <UInput :model-value="props.addTagValue" @update:model-value="(_value: string) => emit('update:addTagValue', _value)" />
      </template>
      <template #footer>
        <UButton type="button" color="primary" @click="create_tags">確認</UButton>
      </template>
    </UIModal>
    <UForm :state="props.form" :schema="schema" @submit="emit('form-submit')">
      <UFormField label="狀態" name="tag">
        <UInputMenu
          :model-value="props.form.tag" :items="props.tagItems" value-key="uuid"
          @update:model-value="(_value: object)  => emit('update:form', { ...props.form, tag: _value})" />
      </UFormField>
      <UFormField label="標題" name="title">
        <UInput 
          :model-value="props.form.title"
          @update:model-value="(_value: string) => emit('update:form', { ...props.form, title: _value })" 
        />
      </UFormField>
      <UFormField label="內容" name="content">
        <client-only>
          <TiptapEditor 
            :model-value="props.form.content"
            @update:model-value="(_value: string) => emit('update:form', { ...props.form, content: _value })" />
        </client-only>
      </UFormField>
      <UButton type="submit" color="neutral" variant="outline">送出</UButton>
    </UForm>
  </LayoutsPage>
</template>
