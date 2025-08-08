<template>
  <LayoutsPage>
    <a class="text-3xl font-bold underline">
      single page
    </a>
    <UIModal v-model="showModal" title="確認刪除" open-title=" Modal">
      <template #default>
        <UButton label='open' color="neutral" variant="subtle" />
      </template>
      <template #body>
        <p>你確定要刪除這筆資料嗎？此操作無法復原。</p>
      </template>
      <template #footer>
        <UButton color="primary" @click="handleConfirm">確認</UButton>
      </template>
    </UIModal>
  </LayoutsPage>

</template>

<script setup>
import { ref } from 'vue'
import UIModal from '~/components/common/UIModal.vue'

const showModal = ref(false)

function handleConfirm() {
  console.log('確認操作')
  showModal.value = false
}
</script>