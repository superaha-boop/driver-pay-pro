# Driver Pay Pro Decision Log

本文件記錄已確認且會影響後續產品或工程工作的決策、理由與影響。它不是 commit 歷史；程式變更時間線請見 `docs/CHANGELOG.md`。

## D-001

- Date: 2026-07
- Decision: 主要族群設定為 20～50 歲職業與兼職司機。
- Reason: 符合主要實際使用者範圍。
- Impact: 介面強調快速閱讀與操作，不以高齡模式作為唯一設計基準。

## D-002

- Date: 2026-07
- Decision: 首頁核心操作為平台收入直接輸入。
- Reason: 司機最常在完成行程後快速更新平台收入。
- Impact: 不需先按新增收入或進入新頁面。

## D-003

- Date: 2026-07
- Decision: 採用 Mobile First 與 Apple-inspired UI。
- Reason: 主要使用設備為 iPhone，並降低學習成本。
- Impact: 優先使用熟悉的 iOS 互動與單手操作，但不複製 Apple 品牌素材。

## D-004

- Date: 2026-07
- Decision: 工作計時支援開始、暫停、繼續及收工。
- Reason: 午休或中途休息不應計入實際工時。
- Impact: 時薪以扣除休息後的實際工時計算。

## D-005

- Date: 2026-07
- Decision: 採用 Official Master Icon v1.0。
- Reason: 統一品牌素材，避免 Codex 自行生成或錯誤裁切。
- Impact: Header、PWA、Apple Touch Icon 與 Favicon 應使用正式圖檔。現況是 Header 已使用 Master Icon，但其他 PWA icon 路徑尚未全部統一；必須另立 PRD 並完成 PWA 驗證，不可在無關任務順便替換。

## D-006

- Date: 2026-07
- Decision: 開發完成後必須經過 iPhone Beta Test 才能標示 Done。
- Reason: Driver Pay Pro 的核心使用環境為 iPhone 與真實司機工作流程。
- Impact: Codex 完成後僅能標示 Ready for Human QA。

## D-007

- Date: 2026-07
- Decision: MVP 現階段採方案 A，以瀏覽器 `localStorage` 保存資料。
- Reason: 可維持零後端成本，並讓不同裝置／瀏覽器在同一網址進行彼此獨立的小規模測試。
- Impact: 核心 key 固定為 `driverPayApp.v2`；目前沒有登入、雲端備份或跨裝置同步，清除網站資料可能造成資料遺失。

## D-008

- Date: 2026-07
- Decision: 一般平台收入輸入新當日總額並覆蓋舊值；只有 Yoxi 加號新增單筆並累加。
- Reason: 一般平台適合直接修正日總額，Yoxi 則需要逐筆車資紀錄。
- Impact: 不得把所有平台改成自動累加；Yoxi 累計總額仍可直接修正。

## D-009

- Date: 2026-07
- Decision: 首頁主要 UI、平台收入設計與週報第一輪手機響應式成果進入凍結狀態。
- Reason: 已完成驗收方向，持續順手美化會增加回歸風險。
- Impact: 後續只允許依明確 PRD 修改指定小範圍，不得重做整頁。

## D-010

- Date: 2026-07
- Decision: 手機月份明細採單一外層面板中的精簡每日 row，桌面保留表格。
- Reason: 大幅減少手機捲動距離，同時保留桌面資料密度。
- Impact: 700px 以下不使用每日獨立卡片、展開功能或水平捲動；每日以細線分隔。

## D-011

- Date: 2026-07
- Decision: AI 分頁第一版採本機規則與統計，不接外部模型。
- Reason: 以現有資料提供可重現、零 API 成本的營運分析。
- Impact: 不加入聊天框、付費 AI API、API Key 或虛假 AI 連線宣稱；缺資料時顯示資料不足或空狀態。

## D-012

