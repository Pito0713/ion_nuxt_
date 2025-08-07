<template>
  <div class='fixed z-40 w-dvw backdrop-blur-md'>
    <div class=" flex justify-center items-center flex-col">
      <NavigationMenu />
      <div class='flex justify-center items-center flex-col w-svw'>
        <div class=' w-dvw'>
          <main class='relative '>
            <NuxtPage />
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavigationMenu from './NavigationMenu.vue';
</script>