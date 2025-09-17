<script setup lang="ts">
import UIModal from '~/components/common/UIModal.vue'
import { useAddTagHook } from './useAddTagHook'
const {
  coverInputRef,
  showUrl,
  hasPicked,
  showModal,
  pending,
  state,
  openPicker,
  onPick,
  resetCover,
  submit,
} = useAddTagHook()
</script>

<template>
  <UIModal v-model="showModal" title="新增 Tag" open-title="Modal">
    <template #default>
      <UButton label="新增" color="neutral" variant="subtle" />
    </template>
    <template #body>
      <UForm :state="state" class="space-y-6" @submit.prevent="submit">
        <a class="text-base font-semibold mb-6">名稱</a>
        <UFormField name="label" :help="'名稱（必填）'" class="mt-2">
          <UInput v-model="state.label" placeholder="請輸入名稱" />
        </UFormField>
        <div class="space-y-3">
          <h3 class="text-base font-semibold">封面圖片</h3>
          <div class="flex items-start gap-4">
            <div class="w-40 h-40 rounded-xl border bg-muted/20 overflow-hidden flex items-center justify-center">
              <template v-if="showUrl">
                <img :src="showUrl" alt="cover" class="h-full w-full object-cover" />
              </template>
              <template v-else>
                <span class="text-xs text-muted-foreground">尚未選擇</span>
              </template>
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex gap-2">
                <label>
                  <UButton variant="solid" icon="i-lucide-image" @click.prevent="openPicker">選擇圖片</UButton>
                </label>
                <UButton variant="ghost" :disabled="!hasPicked" @click="resetCover">清除</UButton>
              </div>
              <p class="text-xs text-muted-foreground">支援 JPG / PNG / WebP / AVIF，最大 10MB。</p>
              <input ref="coverInputRef" type="file" accept="image/*" class="hidden" @change="onPick" />
            </div>
          </div>
        </div>
        <div class="flex items-center justify-end gap-3">
          <UButton type="submit" :loading="pending">儲存變更</UButton>
        </div>
      </UForm>
    </template>
  </UIModal>
</template>
