# Driver Pay Pro Testing

更新日期：2026-07-29

## 基本規則

- 依本次變更風險選擇適用測試，不以桌面預覽取代 iPhone Safari 或 installed PWA 實機 QA。
- 專案已有最小 package、ESLint、static production validation 與 release gate；
  仍沒有 TypeScript 或 bundler。TypeScript 必須標示 Deferred／Not available。
- 現行自動測試使用 Node.js 內建 `node:test`。
- 所有功能變更都必須確認 `driverPayApp.v2` 未被更名或清除。
- PWA 資源變更必須同步檢查 `sw.js` cache version 與 App Shell。

## QA 分級

- L1 自動驗證：語法、Node tests、Console、responsive、資料安全與適用回歸。
- L2 Preview Smoke QA：以未登入 iPhone Safari 可直接開啟的 Preview 快速驗證
  主要流程、導覽、即時更新、overflow、白畫面與阻擋性錯誤。
- L3 Module Human QA：模組 Final Regression 後驗收完整流程、installed PWA、
  Offline、VoiceOver、safe area 與 iOS 特有行為。
- L4 Production Release QA：正式發布後核對 Production commit、核心流程、
  Service Worker 更新與 rollback readiness。

小型 Sprint 原則上不重複執行完整 L3；大模組完成 Final Regression 後集中
執行一次。高風險資料、同步、Service Worker 或 iOS 特有變更仍須即時提高
驗證層級。

## V1.1 Milestone 1 — Today／Work-Time／QA Follow-up

- `npm run test:today`：49/49，涵蓋 stale session 修正、正常／無休息／跨午夜、
  break validation、不完整時間、舊小數工時轉換、整數分鐘、自然語言格式、
  zero-hour hourly rate、Today 同列明細、reduced-motion 捲動、未填工時提醒、
  三個獨立收合區塊、工時模式確認、9 小時 10 分＝550 分鐘、續跑休息累加、
  支出防重複與 transactional persistence、天氣權限／映射／手動覆蓋及 CSV。
- `npm test`：171/171；Calendar、Reports、AI 與 integration regression 全部
  保持通過。
- 共用時薪界線：0～9 分鐘不計算；10 分鐘且時薪不高於 NT$2,000 可計算；
  超過 NT$2,000 標記異常，不參與 AI 正常洞察、百分比或排班建議。
- 真實瀏覽器隔離 origin：
  - start → pause → resume → end 狀態與主要操作正確。
  - 工時模式一次只顯示一種；雙向切換均先確認，manual 模式的「再跑一段」
    會提示先切換。
  - clock 模式「再跑一段」保留原始開始時間、清空結束時間並把收工空檔加入
    休息；不建立第二筆日期紀錄。
  - 「新增支出」與「其他資料」獨立收合；快捷／完整類別、三種支出方式、
    付款日期、備註與獨立儲存流程正常。
  - 手動修改 10:00–18:08 後立即顯示 8 小時 8 分，重開仍保留。
  - Calendar 與 Reports 對同一筆紀錄皆顯示 8 小時 8 分。
  - 320、375、390、393、430px：
    `scrollWidth === clientWidth`；time input、休息、小時與分鐘欄位均位於
    父容器內。
  - 有收入無工時時，「補上工時」保留表單並捲動但不彈鍵盤；「稍後再補」
    可儲存，AI 顯示未計算原因而非極端時薪。
  - 天氣首次展開只顯示隱私說明；未同意不呼叫定位，手動選擇可獨立保存。
    自動定位成功、iOS 權限拒絕及 installed-PWA 權限行為留給最終一次真機 QA。
  - Console：0 error／0 warning。
- App Shell：`driver-pay-pro-v16`；Manifest 與 localStorage key
  `driverPayApp.v2` 保持原契約。
- Final follow-up 必須建立新的公開 Preview，並在未登入 iPhone Safari 直開
  驗證後才交付本 Milestone 唯一一次最終 Human QA；舊 Preview 不重用。
- 尚待：Product Owner 於 iPhone Safari／installed PWA 驗證 native picker、
  定位權限、鍵盤、safe area 與離線更新的最終一次 Human QA。

## Local-first V1 Release Candidate

Date: 2026-07-26

Status: L1, public L2 and Product Owner L3 passed; V1 UX Freeze active.

