# Driver Pay Pro 開發交接摘要

更新日期：2026-07-26
專案位置：Git repository 根目錄
GitHub：`superaha-boop/driver-pay-pro`

---

## Reports Sprint 5A — Specification and Current-State Audit

### 分支與範圍

- 工作分支：`codex/reports-specification-20260726`。
- Base：`2c8b30fb588e2a262a69b24e82f548a3b253d639`。
- 本 Sprint 只建立正式 Reports 規格、現況稽核、永久文件與規格契約測試。
- 明確未修改 `index.html`、正式 CSS、Reports renderer、Calendar、`sw.js`、Manifest、資料、localStorage schema、main 或 Production。

### 正式規格

- 新增 `docs/REPORTS_SPEC.md` Version 1.0，成為下一個 Reports Core Implementation 的唯一主要實作規格。
- 固定 `週報｜月報｜平台`，新 session 預設週報；所有 Reports navigation state 維持 session-only。
- 週報採台北星期一至星期日，月報採台北曆月；支援前一期間、下一期間與返回本週／本月。
- 週／月共用 canonical KPI，平均時薪為期間淨收入除以期間有效工時。
- 週趨勢採七個每日淨收入點；月趨勢採四至六個 Monday-first 週彙總。
- 平台只分析收入貢獻；小費不歸入平台，也不推論效率或最佳平台。
- 重要日期連到 Calendar 精確日期，Reports 本身保持唯讀並在同 session 保留返回 context。

### Current-State Audit 結論

- 現有週／月報已重用 `summarize()` 等 canonical calculations，但選期與 aggregation 仍寫在 renderers。
- 現有月趨勢是每日總收入，不是核准規格的淨收入；週報沒有趨勢或前期比較。
- 現有 `lastReportView`／`reportMonth` 是 durable settings，與新 session-only 契約不同；不在 Sprint 5A 刪除或 migration。
- 平台排行存在且命名正確，但 `每日平均` 缺乏可靠產品意義；歷史平台收入仍以顯示名稱為 key。
- Calendar exact-date API 存在，但 Reports 尚未提供 date drill-down 或返回 context。
- Reports 尚無獨立 Loading／Error／last-valid fallback UI，也沒有正式 tab/chart accessibility。
- 可直接重用的 Calendar 基礎包含 date-only utilities、Monday-first week、
  exact-date navigation、canonical calculations、work-day selector、verified
  persistence read path、金額格式與 Design System primitives。
- AI 仍有 `analysisEntryTotal()`、`analysisEntryExpenses()`、`analysisSummary()`
  與 platform aggregation 複本；這是 TD-006，Reports 不得依賴或再複製這套公式。

### 下一步

1. Sprint 5B1 — Weekly and Monthly Core。
2. Sprint 5B2 — Platform, Drill-Down, and Hardening。
3. 實作前再次核對 Git、PRD、`REPORTS_SPEC.md` 與 Product Owner 當次指令。

### Sprint 5A 驗證

- 全部 Node tests：58/58 passed。
- Reports／Reporting／Calendar regression targeted tests：21/21 passed。
- Reporting／Reports Spec 在 `TZ=UTC` 與 `TZ=Asia/Taipei`：各 14/14 passed。
- Inline JavaScript、Service Worker syntax、Manifest JSON、App Shell 與
  `git diff --check`：passed。
- 正式程式／CSS／PWA／Calendar diff：none。
- TypeScript、ESLint、Production build：Not available。

---

## Calendar Final Regression and UX Freeze — Version 1

### 分支與範圍

- Base branch：`codex/calendar-record-mutation-20260725`，base commit `f89f970888cd5b1d085da16a2914d8dfe059cb80`。
- 工作分支：`codex/calendar-final-regression-20260725`。
- 本 Sprint 只做 Calendar final regression、三項阻擋性修正、固定 fixture、文件與 UX Freeze；沒有新增功能或 redesign。
- 依本次 PRD：只 push 功能分支，不 merge `main`、不 Production deploy。

### Regression 結果

- 52/52 Node tests 通過，涵蓋 Product／Calendar／Ownership contract、read、
  navigate、create、edit、delete、persistence、rollback、report consistency、
  navigation、Design System、PWA 與 fixed regression fixture。
- 固定 fixture：無紀錄、正／零／負淨收入、有收入無工時、有工時無收入、
  多平台、支出、天氣與備註、跨午夜、超大金額及不完整舊資料。
- Today、Calendar、Reports 仍直接重用 `entryTotal()`、`entryExpenses()`、
  `entryNet()`、`workMetrics()`、`hourlyRate()` 與 `summarize()`。
- Product Owner 已確認 Sprint 4B 的 iPhone Safari、installed PWA、Preview 與
  Offline Human QA 通過；Final Regression 沒有改 UI、App Shell 或 Service Worker。

### Final Regression 修正

1. `persistStatePayload()` 在 clone／serialization 之前先保存主 key 與 last-valid
   快照；序列化、quota 或安全快照寫入失敗時，兩份原值都會回復，不再可能因
   early failure 誤刪 `driverPayApp.v2`。
2. 共用 Record Editor 關閉後不再嘗試聚焦已被 `renderCalendar()` 替換的舊
   button；改以穩定 selector 找回重新渲染後的新增／編輯按鈕，並以日期格為
   fallback。
3. Validation error 改為 assertive `role="alert"`，兩個共用 form 以
   `aria-describedby`／`aria-invalid` 關聯錯誤；非錯誤 SaveStatus 維持 polite。

### Calendar UX Freeze

Calendar UX Freeze — Version 1 已生效。凍結範圍：Header、Month Navigation、
Weekday Header、Month Grid、Today／Selected、Heatmap、Work Record Card、
Empty States、新增／編輯／刪除、手勢、Accessibility、Responsive 與
SaveStatus。後續只接受 Bug、Accessibility、Data Integrity 與重大使用障礙修正。

### 仍開放的技術債

- 真正跨裝置同步、server backup、Supabase conflict resolution。
- WorkRecord record metadata 與多段工作明細模型。
- AI 重複彙總。
- TypeScript、lint 與 production build pipeline。
- Design System showcase automation。
- iPhone time input 與 PWA 實機 QA 仍需在每次相關 release 持續執行。
- 非 Calendar 頁面的損壞資料錯誤呈現與 legacy Today write rollback。

### Reports 可重用的穩定基礎

- Date utilities、Monday-first week logic、date-key handling。
- Canonical income／expense／net／work time／hourly rate calculations。
- Monthly aggregation、work-day selector、platform totals。
- Persistence adapter read API；record-change notification 尚未存在，已列入
  Reports Sprint 5B2 與 TD-024。
- Amount formatting、Design System primitives、Empty／Error／Loading states。

下一步是 Reports Sprint 5B1 — Weekly and Monthly Core；不得在該 Sprint 回頭
重設 Calendar 或複製計算公式，必須遵循 `docs/REPORTS_SPEC.md`。

---

## Calendar Sprint 4B — Record Mutation and Hardening

### 分支與範圍

- Base：`codex/calendar-visual-polish-20260725`，exact base commit `574536f7d632f71d2ffe91c75fb61cecbcea8962`。
- 工作分支：`codex/calendar-record-mutation-20260725`。
- 本 Sprint 只實作 Calendar 過去紀錄新增、編輯、刪除與本機儲存 hardening；不修改 Calendar Month Grid／Heat／導覽、Today 即時工作控制、Reports、AI、Driver、資料公式或 schema。
- 依 PRD 不 merge `main`、不 Production deploy。

