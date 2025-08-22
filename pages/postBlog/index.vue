<script setup lang="ts">
import UI from './UI.vue'
import { useHook } from './useHook'

const { createTags, formSubmit, tagItems, addTagValue, form } = useHook()
</script>

<template>
  <LayoutsPage>
    <UI v-model:add-tag-value="addTagValue" v-model:form="form" :tag-items="tagItems" @create-tags="createTags"
      @form-submit="formSubmit" />
  </LayoutsPage>
</template>
