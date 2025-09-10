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
    <UForm class="md:mt-4" :state="props.form" :schema="schema" @submit="emit('form-submit')" >
      <div class="md:flex items-start justify-between">
        <div class="md:flex mb-3">
          <UFormField label="標題" name="title" class="mr-3">
            <UInput 
              :model-value="props.form.title"
              @update:model-value="(_value: string) => emit('update:form', { ...props.form, title: _value })" />
          </UFormField>
          <UFormField label="狀態" name="tag" class="mt-3 md:mt-0">
            <UInputMenu
              size="xl"
              class="mr-3"
              :model-value="props.form.tag" 
              :items="props.tagItems" 
              value-key="uuid"
              @update:model-value="(_value: object) => emit('update:form', { ...props.form, tag: _value })" 
            />
            <AddTagModal class="mt-3 md:mt-0" v-model:add-tag-value="addTagValue" @create-tags="createTags" />
          </UFormField>
        </div>
        <UButton class="mb-2 md:mt-6 w-20" type="submit" color="neutral" >送出</UButton>
      </div>
      <UFormField name="content">
        <client-only>
          <TiptapEditor 
            :model-value="props.form.content"
            @update:model-value="(_value: string) => emit('update:form', { ...props.form, content: _value })" />
        </client-only>
      </UFormField>
    </UForm>
</template>