### 已完成

- 過去空日期顯示「新增紀錄」，已有紀錄顯示直接可見的「編輯」；今天仍導回 Today，未來日期沒有寫入入口。
- Calendar 以原本的 `#entryForm`、`#detailForm`、收入欄位與支出元件作為唯一 Record Editor，開啟時將同一組 DOM 移入全螢幕 dialog，關閉後移回 Today；沒有第二套欄位 ID、資料模型或計算公式。
- Calendar 編輯使用 UI draft；收入、班別、天氣、支出與其他欄位在按「完成」前不寫入 durable state。
- 離開 dirty editor 會顯示日期明確的放棄確認；刪除是次級操作，確認內容包含日期及收入／支出／工時影響範圍。
- 新增日期、未來日期、數值範圍、開始／結束配對、休息時間與最小內容驗證；歷史時間欄位被校正時移除該紀錄不再可信的 aggregate `workSession`，避免覆蓋已編輯時間。
- Calendar 支出可加入草稿，也可移除既有類別；歷史平台收入統一直接校正當日總額，不建立第二套逐筆歷史編輯流程。
- `persistStatePayload()` 會建立記憶體快照、寫入 `driverPayApp.v2`、讀回驗證、保存 `driverPayApp.v2.lastValid`；失敗時回復原始值，Calendar in-memory state 只在成功後替換。
- `loadState()` 在主 key 損壞時保留原始字串，並優先使用最近一次有效本機快照；若無安全快照，Calendar 顯示中性錯誤與重試。
- Service Worker cache 更新為 `driver-pay-pro-v10`。

### 驗證摘要

- Node 自動測試：45/45 通過。
- Inline JavaScript 語法、`git diff --check` 通過；瀏覽器 Console 無 error／warning。
- 隔離 localStorage 來源完成新增 $2,300、放棄 $2,500 草稿、正式更新 $2,500、刪除回空狀態；未來日期沒有新增入口。
- 390／393／430px 的 `scrollWidth === clientWidth`；390px 全螢幕編輯器、共用收入欄位與兩個 time input 均在 viewport 內。
- `driverPayApp.v2` key 與 WorkRecord schema 不變；新增的是獨立的 last-valid safety key，沒有 Supabase、後端或跨裝置同步。
- TypeScript、ESLint、production build：專案未配置，Not available。

### Open：Human QA 與既有技術債

1. 實體 iPhone Safari 新增／編輯／刪除與鍵盤 QA。
2. installed PWA 的 safe area、重開保留與 `driver-pay-pro-v10` 更新 QA。
3. VoiceOver dialog、日期與 SaveStatus 朗讀。
4. 真實 iOS time picker 與原生 date／time intrinsic width。
5. WorkRecord `createdAt`／`updatedAt` 仍未加入；需要 migration／sync 決策，不可在目前 schema 中猜測。
6. Today 的 legacy 非交易式寫入與可選非今日日期仍是獨立技術債，未在本 Sprint 擴大處理。

---

## Calendar Sprint 4A.5 — Visual Polish

### 分支與範圍

- Base：`codex/calendar-read-navigate-20260725`，exact base commit `09cde36eb61e85d8e78b1246b1096a1428d212b0`。
- 工作分支：`codex/calendar-visual-polish-20260725`。
- 本 Sprint 僅做 Calendar presentation 微調；沒有 merge、deploy、資料寫入、功能新增或互動規則變更。

### 修改前後差異

- Calendar 頁內 top padding 由 `--spacing-2` 改為 `--spacing-1`，主要區塊 gap 由 `--spacing-5` 改為 `--spacing-3`；390px 的 Month Grid 提前約 16px、Work Record Card 提前約 24px。
- 月份標題仍是操作中心；今天按鈕保持 Ghost／Text Button，新增 56px 最小寬度、`--spacing-3` 水平 padding、`--radius-sm` 與柔和 hover／pressed surface，所有導覽控制仍至少 44px 高。
- 星期標題維持 secondary color 與七欄，只提高字重並縮短多餘垂直空間。
- 日期格整體點擊高度不變；日期與收入 gap 改為 1px，收入仍 nowrap、tabular-nums，金額縮寫規則不變。
- Heat Level 1–4 改用較容易區分但仍柔和的 `--color-calendar-heat-1` 至 `--color-calendar-heat-4`；演算法、fallback、同值 Level 2、Selected 與 Today 規則未變。
- Work Record Card 採方案 C：相同完整日期／星期與相同 ARIA label，日期使用 primary semibold，星期使用 secondary medium。
- Primary metrics 使用 `--font-size-section-title`；Secondary metrics 使用 18px semibold，兩組以 `--border-subtle` 與 `--spacing-3` 分隔；卡片資料、順序與格式化未變。
- Service Worker cache 由 `driver-pay-pro-v8` 更新為 `driver-pay-pro-v9`。

### 驗證摘要

- Node 自動測試：41/41 通過。
- Inline JavaScript、Service Worker、manifest、App Shell、`git diff --check` 通過；Browser Console 無 error／warning。
- 320、375、390、393、430、768、1024px 無水平 overflow；七欄、金額 nowrap、Selected border、44px touch target、窄螢幕卡片標題與 Desktop bounded width 均通過。
- 2026 年 8 月六週月份於 390／430px 均為 42 格、每列 7 欄，Calendar／Card gap 12px。
- `driverPayApp.v2`、WorkRecord schema、canonical calculations、Calendar state、日期／月份／手勢／鍵盤／ARIA、read-only 與 heat algorithm 均未變。
- TypeScript、ESLint、production build：專案未配置，Not available。

### Open：Human QA、Sprint 4B 與既有技術債

以下項目均未在 Sprint 4A.5 完成，不得標記 Done：

1. 實體 iPhone Safari QA。
2. installed PWA QA。
3. VoiceOver 日期朗讀。
4. iOS 返回手勢。
5. safe area 與 Bottom Navigation。
6. PWA 關閉重開回到今天。
7. Service Worker 更新行為。
8. Month switch 保留 `selectedDate` UX。
9. Sprint 4B 共用 Record Editor。
10. 過去紀錄補登。
11. 歷史紀錄編輯。
12. 刪除確認與 rollback。
13. SaveStatus。
14. Offline／Error hardening。
15. Record-level `createdAt`／`updatedAt` 評估。
16. localStorage 損壞錯誤狀態。
17. AI 重複彙總風險。
18. TypeScript 評估。
19. lint pipeline。
20. production build pipeline。
21. Design System showcase route。
22. 真實 iPhone Time Input 驗證。
23. 每個主要功能後的 UX Review Sprint。

### 下一步

先完成 Human QA Gate；通過後才進入 Sprint 4B — Record Mutation and Hardening。Sprint 4B 前置條件仍是單一 Record Editor、past-only mutation、transaction rollback、SaveStatus、離線／錯誤保護及資料完整性測試。

---

## Calendar Sprint 4A — Read and Navigate Implementation

### 本次分支與範圍

- Base：`codex/calendar-specification-20260725`，包含 Sprint 2／3 ancestry。
- 工作分支：`codex/calendar-read-navigate-20260725`。
- 純函式第一階段 commit：`337ac2c feat: add calendar date utilities and tests`。
- Calendar UI／互動／回歸 commit：`f701af3 feat: implement calendar read and navigation`。
- 本 Sprint 只實作 Calendar 唯讀瀏覽與導覽；沒有啟用新增、編輯、刪除或 Record Editor。
- 依本次 PRD 只 push 功能分支，不 merge、不 deploy。

