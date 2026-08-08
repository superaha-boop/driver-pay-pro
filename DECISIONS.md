# Driver Pay Pro Decisions

本檔是根目錄的永久決策入口，供 Codex 在每次任務開始前快速確認正式決策文件位置。

為避免建立兩份互相競爭的決策來源，完整且具編號的正式決策紀錄統一維護於：

- [`docs/DECISION_LOG.md`](docs/DECISION_LOG.md)

## D-019 — 全域產品設計規範

- Date: 2026-07-25

### 決策

1. Driver Pay Pro 建立永久的全域產品設計規範。
2. 所有頁面遵循三秒原則。
3. 重要資訊與操作最多維持兩層。
4. 安全操作優先使用合理預設、自動儲存、已核准的自動同步、即時更新與低干擾回饋。
5. 高頻操作必須適合單手操作。
6. 視覺採 Apple-like 的低彩度、清楚層級、合理留白及柔和深度感。
7. 不使用傳統企業 Dashboard、Excel 資料表、彩色 KPI 卡片牆或 Android Material Dashboard 風格。
8. 月曆的「工作紀錄卡片」採混合式布局。
9. 核心資料使用雙欄，延伸資料使用單欄。
10. 工作紀錄卡片支援精簡、標準、完整及自訂模式。

### 原因

Driver Pay Pro 的主要使用者會在行程間快速查看或記錄資料。產品需要一套跨頁面、跨任務且可由後續 Codex 一致執行的設計判準，避免每個 Sprint 重新發明介面。

### 影響範圍

- 適用於所有新頁面、UI／UX 修改、元件、響應式、PWA、動畫、表單、導航、設定、報表、月曆與 AI 任務。
- `AGENTS.md` 是完整永久規則；`PROJECT_CONTEXT.md` 只保存產品背景摘要。
- 未來 Calendar 採 `Overview → Detail`，點選日期後在月曆下方顯示工作紀錄卡片。
- 工作紀錄卡片的核心欄位、延伸欄位、空資料與設定入口必須遵守核准規格。
- 本決策只建立規範，不代表月曆 UI、卡片設定、拖曳、滑動、收入熱度或同步功能已完成。

### 不採用的替代方案

- 不採每個頁面各自建立一套視覺與互動規則。
- 不採多層導航、重複確認、每項數字一張卡片或卡片巢狀。
- 不採先做 Desktop 再縮成手機的流程。
- 不採單純增加圓角來模仿 Apple 風格。
- 不採傳統 Dashboard、彩色 KPI 卡片牆、大量漸層、厚重陰影或過度裝飾。

### 變更管制

