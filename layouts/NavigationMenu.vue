<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from '#imports'
import type { NavigationMenuItem } from '@nuxt/ui'
import ColorModeButton from '../components/common/ColorModeButton.vue'
import UIModal from '~/components/common/UIModal.vue'
import LogIn from '~/components/extra/LogIn.vue'
import Register from '~/components/extra/UserRegister.vue'
const { authed } = await useAuth()
const menuItems = computed<NavigationMenuItem[][]>(() => [[
  { label: 'main', icon: 'i-lucide-book-open', to: '/main?page=1&pageSize=10', class: 'justify-center items-center p-3' },
  { label: 'tag', icon: 'i-lucide-tag', to: '/tag', class: 'justify-center items-center p-3' },
  ...(authed.value ? [
    { label: 'postBlog', icon: 'i-lucide-database', to: '/postBlog', class: 'justify-center items-center p-3' },
    { label: 'editTag', icon: 'i-lucide-database', to: '/editTag', class: 'justify-center items-center p-3' }
  ] : []),
  { slot: 'components' as const },
]])

const isOpen = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => { isOpen.value = false })
watch(isOpen, (open) => {
  if (import.meta.client) document.documentElement.style.overflow = open ? 'hidden' : ''
})
// 不顯示 login ；長按 Logo 1.5 秒
const showLogin = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null
const startPress = () => { timer = setTimeout(() => (showLogin.value = true), 1500) }
const endPress = () => { if (timer) clearTimeout(timer); timer = null }
const showLogInModal = ref(false)
const showRegisterModal = ref(false)
const onShowLogInModal = () => {
  showLogInModal.value = false
}
const onShowRegisterModal = () => {
  showRegisterModal.value = false
}
</script>
<template>
  <div>
    <div>
      <!-- 桌面版導覽 -->
      <aside class="hidden md:flex fixed left-0 top-0 h-screen w-64 z-40 overflow-y-auto">
        <div class="flex flex-col w-full p-4 gap-4 overflow-y-auto">
          <a class="text-2xl font-bold">BLOG</a>
          <div class="w-full flex items-center justify-center flex-col gap-2">
            <div @mousedown="startPress" @mouseup="endPress" @mouseleave="endPress" @touchstart="startPress"
              @touchend="endPress">
              <div class="w-40 h-40 rounded-full border-2 overflow-hidden">
                <img src="/public/favicon.ico" alt="Logo" class="w-full h-full object-cover" />
              </div>
            </div>
            <a class="text-2xl font-bold">ion筆記</a>
            <div>
              <UIModal v-if="showLogin" v-model="showLogInModal" title="登入" open-title=" Modal">
                <template #default>
                  <UButton label="登入" color="neutral" variant="subtle" />
                </template>
                <template #body>
                  <LogIn @showOff-Modal="onShowLogInModal" />
                </template>
              </UIModal>
              <UIModal v-if="showLogin" v-model="showRegisterModal" title="註冊" open-title=" Modal">
                <template #default>
                  <UButton label="註冊" color="neutral" variant="subtle" class="ml-1" />
                </template>
                <template #body>
                  <Register @showOff-Modal="onShowRegisterModal" />
                </template>
              </UIModal>
            </div>
          </div>

          <!-- 垂直導航 -->
          <UNavigationMenu orientation="vertical" color="primary" highlight :items="menuItems" class="flex-1">
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
          <UNavigationMenu orientation="vertical" color="primary" :items="menuItems" highlight />
        </div>
      </div>
    </Transition>
  </div>
</template>