### 已完成

- 以 Monday-first Month Grid 取代 legacy 月份下拉與每日清單，支援 5／6 列、相鄰月份日期、Today、Selected、Focus 與 Future 狀態。
- 新增 session-only `CalendarState`；新 session 使用台北今天，同 session 返回保留 `selectedDate`／`displayedMonth`，月份瀏覽不改 selected date。
- 新增 `#calendar/YYYY-MM-DD` deep link 與 `window.openCalendar({ selectedDate, source })`；無效日期安全回到今天且不建立資料。
- 新增日期／月份純函式、緊湊淨收入格式、四級語意 heat、每月 record map 與月份摘要。
- 新增唯讀標準工作紀錄卡片，重用 `entryTotal()`、`entryExpenses()`、`entryNet()`、`workMetrics()`、`hourlyRate()`、`platformNetAmount()` 與 `summarize()`。
- 日期格與卡片支援 Arrow／Enter／Space、roving focus、ARIA、polite live region、月份／日期水平手勢、iOS edge guard 與 reduced motion。
- 今天空狀態只提供回 Today；過去與未來空狀態不提供寫入入口。Calendar 沒有接回 legacy `editEntry()`／`deleteEntry()`。
- Calendar 讀取錯誤提供提示與重試，不清除損壞的原始 localStorage；資料品質問題使用非阻斷式提示。
- Design System 新增 Calendar heat semantic tokens；Service Worker cache 更新為 `driver-pay-pro-v8`。

### 資料與相容性

- `driverPayApp.v2` key、WorkRecord schema、收入／支出／工時計算與 durable settings 均未變更。
- `settings.calendarMonth` 保留舊資料相容性，但新 Calendar 不讀寫它。
- Calendar 的格式化、heat、selected/focus/gesture/transition 全為顯示或 session state，不回寫 record。
- 專案仍只有瀏覽器 localStorage，沒有 Supabase、後端或跨裝置同步。

### 驗證摘要

- Node 自動測試：40/40 通過。
- Inline JavaScript、Service Worker 語法、manifest JSON、App Shell、`git diff --check` 通過。
- 瀏覽器驗證涵蓋 deep link、同 session 返回、reload 重設今天、月份／日期導覽、鍵盤、未來／過去空狀態、四級 heat、canonical card／summary、Reports 回歸及 Console。
- 320、375、390、393、430、768、1024px 均無水平 overflow；Bottom Navigation 未遮住內容；既有 time input 右側框線未回歸。
- TypeScript、ESLint、production build：專案未配置，Not available。
- 實體 iPhone Safari 與 installed PWA 尚需 Product Owner 人工驗收。

### Needs UX Validation

- 使用月份箭頭或月份 swipe 時保留原 `selectedDate`；若該日不在目前月份，卡片仍顯示原日期並提示「所選日期不在目前月份」。此行為遵循 D-022／D-023，但需在真機確認是否符合直覺。
- 真機需特別驗證 grid swipe、card day swipe、iOS 系統返回手勢、VoiceOver、safe area、PWA 重新開啟與 Service Worker 更新。

### 下一步

Calendar Sprint 4B — Record Mutation and Hardening：建立單一 Record Editor、past-only backfill/edit/delete、transaction rollback、SaveStatus、dirty state、離線寫入與完整實機回歸。不得在 4A 分支順手啟用 legacy 寫入流程。

---

## Calendar Interaction and Implementation Specification Sprint

### 本次分支與範圍

- Base branch：`codex/product-specification-20260725`
- 工作分支：`codex/calendar-specification-20260725`
- Sprint 2 commit：`cc6b678`；已確認 ancestry 包含 Design System Foundation `bf29913`。
- 本 Sprint 只建立 Calendar 互動／實作規格與程式現況稽核。
- 沒有修改 Calendar UI、任何 production code、資料模型、localStorage、PWA、Bottom Navigation 或計算。
- 依 PRD 只推送工作分支，不 merge、不 deploy。

### 已完成規格

- 新增 `docs/CALENDAR_SPEC.md`，涵蓋 Purpose、User Goals、Scope、資訊架構、State Model、月份／日期互動、日期格狀態矩陣、收入熱度、Today／Selected、標準工作紀錄卡片、空狀態、未來日期、CRUD、SaveStatus、手勢、動畫、Accessibility、Responsive、Data Contract、計算、效能、錯誤、Offline、30 項 edge cases、Implementation Architecture 與 Acceptance Criteria。
- Calendar 一般新 session 選今天，同 session 保留 selectedDate／displayedMonth；月份瀏覽不改 selectedDate，也不選最近工作日。
- 熱度使用四級 positive-net quantile；少於四筆使用相對最大值 fallback；零與負值不使用正收入熱度。
- 今天空狀態連到 Today；過去空日期可補登；未來日期可查看但不可新增。
- 工作紀錄卡片第一版使用標準模式，不用平台 Logo，全部數值引用 canonical calculations。
- 正式決策新增 D-022；永久規則、專案背景、Product Spec、Testing、Technical Debt 與 Changelog 已同步。

### Current Calendar Audit

- Calendar 全部位於 `index.html`，目前是 `monthFilter`＋`entriesTable` 月份清單，不是真正 Month Grid。
- Calendar 與 Reports 已分離；Reports 的週／月／平台程式不得搬入 Calendar。
- 目前沒有 Calendar selectedDate、income heat、Work Record Card 或日期 deep link；只有持久化 `settings.calendarMonth`。
- `dateOnlyParts()`／`addLocalDays()` 可作為 date-only 基礎；新 month generator 仍需月末、閏年、六列與 timezone 測試。
- `entryTotal()`、`entryExpenses()`、`entryNet()`、`workMetrics()`、`hourlyRate()`、`summarize()` 可直接重用。
- AI 仍有重複的收入／支出／summary 計算；Calendar 不得建立第三套。
- 現有 `#detailForm` 的欄位與 handlers 可部分重用，但它是 DOM-global、Today-bound，`editEntry()` 會跳回 Today；下一輪需先抽出單一 Editor controller。
- WorkRecord 沒有 record-level `createdAt`／`updatedAt`；Calendar 不得假造。
- `loadState()` parse 失敗時保留原始 localStorage，但目前回傳預設空狀態；detail save／delete 在 `saveState()` 失敗時沒有 transactional rollback。
- 現有測試只涵蓋 Calendar／Reports 分離、月份狀態、legacy actions 與週期日期；Month Grid、Selected、Heat、Card、Gesture、Future、Editor 和 Accessibility 尚無測試。

### Data Contract 與儲存

- 維持既有 WorkRecord：`id`、`date`、shift/time/break/manualHours、tips/orders/km、weather/note、`incomes`、`expenses`、optional `workSession`／`incomeRecords`。
- Derived values 只引用正式函式；compact amount、heat、localized date 與 CalendarState 全部是 display/UI state，不寫回 record。
- `driverPayApp.v2` 與資料 schema 不變；目前只有 localStorage，無 Supabase、server queue、跨裝置同步或 conflict resolution。
- 現有 grouped detail form 保留單一明確提交；平台收入、班別與天氣沿用現有即時儲存；不新增另一個 Calendar Save。

### 建議 Implementation 拆分

