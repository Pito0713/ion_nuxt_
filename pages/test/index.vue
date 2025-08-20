<template>
  <LayoutsPage>
    <UButton label='open' color="neutral" variant="subtle" @click="createPost" />
  </LayoutsPage>

</template>

<script setup>
async function createPost() {
  try {
    const created = await useApiFetch('/blogs', {
      method: 'POST',
      body: {
        text: 'asd'
      },
    })
    console.log('created', created)

  } catch (err) {
    console.log(err, '發生錯誤，請稍後再試。')
  } finally {
    console.log('OK')
  }
}

</script>