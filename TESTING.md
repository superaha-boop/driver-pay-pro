# Driver Pay Pro Testing

更新日期：2026-07-25

## 基本規則

- 依本次變更風險選擇適用測試，不以桌面預覽取代 iPhone Safari 或 installed PWA 實機 QA。
- 專案目前沒有 package.json、TypeScript、ESLint 或 build pipeline；對應項目須明確標示 Not available，不可假裝通過。
- 現行自動測試使用 Node.js 內建 `node:test`。
- 所有功能變更都必須確認 `driverPayApp.v2` 未被更名或清除。
- PWA 資源變更必須同步檢查 `sw.js` cache version 與 App Shell。

## Cross-page product contract checklist

Use this checklist for every feature that affects navigation, records, calculations, or more than one primary page.

### Page ownership

- [ ] Bottom Navigation remains Today, Calendar, Reports, AI, Driver.
- [ ] Every writable capability has exactly one Primary owner in `docs/PRODUCT_SPEC.md`.
- [ ] Today only creates or updates today's record.
- [ ] Calendar owns past-record creation, editing, and deletion.
- [ ] Reports remains read-only and links to Calendar for record correction.
- [ ] AI remains read-only and separates facts, inference, and advice.
- [ ] Driver contains only persistent multi-day settings.
- [ ] Future dates cannot create work records.

### Shared data and calculations

- [ ] Today and Calendar use the same record model, validation, and autosave behavior.
- [ ] Income uses the canonical platform-rate and entry-total functions.
- [ ] Expenses use the canonical entry-expense function.
- [ ] Net income uses the canonical total-minus-expenses function.
- [ ] Work duration uses `workMetrics()` or its approved successor.
- [ ] Hourly rate uses `hourlyRate()` or its approved successor.
- [ ] Weekly and monthly summaries use one shared summary source.
- [ ] Zero or invalid duration produces `$0`, never `Infinity` or `NaN`.
- [ ] The same fixture produces the same values in Today, Calendar, Reports, and AI.

### Date and route behavior

- [ ] Calendar starts on today after a fresh app launch.
- [ ] Calendar retains the selected date during the same app session.
- [ ] Calendar and Reports month state remain independent.
- [ ] Selecting a date in another month updates the visible Calendar month.
- [ ] Monday-through-Sunday week boundaries remain complete and timezone-safe.
- [ ] Reports or AI record links preserve the exact target date.
- [ ] Invalid routes or dates do not create records.

### Product regression review

- [ ] No feature was moved to a page that has View, Link, or None ownership.
- [ ] No page-specific copy of a shared calculation or record form was introduced.
- [ ] No sixth Bottom Navigation destination was added.
- [ ] `driverPayApp.v2` and the existing data structure remain intact unless an approved migration exists.
- [ ] `docs/TECH_DEBT.md` is updated when an approved Sprint intentionally leaves a known gap.

## Design System checklist

### Viewport and layout

- [ ] 375px iPhone viewport 無水平 overflow。
- [ ] 390px iPhone viewport 無水平 overflow。
- [ ] 393px iPhone viewport 無水平 overflow。
- [ ] 430px iPhone viewport 無水平 overflow。
- [ ] installed PWA viewport 正確保留 safe area。
- [ ] Desktop 1024px 以上不無限拉寬、不破壞既有響應式。
- [ ] Bottom Navigation 不遮住最後內容。
- [ ] 長繁體中文不截斷必要資訊。
- [ ] 大額金額使用 tabular numerals 且不撐破容器。

### Interaction and accessibility

- [ ] 主要元件可用鍵盤操作。
- [ ] Tab 導覽出現 focus-visible。
- [ ] 滑鼠點擊不留下不必要永久 focus ring。
- [ ] IconButton 具備 `aria-label`。
- [ ] 選取狀態具備 `aria-pressed`、`aria-selected` 或合適語意。
- [ ] 主要 touch target 至少 44×44px。
- [ ] Disabled 元件無法觸發。
- [ ] Button loading 保留原寬度、防止重複提交並顯示文字狀態。
- [ ] SaveStatus 的 saving／saved／offline 可由 `aria-live` 感知。
- [ ] SaveStatus error 可持續顯示並由輔助技術感知。
- [ ] 狀態不只依靠顏色。

### Motion and loading

- [ ] `prefers-reduced-motion: reduce` 時轉場縮短或停止。
- [ ] Skeleton reduced motion 時停止 shimmer。
- [ ] Skeleton 尺寸接近實際內容，不造成明顯 layout shift。
- [ ] 短暫本機狀態不濫用 Skeleton。

### Forms

- [ ] Input、Select、Textarea 與 Time input 高度至少 44px。
- [ ] Label 不只依賴 placeholder。
- [ ] 金額／數字欄位使用適當 input mode。
- [ ] Time input 在 iPhone Safari 的左、右、上、下框線完整。
- [ ] Time input focus 與 value 狀態不讓 border 消失。
- [ ] Time input wrapper 與 input 都沒有超出父容器。
- [ ] Disabled 與 read-only 可清楚區分。

### Visual foundations

- [ ] 新 UI 使用 `styles/design-system.css` tokens。
- [ ] 沒有新增孤立色彩、圓角、陰影或間距。
- [ ] 沒有新增第二套 Button、Card、EmptyState、Skeleton 或 SaveStatus。
- [ ] Lucide 是唯一正式 UI icon 形式。
- [ ] 每頁最多一個主要 CTA。
- [ ] 沒有 Card inside Card 或 KPI card wall。
- [ ] 一般卡片沒有厚重陰影、粗框或高飽和大型漸層。

### Engineering and release

- [ ] Inline JavaScript syntax。
- [ ] Service Worker syntax。
- [ ] Node automated tests。
- [ ] Console 無新增 error／warning。
- [ ] Production build（目前無 build pipeline，標示 Not available）。
- [ ] TypeScript（目前無 TypeScript，標示 Not available）。
- [ ] Lint（目前無 ESLint，標示 Not available）。
- [ ] `git diff --check`。
- [ ] `git diff` 人工核對。
- [ ] `git status` 人工核對。
- [ ] localStorage key 保持 `driverPayApp.v2`。
- [ ] PWA App Shell 資源完整。
- [ ] Showcase 不在 Bottom Navigation 或 PWA App Shell。

## Design System automated tests

```text
node --test tests/*.test.js
```

`tests/design-system.test.js` 驗證 tokens、primitives、PWA 接線、showcase 隔離、無障礙契約與 time input 安全 wrapper。自動測試不能取代真實 iPhone Safari／PWA 驗收。

## Documentation-only Sprint validation

When a Sprint explicitly prohibits product-code changes:

- [ ] `git diff --name-only` contains only approved documentation files.
- [ ] `git diff --exit-code -- index.html design-system.html sw.js manifest.webmanifest styles tests` succeeds.
- [ ] Inline JavaScript syntax still passes against the unchanged `index.html`.
- [ ] Service Worker syntax still passes against the unchanged `sw.js`.
- [ ] `manifest.webmanifest` parses as JSON.
- [ ] Existing Node tests pass.
- [ ] Service Worker cache version is unchanged.
- [ ] No dependency, schema, localStorage, navigation, UI, or business-logic change is present.
