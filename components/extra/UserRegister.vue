<template>
  <div class="flex items-center justify-center">
    <UCard class="w-1/2">
      <UForm :state="form" @submit="register">
        <UFormField label="帳號">
          <UInput v-model="form.account" placeholder="Account" class="w-full" />
        </UFormField>
        <UFormField label="密碼" class="mt-3">
          <UInput v-model="form.password" type="password" placeholder="Password" class="w-full" />
        </UFormField>
        <UButton type="submit" class="mt-4" :loading="loading" block>註冊</UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const form = ref({ account: '', password: '' })
const loading = ref(false)
const emit = defineEmits<{ (e: 'showOff-Modal'): void }>()

async function register() {
  try {
    const payload = {
      account: form.value.account,
      password: form.value.password,
    }
    // 只有在本地端開發時，才會執行註冊請求
    type Res = { status: number }
    const submit: Res = await $fetch('http://localhost:8082/users', {
      method: 'POST',
      body: payload
    })
    if (submit.status !== 1) throw new Error('註冊失敗')
    emit('showOff-Modal')
  } catch (err) {
    console.error(err, '發生錯誤，請稍後再試。')
  } finally {
    console.log('OK')
  }
}
</script>