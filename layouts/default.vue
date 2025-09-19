<template>
  <div class="min-h-svh  md:max-w-[876px] lg:max-w-[1024px] mx-auto flex">
    <main class='relative md:flex'>
      <NavigationMenu />
      <NuxtPage class="md:ml-64" />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import NavigationMenu from './NavigationMenu.vue';
import Footer from './FooterFC.vue';
</script>