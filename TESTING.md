# Driver Pay Pro Testing

更新日期：2026-07-25

## 基本規則

- 依本次變更風險選擇適用測試，不以桌面預覽取代 iPhone Safari 或 installed PWA 實機 QA。
- 專案目前沒有 package.json、TypeScript、ESLint 或 build pipeline；對應項目須明確標示 Not available，不可假裝通過。
- 現行自動測試使用 Node.js 內建 `node:test`。
- 所有功能變更都必須確認 `driverPayApp.v2` 未被更名或清除。
- PWA 資源變更必須同步檢查 `sw.js` cache version 與 App Shell。

## Calendar Final Regression Matrix

Date: 2026-07-25

- Fixed fixture: `tests/fixtures/calendar-regression.json`。
- Automated suite: `tests/calendar-regression.test.js` 與所有既有 `tests/*.test.js`。
- Result: 52/52 passed。
- Read／Navigate: fresh session Today、same-session selection、relaunch reset、
  Monday-first、month arrows、Today、swipe、adjacent month、Today／Selected／Heat、
  out-of-month selection、5／6-week months、future／empty／zero／negative passed。
- Create: past empty date、blank rejection、future guard、Today routing、grid／heat／
  card／summary refresh、selected-date retention、reload persistence passed。
- Edit: income、expense、work time、weather、note、cancel／discard、duplicate-date
  prevention、immediate derived values and selected-date retention passed。
- Delete: cancel／confirm、single-date scope、grid／heat／summary／empty-state refresh、
  rollback and reopen passed。
- Cross-page: Today、Calendar、Reports share canonical total、net、expense、work time、
  hourly rate、work days and monthly aggregation.
- Error／Data Integrity: corrupt JSON preservation, write／serialization／quota
  failures, create／edit／delete rollback, original data preservation and stable
  `driverPayApp.v2` passed。
- Accessibility: date ARIA, Editor title and labels, assertive validation alert,
  SaveStatus live region, confirmation dialog, focus return, keyboard, reduced
  motion and 44×44 targets passed。
- Responsive: 320、375、390、393、430、768、1024px passed without horizontal
  overflow；Final Regression only changed JavaScript behavior and documentation,
  not responsive CSS。
- Browser verification: validation error exposes `role="alert"`,
  `aria-live="assertive"`, `aria-atomic="true"`; forms point to
  `recordEditorStatus`; closing returns focus to the rerendered add button。
- PWA／Offline: Product Owner previously confirmed physical iPhone Safari,
  installed PWA, Preview and offline Human QA; App Shell remains
  `driver-pay-pro-v10` with no resource change in this Sprint。
- TypeScript: Not available。
- ESLint: Not available。
- Production build: Not available。
- Inline JavaScript、Service Worker syntax、manifest JSON、fixture JSON、
  App Shell and `git diff --check`: passed。

### Feature Freeze

正式共用 Gate 位於 `docs/FEATURE_FREEZE_CHECKLIST.md`。Calendar V1 已提供完整
Evidence 並宣告 UX Freeze — Version 1；Reports、AI 與 Driver 必須建立各自證據，
不得沿用 Calendar 的通過狀態。

## Calendar Sprint 4A validation record

Date: 2026-07-25

- Automated Node tests: 40/40 passed.
- Inline JavaScript syntax: passed.
- Service Worker syntax, manifest JSON, and App Shell resource checks: passed.
- Browser Console: no errors or warnings after Calendar interaction and reporting regression checks.
- Responsive browser checks: 320, 375, 390, 393, 430, 768, and 1024px passed without horizontal overflow.
- Verified: fresh/reload Today selection, same-session selection retention, valid/invalid date deep links, month-only navigation, Today action, adjacent-month selection, future/past empty states, keyboard selection, four-level heat, canonical Work Record Card, month summary, Reports fixture consistency, Bottom Navigation clearance, and time-input borders.
- TypeScript: Not available.
- ESLint: Not available.
- Production build: Not available.
- Physical iPhone Safari and installed PWA: pending Product Owner human QA.
- Needs UX Validation: month navigation preserves an out-of-month selected date and keeps that date's card visible with a quiet context label.

## Calendar Sprint 4A.5 Visual Polish validation record

Date: 2026-07-25

- Automated Node tests: 41/41 passed.
- Inline JavaScript, Service Worker syntax, manifest JSON, App Shell, and `git diff --check`: passed.
- Browser Console: no errors or warnings.
- Responsive checks: 320, 375, 390, 393, 430, 768, and 1024px passed without horizontal overflow; seven columns, month navigation, nowrap amounts, selected border, bounded desktop width, and Work Record Card alignment remained intact.
- Six-row month: August 2026 passed at 390 and 430px with 42 date cells, seven columns, a 12px Calendar/Card gap, and no horizontal overflow.
- 390px before/after measurement: Month Navigation moved from y=109.5 to y=105.5; Month Grid from y=207.0 to y=191.0; Work Record Card from y=519.0 to y=495.0, so the card appears about 24px earlier without reducing control hit areas.
- Verified presentation contracts: Today button remains at least 44px high, weekday header keeps seven columns, date amount is nowrap/tabular, selected/current ARIA remains, Work Record Card keeps the same accessible header label, and heat remains a four-level semantic-token presentation.
- Verified regressions: Monday-first, exact date route, month-only navigation, Today action, selected/current separation, canonical card calculations, read-only behavior, unchanged `driverPayApp.v2`, and unchanged heat algorithm.
- TypeScript: Not available.
- ESLint: Not available.
- Production build: Not available.
- Physical iPhone Safari, installed PWA, VoiceOver, iOS return gesture, safe area, Service Worker lifecycle, relaunch-to-today, and month-switch UX: pending Product Owner Human QA.

