<script setup lang="ts">
import { useHook } from './useHook'
const { blogInfo } = useHook()
</script>

<template>
  <div v-if="blogInfo">
    <div v-html="blogInfo.textContent" />
  </div>
</template>
