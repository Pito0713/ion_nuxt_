<script setup lang="ts">
import UIModal from '~/components/common/UIModal.vue'
const props = defineProps<{
  tagInfo: {
    uuid: string
    label: string
    tagCount: number,
  }
}>()
const state = reactive({
  label: props.tagInfo.label,
})

const showModal = ref(false)
</script>

<template>
  <UIModal v-model="showModal" title="編輯 Tag" open-title=" Modal">
    <template #default>
      <UButton label="編輯" color="neutral" variant="subtle" />
    </template>
    <template #body>
      <div class="flex items-center justify-between">
        <p class="text-sm text-muted-foreground">ID: {{ props.tagInfo.uuid }} </p>
      </div>

      <!-- 表單 -->
      <UForm :state="state" class="space-y-6" @submit.prevent="">
        <UFormField label="名稱" name="label" :help="'顯示名稱（必填）'">
          <UInput v-model="state.label" placeholder="例如：前端、旅遊、攝影" />
        </UFormField>

        <!-- 封面 -->
        <div class="space-y-3">
          <h3 class="text-base font-semibold">封面圖片</h3>
          <div class="flex items-start gap-4">
            <div class="w-40 h-40 rounded-xl border bg-muted/20 overflow-hidden flex items-center justify-center">
              <img alt="cover" class="h-full w-full object-cover" />
              <span class="text-xs text-muted-foreground">尚未選擇</span>
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex gap-2">
                <UButton variant="solid">選擇圖片</UButton>
                <UButton variant="ghost">
                  還原
                </UButton>
              </div>
              <p class="text-xs text-muted-foreground">支援 JPG / PNG / WebP / AVIF，最大MB。</p>
              <input ref="coverInputRef" type="file" accept="image/*" class="hidden" />
            </div>
          </div>
        </div>


        <!-- 相簿（多圖） -->
        <div class="space-y-3">
          <div class="flex items-center justify-end gap-3">
            <UButton variant="ghost">重設</UButton>
            <UButton type="submit">儲存變更</UButton>
          </div>
        </div>
      </UForm>
    </template>
  </UIModal>
</template>
