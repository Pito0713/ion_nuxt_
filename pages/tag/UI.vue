<script setup lang="ts">
import { useHook } from './useHook'
const { tagInfo } = useHook()
</script>

<template>
  <div>
    <UAccordion :items="tagInfo">
      <template #content="{ item }">
        <ul>
          <li v-for="blog in item.blogs" :key="blog.id" class="py-2">
            <NuxtLink :to="`/single/${blog.id}`">
              {{ blog.title }}
            </NuxtLink>
          </li>
        </ul>
      </template>
    </UAccordion>
  </div>
</template>
