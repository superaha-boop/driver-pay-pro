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