1. **Sprint A — Read and Navigate**：date utilities、month grid、state、navigation、cells／heat、read-only card、summary、gestures、Accessibility 與 responsive。
2. **Sprint B — Record Mutation and Hardening**：單一 Record Editor、backfill/edit/delete、transaction rollback、SaveStatus、offline/error、完整回歸與實機 QA。

拆為兩輪是因為目前沒有 Grid／selection 測試，Editor 又緊密綁定 Today；不應在同一輪同時承擔全新視覺與資料寫入風險。

### 驗證

- Calendar Specification contract：32 個必要章節、10 個核心 state、完整日期格矩陣與 30 項 edge cases 通過。
- Product Ownership Matrix：每列恰好一個 Primary。
- 既有 Node 自動測試：21/21 通過。
- Inline JavaScript、Service Worker 語法與 manifest JSON 解析通過。
- `git diff --check` 通過；產品程式、styles、tests、assets、manifest 與 Service Worker 都沒有差異。
- TypeScript、lint、production build：專案未配置，Not available。
- localStorage key 仍為 `driverPayApp.v2`；cache 仍為 `driver-pay-pro-v07-design-system-foundation`。

### 下一步

**Calendar Implementation — Sprint A: Read and Navigate**

---

## Product Specification and Information Architecture Sprint

### 本次分支與範圍

- 分支：`codex/product-specification-20260725`
- 本 Sprint 僅建立產品規格、資訊架構、Current State Audit、技術債與測試契約。
- 依本次 PRD，不修改 `index.html`、`design-system.html`、`sw.js`、manifest、資料模型、localStorage、導航、UI 或業務邏輯。
- 本次只推送功能分支，不合併 `main`、不部署 Production。

### 已完成

- 新增 `docs/PRODUCT_SPEC.md`，正式定義 Product Vision、Persona、Today／Calendar／Reports／AI／Driver 責任、Feature Ownership Matrix、跨頁紀錄契約、Single Source of Truth、Single Component Principle、互動原則、產品術語、Calendar 決策與 V1／V1.5／V2 Roadmap。
- 新增 `docs/TECH_DEBT.md`，記錄工具鏈、計算重複、legacy primitives、iPhone／PWA QA、time input、Calendar owner、未來日期、收入術語與 localStorage 限制。
- `AGENTS.md` 新增永久 Product Architecture Execution Rules。
- `PROJECT_CONTEXT.md`、`DECISIONS.md`、`docs/DECISION_LOG.md`、`TESTING.md` 與 `docs/CHANGELOG.md` 已同步。
- 正式決策新增 D-021。

### Current State Audit 結論

- 已確認 Bottom Navigation 為 Today、Calendar、Reports、AI、Driver；Calendar 與 Reports 已分離；Reports 與 AI 目前唯讀。
- 已確認 `workMetrics()` 與 `hourlyRate()` 是跨頁共用工時與時薪來源。
- 已確認 AI 另有 `analysisPlatformIncome()`、`analysisEntryTotal()`、`analysisEntryExpenses()` 與 `analysisSummary()`，存在與 canonical income／expense summary 分歧的風險。
- 已確認 Calendar 編輯歷史紀錄時會由 `editEntry()` 導回 Today 表單。
- 已確認 Today 日期欄位沒有 future `max`，submit path 也沒有未來日期 guard；目前可透過 Today 保存非今日日期。
- 已確認目前 Calendar 仍是月份篩選與每日清單，尚無日期格、session selected date、日期 deep link 或工作紀錄卡片。
- 上述差距本 Sprint 只記錄，未修改 production code 或使用者資料。

### 驗證與相容性

- 既有 Node 自動測試 21/21 通過。
- Inline JavaScript 與 Service Worker 語法檢查通過；`manifest.webmanifest` JSON 解析通過。
- `git diff --check` 通過；變更範圍僅限本 Sprint 核准文件。
- 專案仍沒有 TypeScript、ESLint 或 build pipeline，對應結果為 Not available。
- `driverPayApp.v2`、資料結構與 PWA cache version 均不得變更。
- 真實 iPhone Safari 與 installed PWA 不受文件變更影響，但正式裝置 QA 仍不能由桌面測試取代。

### 下一步

**Calendar Interaction and Implementation Specification**

下一個 Sprint 必須先定義 selected-date session state、日期 deep link、Today／Calendar 編輯邊界、未來日期 validation、Work Record Card interaction 與完整驗收，再開始 Calendar 程式實作。

---

## Design System Foundation Sprint

### 本次分支與範圍

- 分支：`codex/design-system-foundation-20260725`
- 本 Sprint 只建立全 App 共用視覺 foundation、開發展示頁、測試與永久文件。
- 依本次 PRD 明確要求，不合併 `main`、不部署 Production、不改導航、資料結構或業務邏輯。

### 已完成

- 新增 `styles/design-system.css`，統一 spacing、radius、typography、語意色彩、shadows、borders、motion、touch target、safe area 與 layout tokens。
- 新增 Button、IconButton、Card、SectionHeader、EmptyState、Skeleton、SaveStatus、PageContainer、Surface、Divider 及基礎表單／time input primitives。
- `index.html` 只將既有 legacy variables 對應至新 token，沒有遷移或重做首頁、月曆、報表、AI 或 Driver。
- `sw.js` App Shell 加入 Design System 樣式，cache 更新為 `driver-pay-pro-v07-design-system-foundation`。
- 新增獨立 `design-system.html`；直接開啟 `/design-system.html` 使用，不在 Bottom Navigation、不在 PWA App Shell，並設定 `noindex, nofollow`。
- 新增 `docs/DESIGN_SYSTEM.md`、`TESTING.md` 與 `tests/design-system.test.js`。

### 相容性與尚未遷移

- 專案沒有 TypeScript、Tailwind、React、Storybook、ESLint 或 build pipeline，因此本次沒有新增 typed component framework 或任何 dependency。
- 共用 API 使用語意 HTML、`.ds-*` classes、原生 `disabled` 與 ARIA 狀態；未來若建立 TypeScript 元件層必須向下相容。
- 現有頁面仍保留大量歷史 CSS，應由後續核准 Sprint 逐區遷移，不可一次性全站重寫。
- 現有 `.work-time-control` 已具備安全 wrapper；本次新增 `.ds-time-control` 並以自動測試固定寬度、box-sizing、margin 與 Safari appearance 契約。沒有改工時 UI 或計算。
- 真實 iPhone Safari 與 installed PWA 仍需 Product Owner 實機驗收。

### 驗證結果

- Node 自動測試 21/21 通過。
- Inline JavaScript 與 Service Worker 語法檢查通過。
- Design showcase 與主程式在 375、390、393、430、1024px 均無水平 overflow。
- 18 個 showcase 互動元件均達 44×44px 最小觸控範圍。
- Showcase 與首頁原生 time input 在所有測試寬度都完整限制於 wrapper；既有右側框線沒有回歸。
- 鍵盤 focus-visible 實測為 3px focus ring；disabled、loading、SaveStatus aria-live 與 no-navigation 契約通過。
- 瀏覽器 Console 無 error 或 warning。
- TypeScript、lint 與 production build：專案未配置對應工具，Not available。

### 下一步

Calendar Interaction and Implementation Specification。新的 Calendar UI 必須直接使用本 Design System，不建立第二套 tokens 或 primitives。

---

## 1. 目前整體狀態