- Fixed fixture: `tests/fixtures/v1-regression.json`，覆蓋 45 個核准情境。
- `npm test`：120/120 passed。
- `npm run test:calendar`：38/38 passed。
- `npm run test:reports`：44/44 passed。
- `npm run test:ai`：5/5 passed。
- `npm run test:driver`：5/5 passed。
- `npm run test:integration`：16/16 passed。
- lint：0 errors／10 existing unused-code warnings。
- `npm ci`：Passed；`npm audit`：0 vulnerabilities。
- `npm run release:check`：Passed；inline JavaScript、Service Worker syntax、
  Manifest、static Production validation 與 `git diff --check` 全部通過。
- AI／Reports shared analytics、AI read-only／exact-date deep link、Driver goal
  persistence／rollback、single committed-record refresh、five-tab navigation、
  corrupt-data safety、offline App Shell、Accessibility／responsive contracts
  passed。
- Service Worker candidate：`driver-pay-pro-v13`。
- Public L2 QA：
  `https://mystery-kijiji-publicity-tech.trycloudflare.com`，未登入 Safari 可直接
  開啟，沒有第三方登入或警告頁。
- L2 browser：Today、Calendar、Reports 三個 tabs、AI 三區、Driver、跨頁
  deep link、Driver 即時狀態與 390px `scrollWidth === clientWidth` 通過；
  320／375／393／430px responsive regression contracts 通過。
- Safari Console：0 error／0 warning；Manifest 與 Service Worker v13 可由
  同源直接取得。
- Offline App Shell：停止本機來源、由 Cloudflare 收到 502 時，Safari
  navigation 會回退至已快取的 `index.html`；恢復來源後重新載入正常。
- QA 後 `driverPayApp.v2` 沒有測試紀錄，每日目標維持未設定。
- `driverPayApp.v2`、WorkRecord schema、Supabase 與 Production data 未變。
- TypeScript：Deferred／Not available；目前靜態 PWA 沒有 TypeScript pipeline。
- L3：Product Owner 於 2026-07-26 回覆
  `Driver Pay Pro V1 L3 全部通過`；iPhone Safari、installed PWA、Offline、
  VoiceOver、safe area、responsive、跨頁資料一致與無 High Priority issue
  全部通過。
- Driver Pay Pro Local-first V1 UX Freeze 已生效。

## Foundation Cleanup Validation

Date: 2026-07-26

Status: L1 and L2 passed; no L3 required by approved PRD.

- `npm run lint`：passed，0 errors／10 existing unused-code warnings。
- `npm test`：94/94 passed。
- `npm run test:reports`：44/44 passed。
- `npm run test:calendar`：38/38 passed。
- `npm run check:inline`：1 inline JavaScript block passed。
- `npm run check:sw`：passed。
- `npm run check:manifest`：2 icons and required PWA metadata passed。
- `npm run validate:production`／`npm run build`：HTML、assets、navigation、
  App Shell、fallback、storage key、forbidden URL／secret checks passed。
- `npm run release:check`：全部 gate 依序 passed；任一步失敗會非零退出。
- L2 browser：Today、Calendar、Reports 三個 Tabs、showcase、offline App Shell
  passed；online Console 0 error／warning。
- 390px Chrome：Today、Calendar、Reports weekly／monthly／platform 與 showcase
  全部 `scrollWidth === clientWidth === 390`。
- `driverPayApp.v2`、schema 與 product files 不變；Service Worker 維持 v12。

## Reports Final Regression Matrix

Date: 2026-07-26

Status: L1, L2 and L3 passed; Reports UX Freeze Version 1 active.

- Fixed fixture: `tests/fixtures/reports-final-regression.json`，覆蓋 28 個核准情境。
- Automated suite: `tests/reports-final-regression.test.js` 與全部既有
  `tests/*.test.js`。
- Result: 88/88 Node tests passed；Reports targeted tests 在
  `TZ=Asia/Taipei` 與 `TZ=UTC` 各 38/38 passed。
- Weekly: Monday-first 七天、canonical KPI、期間平均時薪、比較、正負跨越、
  七點趨勢與重要日期 passed。
- Monthly: 曆月、跨月週 clipping、跨年週、閏年、4–6 週趨勢與重要日期 passed。
- Platform: aliases、unknown、tips、unattributed、inconsistent、invalid、
  equal-order、large value、share 及來源不變 passed。
- Drill-down／context／refresh: exact date、no auto-editor、session-only return、
  Calendar create/delete refresh、Today notification 與 single-frame refresh passed。
- Error／Offline／Recovery: corrupt／last-valid／retry／read-only contracts、
  Offline presentation 與 Service Worker App Shell passed；Product Owner 已
  完成真機飛航模式與 installed-PWA relaunch。
- Accessibility／Responsive: tabs、ARIA、visible values、44px、reduced-motion
  contracts passed；320、375、390、393、430、768、1024px 均無 document-level
  horizontal overflow，Reports tabs 單行。
