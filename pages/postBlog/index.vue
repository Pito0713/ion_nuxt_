<script setup lang="ts">
import UI from './UI.vue'
import { useHook } from './useHook'
definePageMeta({ middleware: ['auth'] })
const { formSubmit, tagItems, form } = useHook()
</script>

<template>
  <LayoutsPage>
    <UI v-model:form="form" :tag-items="tagItems" @form-submit="formSubmit" />
  </LayoutsPage>
</template>