Driver Pay Pro 目前是單頁式網頁 App，主要介面、樣式與邏輯集中在 `index.html`。首頁、平台收入、週報手機版、月份明細、目標進度條與規則式 AI 營運助理已有本機成果；平台輸入模式功能已建立獨立功能提交，Git 工作流程文件於本次 Sprint 更新。

目前首頁視為已完成並凍結。除非使用者明確提出新的首頁需求，後續不要順手調整首頁、平台收入輸入流程、工作計時或任何統計邏輯。本次資訊架構 Sprint 已將月曆、報表與底部導覽重新分工，功能提交已推送至工作分支；正式發布狀態仍以本次完成回報與即時 Vercel 檢查為準。

### Git 現況

- 目前分支：`codex/restructure-calendar-reports-nav-20260725`
- 上一次發布工作分支：`codex/add-brand-attribution-20260724`
- 本次作者資訊、About 精簡與工時／週期修正已合併至 `main`。
- 正式發布整合提交：`823bfdf merge: release latest Driver Pay Pro updates`
- Vercel Production Deployment：`dpl_Fgh8JyF9FQsB5k7nFb5Adr4zE44G`，狀態 `READY`，穩定網址 `https://driver-pay-app.vercel.app/`
- 本次 Main 整合提交：`ab7b2cb merge: sync latest Driver Pay Pro`
- 合併來源：`codex/home-restore-ui-20260717`
- 最新功能提交：`d58d0a1 fix: unify work time and weekly reporting`
- 錯誤舊圖示刪除提交：`5a3b2cd chore: remove obsolete app icon`
- 持續發布規則提交：`0e4f457 docs: enable verified production releases`
- Git 流程文件提交：`53aa540 docs: update sprint git workflow`
- 作者資訊與 About 基礎提交：`42f9f31 feat: add brand attribution and about page`
- `main` 已用標準 merge commit 保留雙方歷史；本次不需要 rebase、reset 或 force push。
- 本次工作分支已設定 upstream：`origin/codex/restructure-calendar-reports-nav-20260725`。
- 操作前仍應 Fetch 並確認遠端目前 Branch 是否出現其他提交，不沿用舊交接資訊推測同步狀態。
- `.backups/` 只留本機並由 `.gitignore` 排除；不要刪除或部署。
- Product Owner 已確認 `assets/driver-pay-icon-512.png` 是錯誤且不需要的舊圖，本次可安全刪除；目前 manifest、Service Worker、favicon 與 Apple Touch Icon 均未引用此檔案。
- Vercel 專案 `driver-pay-pro` 已連結 GitHub；推送 `main` 會自動建立 Production Deployment。
- 最新遠端與 Production 狀態仍應以 `git status -sb`、Vercel deployment commit SHA 及本次完成回報為準。

### 本次資訊架構 Sprint

- 功能提交：`877a4db feat: reorganize calendar reports and navigation`

- 底部導覽改為「今天｜月曆｜報表｜AI｜Driver」，圖示統一為 24px、2px stroke 的 Lucide inline SVG。
- 月曆只保留月份明細與每日歷史紀錄；週報、月報與平台分析移入固定主標題「報表」的三個內部分頁。
- 月曆與報表月份互相獨立；上述 durable `reportMonth`／`lastReportView` 是目前
  legacy 行為，正式新契約由 D-027 改為 Reports session-only。
- 每日歷史紀錄補齊總收入、平台收入、支出、淨收入與實際工時；編輯／刪除至少 44px，刪除仍有確認。
- 新增 hash 導覽與舊 `#week`、`#month`、`#platform`、`#analysis` 相容；瀏覽器返回可回到原本月曆或報表狀態。
- Service Worker cache 更新為 `driver-pay-pro-v06-calendar-report-navigation`。
- 沒有改變收入、支出、工時或報表計算公式；`driverPayApp.v2` key 不變，只在既有 `settings` 增加相容性的月曆／報表 UI 狀態。
- 自動測試 15/15 通過，並在 `Asia/Taipei` 與 `UTC` 各重跑一次；Inline JavaScript、Service Worker、manifest 與 `git diff --check` 通過。
- 375、390、393、430px 的頁面寬度均等於 viewport，五個導覽圖示為 24px、按鈕 56px、文字 14px 且不換行；1024px 桌面版仍顯示月份表格。
- 本機瀏覽器已驗證舊連結、返回、編輯、刪除確認、空白狀態、報表分頁記憶及月份獨立狀態；真實 iPhone Safari 與已安裝 PWA 仍需 Product Owner 實機驗收。

### 全域產品設計規範 Sprint

本 Sprint 只建立永久文件規範，沒有修改程式碼、UI、路由、資料、PWA 或資料庫，也不得合併至 `main` 或部署。

已完成：

- 建立 Driver Pay Pro 全域產品設計規範。
- 建立「工作紀錄卡片」顯示規則。
- 確認工作紀錄卡片採核心資訊雙欄、延伸資訊單欄的混合式布局。
- 確認精簡、標準、完整及自訂四種顯示模式。
- 將正式決策記錄於 `docs/DECISION_LOG.md` 的 D-019，並新增根目錄 `DECISIONS.md` 作為永久決策入口。

下一步：

- 等待正式 Calendar 實作規格。
- 設計並實作新的月曆頁。
- 月曆採 Apple Calendar 與收入熱度混合形式。
- 日期格顯示淨收入。
- 點日期後在月曆下方顯示工作紀錄卡片。
- 支援日期切換與月份切換。
- 實作前仍須依正式 Calendar Codex 規格執行，不得只依本節自行開始開發。

尚未實作：

- 月曆 UI。
- 月曆互動。
- 工作紀錄卡片設定頁。
- Supabase 設定同步。
- 拖曳排序。
- 日期左右滑動。
- 月份滑動。
- 收入熱度。

### 新 Git 工作流程

Sprint 完成且通過適用驗證後，Codex 可以直接：

1. 只 stage 本 Sprint 核准檔案。
2. 使用 `feat:`、`fix:`、`refactor:`、`docs:`、`style:`、`test:` 或 `chore:` 建立 Commit。
3. Push 到目前工作 Branch。
4. 更新本文件與必要開發文件。
5. 回報 Branch、Commit Hash、修改檔案與驗證結果。

自 2026-07-25 起，完成且通過適用驗證的 Sprint 預設會 Commit、Push 工作 Branch、以一般 Git 合併至 `main`、Push `main` 並確認 Vercel Production Deployment，不需逐次再次詢問。若當次使用者明確要求不部署、驗證失敗、遠端衝突無法安全判定或有資料遺失風險，必須停止發布並回報。Reset、Rebase、Force Push、Schema／Migration、刪除正式資料、架構修改與大規模 UI 重構仍須另行明確確認。

### 本機提交順序

由新到舊：

1. `4d4637b feat: add configurable platform input modes`
2. `07cafdf feat: sync current app and project documentation`
3. `cc42cda feat: optimize weekly report for mobile`
4. `2ee29d0 backup: preserve app before weekly report responsive update`
5. `d5ca72d style: finalize platform income visuals`
6. `3dd83a0 backup: preserve home before next adjustments`
7. `f8a4d2a fix: restore home dashboard income editing`
8. `7104f13 backup: preserve pre-home-restore UI`
9. `af9aae0 Initial Driver Pay Pro`

相關分支：

- `main`：已整合目前完成版本
- `codex/home-restore-ui-20260717`：本次整合來源，保留作為工作歷史
- `codex/backup-pre-home-restore-20260717`：首頁還原前的完整備份
- `backup-old-version`：較早的備份分支

---

