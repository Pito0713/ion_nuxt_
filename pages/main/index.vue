<template>
  <LayoutsPage>
    <!-- Nuxt 提供的 ClientOnly，避免 SSR 環境觸發 -->
    <ClientOnly>
      <MainThreeCanvas :data="data.data.category" />
      <template #fallback>
        <p>載入 3D 場景中…</p>
      </template>
    </ClientOnly>
  </LayoutsPage>
</template>

<script setup>
import MainThreeCanvas from '~/components/common/MainThreeCanvas.client.vue'
const { data } = await useApiFetch('/users/3b1a0a83-d329-42af-8270-5168c7594237')
</script>