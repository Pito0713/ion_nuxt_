# ion-nuxt 專案說明

本專案採用 [Nuxt 3](https://nuxt.com/) 建構，整合多種 UI 與開發工具，提供可擴充的前端架構。

## 專案架構

```
.
├─ assets/           # 靜態資源與全域樣式
├─ components/       # 可重用的 Vue 元件
├─ composables/      # 可共用的組合式函式 (useXxx)
├─ layouts/          # 頁面佈局模板
├─ pages/            # 依檔案自動產生的路由頁面
├─ plugins/          # Nuxt 外掛初始化
├─ public/           # 直接由伺服器提供的靜態檔案
├─ server/           # 伺服端 API 與中介層
├─ utils/            # 共用工具函式
├─ types/            # TypeScript 型別宣告
├─ app.config.ts     # @nuxt/ui 與色彩設定
├─ nuxt.config.ts    # Nuxt 應用程式設定
└─ ...
```

## 使用的框架與技術

- **Nuxt 3 & Vue 3**：核心前端框架，支援通用渲染與檔案式路由。
- **TypeScript**：提供型別安全與更佳的開發體驗。
- **@nuxt/ui + Tailwind CSS**：UI 元件與樣式系統。
- **Pinia**：狀態管理方案。
- **@nuxtjs/color-mode**：深淺色主題切換。
- **@tresjs/nuxt**：整合 Three.js，支援 3D 場景。
- **Tiptap**：富文字編輯器套件。
- **ESLint**：程式碼風格與品質檢查。

## 開發與使用規則

1. 使用 [Yarn](https://yarnpkg.com/) 作為封包管理器。
2. 安裝依賴：
   ```bash
   yarn install
   ```
3. 啟動開發伺服器：
   ```bash
   yarn dev
   ```
   預設於 <http://localhost:3000> 提供服務。
4. 建置正式版：
   ```bash
   yarn build
   ```
5. 預覽正式版：
   ```bash
   yarn preview
   ```
6. 新增頁面請放在 `pages/`，共用元件放在 `components/`，共用邏輯放在 `composables/`。
7. 環境變數可於 `.env` 中設定，例如 `API_BASE` 會對應到 `runtimeConfig.public.baseURL`。

歡迎依據專案需求進一步擴充與調整。