## 2. 專案結構與資料安全

### 主要檔案

- `index.html`：主要 UI、CSS、JavaScript 與資料處理邏輯
- `manifest.webmanifest`：PWA manifest
- `sw.js`：Service Worker
- `assets/`：App 圖示及靜態資源

此專案目前沒有 `package.json`、TypeScript 設定、ESLint 設定或正式 build pipeline，因此無法執行傳統的 TypeScript、ESLint 與 npm build。現階段以 JavaScript 語法檢查、瀏覽器操作測試、Console、響應式尺寸及 Git diff 檢查作為驗證方式。

### 儲存方式

- App 資料保存在瀏覽器 `localStorage`。
- 核心 storage key：`driverPayApp.v2`
- 不可任意更名、清空或改變既有資料結構。
- 重新整理後資料會保留，但不同裝置、瀏覽器或網域不會自動同步。
- 目前沒有帳號系統、雲端同步或伺服器資料庫。
- CSV 匯出仍是重要的人工備份方式。
- 正式站更新時要留意 Service Worker 快取，避免使用者仍看到舊畫面。

---

## 3. 已完成修改

### A. 首頁儀表板完整還原

提交：`f8a4d2a`

已完成：

- 最上方綠色核心數據框維持首頁第一個主要區塊。
- 核心框顯示今日收入、今日實際工時與目前時薪。
- 今日工作狀態標題與狀態標籤放在同一行。
- 總經過時間、休息時間、實際工作時間直接持續顯示。
- 移除工作狀態內重複的收入與時薪。
- 保留開始、暫停、繼續、收工與再次開始功能。
- 開始工作不再受天氣是否選取限制。
- 天氣選項移到平台收入下方，可直接切換並自動儲存。
- 今日目標會隨收入立即更新。
- 更新今日紀錄的日期欄位裁切問題已修正。
- Yoxi 明細移到更新今日紀錄之後，歸類為次要資訊。

首頁目前固定順序：

1. 綠色核心數據大框
2. 今日工作狀態
3. 工作控制按鈕
4. 平台收入
5. 天氣
6. 今日目標
7. 更新今日紀錄
8. 其他次要功能

### B. 平台收入輸入流程與資料邏輯

- 基礎提交：`f8a4d2a`
- 可設定輸入模式：`4d4637b`

已完成：

- 所有平台同時顯示，一個平台一行。
- 輸入框本身可直接原位編輯。
- 已有金額時，點擊後會自動全選。
- 使用適合手機的數字鍵盤。
- Enter、鍵盤完成或失去焦點時自動儲存。
- 不顯示鉛筆圖示、額外完成按鈕或第二行輸入框。
- 輸入會過濾不合法字元，不接受負數，空白不會產生 `NaN`。
- Enter 與 blur 共用提交保護，避免重複儲存。
- 切換平台時不會帶入上一個平台的草稿。

平台輸入方式：

- 每個平台可獨立選擇「直接輸入總額」或「每筆收入累加」。
- 預設為 Uber、LINE GO、55688 與自訂平台直接輸入總額；Yoxi 每筆收入累加。
- 只有累加模式顯示右側加號；總額欄位在兩種模式下都可直接校正。
- 切換模式不會清除或重算既有當日收入。
- 累加成功後提供 5 秒最近一次復原，並綁定 platform ID、日期、加入前／後總額及紀錄 ID。
- 自訂平台建立時可選輸入模式，設定使用穩定 platform ID。
- 新增設定保存在既有 `driverPayApp.v2` 的 `settings.platformProfiles`，沒有後端或跨裝置同步。
- 既有 Yoxi 明細仍可編輯與刪除；本次沒有建立完整收入明細管理頁。

### C. 平台收入最終美術

提交：`d5ca72d`

此提交只調整平台收入視覺，沒有改變收入計算或儲存邏輯。

目前規格：

- 平台名稱：24px、700、`#17211B`
- 已輸入收入：28px、700、`#203128`
- 小螢幕收入字級：26px
- 未輸入文字：`輸入收入`，22px、600、`#98A29C`
- 輸入框：56px 高、`#FAFCFB` 背景、`#DCE4DF` 邊框、15px 圓角
- 編輯狀態：`#0B8A63` 邊框、`#087F5B` 文字、`#F1FAF6` 背景
- 標題右側單位：14px、500、`#7E8982`
- 每列不再重複顯示 `NT$`
- 不使用平台品牌色，也不使用亮藍色收入數字
- Yoxi 加號：淡綠底、深綠加號，44×44px；窄螢幕為 42×42px
- 320、375、390、430px 寬度均確認沒有水平溢出，平台名稱不會換行或截斷。

手機版截圖：

`driver-pay-pro-platform-income-390.png`（歷史本機驗收截圖，未納入 repository）

### D. 週報表／月曆手機版響應式優化

備份提交：`2ee29d0`
完成提交：`cc42cda`

此修改只調整週報表呈現方式，沒有修改首頁、資料來源、資料欄位或統計公式。

已完成：

- 「每週總額」與「月份明細」標題不再被擠成逐字直排。
- 月份選擇器可縮放並完整留在卡片內。
- 手機版週摘要改為兩欄 Dashboard；週期範圍占滿第一列。
- 小於 700px 時，月份明細改成每日卡片列表。
- 每張卡片直接顯示日期、總收入、班別、天氣、所有平台收入、小費與淨收入。
- 零收入顯示 `—`，金額使用千分位。
- 手機版不再顯示超寬表格，也不需要左右滑動。
- 編輯與刪除功能保留。
- 700px 以上仍使用原本桌面表格，不會同時顯示卡片和表格。
- 最後一筆資料與固定底部導覽列之間保留安全距離。
- 週報、月報、平台頁籤切換功能維持原樣。

完整手機版截圖：

`driver-pay-pro-weekly-report-mobile-390.png`（歷史本機驗收截圖，未納入 repository）

### E. 日期卡與新增支出模式（未提交）

本輪修改集中在 `index.html`，沒有 commit、push、merge 或部署。

已完成：

- 「更新今日紀錄」與支出付款日期共用 56px 置中日期卡，原生日期 input 限制在卡片內並覆蓋完整點擊區域。
- 新增油錢、停車費、洗車快捷按鈕；點擊後自動選類別、切到一次支出並聚焦金額欄位。
- 新增一次支出、每月固定、分月計算三段式切換與依類別智慧預設。
- 每月固定提供每月金額、日期、開始月份及結束方式前端設定。
- 分月計算提供 2、3、6、12、自訂月份、期間、每月成本與尾月補差預覽；自訂限制 2～60 個月。
- 金額支援千分位、空值／0 時停用儲存，儲存後清空金額、保留日期、收合區塊並顯示提示。
- 現有支出仍只寫入 `entry.expenses[category]`；固定與分月規則未持久化，也未修改月報算法或 `driverPayApp.v2` 結構。

本機備份：

`.backups/index-before-expense-modes-2026-07-23.html`

本機驗收截圖位於 Codex visualizations 資料夾，未納入 repository。

### F. 作者資訊與 About

工作分支：`codex/add-brand-attribution-20260724`

已完成：

