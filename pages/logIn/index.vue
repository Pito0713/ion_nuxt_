<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-xl font-semibold">會員登入</h1>
      </template>


      <UForm :state="form" @submit="createPost">
        <UFormField label="Email">
          <UInput v-model="form.account" placeholder="you@example.com" />
        </UFormField>
        <UFormField label="密碼" class="mt-3">
          <UInput v-model="form.password" type="password" placeholder="••••••••" />
        </UFormField>


        <UButton type="submit" class="mt-4" :loading="loading" block>登入</UButton>
      </UForm>


      <template #footer>
        <p class="text-sm">還沒有帳號？ <ULink to="/register">建立一個</ULink>
        </p>
      </template>
    </UCard>
  </div>
</template>


<script setup>
import { ref } from 'vue'


const form = ref({ account: '', password: '' })
const loading = ref(false)


async function createPost() {
  try {
    const payload = {
      account: form.value.account,
      password: form.value.password,
    }
    const created = await $fetch('http://localhost:8082/users/login', {
      method: 'POST',
      body: payload
    })
    console.log('created', created.data)
    // 設定 userToken Cookie，存放 Token，有效期 7 天
    const userUuid = useCookie('userUUID', { maxAge: 60 * 60 * 24 * 7 });
    userUuid.value = created?.data?.uuid; // cookies 存入 token
  } catch (err) {
    console.error(err, '發生錯誤，請稍後再試。')
  } finally {
    console.log('OK')
  }
}
</script>