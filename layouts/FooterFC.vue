<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <!-- Footer -->
  <footer class="fixed bottom-0 inset-x-0">
    <UContainer class="">
      <!-- 上半：多欄資訊 -->
      <div>
        <div class="flex justify-center items-center ">
          <div class="flex gap-2">
            <UButton variant="ghost" color="neutral" icon="i-simple-icons-github" to="https://github.com/Pito0713"
              target="_blank" :padded="false" aria-label="GitHub" />
            <UButton variant="ghost" color="neutral" icon="vscode-icons:file-type-nuxt" to="https://nuxt.com/"
              target="_blank" :padded="false" aria-label="nuxt" />
            <UButton variant="ghost" color="neutral" icon="devicon:tailwindcss" to="https://tailwindcss.com/"
              target="_blank" :padded="false" aria-label="tailwindcss" />
          </div>
        </div>
      </div>
      <div class="flex justify-center items-center ">
        <p class="text-xs text-gray-600 dark:text-gray-400">
          © {{ year }} ion_Nuxt. All rights reserved.
        </p>
      </div>
    </UContainer>
  </footer>
</template>
