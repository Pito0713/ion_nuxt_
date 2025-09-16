<script setup lang="ts">
import Modal from './Modal.vue';
import { useHook } from './useHook'
const { tagInfo } = useHook()
</script>

<template>
  <div class="mt-10">
    <ul>
      <li v-for="tag in tagInfo" :key="tag.uuid" class="py-6">
        <UCard>
          <template #header>
            <a>
              {{ tag.label }}
            </a>
          </template>
          <div class="w-full flex flex-col md:flex-row gap-4">
            <Modal :tag-info="tag" />
          </div>
        </UCard>
      </li>
    </ul>
  </div>
</template>