### Calendar Visual Polish human checklist

- [ ] Header feels clearly shorter without losing brand recognition.
- [ ] Month navigation remains understandable and all controls are comfortable to tap.
- [ ] Today button is visible but does not compete with the month title.
- [ ] Weekday labels are easier to read outdoors and remain secondary.
- [ ] Date and compact income amount feel related without touching or wrapping.
- [ ] Heat levels are slightly easier to distinguish while remaining soft.
- [ ] Selected remains the strongest visual state and Today remains identifiable.
- [ ] Work Record Card date is primary and weekday is secondary; VoiceOver wording is unchanged.
- [ ] Primary and secondary metrics scan clearly without new visual noise.
- [ ] 390px reveals the Work Record Card earlier; 430px retains comfortable spacing.
- [ ] Physical iPhone Safari and installed PWA preserve safe area, Bottom Navigation, gestures, focus, offline shell, and relaunch behavior.

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

## Calendar implementation checklist

This checklist applies across Calendar Implementation Sprints. Sprint 4A read/navigation
and Sprint 4B mutation/hardening automated results are recorded in the repository tests
and `HANDOFF.md`. Physical iPhone Safari and installed-PWA items remain Human QA. Full
expected behavior is defined in `docs/CALENDAR_SPEC.md`.

### Month grid and dates

- [ ] Fresh Calendar entry selects Taipei-local today.
- [ ] Same session preserves selected date and displayed month.
- [ ] New session resets normal entry to today.
- [ ] Grid is Monday-first with headers 一 through 日.
- [ ] Normal February has 28 days.
- [ ] Leap-year February has 29 days.
- [ ] Month starting Monday aligns day 1 to the first column.
- [ ] A six-row month renders without clipping or overflow.
- [ ] Leading/trailing adjacent-month dates are valid and selectable.
- [ ] Previous/next arrows change displayed month only.
- [ ] Today button selects and displays current today.
- [ ] Month-only navigation does not silently change selected date.
- [ ] Rapid month changes settle on the final requested month.
- [ ] Date utilities pass in Asia/Taipei and UTC test processes.

### Date-cell states and heat

- [ ] Today and Selected are distinct and can coexist.
- [ ] Focus and Selected are visually distinct.
- [ ] Record with no net displays `—`; no record displays no amount.
- [ ] Negative net displays a signed compact amount and no positive heat.
- [ ] Future date displays no heat and cannot create.
- [ ] One to three positive days use maximum-ratio fallback.
- [ ] Four or more positive days use quantile levels 1–4.
- [ ] All equal positive values receive the same Level 2.
- [ ] One extreme value does not erase differentiation among other days.
- [ ] Compact values cover under 1,000, one-decimal k, integer k, negative, and very large amounts.
- [ ] Heat uses semantic Design System tokens and Selected overrides its surface.

### Work Record Card and empty states

- [ ] Selecting a date updates the card without navigation or auto-creation.
- [ ] Card uses canonical total, expenses, net, duration, and hourly calculations.
- [ ] Platform rows use text, recognized values, and no logos/colors.
- [ ] Empty platform section is hidden.
- [ ] Today empty state shows `前往今天`.
- [ ] Past empty state shows `新增紀錄`.
- [ ] Future empty state has no action.
- [ ] Card and grid update after another page changes records.
- [ ] Monthly net and shared work-day count are correct.

### Record mutation

- [x] Past backfill prefills and locks selected date.
- [x] Existing record opens the one reusable Record Editor.
- [x] Calendar editing does not navigate into or masquerade as Today.
- [x] Successful create/edit returns to the same selected date.
- [x] Routine saves show SaveStatus without success Toast spam.
- [x] Dirty grouped fields cannot be silently discarded.
- [x] Delete is secondary and confirmation includes exact date and affected data.
- [x] Delete success keeps selected date and updates card/grid/heat/summary.
- [x] localStorage write failure rolls back create/edit/delete and preserves a retryable draft.
- [x] Corrupted localStorage shows read error/retry and does not appear as an empty month when a last-valid safety copy exists.
- [x] Offline create/edit/delete accurately says locally saved and does not claim cloud sync.

### Gesture, motion, and accessibility

- [ ] Grid swipe changes one month and arrows remain available.
- [ ] Card swipe changes one day and crossing month syncs displayed month.
- [ ] Vertical scrolling is not intercepted by horizontal gesture detection.
- [ ] iOS screen-edge browser gesture is not hijacked.
- [ ] Reduced motion removes transforms and smooth scrolling.
- [ ] Grid supports roving focus and Arrow/Enter/Space behavior.
- [ ] Date labels announce full date, Today/Selected, record, full net, and future status.
- [ ] Selected uses `aria-selected`; Today uses `aria-current="date"`.
- [ ] Month/card announcements are polite and not repetitive.
- [ ] IconButtons have accessible names.

### Responsive, PWA, and regression

- [ ] 375, 390, 393, and 430px have no horizontal overflow.
- [ ] 320px stress layout remains usable without forcing 44px-wide columns.
- [ ] 768 and 1024px retain a bounded Calendar width and information order.
- [ ] Full date cells remain at least 44px high; primary widths meet the touch target where physically possible.
- [ ] Compact amounts never wrap.
- [ ] Bottom Navigation and installed-PWA safe area do not cover Calendar content.
- [ ] Today, Reports, AI, Driver, navigation, Service Worker, and manifest do not regress.
- [ ] Today, Calendar, Reports, and AI return identical values for shared fixtures.
- [ ] `driverPayApp.v2` and old records remain intact.

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
