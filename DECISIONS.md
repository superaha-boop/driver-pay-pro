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