- Driver Space 設定頁新增「關於 Driver Pay Pro」入口。
- About 頁顯示 App 名稱、Version 1.0.0、Designed & Developed by、Mark Hu、產品理念與著作權。
- About 下方只保留 disabled 的 Send Feedback「即將推出」設定列；GitHub 與 LinkedIn 已依最新需求移除，沒有殘留空白列或分隔線。
- 自訂啟動作者過場及 Built by／Mark Hu 已完整移除；啟動時不再顯示作者資訊，也沒有增加其他品牌過場或延遲。
- Runtime 作者資訊集中在 `brandAttribution`，用於 About 的產品、版本、作者、理念與著作權。
- README 已新增 Author 章節。
- 首頁沒有新增可見作者資訊。
- 沒有修改 `driverPayApp.v2`、資料模型、收入、支出、工時、報表或 PWA 資源。

本機驗證：

- Inline JavaScript、Service Worker 與 manifest 語法通過。
- About 開啟、返回設定、作者資訊保留及 Send Feedback disabled 狀態通過。
- DOM、CSS 與 JavaScript 均不再包含自訂 Splash、Built by 或啟動作者名稱。
- 320、390、393、430、1024px 均無水平 overflow。
- 瀏覽器 Console 無 error 或 warning。
- 開始／結束跑車時間欄位仍完整位於父容器內。

實機狀態：

- iPhone Safari 與安裝式 PWA 仍需由 Product Owner 進行實機啟動驗收；內建響應式瀏覽器不能取代真機。

### G. 週報工時與完整週期修正

工作分支：`codex/add-brand-attribution-20260724`

根本原因：

- 原 `calcHours()` 對所有 `workSession.status === "running"` 的紀錄都使用 `Date.now()` 加上目前區段；歷史日期只要未正常收工，就會在週報與月度統計中持續累加到今天，產生 617.4 小時等異常值。
- 原 `weekStart()` 用本地時間計算後再以 UTC `toISOString()` 轉回日期。台北時區會讓週起始與週結束各退一天，因此畫面出現 `7/12－7/17`、`7/19－7/24` 的六天區間。

已完成：

- `workMetrics()` 成為唯一工時來源，內部統一使用毫秒；支援手動小時、開始／結束時間、跨午夜、休息分鐘及既有 `workSession`。
- `hourlyRate()` 成為唯一平均時薪來源；工時小於 1 分鐘時回傳 0，不會出現 NaN 或 Infinity。
- 已停止歷史未收工 session 跟著現在時間繼續增長；只讀取既有 `accumulatedActiveMs` 或可信的開始／結束時間，不改寫舊紀錄。
- 首頁、週報、月度摘要、CSV、AI 本月平均時薪及工時提醒均引用同一套工時／時薪邏輯。
- 前一版週報曾固定為星期日至星期六；本規則已由本文件 H 節的星期一至星期日正式定義取代。
- 跨月週會納入同一完整週中位於相鄰月份的既有紀錄，不因月份篩選遺漏週內資料。

本機驗證：

- 案例 A：08:00－17:00、休息 60 分鐘＝8 小時；收入 4,000，平均時薪 500。
- 案例 B：10:00－15:30、無休息＝5.5 小時；收入 2,750，平均時薪 500。
- 案例 C：22:00－翌日 02:00、休息 30 分鐘＝3.5 小時。
- 案例 D：收入 2,340、工時 0＝平均時薪 0，且為有限數字。
- 前一版案例 E 使用星期日至星期六；現行驗收案例請以本文件 H 節為準。
- 同型歷史 running session 舊算法為 617.4 小時，新讀取層為 0 小時且不修改原始資料。
- 現有本機 2026-07 紀錄：週報 `7/12－7/18` 顯示 8 小時，月度摘要顯示 8 小時；月度與 AI 平均時薪一致。
- 320、390、393、430、1024px 均無水平 overflow，Console 無 error 或 warning。
- Inline JavaScript、Service Worker、manifest 與 `git diff --check` 通過。

資料與實機狀態：

- 沒有修改 `driverPayApp.v2`、資料欄位、Supabase Schema、正式資料或 PWA 資源。
- 無法從 repository 判定使用者裝置上是哪一筆歷史紀錄未收工；本次確認異常值是讀取時計算持續增長，不是已儲存 617.4 小時，也不需要批量修復。
- iPhone Safari 與安裝式 PWA 仍需 Product Owner 實機驗收。

### H. 星期一週期、619 小時與 PWA 更新修正

工作分支：`codex/fix-monday-week-worktime-20260725`

根本原因：

- 舊版 `weekStart()` 先以台灣本地時間算出星期一，再使用 `toISOString().slice(0, 10)` 轉回日期字串，導致星期一顯示成前一天星期日；週末也因同一 UTC 轉換從星期日退成星期六，因此出現 `7/12－7/17`、`7/19－7/24`。
- 舊版 `calcHours()` 對任何 `workSession.status === "running"` 的紀錄加入 `Date.now() - segmentStartedAt`。歷史未收工紀錄會隨真實時間持續成長；固定測試中從 `2026-06-29 20:00` 到 `2026-07-25 15:00` 正好是 619 小時。
- 工時與週期程式雖已在 `d58d0a1` 修正，但 `sw.js` 從初始版本到該發布的內容雜湊與 cache 名稱完全未變，已安裝 PWA 沒有取得新的 worker 版本；舊 App Shell 在離線回退或未真正重載時仍可能繼續執行舊演算法。

本次修正：

- `weekStart()` 改為星期一，`weekEnd()` 固定為開始日加 6 天；date-only 曆法運算不再把日期字串轉成台灣午夜後再序列化成 UTC。
- `todayString()` 與 session 日期比對明確使用 `Asia/Taipei`。
- 保留毫秒制 `workMetrics()` 與 `hourlyRate()` 唯一來源；歷史 running session 不會隨目前時間增加。
- Service Worker cache 更新為 `driver-pay-pro-v05-monday-week-worktime-fix`，navigation 強制走 network-first 並略過 HTTP cache；註冊使用 `updateViaCache: "none"`，新 worker 接管舊 PWA 後安全重載一次。
- 新增 `tests/reporting.test.js`，直接擷取並測試 `index.html` 的正式函式，涵蓋星期一、星期日、跨月、跨年、619 小時重現、33.5 小時週總和、時薪與 PWA 更新契約。

資料限制：

- Repository 與桌面瀏覽器無法讀取使用者 iPhone 的 `driverPayApp.v2`，因此不能列出手機上該筆紀錄的 ID 或未提供的原始 JSON。
- 619 小時的運算來源已由舊函式與持續增長現象確認；本次不清除、不改寫或批量修復任何手機資料。若更新後仍顯示固定的異常值，需由使用者提供該裝置的原始資料匯出後再判定是否已有異常 `accumulatedActiveMs` 被持久化。

---

## 4. 最新設計決定

### 首頁

- 首頁已完成，後續預設凍結。
- 首頁必須是儀表板，不是一般表單。
- 重要數據直接顯示，避免展開、收合、彈窗與額外確認步驟。
- 能原位編輯就不建立第二個輸入區。
- 能自動儲存就不增加完成按鈕。
- 維持穩重、專業、清楚的深綠與灰綠配色。

### 平台收入

- 固定為直式列表，一個平台一行。
- 不採用平台切換卡片。
- 不採用平台品牌色。
- 不使用亮藍色收入數字。
- 不顯示鉛筆、每列完成按鈕或重複 `NT$`。
- 每個平台可設定總額覆蓋或單筆累加；預設只有 Yoxi 使用累加。

### 週報表手機版

- 手機版使用每日卡片，桌面版保留表格。
- 不以水平捲動作為手機版解法。
- 所有重要資料直接顯示，不加入展開／收合按鈕。
- 顯示層可以依螢幕切換，但資料來源與計算邏輯必須共用。

