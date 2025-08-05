<template>
    <div>    
        <a class="text-3xl font-bold underline">
    {{ data.data.uuid }}
        </a>
          <select v-model="$colorMode.preference">
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="sepia">Sepia</option>
    </select>
<NuxtLink to="/single">single page</NuxtLink>
    </div>
    
    

</template>

<script setup>
// 取得 runtimeConfig
const colorMode = useColorMode()
console.log(colorMode.preference)
const { data } = await useApiFetch('/users/3b1a0a83-d329-42af-8270-5168c7594237')
</script>