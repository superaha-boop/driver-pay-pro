# Driver Pay Pro Design System

Version: 1.0
更新日期：2026-07-25

## 文件定位

本文件是 Driver Pay Pro 可實作的視覺基礎規格。產品與互動原則仍以 `AGENTS.md`、`docs/PRODUCT_GUIDE.md` 與 `docs/DESIGN_KIT.md` 為準；實際 token 與 primitive 的單一程式來源是：

```text
styles/design-system.css
```

現有頁面採漸進式導入，不因 Design System 建立就一次性重寫。新 UI 必須優先使用本文件定義的 token 與共用 class；若需要突破規格，先在 `DECISIONS.md`／`docs/DECISION_LOG.md` 記錄理由。

## 技術選擇

- 專案是無建置流程的靜態單頁 PWA，沒有 TypeScript、Tailwind、React 或元件套件。
- Design Tokens 使用 CSS custom properties，避免增加相依套件或第二套樣式來源。
- 共用 primitive 使用語意化 HTML 加 `.ds-*` class；額外頁面 class 可直接附加，等同元件系統的 `className` 擴充。
- HTML 原生 `disabled`、`aria-busy`、`aria-pressed`、`role` 與 `aria-live` 是狀態 API。
- 本專案目前無法提供 TypeScript typed props；未來若導入具建置流程的元件層，型別必須映射既有 variant 名稱，不得另建第二套 API。
- Lucide 風格 inline SVG 是唯一正式 icon 形式；不加入 emoji 或另一套 icon library。

## Tokens

### Spacing

4px 基礎節奏：

| Token | Value |
| --- | ---: |
| `--spacing-1` | 4px |
| `--spacing-2` | 8px |
| `--spacing-3` | 12px |
| `--spacing-4` | 16px |
| `--spacing-5` | 20px |
| `--spacing-6` | 24px |
| `--spacing-8` | 32px |
| `--spacing-10` | 40px |
| `--spacing-12` | 48px |

手機頁面左右安全間距預設 16px，低於 375px 時可降至 12px。主要卡片內距優先 16px 或 20px，區塊間距優先 24px。既有畫面的 10px、14px、18px 等歷史值為凍結版型相容用途，不可作為新 UI 範例。

### Radius

| Token | 用途 |
| --- | --- |
| `--radius-sm` | 小型控制項，12px |
| `--radius-md` | 按鈕與一般控制，16px |
| `--radius-card` | 一般卡片，20px |
| `--radius-lg` | 主要資訊卡，24px |
| `--radius-sheet` | Sheet／Modal，28px |
| `--radius-pill` | 標籤與膠囊 |

### Typography

| Class / token | 建議用途 |
| --- | --- |
| `.ds-display` / `--font-size-display` | 單一主要數字 |
| `.ds-page-title` / `--font-size-page-title` | 頁面標題 |
| `.ds-section-title` / `--font-size-section-title` | 區塊標題 |
| `.ds-card-title` / `--font-size-card-title` | 卡片標題 |
| `.ds-body` / `--font-size-body` | 主要內文 |
| `.ds-secondary` / `--font-size-secondary` | 次要資訊 |
| `.ds-caption` / `--font-size-caption` | 註解與狀態 |
| `.ds-numeric` | 金額、時數、百分比與 KPI |

使用 Apple system font stack，不下載或提交字型。主要數字加 `.ds-numeric` 以啟用 `tabular-nums`。同一畫面避免大量 Display 數字競爭注意力。

### Semantic colors

- Brand：`--color-brand`、`--color-brand-hover`、`--color-brand-pressed`、`--color-brand-soft`、`--color-brand-subtle`
- Surface：`--color-background`、`--color-surface`、`--color-surface-secondary`、`--color-surface-elevated`、`--color-surface-muted`
- Text：`--color-text-primary`、`--color-text-secondary`、`--color-text-tertiary`、`--color-text-inverse`、`--color-text-disabled`
- Border color：`--color-border-subtle`、`--color-border-default`、`--color-border-strong`
- Status：success、warning、danger、info 及各自 soft 版本
- Overlay：`--color-overlay`、`--color-focus-ring`

品牌綠只用於主要操作、選取、正向進度與重要焦點。Danger 只用於真正破壞性操作。狀態不得只依賴顏色。

`--color-legacy-brand-secondary`、`--color-legacy-accent` 與 `--color-legacy-coral` 只用於保留凍結畫面的既有色彩，不是新 UI token；後續在核准範圍遷移完成後才能移除。

### Shadows and borders

- Shadows：`--shadow-none`、`--shadow-soft`、`--shadow-card`、`--shadow-overlay`
- Borders：`--border-subtle`、`--border-default`、`--border-selected`、`--border-danger`

一般卡片以背景、細框線與留白建立層級；overlay 或浮動內容才使用較明顯陰影。Focus ring 與 selected border 必須同時保持不同用途。

### Motion

- Duration：`--motion-fast` 120ms、`--motion-normal` 180ms、`--motion-slow` 260ms
- Easing：`--ease-standard`、`--ease-enter`、`--ease-exit`

一般 UI 不超過 300ms，不使用彈跳、翻轉或娛樂性動畫。所有共用動畫尊重 `prefers-reduced-motion`，Skeleton 在 reduced motion 下停止。

### Touch and safe area

- `--touch-target-min` 固定 44px。
- `--safe-area-*` 對應 iPhone safe area。
- `--bottom-navigation-space` 預留固定底部導覽空間。
- 圖示視覺尺寸可為 18–22px，但互動區不得小於 44×44px。

