# ion_nuxt_文檔
## 專案說明
建立 BLOG 專案,  紀錄開發上的重點與踩坑

## 當前版本: [V1.0.0](###V1.1.1)

## API 文檔
```
```

## 專案架構

```
├─ assets/             # css & 全域樣式
├─ components/        
│   ├─ common          # 共用元件
│   └─ global          # 全域共用元件
├─ composables/        # 共用的 use 函式
├─ layouts/            # 頁面佈局
├─ pages/              # 路由頁面
├─ plugins/            # 外掛函式
├─ public/             # 靜態檔案
├─ server/             # 伺服端 API 與中介層
├─ types/              # TypeScript 型別宣告
├─ utils/              # 共用工具函式
├─ nuxt.config.ts      # Nuxt 應用程式設定
├─ app.config.ts       # @nuxt/ui 設定
├─ README.md           # 專案文檔
├── .env               # 環境變數
└─ tailwind.config.js  # @nuxt/ui 設定
```

## 使用的框架與技術

- **Nuxt 3 & Vue 3**：核心前端框架，支援通用渲染與檔案式路由。
- **TypeScript**：提供型別安全與更佳的開發體驗。
- **@nuxt/ui + Tailwind CSS**：UI 元件與樣式系統。
- **@nuxtjs/color-mode**：深淺色主題切換。
- **@tresjs/nuxt**：整合 Three.js，支援 3D 場景。
- **Tiptap**：富文字編輯器套件。
- **ESLint**：程式碼風格與品質檢查。

## 開發與使用規則
1. 新增頁面請放在 `pages/`，
   共用元件放在 `components/`，
   共用 use 邏輯放在 `composables/`。
2. 環境變數可於 `.env` 中設定
   例如 `API_BASEURL` 會對應到 `runtimeConfig.public.baseURL`。
3. 頁面開發需遵守單一組件 `SRP` 原則 
   EX: `UI` (頁面佈局UI), `useHook`(頁面邏輯), `index` (頁面導入)

### Git

- `main` 正式版本。
- `develop` 開發分支。
- `feature` 功能分支。
- `release` 版本分支。
- `README` 文檔分支


### V1.0.1

```
```
