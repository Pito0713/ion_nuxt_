<script setup lang="ts">
import MainThreeCanvas from '~/components/common/MainThreeCanvas.client.vue'
import { useHook } from './useHook'

const { page, pageSize, blogTotalCount, blogInfo, tagInfo, tagReady, tagPending } = useHook()

// 讓 3D 元件在資料更新時重掛載（避免拿到空資料就初始化）：
const canvasKey = computed(() => `tags-${tagInfo.value.length}`)
const fmt = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
</script>

<template>
  <LayoutsPage>
    <!-- 等 tags 準備好才渲染 3D；否則顯示 loading -->
    <div v-if="tagReady">
      <ClientOnly>
        <MainThreeCanvas :key="canvasKey" :data="tagInfo" />
        <template #fallback>
          <p>載入 3D 場景中…</p>
        </template>
      </ClientOnly>
    </div>
    <div v-else>
      <p v-if="tagPending">載入 3D 資料中…</p>
      <p v-else>暫無標籤資料</p>
    </div>

    <ul class="">
      <li v-for="post in blogInfo" :key="post.id" class="py-6">
        <UCard class="">
          <template #header>
            <NuxtLink :to="`/`"
              class="text-2xl md:text-3xl font-extrabold leading-tight text-neutral-900 hover:underline">
              {{ post.title }}
            </NuxtLink>
          </template>
          <div class="w-full flex flex-col md:flex-row gap-4">
            <div class="md:flex-1 flex flex-col items-start justify-between">
              <div class="prose max-w-none" v-html="post.textContent" />
              <div class="w-full flex items-center justify-between mt-3">
              </div>
            </div>
          </div>
        </UCard>
      </li>
    </ul>
    <div class="mt-4 flex items-center justify-between">
      <div />
      <UPagination v-model:page="page" :total="blogTotalCount" :page-count="pageSize" color="primary" />
    </div>
  </LayoutsPage>
</template>
