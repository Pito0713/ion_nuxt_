<script setup lang="ts">
import UIModal from '~/components/common/UIModal.vue'
// ----------------------------------------------------
// props
// ----------------------------------------------------
const props = defineProps<{
  addTagValue: string
}>()
// ----------------------------------------------------
// emit
// ----------------------------------------------------
const emit = defineEmits<{
  (e: 'create-tags'): void
  (e: 'update:addTagValue', value: string): void // Modal add
}>()

const showModal = ref(false)
const create_tags = () => {
  emit('create-tags')
  showModal.value = false
}
</script>

<template>
  <UIModal v-model="showModal" title="新增tag" open-title=" Modal">
    <template #default>
      <UButton label="新增tag" color="neutral" variant="subtle" />
    </template>
    <template #body>
      <UInput 
        :model-value="props.addTagValue"
        @update:model-value="(_value: string) => emit('update:addTagValue', _value)" 
      />
    </template>
    <template #footer>
      <UButton type="button" color="primary" @click="create_tags">確認</UButton>
    </template>
  </UIModal>
</template>