- Date: 2026-07
- Decision: 文件按「產品方向、設計規範、開發流程、決策、實作規格、功能狀態、變更歷史」分工。
- Reason: 避免同一規則散落於多份名稱相近文件，並保留產品與技術狀態的不同生命週期。
- Impact: 不另建同義文件；重複內容應整合並以交叉連結取代多份平行版本。

## D-013

- Date: 2026-07-24
- Decision: Sprint 完成並通過適用驗證後，Codex 可直接 Commit 並 Push 到目前工作 Branch。
- Reason: 專案已進入多人測試與持續開發階段，需要降低每次完成修改後的發布等待，同時維持檔案範圍與 Git 歷史安全。
- Impact: Codex 必須只 stage 本 Sprint 核准檔案、使用規範化 Commit Message、更新 `HANDOFF.md` 並回報 Branch、Commit Hash 與驗證結果；Merge、Production Deploy、Push 到 `main`、Reset、Rebase、Force Push、Schema／Migration、架構重構及資料破壞操作仍需使用者明確確認。

## D-014

- Date: 2026-07-24
- Decision: D-008 的「只有 Yoxi 累加」固定規則已由可設定平台輸入模式取代。
- Reason: 不同車隊的實際記錄方式不同，使用者需要讓每個平台獨立選擇直接輸入總額或每筆收入累加。
- Impact: 預設仍只有 Yoxi 使用累加；其他平台與自訂平台預設直接輸入總額。切換模式不得清除既有收入，所有模式仍輸出同一個當日平台總額供既有報表使用。

## D-015

- Date: 2026-07-25
- Decision: 工時內部統一使用毫秒，週報週期固定為星期日至星期六的完整 7 天。
- Reason: 歷史未結束 session 使用目前時間持續累加會產生數百小時，且本地日期經 UTC 序列化會讓週期兩端各退一天。
- Impact: 首頁、週報、月度摘要、CSV 與 AI 統一使用 `workMetrics()` 與 `hourlyRate()`；歷史未結束 session 只讀取已累積的可信工時，不改寫原始資料。週期使用本地日期運算，不以 `toISOString()` 產生日曆日期。

## D-016

- Date: 2026-07-25
- Decision: Sprint 完成並通過適用驗證後，Codex 預設將工作 Branch 以一般 Git 合併整合至 `main`，Push `main` 並確認 Vercel Production Deployment，不需逐次再次取得發布確認。
- Reason: Product Owner 希望每次完成修改後，手機正式版可直接取得最新版，不再需要額外手動合併或部署。
- Impact: 發布仍必須保留可追溯 Git 歷史並核對 Production commit；當次明確要求不部署、驗證未通過、遠端衝突無法安全判定或可能造成資料遺失時必須停止。Reset、Rebase、Force Push、Schema／Migration、正式資料刪除與架構級變更仍需另行明確確認。

## D-017

- Date: 2026-07-25
- Decision: D-015 的週期定義改為星期一至星期日；週期與台灣日期以不受 UTC 序列化偏移影響的 date-only 曆法計算。
- Reason: Product Owner 正式確認營運週由星期一開始，且舊版將台灣午夜轉為 UTC 日期字串，造成週期兩端各往前一天與六天顯示。
- Impact: 星期日歸屬前一個星期一開始的週，週末固定為開始日加 6 天；同月、跨月與跨年分別顯示如 `7/13－7/19`、`6/29－7/5`、`2026/12/28－2027/1/3`。PWA 發布必須同步更新 Service Worker cache 版本，避免手機繼續使用舊週期或工時程式。

## D-018

- Date: 2026-07-25
- Decision: 底部資訊架構固定為「今天｜月曆｜報表｜AI｜Driver」；月曆只管理每日歷史紀錄，週報、月報與平台統一隸屬同一個報表頁。
- Reason: 舊版把週報與月份明細放在月曆、月報與平台又歸屬分析，造成上方分頁與底部 Active State 不一致。
- Impact: 月曆與報表各自保存月份；報表三個分頁共用月份並記住最後分頁。底部五個圖示統一使用 24px、2px stroke 的 Lucide inline SVG，不再混用 Unicode 字元。

