<script setup lang="ts">
import { useHook } from './useHook'
const { page, pageSize, blogTotalCount, blogInfo, fmt } = useHook()
</script>

<template>
  <div>
    <ul>
      <li v-for="blog in blogInfo" :key="blog.id" class="py-6">
        <UCard>
          <template #header>
            <NuxtLink :to="`/single/${blog.id}`" class="text-2xl">
              {{ blog.title }}
            </NuxtLink>
          </template>
          <div class="w-full flex flex-col md:flex-row gap-4">
            <div class="md:flex-1 flex flex-col items-start justify-between">
              <div class="prose max-w-none">{{ blog.previewText  }} </div>
              <div class="w-full flex items-center justify-between mt-3">
                <time :datetime="blog.createTime">{{ fmt.format(new Date(blog.createTime)) }}</time>
              </div>
            </div>
          </div>
        </UCard>
      </li>
    </ul>
    <div class="mt-4 flex items-center justify-end">
      <UPagination v-model:page="page" :total="blogTotalCount" :page-count="pageSize" color="primary" />
    </div>
  </div>
</template>
