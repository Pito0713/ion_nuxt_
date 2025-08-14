<template>
  <LayoutsPage>
    <div class="tiptap p-4">
      <div v-html="content" />
    </div>
  </LayoutsPage>

</template>

<script setup>
import { ref } from 'vue'
const content = ref('<p>Im running Tiptap with Vue.js. 🎉</p>')

const { data } = await useApiFetch('/blogs')
if (data.value) {
  content.value = data.value.data[1].text
}

</script>