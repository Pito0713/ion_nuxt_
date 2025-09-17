import { upload } from '@imagekit/vue'

type ImageRes = { data:{token: string; expire: string; signature: string }}
const PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY as string
const URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT as string

export async function useImageKitUpload(file: File, folder = '/Default') {
  const config = useRuntimeConfig();
  // 拿簽名 token, signature, expire
  const auth = await $fetch<ImageRes> (`${config.public.baseURL}/imagekit/auth`);
  if(!auth.data.token || !auth.data.signature) {
    throw new Error('ImageKit 認證失敗')
  }

  // 上傳 imagekit
  const res = await upload({
    file,
    fileName: file.name,
    token: auth.data.token,
    signature: auth.data.signature,
    expire:  Number(auth.data.expire),
    publicKey: PUBLIC_KEY,
    folder: folder,
    useUniqueFileName: true
  })

  return { url: res.url as string, fileId: res.fileId as string, urlEndpoint: URL_ENDPOINT }
}
