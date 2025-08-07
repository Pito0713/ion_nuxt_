<template>
  <LayoutsPage>
    <div class="overflow-auto text-3xl h-60 font-bold border-2">
      <a>
        {{ data.data.uuid }}
      </a>
      <a>
        {{ data.data.uuid }}
      </a>
    </div>
  </LayoutsPage>
</template>

<script setup>
const { data } = await useApiFetch('/users/3b1a0a83-d329-42af-8270-5168c7594237')
</script>