---

## 5. 已完成驗證

### 程式與資料邏輯

- Inline JavaScript 語法檢查通過。
- `git diff --check` 通過。
- 瀏覽器 Console 沒有錯誤或警告。
- 直接輸入模式的總額覆蓋正常。
- 累加模式的單筆累加、最近一次復原與總額修正正常。
- 天氣自動儲存正常。
- 開始、暫停、繼續、收工狀態切換正常。
- 重新整理後資料仍存在。
- 週報手機版與桌面版顯示的數值一致。
- 週報修改期間已確認首頁主要區塊與核心函式未被改動。

### 響應式畫面

- 已測試 320、375、390、430px 手機寬度。
- 週報手機版沒有水平 overflow。
- 1024px 桌面寬度仍顯示原表格。
- 底部最後一筆資料不會被固定導覽列遮住。

### 尚未完成的實機驗證

- 已確認本機有 Safari 26.5.2 WebDriver，但 Safari 的「允許遠端自動化」未開啟。
- 因此尚未完成真正的 Safari 自動化測試或 iPhone 實機／PWA 最終驗收。
- 目前所稱手機測試是瀏覽器響應式尺寸測試，不應誤寫成 iPhone 實機驗證。

---

## 6. 尚未完成項目

### 發布與版本整合

- `codex/home-restore-ui-20260717` 已透過 `ab7b2cb` 合併至 `main`，雙方歷史均保留。
- 本次整合使用一般 push；未使用 force push。
- 遠端 `main` push 後由既有 Vercel Git Integration 自動建立 Production Deployment。
- 已依 Product Owner 明確確認刪除未被程式、manifest 或 Service Worker 引用的錯誤舊圖 `assets/driver-pay-icon-512.png`；正式 Master Icon 與現行 PWA 圖示完整保留。
- 每次開始工作仍需以 `git status -sb` 與遠端 Fetch 結果確認是否同步。
- 未來每個驗證通過的 Sprint 均依持續發布授權合併、Push `main` 並確認 Production；當次使用者可明確要求不要部署。
- GitHub CLI 目前未登入；若後續要建立或管理 Pull Request，需先完成 `gh auth login`，但一般 Git push 可使用既有 Git／GitHub Desktop 認證。
- 正式部署仍需核對 deployment commit SHA、`manifest.webmanifest`、`sw.js`、圖示資源路徑與 Service Worker 快取更新。

### 最終驗收

- iPhone Safari 實機操作。
- 加到主畫面後的 PWA 啟動與更新。
- Service Worker 是否仍提供舊快取。
- 首頁計時、平台收入、Yoxi、天氣、今日目標、週報切換的正式站完整流程。
- 不同 iPhone 寬度及 safe-area。

### 目前仍屬未開發功能

- AI 分頁仍是預留畫面，沒有串接 API。
- 沒有使用者帳號、雲端資料庫或跨裝置同步。

---

## 7. 備份與快速回復方式

### Git 備份

- 首頁還原前：分支 `codex/backup-pre-home-restore-20260717`，提交 `7104f13`
- 週報響應式修改前：提交 `2ee29d0`
- 平台收入最終美術前：提交 `3dd83a0`

若只需要查看舊版本，優先使用 Git 比較或建立新分支，不要對目前工作目錄執行破壞性的強制重設。

### 額外檔案備份

檔案：

`.backups/index-before-core-summary-order-2026-07-17.html`

SHA-256：

`4cd49780499c9a4d123b06c5b96fa41924354f84f3f2db47854f1ba99105d2d9`

---

## 8. 重要程式位置

行號會隨後續修改變動，請以搜尋名稱為準。

- 平台收入列樣式：`.platform-income-row`，約 `index.html:1404`
- 原位收入輸入框：`.inline-income-input`，約 `index.html:1435`
- 收入編輯狀態：`.inline-income-input:focus`，約 `index.html:1458`
- 週報標題列：`.report-panel-head`，約 `index.html:1720`
- 手機每日卡片：`.entries-mobile-list`，約 `index.html:1747`
- 週報手機 breakpoint：`@media (max-width: 699px)`，約 `index.html:1775`
- 月份明細渲染：`renderEntries()`，約 `index.html:2756`
- 週摘要渲染：`renderWeeks()`，約 `index.html:2841`
- 工作控制狀態：`updateWorkControls()`，約 `index.html:3027`
- 共用工時計算：`workMetrics()`，請以函式名稱搜尋
- 共用平均時薪：`hourlyRate()`，請以函式名稱搜尋
- 週起始日：`weekStart()`，請以函式名稱搜尋
- 天氣狀態：`updateCurrentWeather()`，約 `index.html:3054`
- 平台收入提交：`commitInlineIncome()`，約 `index.html:3351`
- Yoxi 單筆新增：`startYoxiAdd()`，約 `index.html:3403`
- PWA 初始化：`setupPwa()`，約 `index.html:3447`
- storage key `driverPayApp.v2`，約 `index.html:2319`

預設平台：

- Uber
- LINE GO
- Yoxi
- 55688
- 大都會
- 台灣大車隊
- 路邊客
- 自訂

---

## 9. 後續修改不可退步的項目

- 不可清除或更名 `driverPayApp.v2`。
- 不可改壞既有收入、工時、休息、收工、歷史紀錄與統計資料。
- 不可忽略各平台已保存的輸入模式。
- 不可在切換輸入模式時清除或重算既有收入。
- 不可讓 Enter 與 blur 重複提交。
- 不可讓天氣阻擋開始工作。
- 不可把首頁綠色核心數據框移離第一個位置。
- 不可重新加入平台切換卡、第二行輸入框、鉛筆或每列完成按鈕。
- 不可重新使用亮藍色收入數字或各平台品牌色。
- 不可讓週報手機版退回超寬橫向表格。
- 不可為了手機版而移除桌面表格或改變統計公式。
- 不可把 `.backups/` 當正式網站內容發布。

---

## 10. 下一個對話建議先做的事

如果下一步是繼續開發：

1. 先閱讀本文件並檢查 `git status`、目前分支與最近提交。
2. 確認新需求是否會碰首頁；首頁預設凍結。
3. 只改需求指定範圍，並重新驗證資料持久化與相關計算。
4. 驗證通過後建立規範化 Commit、Push 目前工作 Branch 並更新本文件。

如果下一步是再次發布：

1. 先取得目前工作 Branch 與 `main` 的最新遠端紀錄。
2. 確認本次要發布的提交與檔案範圍。
3. 確認適用驗證全部通過，且沒有無法安全判定的遠端衝突或資料風險。
4. 依持續發布授權合併、Push `main`，再檢查 Vercel、PWA 資源、Service Worker 與正式站完整流程。
5. 最後安排 iPhone Safari／PWA 實機驗收。

---

## 11. 給下一個對話的簡短交接提示

Driver Pay Pro 的首頁、可設定平台收入模式、支出介面及週報手機版已透過 `ab7b2cb` 整合至 `main`；最新功能提交為 `4d4637b`，Git 流程文件提交為 `53aa540`。本次沒有刪除任何 Git 追蹤檔案，也沒有使用 force push。首頁目前凍結；不要修改既有收入、計時、天氣、目標、歷史紀錄或統計邏輯。iPhone Safari／PWA 實機驗收仍待完成，開始任何修改前仍須先檢查實際 Git、GitHub 與 Production 狀態。
