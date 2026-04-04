# Prototype 开发者指南 (README-dev)

---

## 目录

1. [技术栈](#1-技术栈)
2. [数据与常量配置](#2-数据与常量配置)
3. [如何添加新资产 (Model & Image)](#3-如何添加新资产-model--image)
4. [本地存储 (Local Storage) 可复用逻辑](#4-本地存储-local-storage-可复用逻辑)
5. [TypeScript 接口](#5-typescript-接口)
6. [其他重要组件复用说明](#6-其他重要组件复用说明)

---

## 1. 技术栈


- **框架**: Native React 18 + Vite
- **语言**: TypeScript
- **样式**: Tailwind CSS (结合 CSS Variables 注入定制主题)
- **核心组件图库**: Lucide React
- **核心功能库**: 
  - `leaflet` / `react-leaflet`: 用于地图功能的展示与交互。
  - `swiper`: 用于 Collection 收藏页的 3D 卡片流切换展示。
  - `@google/model-viewer`: 用于加载并在 Web 端渲染 `.glb` 3D 模型格式。
  - `lottie-react`: 动画展示（如解锁成功高光动画）。

---

## 2. 数据与常量配置

项目中所有的“数据驱动”都依赖于 `src/constants/` 下的核心常量配置。所有的地点、鸟类对应关系、初始留言都尽量避免硬编码在组件中。

###  `src/constants/locations.ts`
这里是整个项目的 **单一事实来源 (Single Source of Truth)**。当你需要添加一个新的校园打卡点或一只新的吉祥物时，修改这个文件即可。

```typescript
export interface Location {
  id: string;             // [重要] 这个 ID 将用于图片、模型的命名映射和存储打卡记录中。
  name: string;           // 地点的显示名称
  mascotName: string;     // 吉祥物（鸟）的名称
  coordinates: [number, number]; // 地图上的经纬度 [lat, lng]
}
```
**复用功能**：你可以复用 `getLocationData(id: string)` 工具函数，通过传入位置ID，快速获得完整的位置和物种信息。

###  `src/constants/messages.ts`
这里存放了留言墙与弹幕使用的假数据（后续可替换为接口）。
通过 `getMessagesByLocation(locationId: string)` 函数，可以根据当前地图所选的位置拉取出该地点的专属弹幕。

---

## 3. 如何添加新资产 (Model & Image)

为了最大限度减少开发手动编写 `import` 的负担，我们使用了 Vite 的 **`import.meta.glob`** 实现自动化资产扫描。你只需要把文件放入指定文件夹，并**严格遵守命名规范**，系统就会自动读取。

###  新增吉祥物的展示图 (Image)
当用户进入 My Collection 页面时，展示的解锁鸟类图片位于：
 `src/assets/image/`

- **命名规范**: 必须与 `locations.ts` 中的 `id` 相同，再拼上 `-image`。
- **扩展名**: 支持 `png`, `jpg`, `jpeg`, `webp`。
- **示例**: 如果你添加了 `location.id = 'lib'` (Library):
  - 放入图片 `src/assets/image/lib-image.png`
- **Fallback 兜底**: 如果系统中未找到目标位置图，默认回退显示 `default-image.png`。

###  新增吉祥物的 3D 模型 (Model)
当用户扫码触发 Check In 解锁框，或者点击卡片预览时播放的 3D 模型位于：
 `src/assets/model/`

- **命名规范**: 必须拼上 `-model` ，固定扩展名为 `.glb`。
- **示例**: 你为位置 `id='lib'` 添加模型：
  - 放入模型文件 `src/assets/model/lib-model.glb`
- **Fallback 兜底**: 若模型未找到，将回退渲染 `default-model.glb`。

> **逻辑定位**：自动匹配挂载点的代码可见 `src/components/collection/CollectionPage.tsx` 与 `src/components/collection/CheckInSuccessModal.tsx`，通过 `import.meta.glob(..., { query: '?url' })` 扫描解析。

---

## 4. 本地存储 (Local Storage) 可复用逻辑

所有的离线数据读写（如：记录用户的扫码解锁状态）已经被抽离和封装在独立的逻辑层内，**请不要在组件里直接写 `localStorage.getItem`**。

 **文件路径**: `src/lib/storage.ts`

### 可复用的方法：

- **`getUnlockedCollectibles()`**:
  - 返回已被解锁的物品的汇总对象 (`Record<string, { unlockedAt: number }>`)。
- **`unlockCollectible(id: string)`**:
  - 传入特定地点的 `id` 将其标记为已解锁。它会自动记录解锁当前对应的时间戳，并在 `localStorage` 持久化。
- **`isUnlocked(id: string)`**:
  - 传入 `id` 检查布尔值，看看该用户是否拥有此卡片。
- **`getUnlockedCount()`**:
  - 返回当前用户已解锁的数量（通常用于计算进度条 Progress Bar 分子）。

**工作流示例**：
系统在 `App.tsx` 中监听 `window.location.search` (比如扫码跳转的 `?checkin=cb`)，一旦捕获，便调用 `unlockCollectible('cb')`。随后，如 `CollectionPage` 内调用 `getUnlockedCollectibles()` 即可点亮对应卡片。

---

## 5. TypeScript 接口

当你为项目提 PR 或者 npm run build 开发构建时，一定要注意以下开发指南，以避免 Vite 报错中断。

###  严格类型隔离 (import type)
按照项目中 `tsconfig.node.json` 和开发最佳实践约定，所有提取的类型 (Interfaces/Types) 在被别的组件纯粹用作类型定义而非实值导入时，**务必挂上 `type` 关键字**。
```typescript
//  错误示例
import { MESSAGES, Message } from '../constants/messages';

//  正确示例 (加 type 预防 TS1484 verbatimModuleSyntax 报错)
import { MESSAGES, type Message } from '../constants/messages';
```

### 消除未使用变量声明
项目中开启了严格格式校验（`noUnusedLocals`）。如果在某个组件的顶端你只 `import` 但并未在下面真正使用，会导致构建失败：
```typescript
// 比如从 lucide-react 乱抄了一把 Icon
import { Backpack, Map, Sparkles } from 'lucide-react';
// 如果你在下方没渲染 <Map />，构建就会报错（TS6133）。请及时清理！
```

### CSS Modules 的 TypeScript 声明
像 `swiper` 这类需要注入 `import 'swiper/css';` 的插件，默认由于没有 TS 类型签名会抛出 TS2307。为此我们已统一在 **`src/vite-env.d.ts`** 下做了全局声明 (`declare module 'swiper/css'`)，若后续添加了更多没有 typings 的样式库，请去该文件内添加声明扩展。

---

## 6. 其他重要组件复用说明

- **`DanmakuDetailModal.tsx`**: 
  这是一个在 `src/components/wall/` 下的全屏毛玻璃弹窗（背景带 backdrop blur）。
  不仅用于地图上的弹幕详情弹窗，目前也支持高自由度作为 **留言墙 (Wall Page) 拍立得照片** 点击后的查看大图与全量的弹窗载体复用。需要时，按其要求的 `DanmakuItem` 接口格式传入对应字段（支持图片和长正文）。

- **响应式排版**:
  所有的新写页面的顶层响应式我们通常采用 `max-w-6xl mx-auto w-full px-4`，以保证移动端和 PC 端同时具备良好的安全边距并能灵活居中。尽量采用 Tailwind 的基于断点的指令，如：`flex-col md:flex-row` 保证移动端优先的设计体验。