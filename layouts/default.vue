<template>
  <div class="h-svh w-dvw">
    <NavigationMenu />
    <main class='relative'>
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import NavigationMenu from './NavigationMenu.vue';
import Footer from './FooterFC.vue';
</script>