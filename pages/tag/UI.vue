<script setup lang="ts">
import { useHook } from './useHook'
const { tagInfo } = useHook()

console.log(tagInfo)
</script>

<template>
  <div>
    <ul>
      <li v-for="blog in tagInfo" :key="blog.uuid" class="py-6">
        <UCard>
          <div class="w-full flex flex-col md:flex-row gap-4">
            <a>{{ blog.label }} </a>
          </div>
        </UCard>
      </li>
    </ul>
  </div>
</template>
