<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from '#imports'
import type { NavigationMenuItem } from '@nuxt/ui'
import ColorModeButton from '../components/common/ColorModeButton.vue'
const items = ref([
  [
    { label: 'main', icon: 'i-lucide-book-open', to: '/main', class: 'justify-center items-center p-3' },
    { label: 'single', icon: 'i-lucide-database', to: '/single', class: 'justify-center items-center p-3' },
    { label: 'category', icon: 'i-lucide-database', to: '/category', class: 'justify-center items-center p-3' },
    { slot: 'components' as const }
  ]
] satisfies NavigationMenuItem[][])

const isOpen = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => { isOpen.value = false })
watch(isOpen, (open) => {
  if (import.meta.client) document.documentElement.style.overflow = open ? 'hidden' : ''
})
</script>
<template>
  <header>
    <div>
      <!-- 桌面版導覽 -->
      <div class="hidden md:block">
        <UNavigationMenu color="primary" highlight :items="items" class="felx justify-center items-center">
          <template #components-trailing>
            <UButton variant="ghost" color="neutral" icon="i-simple-icons-github" to="https://github.com/Pito0713"
              target="_blank" :padded="false" aria-label="GitHub" />
            <ColorModeButton />
          </template>
        </UNavigationMenu>
      </div>

      <!-- 行動版 -->
      <div class="flex justify-between items-center md:hidden w-svw p-3">
        <UButton color="primary" variant="ghost" aria-label="Open menu" icon='i-lucide-menu'
          @click="isOpen = !isOpen" />
        <div>

          <UButton variant="ghost" color="neutral" icon="i-simple-icons-github" to="https://github.com/Pito0713"
            target="_blank" :padded="false" aria-label="GitHub" />
          <ColorModeButton />
        </div>

      </div>
    </div>

    <!-- 行動版下拉面板 -->
    <Transition enter-active-class="transition-transform duration-300 ease-out" enter-from-class="-translate-y-full"
      enter-to-class="translate-y-0" leave-active-class="transition-transform duration-250 ease-in"
      leave-from-class="translate-y-0" leave-to-class="-translate-y-full">
      <div v-if="isOpen" class="md:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 shadow-lg">
        <UButton variant="ghost" color="neutral" icon="i-lucide-x" aria-label="Close menu" @click="isOpen = false" />
        <div class="">
          <UNavigationMenu orientation="vertical" color="primary" :items="items" highlight />
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped></style>