- L2 Preview Smoke: Weekly、Monthly、Platform、平台週／月、Calendar mutation
  refresh、important-date drill-down、return context、390px 與 Console passed。
- TypeScript：Not available；ESLint 與 static Production build：Passed。
- L3 清單：`docs/REPORTS_HUMAN_QA.md`；iPhone Safari、installed PWA、
  Offline、VoiceOver、Reduced Motion、safe area、responsive 與無 High Priority
  issue 全部由 Product Owner 確認通過。
- Reports Feature Freeze Checklist 14/14 Passed。
- Reports UX Freeze Version 1 已於 2026-07-26 正式生效。

## Reports Sprint 5B2 Platform and Drill-Down Validation

Date: 2026-07-26

- `tests/reports-platform.test.js` 驗證平台週／月 session control、收入貢獻語意、
  distinct data states、Calendar exact-date drill-down、return context、
  committed-record refresh、read-only、Accessibility、responsive 與 PWA v12。
- `tests/reports-core.test.js` 驗證 alias normalization、未知平台 fallback、小費
  排除、同額排序、負值／無效值與來源資料不變。
- Result: 全部 Node tests 79/79 passed；Inline JavaScript 與
  `git diff --check` passed。
- Browser: 週／月切換、`#calendar/2026-07-24` exact-date、無自動 Editor、
  返回週報／scroll／focus、Console 0 error／warning passed。
- Responsive: 320、375、390、393、430、768、1024px 均為
  `scrollWidth === clientWidth`；重要日期與 Reports tabs 至少 44px。
- TypeScript、ESLint、Production build：Not available。
- L2 Preview Smoke：平台頁、本週／本月、排行／占比、正確用語、exact-date
  drill-down、return context、mutation refresh 與手機無阻擋性錯誤 passed。
- 本 Sprint 依核准 PRD 不執行完整 L3；實體 iPhone Safari、installed PWA、
  VoiceOver、offline relaunch 與 safe area 集中於 Reports Final Regression
  後的 Module Human QA。

## Reports Sprint 5A Specification Validation

Date: 2026-07-26

- `tests/reports-spec.test.js` 驗證 `docs/REPORTS_SPEC.md` 的 30 個正式章節。
- 契約涵蓋固定 tabs、session-only state、Monday-first Taipei periods、canonical
  KPI、comparison、weekly/monthly trend、platform semantics、Calendar drill-down、
  data safety、35 個 edge cases 與 20 題 Current-State Audit。
- 同步驗證 `AGENTS.md` Reports 永久規則、`PRODUCT_SPEC.md` owner contract 與
  `FEATURE_FREEZE_CHECKLIST.md`。
- Sprint 5A 不改正式 UI；iPhone Safari／installed PWA 視覺驗收不適用，
  並不得沿用 Calendar Human QA 宣稱 Reports UI 已通過。
- TypeScript、ESLint、Production build：Not available。
- Result: 全部 Node tests 58/58 passed；Reports／Reporting／Calendar regression
  targeted tests 21/21 passed；`TZ=UTC` 與 `TZ=Asia/Taipei` 子集各 14/14 passed。
- Inline JavaScript、Service Worker syntax、Manifest JSON、App Shell 與
  `git diff --check`：passed。

### Reports Core Implementation Future Acceptance

- [ ] Weekly：完整台北星期一至星期日、canonical KPIs、前週比較與七日淨收入趨勢。
- [ ] Monthly：完整台北曆月、canonical KPIs、前月比較與 Monday-first 週趨勢。
- [ ] Platform：週／月期間、收入總額、排行、占比與安全前期比較，不推論效率。
- [ ] Comparison：無資料、前期零值、負值與正負跨越不顯示誤導百分比。
- [ ] Trend：無紀錄、零、負值分開，具 visible values 與文字替代。
- [ ] Deep link：開啟 Calendar exact date，返回時保留同 session Reports context。
- [ ] Accessibility：tabs、44px targets、focus、live region、chart alternative 與 reduced motion。
- [ ] Responsive：375、390、393、430px 無 document-level horizontal overflow。
- [ ] Offline：本機有效資料可讀，損壞資料與 last-valid fallback 有明確狀態。
- [ ] Cross-page consistency：Today、Calendar、Reports、AI 共用 fixture 產生相同 canonical values。

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
- [ ] `npm run validate:production`／`npm run build`。
- [ ] TypeScript（目前無 TypeScript，標示 Not available）。
- [ ] `npm run lint`。
- [ ] `npm run release:check`。
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
