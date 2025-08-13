<template>
  <div class="h-svh w-dvw">
      
      <main class='relative md:flex'>
        <NavigationMenu />
        <NuxtPage class="md:ml-64"/>
      </main>
    <Footer />
  </div>
</template>

<script setup>
import NavigationMenu from './NavigationMenu.vue';
import Footer from './FooterFC.vue';
</script>