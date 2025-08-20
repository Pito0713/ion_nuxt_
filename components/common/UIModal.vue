<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  openTitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'test',
  openTitle: '打開 Modal'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const isOpen = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  isOpen.value = val
})

watch(isOpen, (val) => {
  emit('update:modelValue', val)
})

// 取得 slots
const slots = useSlots()
const hasDefaultSlot = !!slots.default
</script>

<template>
  <UModal v-model:open="isOpen" :title=props.title :ui="{ footer: 'justify-end' }">
    <template #default>
      <slot v-if="hasDefaultSlot" name="default" />
      <UButton v-else :label="props.openTitle" color="neutral" variant="subtle" @click="isOpen = true" />
    </template>
    <template #body>
      <slot name="body" />
    </template>
    <template #footer>
      <slot name="footer" />
    </template>
  </UModal>
</template>