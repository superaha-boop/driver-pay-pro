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