未來如需修改本決策、工作紀錄卡片布局或四種顯示模式，必須先取得 Product Owner 的明確產品決策與核准 PRD，不得由 Codex 在實作任務中自行改寫。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-019](docs/DECISION_LOG.md#d-019)；若摘要措辭出現差異，以該編號條目的最新核准內容為準。

## D-020 — Design System Foundation

- Date: 2026-07-25

### 決策

1. Design Tokens 採 CSS custom properties，並由 `styles/design-system.css` 作為單一程式來源。
2. 不新增大型 UI framework、Tailwind、字型或測試框架。
3. 顏色採 brand、surface、text、border、status 與 overlay 等語意命名。
4. 間距、圓角、陰影、框線與動畫只使用有限級距。
5. Lucide 是唯一正式 UI icon 形式。
6. 所有主要 touch target 至少 44×44px。
7. 建立共用 Button、IconButton、Card、SectionHeader、EmptyState、Skeleton、SaveStatus、PageContainer、Surface 與 Divider。
8. 本 Sprint 不進行全站重構；Design System 採漸進式導入。
9. Dark mode 此階段不強制完成，但語意 token 保留未來擴充能力。
10. Design showcase 不出現在一般使用者導航，也不加入 PWA App Shell。
11. 後續 Calendar 重構必須使用本 Design System。

### 原因

Driver Pay Pro 需要讓後續頁面不再各自猜測色彩、間距、圓角、陰影、狀態與基礎元件，同時避免在現有靜態單頁 PWA 中引入高成本框架或一次性重寫風險。

### 影響範圍

- 新 UI 必須優先使用 `styles/design-system.css` 與 `.ds-*` primitives。
- 現有首頁、月曆、報表、AI 與 Driver 保持既有功能與版型，依後續核准 Sprint 漸進遷移。
- 專案目前沒有 TypeScript 或 build pipeline；共用 API 使用語意 HTML、CSS classes 與原生 ARIA 狀態，未來若建立 typed component layer 必須向下相容。
- 完整實作規格與使用方式見 [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md)。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-020](docs/DECISION_LOG.md#d-020)；若摘要措辭出現差異，以該編號條目的最新核准內容為準。

## D-021 — Product Specification and Information Architecture

- Date: 2026-07-25

### 決策

1. 以 `docs/PRODUCT_SPEC.md` 作為正式產品邊界與資訊架構來源。
2. Bottom Navigation 固定為 Today、Calendar、Reports、AI、Driver，不增加第六個主要分頁。
3. 每個可寫入功能只有一個 Primary owner。
4. Today 只處理今日工作與今日紀錄；Calendar 管理過去紀錄；Reports 與 AI 唯讀；Driver 管理持久設定。
5. 收入、支出、淨收入、實際工時、平均時薪及週／月彙總必須共用 canonical calculation。
6. Calendar 新啟動選今天、同 session 保留選取日期、星期一至星期日、未來日期不可建立紀錄。
7. 目前實作差距只記錄於 Current State Audit 與 `docs/TECH_DEBT.md`，本 Sprint 不修改 UI、資料模型或業務邏輯。
8. 下一個正式工作是「Calendar Interaction and Implementation Specification」。

### 原因

現有功能已成長至五個主要頁面，需要固定責任邊界、資料來源與跨頁操作契約，避免後續 Calendar、Reports 與 AI Sprint 重複表單、公式或導航。

### 影響範圍

- 後續 PRD、UI、元件、路由、資料 selector、測試與技術債評估必須核對 `docs/PRODUCT_SPEC.md`。
- 任何改變頁面 owner、Bottom Navigation、canonical calculation、localStorage key 或 Calendar 已定決策的工作，都需要新的明確產品決策。
- 本決策不代表 Calendar 日期格、工作紀錄卡片、deep link、未來日期 guard 或計算去重已完成。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-021](docs/DECISION_LOG.md#d-021)；若摘要措辭出現差異，以該編號條目的最新核准內容為準。

## D-022 — Calendar Interaction and Implementation Specification

- Date: 2026-07-25

### 決策

1. Calendar 一般新 session 選今天，同 session 保留選取；不得自動選最近工作日。
2. 單純月份導覽不改 selectedDate；selectedDate 不在顯示月份時不製造假選取。
3. Calendar 固定 Monday-first；月份箭頭、今天與日期點擊是必要操作，手勢只是增強。
4. Today、Selected 與 Income Heat 是可組合但彼此不同的狀態。
5. 熱度以當月有效正淨收入的分位數四級計算；少於四筆時採相對最大值 fallback。
6. 工作紀錄卡片位於月曆下方，第一版使用標準模式且不顯示平台 Logo。
7. 今天空狀態連到 Today；過去空日期可補登；未來日期不可新增。
8. 編輯直接可見；刪除是次級、具日期與影響說明的確認操作。
9. Calendar 使用 canonical calculations、Design System 與單一 Record Editor，不取代 Reports。
10. Calendar Implementation 建議拆為 Read and Navigate、Record Mutation and Hardening 兩個 Sprint。

### 原因

目前 Calendar 只有月份清單，尚無日期狀態、工作紀錄卡片或可重用 Editor。先固定互動、資料與錯誤契約，才能避免下一輪同時猜測 UX、複製計算或造成紀錄寫入風險。

### 影響範圍

- 完整規格以 `docs/CALENDAR_SPEC.md` 為準。
- 本決策不代表 Calendar UI、日期格、熱度、手勢、Editor 或資料寫入已實作。
- 改變 session 選取、月份導覽、熱度、未來日期或 Record Editor 規則，需要新的 Product Owner 核准。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-022](docs/DECISION_LOG.md#d-022)。

## D-023 — Calendar Read and Navigate Implementation

- Date: 2026-07-25

### 決策

1. Sprint 4A 只實作 Calendar 唯讀瀏覽；新增、編輯與刪除延後至 Sprint 4B。
2. Navigation Never Loses Context：有效外部日期精確開啟該日，無效日期安全回到台北今天，且不建立資料。
3. One Motion = One Meaning：水平位移只代表日期／月份改變，短淡入只代表內容更新。
4. `selectedDate` 與 `displayedMonth` 維持 session-only 分離狀態；月份瀏覽保留選取日期。
5. 日期格式、緊湊金額與熱度只存在顯示層，不回寫工作紀錄。
6. 月份格、唯讀工作紀錄卡片與月份摘要只使用 canonical calculations 與 Design System primitives。
7. `settings.calendarMonth` 保留相容性但不再控制新 Calendar session，也不由 Calendar 瀏覽更新。
8. 切換月份但保留舊月份 selectedDate 的行為，維持 D-022 並標記 Needs UX Validation。

### 原因

將月份格與資料寫入拆開，可先驗證日期、時區、狀態、熱度、計算與手機版互動，再於 Sprint 4B 處理同一 Record Editor、交易式寫入與錯誤回復，降低資料風險。

### 影響範圍

- Calendar 已提供真正 Month Grid、Monday-first、日期選取、相鄰月份、Today／Selected、四級熱度、唯讀標準工作紀錄卡片、空狀態、月份摘要、手勢與鍵盤操作。
- Calendar render、月份切換、日期選取與手勢不呼叫 `saveState()`，不建立空白紀錄。
- 本決策不授權新增、編輯、刪除、Record Editor、schema、migration 或其他頁面重構。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-023](docs/DECISION_LOG.md#d-023)。

## D-024 — Calendar Visual Polish

- Date: 2026-07-25

### 決策

1. Sprint 4A.5 僅調整 Calendar 視覺層級與空間效率，不改 state、日期、互動、ARIA、read-only 或資料規則。
2. Calendar 頁內採更緊湊的垂直節奏，優先減少多餘 spacing，月份與日期觸控操作仍保持至少 44×44px。
3. Work Record Card 保持相同資料內容，以 typography、spacing 與低對比分隔線區分 Primary／Secondary metrics。
4. Income Heatmap 只調整 `--color-calendar-heat-1` 至 `--color-calendar-heat-4` semantic tokens；分級、fallback、同值規則與 Selected 優先級不變。
5. Month switch preserving `selectedDate` 維持既有決策，繼續列為 Human QA 的 Needs UX Validation。

### 原因

Sprint 4A 的資訊架構與互動已通過自動驗證，但手機首屏仍可藉由減少非必要留白、強化文字層級及略增熱度差異，讓使用者更早看到工作紀錄卡片且更容易掃讀。

### 影響範圍

- 只影響 Calendar presentation CSS、工作紀錄標題的可見文字分層、Design System heat tokens、相關 contract tests 與 PWA cache version。
- `driverPayApp.v2`、WorkRecord schema、canonical calculations、heat algorithm、月份摘要、導航、手勢及其他頁面均不變。
- 下一步必須先完成實體 iPhone Safari／installed PWA Human QA Gate，再進入 Sprint 4B。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-024](docs/DECISION_LOG.md#d-024)。

## D-025 — Calendar Record Mutation and Hardening

- Date: 2026-07-25

### 決策

1. Calendar 只新增、編輯與刪除過去日期；Today 擁有今天，未來日期保持唯讀。
2. Calendar 將 Today 的同一組 `entryForm`／`detailForm` DOM 移入全螢幕 Record Editor，關閉後移回；不得複製第二套表單。
3. Calendar 使用 UI draft 與明確「完成」commit；dirty close 與 delete 使用日期明確的確認。
4. Calendar mutation 透過 snapshot、主 key 寫入、讀回驗證、last-valid safety copy 與 failure rollback；成功後才更新 in-memory state。
5. `driverPayApp.v2` 與 WorkRecord schema 維持不變；`driverPayApp.v2.lastValid` 只作本機 recovery safety copy。
6. 不在缺少 migration／sync 規格時新增 `createdAt`／`updatedAt`，也不建立完整收入或支出明細模型。

### 原因

Calendar 成為過去紀錄 Primary owner 後，需要安全的 record lifecycle，同時避免表單、
validation、資料模型與 canonical calculations 分裂。

### 影響範圍

- 過去空日期可補登，既有過去紀錄可直接編輯與日期明確刪除。
- 今天仍導回 Today，未來日期不顯示寫入入口。
- Calendar 成功寫入後重算 grid、card、heat、month summary、Reports 與 AI。
- Service Worker cache 更新為 `driver-pay-pro-v10`。
- 實體 iPhone Safari／installed PWA Human QA 仍是完成 Gate。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-025](docs/DECISION_LOG.md#d-025)。

## D-026 — Calendar UX Freeze Version 1

- Date: 2026-07-25

### 決策

1. Calendar Read、Navigate、Create、Edit、Delete、Rollback 與 Human QA 驗收完成。
2. Calendar UX Freeze — Version 1 正式生效。
3. Freeze 範圍包含 Header、Month Navigation、Weekday Header、Month Grid、
   Today／Selected、Heatmap、Work Record Card、Empty States、新增／編輯／刪除、
   手勢、Accessibility、Responsive 與 SaveStatus。
4. 凍結後只接受 Bug、Accessibility、Data Integrity 與重大使用障礙修正。
5. 所有主要模組使用 `docs/FEATURE_FREEZE_CHECKLIST.md` 作為共同封板 Gate。
6. Reports 可重用 Calendar 的日期工具、Monday-first 週期、canonical
   calculations、月份彙總、工作天判斷、persistence read API 與 Design System
   primitives，但不得因此重設 Calendar UX。

### 變更管制

任何突破 Calendar Freeze 的修改必須先說明使用者問題與影響範圍、取得正式
決策、提供 Regression，並同步更新本文件與正式決策紀錄。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-026](docs/DECISION_LOG.md#d-026)。

## D-027 — Reports Specification Version 1

- Date: 2026-07-26

### 決策

1. `docs/REPORTS_SPEC.md` 成為 Reports Core Implementation 的唯一主要功能規格。
2. Reports 固定包含週報、月報與平台；新 session 預設週報，tab、週、月、平台期間與返回 context 均為 session-only。
3. 週報以台北星期一至星期日為完整七天；月報以台北曆月為完整期間，兩者支援前後與當期導覽。
4. 週／月 KPI、比較、趨勢、平台與重要日期必須來自 canonical calculations 與純 selector；renderer 不得複製公式。
5. 週趨勢使用每日淨收入；月趨勢使用 Monday-first 週彙總。
6. 平台頁只描述收入貢獻，不推論效率；小費不歸入平台總額。
7. Reports 保持唯讀，需要檢查或修正紀錄時連到 Calendar 的確切日期。
8. 實作拆為 Sprint 5B1 Weekly and Monthly Core 與 Sprint 5B2 Platform, Drill-Down, and Hardening。
9. 本決策取代 D-018 中「報表分頁與月份需 durable 保存」的部分；D-018 的五頁資訊架構與 Calendar／Reports 分離仍有效。
10. 趨勢與排行必須提供可見數值與螢幕閱讀器文字替代，不得只靠顏色或圖形。
11. Calendar UX Freeze 對 Reports 實作完整生效；Reports 只能重用已凍結能力，不得為報表回頭重設 Calendar。

### 原因

現有 Reports 已有基本週／月彙總與平台排行，但缺少明確 period state、前期比較、
淨收入趨勢、錯誤狀態、精確日期導覽與 accessibility 契約；先固定規格可避免
下一個 Sprint 複製日期／計算公式或把 Reports 變成第二個資料編輯頁。

### 影響範圍

- Sprint 5A 只更新規格、稽核、測試契約與永久文件，不修改 Production。
- `driverPayApp.v2`、WorkRecord schema、Calendar Freeze、Service Worker 與 App Shell 不變。
- 現況差距登錄於 `docs/TECH_DEBT.md`，不因規格定案而自動授權全部修正。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-027](docs/DECISION_LOG.md#d-027)。

## D-028 — Reports Platform, Drill-Down, and Refresh Contract

- Date: 2026-07-26

### 決策

1. 平台頁只呈現本週／本月收入貢獻、排行、占比與安全前期比較。
2. 平台收入只計算 WorkRecord 的平台收入；小費與其他收入不得歸入任何平台。
3. Uber、LINE GO、Yoxi、55688／台灣大車隊的核准別名只在讀取層正規化；
   未知自訂平台安全保留，不改寫歷史資料。
4. 平台合計低於總收入時顯示未歸因金額；高於可確認總收入時顯示資料不一致，
   不自行修正或隱藏來源資料。
5. 重要日期是 Reports 的唯讀 drill-down，只連到 Calendar exact date，不自動
   開啟 Editor 或建立紀錄。
6. Calendar 返回 Reports 的 context 只存在 session 記憶體，包含 tab、週／月、
   平台期間、捲動位置與來源焦點。
7. 成功的既有 record mutation 透過單一 `driverpay:recordchange` 事件通知；
   Reports 可見時以單一 animation frame 更新，瀏覽行為不得偽裝 mutation。
8. Reports Error、Offline、Empty、no platform income、stored zero 與資料不一致
   保持不同狀態；任何狀態都不得清除 `driverPayApp.v2`。
9. 平台圖形只作輔助；收入與占比必須同時提供可見文字與螢幕閱讀器名稱。
10. Reports Sprint 5B2 完成後仍須 Final Regression、實體 iPhone Safari 與
    installed PWA Human QA 才能進入 UX Freeze。

### 原因

平台歷史資料以顯示名稱為 key，直接 migration 或模糊合併可能破壞歸因；採用
明確 alias 的讀取層 adapter 可在不改資料的前提下提供可信排行。精確日期下鑽、
session return context 與 committed-record notification 則讓 Reports 保持唯讀，
同時避免修正紀錄後看到 stale 結果。

### 影響範圍

- 新增平台純 aggregation selector、平台 UI、exact-date drill-down、return
  context、record-change refresh、測試與文件。
- `driverPayApp.v2`、WorkRecord schema、Calendar UX、Today 流程、AI、Driver、
  Supabase 與 dependency 不變。
- 自訂平台跨重新命名的穩定 ID 仍為 TD-026，需另行核准 migration／資料 Sprint。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-028](docs/DECISION_LOG.md#d-028)。

## D-029 — QA Levels and Reports 5B2 Validation Cadence

- Date: 2026-07-26

### 決策

1. QA 固定分為 L1 自動驗證、L2 Preview Smoke、L3 Module Human QA 與
   L4 Production Release QA。
2. 小型 Sprint 不重複要求完整 L3；大模組完成 Final Regression 後集中執行
   一次完整 Human QA。
3. Reports Sprint 5B2 只執行八項 L2 Preview Smoke；週報、月報、平台、
   drill-down、refresh、Offline、PWA、VoiceOver、responsive 與 safe area 的
   完整驗收延後至 Reports Final Regression。
4. 高風險資料、同步、Service Worker 與 iOS 特有行為仍須依風險即時提高
   QA 層級。
5. iPhone QA 網址必須以未登入的新連線確認可直接開啟，不得只依部署工具
   回傳成功。

### 原因

將短 Sprint 的阻擋性 Smoke 與模組完成後的完整 Human QA 分開，可避免重複
驗收，同時保留資料完整性、PWA 與 iOS 特有風險的必要人工 Gate。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-029](docs/DECISION_LOG.md#d-029)。

## D-030 — Reports UX Freeze Version 1

- Date: 2026-07-26

### 決策

1. Product Owner 已完成 Reports L3 Human QA；iPhone Safari、installed PWA、
   Offline、VoiceOver、Reduced Motion、safe area、responsive 與無 High Priority
   issue 全部通過。
2. Reports Feature Freeze Checklist 14/14 Passed，Reports UX Freeze Version 1
   正式生效。
3. Freeze 範圍為 Reports Header、週報／月報／平台 Tabs、Period controls、
   KPI hierarchy、Comparison layout、Weekly Trend、Monthly Trend、Important
   Dates、Platform Ranking、Unattributed Income、Empty／Loading／Error、
   Reports → Calendar drill-down、Reports context restoration、Record-change
   refresh、Accessibility 與 Responsive。
4. Freeze 後只接受 Bug、Accessibility、Data Integrity、Security、重大使用
   障礙與 Production blocker；一般視覺改善與新增功能放入 Backlog。
5. 後續 AI 必須重用 Reports 的 period utilities、`aggregateReport()`、
   `compareReportPeriods()`、trend data builder、Important Dates selector、
   platform normalization、platform aggregator、persistence read API、
   record-change refresh、amount／duration formatting、Empty／Loading／Error
   patterns 與 drill-down adapter；不得建立另一套 aggregation。
6. TD-023／TD-024 Resolved；TD-025 runtime/session requirement Resolved 且不需
   durable state；TD-026 Partially resolved。其餘 Open／Deferred 技術債不因
   Freeze 關閉。

### 影響範圍

- 本次只更新文件與 Freeze evidence，沒有產品功能、UI、schema、localStorage、
  Service Worker、Supabase migration、dependency、`main` merge 或 Production
  deployment 變更。
- Reports 後續修改必須遵守 Freeze 例外與突破流程。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-030](docs/DECISION_LOG.md#d-030)。

## D-031 — Foundation Cleanup Version 1

- Date: 2026-07-26

### 決策

1. Driver Pay Pro 維持靜態 PWA，不導入 bundler、framework 或大規模
   TypeScript migration。
2. 採用 ESLint、`globals` 與 `parse5` 三個最小 dev dependencies；lockfile
   必須提交以確保可重現。
3. `npm run lint` 檢查 Node scripts、tests、Service Worker 與 HTML inline
   JavaScript；correctness errors 阻擋 release，既有 unused code 保留 warning。
4. `npm run build` 等同 static production validation，不產生 dist。
5. `npm run release:check` 是單一 release gate，涵蓋 lint、全部／專項測試、
   inline JavaScript、Service Worker、Manifest、Production validation 與
   `git diff --check`。
6. `design-system.html` 是內部 showcase，不進入 Bottom Navigation、不加入
   App Shell；可在本機與 Preview 開啟。
7. TD-004 與 TD-005 Resolved；TD-001 Partially resolved；TypeScript Deferred；
   TD-006 Open；TD-026 Partially resolved，其餘資料與同步債保持 Open／Deferred。
8. Calendar／Reports UX Freeze 與 Today／AI／Driver 功能均不因本 Sprint改變。

### 原因

靜態 PWA 不需要大型 bundler，但需要可重現的 lint、資源完整性、release hygiene
與單一 failure gate。保留 inline 產品架構並只加外部驗證，可在不突破 frozen
UX 的前提下降低發布風險。

### 影響範圍

- 新增開發工具、tests、內部 showcase evidence 與文件。
- `index.html`、正式 CSS、Manifest、Service Worker、`driverPayApp.v2`、schema、
  Supabase、Calendar／Reports／Today／AI／Driver 功能均不變。
- Service Worker 維持 `driver-pay-pro-v12`；本 Sprint 不 merge `main`、不
  Production deploy。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-031](docs/DECISION_LOG.md#d-031)。

## D-032 — Local-first V1 Release Candidate Architecture

- Date: 2026-07-26

### 決策

1. Local-first V1 不加入 Supabase、登入、同步、migration 或外部 AI。
2. AI 維持唯讀三區塊，透過 `sharedAnalytics` 重用 Reports canonical
   analytics；TD-006 Resolved。
3. Driver 只管理既有持久設定與衍生 App／本機狀態；每日目標與 Today 共用
   `state.settings.dailyGoal`。
4. 成功 WorkRecord 寫入只發出一次 committed-record notification；Reports
   與 AI 可見時各更新一次。
5. `driverPayApp.v2`、WorkRecord schema、Calendar／Reports Freeze 不變；
   V1 candidate App Shell 使用 `driver-pay-pro-v13`。
6. L1 與公開 L2 通過後只進入一次 V1 L3 Human QA；L3 通過前不宣告 Freeze、
   不合併 `main`、不部署 Production。

### 原因

V1 需要在不引入雲端與資料遷移風險下完成五頁閉環，並消除 AI 與 Reports
公式分歧。共用 canonical analytics 與單一 refresh event 可提供可重複驗證的
本機基礎。

### 影響範圍

- 新增 AI、Driver、integration、regression tests、規格與 v13 App Shell。
- 雲端同步、conflict resolution、record metadata、多段工作、TypeScript 與
  native input 長期驗證保持 Open／Deferred。
- 本決策只建立 Release Candidate，不代表 Human QA、Freeze 或 Production
  已完成。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-032](docs/DECISION_LOG.md#d-032)。

## D-033 — Driver Pay Pro Local-first V1 UX Freeze

- Date: 2026-07-26

### 決策

1. Product Owner 已回覆 `Driver Pay Pro V1 L3 全部通過`；iPhone Safari、
   installed PWA、Offline、VoiceOver、safe area、responsive、跨頁整合與
   local-first data integrity 全部通過。
2. Driver Pay Pro Local-first V1 UX Freeze 正式生效。
3. Freeze 範圍包含 Today 核心流程、Calendar V1、Reports V1、AI V1、Driver
   V1、Bottom Navigation、跨頁 drill-down、context restoration、
   record-change refresh、Loading／Empty／Insufficient／Error／Offline、
   Accessibility、Responsive、PWA 與 local-first data integrity。
4. Freeze 後只接受 Bug、Accessibility、Data Integrity、Security、重大使用
   障礙與 Production blocker；一般新功能進入 V1.1 或 Cloud Sync Backlog。
5. AI 必須持續透過 `sharedAnalytics` 重用 Reports canonical analytics；
   TD-006 維持 Resolved。
6. `driverPayApp.v2`、WorkRecord schema、Calendar／Reports Freeze 與既有
   local-first 資料保持不變。

### 原因

L1 120/120、公開 L2、單次 Product Owner L3 與全部 Freeze Gate 已具備可追溯
證據，五個主要頁面形成完整且可回歸的 Local-first V1 閉環。

### 影響範圍

- 本決策宣告 UX Freeze，不關閉 Supabase sync、跨裝置同步、conflict
  resolution、cloud backup、authentication、record metadata、多段工作模型、
  TypeScript 或 iPhone native input 長期驗證等 Open／Deferred 技術債。
- 本次 Freeze 文件 Commit 不修改產品程式、schema、localStorage key、
  Service Worker、正式資料或 dependencies。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-033](docs/DECISION_LOG.md#d-033)。

## D-034 — V1.1 Today 工時統一採衍生整數分鐘

- Date: 2026-07-29

### 決策

1. `startTime`、`endTime` 與 `breakMinutes` 是完整時間存在時的唯一優先來源；
   `workMinutes = end - start - break`，跨午夜維持單日加 24 小時規則。
2. `workMinutes` 是 canonical 衍生整數，不新增到 WorkRecord；既有
   `manualHours` 只在缺少完整 clock fields 時相容讀取，並以
   `Math.round(hours × 60)` 轉換。
3. Today、Calendar、Reports、AI、CSV 與平均時薪必須持續重用
   `workMetrics()`，不得保留頁面專用工時公式。
4. Today 手動時間修正採 transactional auto-save；只有 localStorage 寫入與
   read-back 成功後才更新記憶體並通知依賴頁面。
5. Today 工作狀態使用單一自然語言主工時，不顯示秒；工作明細與手動新增
   預設收合。手動工時介面使用小時／分鐘欄位。
6. WorkRecord schema 與 `driverPayApp.v2` 不變，不批量遷移或改寫舊資料。

### 原因

舊 Today 表單會保留 stale `workSession`，而舊優先順序又讓 session 或
`manualHours` 蓋過使用者剛修正的 clock fields，造成 Today 與下游統計顯示
舊工時。整數分鐘可消除小數輸入與浮點誤差，同時保留現有 schema 相容性。

### 影響範圍

- 修改 Today 工時流程、共用工時 selector、CSV 工時顯示、測試與 App Shell
  cache；Calendar／Reports 只接受相同 canonical 結果，不改凍結 UI。
- Supabase、同步、authentication、多段工作模型與 Production 資料均不在
  本決策範圍。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-034](docs/DECISION_LOG.md#d-034)。

## D-035 — V1.1 Today Follow-up 共用資料品質與隱私優先天氣

- Date: 2026-07-29

### 決策

1. Today、Reports 與 AI 共用 `hourlyRateQuality()` 與
   `recordDataQuality()`；資料品質狀態固定為 `complete`、
   `missing-work-time`、`insufficient-work-time`、
   `abnormal-hourly-rate`、`invalid-time-range`。
2. 有效工時至少 10 分鐘，合理時薪上限為 NT$2,000／小時。界線只控制
   分析與提示，不限制、修改或刪除使用者原始收入與工時。
3. 有收入但無有效工時的明確儲存流程提供「補上工時／稍後再補」；不得由
   autosave 重複打擾，也不得用零工時計算時薪。
4. 每日紀錄第一層只保留收入與工時；支出及其他選填資料使用同一表單，
   集中於預設收合的「其他資料」。
5. 自動天氣只限 Today，必須先說明並取得使用者同意，再取得一次性位置；
   使用 Open-Meteo 公開 API，無 API key。精確位置不寫入 WorkRecord 或
   localStorage，建議只在 session 記憶體快取 30 分鐘。
6. 使用者拒絕定位、離線、外部服務失敗或編輯歷史日期時，完整回退手動選擇；
   手動天氣永遠覆蓋自動建議。
7. WorkRecord schema 與 `driverPayApp.v2` key 不變；僅在既有 settings
   相容加入 `weatherAutoConsent`，不需要 migration。

### 原因

極短或缺失工時曾造成 AI 顯示失真的高時薪；同時，Today 的選填資料與明細
操作占用核心流程空間。共用資料品質出口可避免頁面各自判斷，明確同意與
一次性定位則在減少輸入步驟時維持 Local-first 與 Privacy by Default。

### 影響範圍

- 修改 Today workflow、AI／Reports 共用時薪有效性、測試與 App Shell cache。
- Calendar／Reports frozen UI、正式資料、Supabase、同步、authentication、
  WorkRecord schema、精確定位儲存與 Production 均不在本決策範圍。
- Open-Meteo 與 iOS 定位權限的長期真機覆蓋記錄於 TD-027。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-035](docs/DECISION_LOG.md#d-035)。

## D-036 — V1.1 Today 獨立支出、互斥工時模式與同日續跑

- Date: 2026-07-29

### 決策

1. D-035 的表單分層第 4 點由本決策取代：Today 固定保留三個獨立可收合區塊
   「工時設定／新增支出／其他資料」，不得再把完整新增支出元件嵌入其他資料。
2. `儲存支出` 只寫入單筆支出；`儲存詳細紀錄` 處理工時與其他資料。兩條
   流程都必須防止重複提交，且成功 persistence read-back 後才顯示成功。
3. 工時一次只允許 clock 或 manual 一種有效輸入。模式由既有欄位推導，
   不新增 durable mode 欄位；切換模式前必須說明清除範圍並取得確認。
4. 舊紀錄同時含完整 clock 與 manual 時，canonical 結果仍以 clock 優先，
   UI 必須揭露衝突並要求使用者明確選擇，不得靜默清除。
5. 已收工的 clock 紀錄可在確認後「再跑一段」：保留原 `startTime`、將停止
   空檔累加進 `breakMinutes`、清除 `endTime`，並沿用同一天同一筆
   WorkRecord。manual 模式必須先切換。
6. 本 Milestone 不建立完整多段工作資料模型；同日續跑仍輸出同一個 canonical
   實際工時給 Today、Calendar、Reports、AI 與 CSV。
7. Product Owner 只執行一次 Final Human QA；所有程式、L1、公開 Preview
   smoke 與文件完成後才交付，不在過程中重複要求。

### 原因

把完整支出流程放進其他資料會降低高頻支出的可發現性；同時顯示 clock 與
manual 會產生兩個互相競爭的答案。將輸入模式互斥、切換改為確認式交易，
以及把同日第二段工作建模為停止空檔休息，可在不變更 schema 的前提下維持
單一 canonical 工時與原有報表相容性。

### 影響範圍

- 修改 Today 表單結構、支出 persistence、工時輸入 UI、同日續跑、測試、
  文件與 App Shell cache v16。
- `driverPayApp.v2`、WorkRecord schema、收入／支出／工時計算公式、
  Calendar／Reports／AI frozen UI、Supabase、同步與正式資料均不變。
- 完整多段工作模型維持 Deferred；本決策不授權 main merge 或 Production
  deployment，須先完成本 Milestone 唯一一次 Final Human QA。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-036](docs/DECISION_LOG.md#d-036)。

## D-037 — Today 顯示責任去重複與支出控制精簡

- Date: 2026-07-29

### 決策

1. Product Owner 已確認 V1.1 Milestone 1 Final Human QA 通過；後續低風險
   Today 細節 Sprint 可在同一功能分支繼續，但新的 Homepage Detail Human
   QA 通過前不得合併 `main` 或部署 Production。
2. Today 綠色摘要卡是今日正式工時的唯一高階顯示。工作狀態卡只負責狀態、
   工作明細與下一步操作，不再顯示第二份主工時。
3. manual 工時以小時／分鐘輸入作唯一主要顯示，不再顯示重複摘要；clock
   工時保留一次使用 `formatWorkDuration()` 的計算結果。
4. 新增支出的快捷按鈕縮短但維持至少 44px；類別與支出方式改為同列兩個
   真正按鈕，按鈕本身同時顯示目前值與完整選項入口。
5. 快捷分類切換必須保留尚未儲存的金額、日期、支出方式與備註；完整類別、
   legacy／自訂類別、三種支出方式與獨立支出 persistence 均保持原來源。
6. `driverPayApp.v2`、WorkRecord schema、canonical calculation、Calendar、
   Reports、AI 與 CSV 契約均不變，不需要 migration。

### 原因

Today 同時在綠色摘要、工作狀態與 manual 輸入下方重複顯示同一工時，增加
視覺高度卻沒有提供新的操作資訊。支出類別與方式也各自以標籤、目前值及
修改文字重複表達。將責任集中在摘要、狀態與輸入控制本身，可以降低高度，
同時保留所有既有功能與資料相容性。

### 影響範圍

- 僅修改 Today 的顯示結構、支出草稿互動、contract tests、文件與 App Shell
  cache v17。
- 不修改工時、收入或支出公式，不修改任何 durable schema，不修改
  Calendar／Reports／AI／Driver UI，不合併 `main`，不部署 Production。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-037](docs/DECISION_LOG.md#d-037)。

## D-038 — 支出分月採可選 WorkRecord metadata 與衍生成本

- Date: 2026-07-29

### 決策

1. Product Owner 明確授權 WorkRecord 僅增加可選
   `expenseAllocations[category] = { months, startMonth }`；原始
   `expenses[category]`、`driverPayApp.v2` key 與其他欄位不變。
2. 舊紀錄或缺少有效 allocation 的分類一律視為一次支出，不批量改寫、不
   migration。切回一次支出或刪除分類時同步移除對應 metadata。
3. Calendar 與原始付款紀錄持續使用 `entryExpenses()`；Reports／AI 透過
   `reportExpenseSummary()` 將原始金額依月份衍生，不能整除的尾差由最後
   一個月吸收。
4. 為讓週／月趨勢與期間 KPI 可重現，每月衍生成本以該台北月份第一天作為
   report-only accounting anchor；不建立 WorkRecord，也不改變 Calendar。
5. CSV 保留原始付款日期、金額與分類欄，並增加可讀的分月期間、月份數、
   一般月額與尾月金額。
6. 本 Sprint 完成後只 Push 功能分支與提供 Public Preview；不 merge
   `main`、不 Production deploy。

### 原因

只保存原始金額無法在 App 重開後還原月份數與開始月份。可選且分類級的
metadata 是支援修改、刪除、尾差與舊資料相容所需的最小擴充，不需要複製
十二筆紀錄或批量遷移。

### 影響範圍

- Today 支出 UI、WorkRecord 可選 metadata、Reports／AI canonical expense
  selector、CSV、tests、文件與 App Shell v18。
- 收入、工時、平台、其他 WorkRecord 欄位、Supabase、同步、正式資料、
  Calendar UI、main 與 Production 不變。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-038](docs/DECISION_LOG.md#d-038)。

## D-039 — 今日工作狀態整條標題列控制工作明細

- Date: 2026-07-29

### 決策

1. Product Owner 已確認 Expense UX Human QA Passed；後續小型 Today
   work-status Sprint 仍在同一功能分支進行，不 merge main、不 Production。
2. 原 `#workDetailsToggle` 改為「今日工作狀態」整條原生 button，包含圖示、
   標題、中間空白、狀態 badge 與 chevron，觸控高度至少 44px。
3. 移除獨立「工作明細 ＋」列；繼續沿用同一 `#workMetrics`、
   `setWorkDetailsExpanded()` 與 `aria-expanded` state，不建立第二套明細。
4. 工作操作與明細內容位於 toggle 外；狀態或計時更新只同步 accessible
   name，不改變展開 state，也不清除工時草稿。
5. 本 Sprint 不修改 canonical work-time、狀態機、WorkRecord、
   `expenseAllocations`、`driverPayApp.v2` 或任何下游資料。

### 原因

獨立「工作明細」列只有右側小控制，浪費一整行高度並縮小單手操作範圍。
把 disclosure 語意集中到既有標題列，可在不改資料與狀態邏輯下提供完整
44px 點擊面積、鍵盤與 VoiceOver 語意。

### 影響範圍

- 僅修改 Today 工作狀態卡 presentation／disclosure、tests、docs 與 App
  Shell v19。
- 工時計算、工作狀態機、收入、支出、Calendar／Reports／AI／CSV、
  schema、Supabase、main 與 Production 不變。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-039](docs/DECISION_LOG.md#d-039)。

## D-040 — AI 與 Reports 共用單一閱讀文字大小設定

- Date: 2026-07-29

### 決策

1. Driver「顯示設定」新增標準／舒適／大字三個原生 radio，唯一 durable
   source 為可選 `settings.aiReportsReadingSize`。
2. 舊資料缺少欄位或出現未知值時使用 `standard`，不批量改寫、不 migration。
3. 切換後立即更新 `<html data-ai-reports-reading-size>` 並交易式保存；失敗
   必須回復前一視覺與 setting。
4. AI 與 Reports 共用同一組 reading CSS variables；放大內文、次要文字、
   行高、閱讀間距與圖表標籤，主標題和主要 KPI 只維持或輕微調整。
5. Today、Calendar、一般 Driver、Bottom Navigation、canonical analytics、
   WorkRecord、`expenseAllocations` 與 `driverPayApp.v2` key 不變。
6. 本 Sprint 只 Push 功能分支與提供 Public Preview；不 merge `main`、不
   Production deploy。

### 原因

AI 長文與 Reports 次要標籤在手機上需要較彈性的閱讀尺度，但瀏覽器 zoom 或
頁面各自的字級 state 會放大操作控制、增加 overflow 並造成設定分歧。單一
持久偏好配合共享 typography tokens，可在不改資料和計算的前提下提供一致
且可回復的閱讀體驗。

### 影響範圍

- Driver 顯示設定、AI／Reports presentation、tests、docs 與 App Shell v20。
- Today、Calendar、其他 Driver 設定、Bottom Navigation、資料公式、CSV、
  schema、Supabase、main 與 Production 不變。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-040](docs/DECISION_LOG.md#d-040)。

## D-041 — Calendar Today 日期改用日期圓圈標記

- Date: 2026-07-29

### 決策

1. Product Owner 明確核准 Calendar V1.1 的 Today marker 小範圍 Freeze
   例外；本次只修改今天日期標記，不重設 Calendar 其他狀態或版型。
2. 今天未選取時，以 28～30px、2px 品牌深綠外框直接包住日期數字；不得
   使用原本的小圓點、短橫線、文字、額外圖示或動畫。
3. 今天被選取時，日期圓圈改為品牌深綠實心、文字使用反差色；日期格只
   保留低干擾 surface，不再疊加強烈 cell border。
4. Today 可與 Heat、Record、Adjacent Month 組合；外框／實心圓必須保持
   清楚且只有一個 Today marker。
5. `aria-current="date"` 只套用真正台北今天；既有 `aria-selected`、完整
   日期格點擊範圍、canonical local-date、今天按鈕、deep link 與工作紀錄
   卡片全部維持。
6. App Shell 更新為 `driver-pay-pro-v21`。本階段只 Push 功能分支並提供
   Public Preview；最終 Human QA 通過前不 merge `main`、不 Production。

### 原因

日期下方 4px 小圓點在 iPhone 上不易辨識，也可能讓使用者花時間判斷是否為
資料符號。直接包住日期數字能在不增加格高或第二個控制的前提下，讓 Today
身分更清楚。

### 影響範圍

- Calendar Today marker presentation、Accessibility contract、tests、docs 與
  PWA cache。
- 不修改其他日期、Heat 演算法、Calendar state／Editor、Today、Reports、
  AI、Driver、WorkRecord、`expenseAllocations`、`settings.aiReportsReadingSize`、
  `driverPayApp.v2`、Supabase、main 或 Production。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-041](docs/DECISION_LOG.md#d-041)。

## D-042 — 全 App 顯示大小、Driver 系統狀態與 Calendar 共用日期基線

- Date: 2026-07-29

### 決策

1. D-040 的 AI／Reports 專用閱讀設定升級為全 App「顯示大小」。唯一
   canonical durable source 是可選 `settings.displaySize`；合法新欄位優先，
   缺少時才讀取合法 `settings.aiReportsReadingSize`，其餘回退 `standard`。
2. 執行期與新寫入只使用 `displaySize`；root 使用 `data-display-size`。
   標準保留既有比例，舒適一般內文約 16px，大字約 18px。Today、Calendar、
   Reports、AI、Driver 與 Bottom Navigation 重用同一 Design System tokens，
   不使用 zoom、scale 或頁面專用 setting。
3. Driver 原資料狀態與 App 狀態合併為置底單一「系統狀態」disclosure；
   正常預設收合，讀取／storage 異常顯示「需要注意」並可自動展開一次。
4. Calendar 所有日期共用 34px day slot，320px 使用 32px；透明 border
   保留相同 geometry。Today 只切換該 slot 的外框／背景，不使用位移補丁，
   不修改 cell 高度、Heat、Selected、Today button 或資料互動。
5. App Shell 更新為 `driver-pay-pro-v22`。本階段只 Push 功能分支並提供
   Public Preview；只有收到指定 Final Human QA 與 Release Candidate 核准
   後才能 merge `main` 與 Production deploy。

### 原因

閱讀偏好若只影響 AI／Reports，使用者在其他主要頁面仍會遇到相同小字；
同一 global token hierarchy 能提高一致性又保持 KPI 層級。Driver 狀態卡
重複且佔用上方空間，合併 disclosure 可保留資訊並降低日常干擾。Today 圓圈
若只有今天擁有額外高度，會造成日期基線下沉；所有日期共享同一槽位才能從
根本消除偏移。

### 影響範圍

- 全域 presentation tokens、Driver system-status presentation、Calendar day
  geometry、tests、docs 與 PWA cache。
- 不修改 WorkRecord、canonical calculations、`expenseAllocations`、
  `driverPayApp.v2` key、Supabase、main 或 Production。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-042](docs/DECISION_LOG.md#d-042)。

## D-043 — Progressive Disclosure、核准字級與 Chevron 語意

- Date: 2026-08-04

### 決策

1. Today 今日收入以整排 disclosure 顯示；金額永遠可見，進度資訊只在展開
   後顯示，session state 不持久化。
2. AI 首屏只完整顯示本週重點；本月洞察、收入變化來源與資料分析依據預設
   收合，既有 analytics 與唯讀責任不變。
3. Driver 第一層固定四類；About 與系統狀態合併至 App 與系統，移除獨立
   About route／row 與獨立 system-status card。
4. 全 App body／secondary 為 13／12、17／15、22／19px。Calendar 另用受控
   token，日期 14／16／20px、Today circle 34／36／40px。
5. `.app-chevron` 統一為 20px、stroke 2；左右只表示導覽，向下／上表示原地
   收合／展開，一般動作不加箭頭。
6. App Shell 更新為 v23；Human QA 核准前不 merge main、不 Production。

### 原因

在不增加資料與功能的前提下，以較少預設內容、更清楚字級差異及一致互動，
降低司機快速查看時的閱讀壓力與誤觸風險。

### 影響範圍

- Today／AI／Driver presentation、global／Calendar typography tokens、Chevron、
  Accessibility、tests、docs 與 PWA cache。
- 不修改 WorkRecord、analytics、收入／工時／支出公式、CSV、storage key、
  Supabase、main 或 Production。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-043](docs/DECISION_LOG.md#d-043)。

## D-044 — Today 只收合目標進度與 Driver 設定去重複

- Date: 2026-08-04

### 決策

1. D-043 的 Today disclosure 範圍收斂為每日目標進度；今日收入、今日實際
   工時與目前時薪在收合與展開狀態都固定可見。
2. 目標進度包含未設定提示、達成百分比、尚差金額及進度條，使用單一
   `todayGoalExpanded` session state，跨台北日期回到收合。
3. Driver 常用設定只顯示單一「每日目標」與單一「字體大小設定」，移除重複
   標題、說明及一般成功狀態文字；既有自動儲存、離線與錯誤回饋不變。
4. Driver 第一層仍固定四類；Header 摘要依序為無摘要、「平台、支出」、
   「備份、匯出」及「正常／需要注意」。
5. App 與系統只保留此裝置與 App、本機資料、離線功能及 Service Worker 的
   可靠狀態；About、版本、作者、法律與資料安全提醒保留。
6. App Shell 更新為 v24；Human QA 前不 merge main、不 Production。

### 原因

收入、工時與時薪是 Today 三秒內必須看見的核心結果，不應因目標進度收合而
消失。Driver 重複標題與診斷文字增加閱讀成本；直接保留唯一控制及可採取行動
的狀態，更符合設定頁快速操作與 One Motion = One Meaning。

### 影響範圍

- Today／Driver presentation、Accessibility、tests、docs 與 PWA cache。
- 不修改 WorkRecord、canonical calculations、收入／工時／支出公式、
  `settings.displaySize`、CSV、`driverPayApp.v2`、Supabase、main 或 Production。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-044](docs/DECISION_LOG.md#d-044)。

## D-045 — 支出管理、Calendar 原地編輯與總收入時薪口徑

- Date: 2026-08-04

### 決策

1. 月報支出分類重用 `reportExpenseSummary()`；油錢優先，其餘依月成本排序，
   原地展開日期、金額與備註。分月支出的主數字是月成本，實際付款不同時才
   額外顯示。
2. Today 新增預設收合的今日支出清單；移除以既有日期＋類別為單位，交易式
   保存後提供 5 秒復原，完整保留或恢復備註與 allocation。
3. Calendar 過去紀錄使用收入／工時／支出／其他資料／更多操作五個原地
   disclosure，移動唯一既有表單 DOM；取消全頁／Modal Editor、全域編輯與
   固定巨大刪除按鈕。
4. 所有時薪固定為總收入除以有效工時。支出繼續影響淨收入與成本，但不得
   降低時薪；品質門檻、零工時及異常值仍由 canonical helper 處理。
5. Calendar／Reports 重複內容標題移除，Calendar 垂直間距與顯示模式列高
   精簡；Bottom Navigation 使用五頁一致的品牌 active state 及
   `aria-current="page"`。Today KPI 改為置中主收入與等寬次要兩欄。
6. App Shell 更新為 v25。Human QA 前只 Push 功能分支與 Public Preview，
   不 merge `main`、不 Production deploy。

### 原因

支出核對、歷史修正與當前頁辨識都應在原上下文一次完成；跨頁或全頁編輯會
增加垂直移動及操作成本。時薪是收入效率，需與成本後淨收入分開，才能讓 Today、
Calendar、Reports、AI 與 CSV 保持同一可解釋口徑。

### 影響範圍

- Today／Calendar／Reports presentation、canonical expense summary、hourly
  input、tests、docs 與 App Shell v25。
- 不修改 `driverPayApp.v2`、WorkRecord、`expenseAllocations`、平台收入資料、
  Manifest、Supabase、migration、main 或 Production。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-045](docs/DECISION_LOG.md#d-045)。

## D-046 — Expense Management、Calendar Inline Editing 與 KPI Production Release

- Date: 2026-08-04

### 決策

1. D-045 已完成唯一一次 Product Owner Human QA：Passed，Release Candidate：Approved。
2. 已將功能分支 `codex/expense-calendar-kpi-integration-20260804` 以一般 merge
   合併至 `main`，merge commit 為 `b17b6d9b49f3cbe025af2264c976d75aca4f16f0`。
3. 由既有 Vercel Git Integration 建立 Production deployment
   `dpl_Goj84FfTsGga2wfNfF7xQBMsFLGy`，正式網址為 `https://driver-pay-app.vercel.app`。
4. Production 使用 `driver-pay-pro-v25`，localStorage key、WorkRecord、
   `expenseAllocations`、Manifest 與 Supabase 狀態維持不變。

### 驗證

- `npm run release:check` 通過；完整 Node 339/339，所有 targeted tests 通過。
- Production 390px 五頁 Smoke QA 通過，無 Console error／warning，無水平 overflow。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-046](docs/DECISION_LOG.md#d-046)。

## D-047 — Calendar 唯讀與 Today 每日紀錄責任

- Date: 2026-08-04
- Decision:
  1. Calendar 工作紀錄卡只負責查看歷史資料，不提供新增、編輯、刪除或支出
     mutation；Today 是每日紀錄的唯一輸入與修改 owner。
  2. 全 App 時薪固定使用總收入除以有效工時，支出只影響淨收入與成本分析。
  3. 週報與月報共用支出分類 selector；首頁目標進度只收合底部區域。
  4. 不改 `driverPayApp.v2`、WorkRecord schema、`expenseAllocations` 或 Supabase。

本條目同步記錄於 [`docs/DECISION_LOG.md` 的 D-047](docs/DECISION_LOG.md#d-047)。

## D-048 — Active Record Date and Today KPI Production Hotfix

- Date: 2026-08-04
- Decision:
  1. `activeRecordDate` 是 Today 唯一 session 日期；所有 Daily Record mutation
     必須顯式傳入同一目標日期並通過 guard，不得 fallback 到今天。
  2. Calendar 維持唯讀；有效過去日期以 `新增紀錄／編輯這天` 導向 Today。
     Calendar 不再搬動、掛載或擁有 Daily Record 表單。
  3. Today 返回時完整恢復並重繪 KPI、工作狀態、平台收入、每日紀錄、支出與
     其他資料，從來源修正 Calendar → Today 半頁渲染。
  4. Today KPI 的今日收入是左對齊最大數字，工時／時薪為等寬兩欄；只有目標
     進度可收合，KPI 工時使用簡潔分鐘／小時格式。標準顯示模式重用舊版已
     驗證的 `50–64px` 主收入與 `26–32px` 次要 KPI 比例。
  5. App Shell candidate 更新為 v27；Human QA 前只 Push Hotfix branch 與
     Public Preview，不 merge main、不 Production deploy。
  6. Today 每日紀錄日期卡恢復為唯一可操作日期入口；只能選今天或過去日期，
     選擇後直接更新 `activeRecordDate`，支出付款日期同步且不建立第二份 state。
- Reason: 舊 Calendar editor 搬移 Today 實體 DOM，且寫入路徑混用多個日期來源，
  形成 Production 資料完整性與導航渲染 Release Blocker。
- Impact: Today／Calendar routing and presentation、write guards、tests、docs、v27；
  `driverPayApp.v2`、WorkRecord、allocation、Manifest、Supabase 與正式資料不變。

## D-049 — Semantic Display Size and KPI Hierarchy

- Date: 2026-08-08
- Decision:
  1. `settings.displaySize` 與 `data-display-size` 維持唯一顯示偏好，但不再以
     13／17／22px 對頁面文字等比例放大；改為 Data／Controls／Structure 三層。
  2. Today 主收入與次要工時／時薪分別使用 `--font-kpi-primary` 與
     `--font-kpi-secondary`；三者共用 system font、700、line-height 1 與
     tabular numerals。工時單位使用較小的 `--font-kpi-unit`。
  3. 每日目標與平台收入輸入值重用 `--font-input-value`，standard／comfort／
     large 固定為 26／29／32px；一般主數據使用 24／27／30px。
  4. 頁面／卡片標題、Driver 分類、Header、Logo、Bottom Navigation 固定或
     只小幅變化；字體切換控制本身固定 14px。
  5. Calendar 日期的既有 14／16／20px 與 Today circle 34／36／40px 契約不變。
     App Shell candidate 更新為 v28；Human QA 前不 merge main、不 Production。
- Reason: 舊規則放大大量結構文字，卻讓每日目標與主要資料缺少清楚級差，造成
  視覺優先順序反轉及大字模式擁擠。語意 token 可讓數據真正可讀，同時穩定版面。
- Impact: Design System typography、Today／Driver／Reports／AI presentation、
  tests、docs 與 v28；設定來源、計算、WorkRecord、storage key、Manifest、
  Supabase、main 與 Production 不變。

## D-050 — Today Daily Record Native Date Picker

- Date: 2026-08-08
- Decision:
  1. Today 每日紀錄日期卡繼續使用唯一原生 `input[type="date"]`，整張日期卡都是
     Picker 觸發區，不建立自訂月曆或第二份日期 state。
  2. Date input 保留 native appearance；WebKit picker indicator 覆蓋完整卡片。
     支援 `showPicker()` 時作直接開啟增強，不支援時保留原生點擊 fallback。
  3. 選擇結果仍只進入 `activeRecordDate`，僅允許今天或過去日期；收入、工時、
     支出、其他資料及付款日期沿用同一日期 guard。
  4. App Shell 更新為 v29。
- Reason: `appearance: none` 移除了 Chrome／部分 WebKit 的原生日期面板觸發區，
  導致點擊日期卡只顯示焦點框而無法選日。
- Impact: Today date-picker presentation／interaction、tests、docs 與 v29；
  `driverPayApp.v2`、WorkRecord、計算、Manifest、Supabase 與正式資料不變。
