<template>
  <div class=" flex items-center justify-center">
    <UCard class="w-1/2">
      <UForm :state="form" @submit="logIn">
        <UFormField label="帳號">
          <UInput v-model="form.account" placeholder="Account" class="w-full" />
        </UFormField>
        <UFormField label="密碼" class="mt-3">
          <UInput v-model="form.password" type="password" class="w-full" placeholder="Password" />
        </UFormField>
        <UButton type="submit" class="mt-4 " :loading="loading" block>登入</UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const form = ref({ account: '', password: '' })
const loading = ref(false)
const emit = defineEmits<{ (e: 'showOff-Modal'): void }>()

async function logIn() {
  try {
    const payload = {
      account: form.value.account,
      password: form.value.password,
    }
    // 只有在本地端開發時，才會執行登入請求
    type Res = { status: number, data: { uuid: string } }
    const submit: Res = await $fetch('http://localhost:8082/users/login', {
      method: 'POST',
      body: payload
    })
    if (submit.status !== 1) throw new Error('登入失敗')
    emit('showOff-Modal')
    // 設定 userToken Cookie，存放 Token，有效期 7 天
    const userUUID = useCookie('userUUID', { maxAge: 60 * 60 * 24 * 7, path: '/', });
    userUUID.value = submit?.data?.uuid; // cookies 存入 token
    await navigateTo('/main', { replace: true })
  } catch (err) {
    console.error(err, '發生錯誤，請稍後再試。')
  } finally {
    console.log('OK')
  }
}
</script>