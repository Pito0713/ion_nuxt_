<script setup lang="ts">
import UI from './UI.vue'
import { useHook } from './useHook'

const { createPost, items, addTagValue } = useHook()
</script>

<template>
  <LayoutsPage>
    <!-- 注意這裡 -->
    <UI :items="items" :add-tag-value="addTagValue" @create_post="createPost" />
  </LayoutsPage>
</template>
