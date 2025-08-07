<template>
  <div>
    <a class="text-3xl font-bold underline">
      category page
    </a>
    <client-only>
      <TiptapEditor v-model="content" />
    </client-only>
    <div class="tiptap">
      <label>Content</label>
      <div v-html="content"></div>
      <div>{{ content }}</div>
    </div>
  </div>

</template>

<script setup>
import { ref } from 'vue'
import TiptapEditor from '~/components/mode/TiptapEditor.vue';
const content = ref('<p>Im running Tiptap with Vue3333.js. 🎉</p>')

</script>