<script setup lang="ts">
import { useHook } from './useHook'
const { page, pageSize, blogTotalCount, blogInfo, formatDate } = useHook()
</script>

<template>
  <div>
    <ul>
      <li v-for="blog in blogInfo" :key="blog.id" class="py-6">
        <UCard>
          <template #header>
            <div class="flex items-end justify-between">
              <a class="text-2xl">
                {{ blog.title }}
              </a>
              <NuxtLink :to="`/single/${blog.id}`">
                閱讀更多
              </NuxtLink>
            </div>
          </template>
          <div class="w-full flex flex-col md:flex-row gap-4">
            <div class="md:flex-1 flex flex-col items-start justify-between">
              <div class="prose max-w-none">{{ blog.previewText }} </div>
              <div class="w-full flex items-center justify-start mt-3">
                <template v-if="blog.tag">
                  <a>分類於{{ blog.tag.label }}</a>
                  <img :src="blog.tag.imgURL" alt="tag image" class="w-6 h-6" />
                </template>
                <a>建立於: {{ formatDate(blog.createTime) }}</a>
              </div>
            </div>
          </div>
        </UCard>
      </li>
    </ul>
    <template v-if="blogTotalCount > 0">
      <div class="mt-4 flex items-center justify-end">
        <UPagination v-model:page="page" :total="blogTotalCount" :page-count="pageSize" color="primary" />
      </div>
    </template>
  </div>
</template>
