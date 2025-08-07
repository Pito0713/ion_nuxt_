<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import ColorModeButton from '../components/mode/ColorModeButton.vue'

interface ApiResponse {
  data?: {
    category?: []
  }
}

const { data } = await useApiFetch<ApiResponse>('/users/3b1a0a83-d329-42af-8270-5168c7594237')

console.log(data?.value?.data?.category)
const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'main',
      icon: 'i-lucide-book-open',
      to: '/main',
      class: 'justify-center items-center px-4',
    },
    {
      label: 'single',
      icon: 'i-lucide-database',
      to: '/single',
      class: 'justify-center items-center px-4',
    },
    {
      label: 'category',
      icon: 'i-lucide-database',
      to: '/category',
      class: 'justify-center items-center px-4',
    },
    {
      label: 'GitHub',
      icon: 'i-simple-icons-github',
      to: 'https://github.com/Pito0713',
      class: 'justify-center items-center px-4',
      target: '_blank'
    },
    {
      slot: 'components' as const
    }
  ],
  []
])

</script>

<template>
  <UNavigationMenu color="primary" :items="items" class="w-1/2 px-4 justify-center items-center">
    <template #components-trailing>
      <ColorModeButton />
    </template>
  </UNavigationMenu>
</template>