## Shared primitives

### Button

基礎 class：

```html
<button class="ds-button ds-button--primary" type="button">新增紀錄</button>
```

Variants：`primary`、`secondary`、`ghost`、`text`、`danger`。
Sizes：`sm`、`md`、`lg`、`icon`。

狀態：

- 使用原生 `disabled`，不可只做視覺停用。
- Loading 使用 `aria-busy="true"`，同時保留可理解的「儲存中」文字與原寬度。
- 每頁原則上只有一個 Primary。
- Danger 不與 Primary 競爭視覺焦點。

### IconButton

```html
<button class="ds-icon-button" type="button" aria-label="上一個月">
  <!-- Lucide inline SVG -->
</button>
```

每個 icon-only button 必須有 `aria-label`。選取使用 `aria-pressed="true"`，危險操作加 `.ds-icon-button--danger`，停用使用原生 `disabled`。

### Card

Variants：default、elevated、muted、selected、interactive。

```html
<article class="ds-card ds-card--muted">
  <header class="ds-card__header">…</header>
  <div class="ds-card__content">…</div>
  <footer class="ds-card__footer">…</footer>
</article>
```

只有真正需要群組的內容才使用卡片，不建立 Card inside Card，不把頁面做成 KPI 卡片牆。Interactive Card 必須使用 `button`、`a` 或其他正確可操作語意，不用 `div` 假裝按鈕。

### SectionHeader

由 `.ds-section-header`、`__copy`、`__title`、`__description`、`__action` 組成，支援 `.ds-section-header--compact`。右側最多放一個低頻操作，不綁定頁面資料。

### EmptyState

由可選 icon、title、description、最多一個 Primary 及一個 Secondary 組成。使用中性敘述，不將「尚無資料」表達為錯誤或紅色警告。緊湊版使用 `.ds-empty-state--compact`。

### Skeleton

Variants：text、metric、row、card、circle。尺寸應接近實際內容以避免 layout shift。只在真正等待資料時使用，不為短暫本機狀態切換加入 Skeleton。

### SaveStatus

`data-status` 支援 `idle`、`saving`、`saved`、`offline`、`error`。Saving／saved／offline 使用 `role="status" aria-live="polite"`；error 可使用 `role="alert"`。元件只呈現狀態，不負責儲存。

### PageContainer, Surface and Divider

- `.ds-page-container`：手機 padding、最大寬度、safe area 與底部導覽預留。
- `.ds-surface`：標準 surface 與主要文字。
- `.ds-divider`：低對比分隔線。

避免為抽象而建立深層 wrapper。

## Forms

- Controls 最小高度 44px，手機輸入字級 16px。
- Label 必須獨立存在，不以 placeholder 取代。
- Error message 靠近欄位，不能只用紅框。
- 金額使用適合的 `inputmode="numeric"` 或 `decimal`。
- Disabled 與 read-only 必須視覺及語意不同。
- 自動儲存需搭配低干擾 SaveStatus。
- Switch 與 segmented control 的整體可點擊區至少 44px，選取狀態同步 `aria-checked` 或 `aria-pressed`。

Time input 使用安全 wrapper：

```html
<label class="ds-field">
  <span class="ds-label">開始時間</span>
  <span class="ds-time-control">
    <input type="time">
  </span>
</label>
```

Wrapper 與 input 都使用 `width: 100%`、`max-width: 100%`、`min-width: 0` 及 `box-sizing: border-box`。外框由 wrapper 負責，原生 input 不建立第二套 border。現有首頁 `.work-time-control` 已符合此安全結構。

## Accessibility

- 主要元件必須可由鍵盤操作。
- 使用 `:focus-visible`，不永久顯示 focus ring。
- IconButton 必須有可理解名稱。
- 選取狀態使用合適 ARIA。
- Loading 與儲存狀態可被輔助技術感知。
- Disabled 元件不能觸發。
- 不只依賴顏色傳達狀態。
- 動畫尊重 reduced motion。
- 文字對比、44px 觸控範圍、長繁中及大額金額都必須納入 QA。

## Showcase

開發展示頁：

```text
design-system.html
```

本機啟動靜態伺服器後直接開啟 `/design-system.html`。此頁：

- 不出現在 App 或 Bottom Navigation。
- 有 `noindex, nofollow`。
- 不加入 PWA App Shell。
- 不影響既有 hash routing。
- 展示 tokens、typography、buttons、segmented control、KPI、Empty／Loading／
  Error、list row、44px touch target、focus-visible 與 reduced motion。
- 由 `tests/design-system.test.js`、`tests/foundation.test.js` 與
  `npm run validate:production` 驗證 isolation 與必要內容。

專案沒有 build-time environment 或 route guard；為避免引入框架，showcase 採獨立靜態內部預覽頁。它不是產品入口，也不應由正式 UI 連結。

## Progressive adoption

本 Sprint 只完成 foundation。現有首頁、月曆、報表、AI 與 Driver 大部分歷史 CSS 尚未遷移，且視覺與功能保持凍結。後續每個核准 Sprint 應：

1. 只遷移本次修改範圍。
2. 使用既有 token 與 primitive。
3. 不同時重做資訊架構或商業邏輯。
4. 驗證 iPhone Safari、installed PWA、safe area、鍵盤及水平 overflow。
5. 不建立第二套 Button、Card、EmptyState、Skeleton 或 SaveStatus。

下一個建議 Sprint：Calendar implementation specification and refactor。
