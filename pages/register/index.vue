<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-xl font-semibold">建立帳號</h1>
      </template>


      <UForm :state="form" @submit="createPost">
        <UFormField label="暱稱">
          <UInput v-model="form.account" placeholder="Your name" />
        </UFormField>
        <UFormField label="密碼" class="mt-3">
          <UInput v-model="form.password" type="password" placeholder="••••••••" />
        </UFormField>


        <UButton type="submit" class="mt-4" :loading="loading" block>註冊</UButton>
      </UForm>


      <template #footer>
        <p class="text-sm">已經有帳號？ <ULink to="/login">前往登入</ULink>
        </p>
      </template>
    </UCard>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'

const form = ref({ account: '', password: '' })
const loading = ref(false)



async function createPost() {
  try {
    const payload = {
      account: form.value.account,
      password: form.value.password,
    }
    const created = await $fetch('http://localhost:8082/users', {
      method: 'POST',
      body: payload
    })
    console.log('created', created)
  } catch (err) {
    console.error(err, '發生錯誤，請稍後再試。')
  } finally {
    console.log('OK')
  }
}
</script>