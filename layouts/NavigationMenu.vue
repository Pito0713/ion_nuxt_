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
    { label: 'test', icon: 'i-lucide-database', to: '/test', class: 'justify-center items-center p-3' },
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
  <div>
    <div>
      <!-- 桌面版導覽 -->
      <aside class="hidden md:flex fixed left-0 top-0 h-screen w-64 z-40 shrink-0
         border-r border-black/10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur
         overflow-y-auto">
        <div class="flex flex-col w-full p-4 gap-4 overflow-y-auto">
          <!-- 垂直導航 -->
          <UNavigationMenu orientation="vertical" color="primary" highlight :items="items" class="flex-1">
            <template #components-trailing>
              <div class="mt-2 flex items-center justify-between px-1">
                <UButton variant="ghost" color="neutral" icon="i-simple-icons-github" to="https://github.com/Pito0713"
                  target="_blank" :padded="false" aria-label="GitHub" />
                <ColorModeButton />
              </div>
            </template>
          </UNavigationMenu>

        </div>
      </aside>

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
  </div>
</template>

<style scoped></style>
