<script setup lang="ts">
import TiptapEditor from '~/components/common/TiptapEditor.vue'
import type { InputMenuItem } from '@nuxt/ui'
import { useHook } from './useHook'
import AddTagModal from './AddTagModal.vue'
import { z } from 'zod'
// ----------------------------------------------------
// props
// ----------------------------------------------------
const props = defineProps<{
  tagItems: InputMenuItem[],
  form: {
    tag: string,
    title: string,
    content: string
  }
}>()

// ----------------------------------------------------
// emit
// ----------------------------------------------------
const emit = defineEmits<{
  (e: 'create-tags' | 'form-submit'): void
  (e: 'update:form', value: { title: string, content: string, tag: InputMenuItem }): void
}>()

// ----------------------------------------------------
// config
// ----------------------------------------------------
const schema = z.object({
  tag: z.string().nonempty('請選擇狀態'),
  title: z.string().nonempty('標題必填'),
})

// ----------------------------------------------------
// Hook
// ----------------------------------------------------
const { addTagValue, createTags, } = useHook()
</script>

<template>
  <LayoutsPage>
    <AddTagModal v-model:add-tag-value="addTagValue" @create-tags="createTags" />
    <UForm :state="props.form" :schema="schema" @submit="emit('form-submit')">
      <UFormField label="狀態" name="tag">
        <UInputMenu :model-value="props.form.tag" :items="props.tagItems" value-key="uuid"
          @update:model-value="(_value: object) => emit('update:form', { ...props.form, tag: _value })" />
      </UFormField>
      <UFormField label="標題" name="title">
        <UInput :model-value="props.form.title"
          @update:model-value="(_value: string) => emit('update:form', { ...props.form, title: _value })" />
      </UFormField>
      <UFormField label="內容" name="content">
        <client-only>
          <TiptapEditor :model-value="props.form.content"
            @update:model-value="(_value: string) => emit('update:form', { ...props.form, content: _value })" />
        </client-only>
      </UFormField>
      <UButton type="submit" color="neutral" variant="outline">送出</UButton>
    </UForm>
  </LayoutsPage>
</template>