## D-019

- Date: 2026-07-25
- Decision:
  1. Driver Pay Pro 建立永久的全域產品設計規範。
  2. 所有頁面遵循三秒原則，讓使用者快速理解用途、核心資訊與下一步。
  3. 重要資訊與操作最多維持總覽及詳細／編輯／設定兩層。
  4. 安全操作優先使用合理預設、自動儲存、已核准的自動同步、即時更新與低干擾回饋。
  5. 高頻操作必須適合單手操作，並以 iPhone Safari 與 installed PWA 為主要驗收環境。
  6. 視覺採 Apple-like 的低彩度、清楚層級、合理留白及柔和深度感。
  7. 不採用傳統企業 Dashboard、Excel 資料表、彩色 KPI 卡片牆或 Android Material Dashboard 風格。
  8. 月曆的「工作紀錄卡片」採混合式布局。
  9. 核心資料使用雙欄，延伸資料使用單欄。
  10. 工作紀錄卡片支援精簡、標準、完整及自訂模式。
- Reason: Driver Pay Pro 的主要使用者會在行程間快速查看或記錄資料；產品需要一套跨頁面、跨任務且可由後續 Codex 一致執行的設計判準，避免每次 Sprint 重新發明介面。
- Impact:
  - 適用於所有新頁面、UI／UX 修改、元件、響應式、PWA、動畫、表單、導航、設定、報表、月曆與 AI 任務。
  - `AGENTS.md` 是完整永久規則；`PROJECT_CONTEXT.md` 只保存產品背景摘要。
  - 未來 Calendar 採 `Overview → Detail`，點選日期後在月曆下方顯示工作紀錄卡片。
  - 工作紀錄卡片的核心欄位、延伸欄位、空資料與設定入口必須遵守核准規格。
  - 本決策只建立規範，不代表月曆 UI、卡片設定、拖曳、滑動、收入熱度或同步功能已完成。
- Rejected alternatives:
  - 不採每個頁面各自建立一套視覺與互動規則。
  - 不採多層導航、重複確認、每項數字一張卡片或卡片巢狀。
  - 不採先做 Desktop 再縮成手機的流程。
  - 不採單純增加圓角來模仿 Apple 風格。
  - 不採傳統 Dashboard、彩色 KPI 卡片牆、大量漸層、厚重陰影或過度裝飾。
- Change control: 未來如需修改本決策、工作紀錄卡片布局或四種顯示模式，必須先取得 Product Owner 的明確產品決策與核准 PRD，不得由 Codex 在實作任務中自行改寫。

## D-020

- Date: 2026-07-25
- Decision:
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
- Reason: 讓後續頁面不再各自猜測視覺規格與基礎元件，同時避免在現有靜態單頁 PWA 中引入大型框架或一次性重寫風險。
- Impact:
  - 新 UI 優先使用 `styles/design-system.css` 與 `.ds-*` primitives。
  - 現有首頁、月曆、報表、AI 與 Driver 保持功能及版型，依核准 Sprint 漸進遷移。
  - 專案目前沒有 TypeScript 或 build pipeline；共用 API 使用語意 HTML、CSS class 與原生 ARIA 狀態。
  - Design showcase 使用獨立 `design-system.html`，不在產品導航或 PWA App Shell。
  - 完整使用方式與相容性說明見 `docs/DESIGN_SYSTEM.md`。
- Rejected alternatives:
  - 不新增 React、Storybook、Tailwind 或其他大型 UI framework。
  - 不一次性重寫全站 CSS 或已凍結頁面。
  - 不為 dark mode 在本 Sprint 擴大範圍。
  - 不建立第二套 Button、Card、EmptyState、Skeleton 或 SaveStatus。
