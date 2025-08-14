<template>
  <LayoutsPage>
    <!-- Nuxt 提供的 ClientOnly，避免 SSR 環境觸發 -->
    <ClientOnly>
      <MainThreeCanvas :data="data.data.category" />
      <template #fallback>
        <p>載入 3D 場景中…</p>
      </template>
    </ClientOnly>
    <ul>
      <li v-for="post in posts" :key="post.id" class="py-6">
        <UCard class="w-full" >
          <!-- header -->
          <template #header>
            <NuxtLink
              :to="`/single`"
              class="text-2xl md:text-3xl font-extrabold leading-tight text-neutral-900 hover:underline"
            >
              {{ post.title }}
            </NuxtLink>
          </template>

          <!-- 內容區：左文 / 右圖 -->
          <div class="w-full flex flex-col md:flex-row gap-4">
            <!-- 左：文字區 -->
            <div class="md:flex-1 flex flex-col items-start justify-between">
              <p class="line-clamp-3">
                {{ post.excerpt }}
              </p>

              <div class="w-full flex items-center justify-between mt-3">
                <time :datetime="post.date">{{ fmt.format(new Date(post.date)) }}</time>
                <UButton class="flex items-center justify-center" variant="link" title="Share">
                  <UIcon name="heroicons:arrow-up-tray-20-solid" class="size-6" />
                </UButton>
              </div>
            </div>

            <!-- 右：縮圖（固定寬度） -->
            <div class="md:w-36">
              <NuxtLink
                :to="`/blog/${post.slug}`"
                class="block w-full h-36 rounded-lg overflow-hidden bg-neutral-100 shadow-sm"
              >
                <img :src="post.cover" :alt="post.title" loading="lazy" class="w-full h-full object-cover" />
              </NuxtLink>
            </div>
          </div>
        </UCard>
      </li>
    </ul>
  </LayoutsPage>
</template>

<script setup>
import MainThreeCanvas from '~/components/common/MainThreeCanvas.client.vue'
const { data } = await useApiFetch('/users/3b1a0a83-d329-42af-8270-5168c7594237')
const posts  = [
  {
    id: 1,
    title: 'Three',
    excerpt: `Nulla dolor velit adipisicing duis excepteur esse in duis nostrud occaecat mollit incididunt deserunt sunt. Ut utsunt laborum ex occaecat eu tempor labore enim adipisicing minim ad. Est in quis eu dolore occaecat excepteur fugiatdolore nisi aliqua fugiat enim ut cillum. Labore enim duis nostrud eu. Est ut eiusmod consequat irure quis deseruntex. Enim laboris dolor magna pariatur. Dolor et ad sint voluptate sunt elit mollit officia ad enim sit consecteturenim.`,
    date: '2022-09-07',
    slug: 'shader-triangle',
    cover: 'https://picsum.photos/seed/tri/420/280'
  },
  {
    id: 2,
    title: 'Three',
    excerpt: 'InterpolationInterpolationInterpolationInterpolationInterpolationInterpolation',
    date: '2022-09-02',
    slug: 'shader-point',
    cover: 'https://picsum.photos/seed/point/420/280'
  },
  {
    id: 3,
    title: 'Three',
    excerpt: 'Face / Vertex / FragmentFace / Vertex / Fragment',
    date: '2022-07-11',
    slug: 'threejs-terms-2',
    cover: 'https://picsum.photos/seed/three/420/280'
  }
]

// 日期格式化（本地化）
const fmt = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
</script>