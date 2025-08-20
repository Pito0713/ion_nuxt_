<template>
  <LayoutsPage>
    <client-only>
      <TiptapEditor v-model="content" />
    </client-only>
    <div class="tiptap">
      <div v-html="content"></div>
      <div>{{ content }}</div>
    </div>
  </LayoutsPage>

</template>

<script setup>
import { ref } from 'vue'
import TiptapEditor from '~/components/common/TiptapEditor.vue';
const content = ref('<p>Im running Tiptap with Vue3333.js. 🎉</p>')

</script>