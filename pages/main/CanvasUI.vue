<script setup lang="ts">
import MainThreeCanvas from '~/components/common/MainThreeCanvas.client.vue'
import { useHook } from './useHook'
const { tagInfo, tagReady, tagPending, canvasKey } = useHook()
</script>

<template>
  <LayoutsPage>
    <!-- 等 tags 準備好才渲染 3D；否則顯示 loading -->
    <div v-if="tagReady">
      <ClientOnly>
        <MainThreeCanvas :key="canvasKey" :data="tagInfo" />
      </ClientOnly>
    </div>
    <div v-else>
      <p v-if="tagPending">載入 3D 資料中…</p>
    </div>
  </LayoutsPage>
</template>
