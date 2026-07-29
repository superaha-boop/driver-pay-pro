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

## D-021

- Date: 2026-07-25
- Decision:
  1. 建立 `docs/PRODUCT_SPEC.md` 作為 Driver Pay Pro 正式產品邊界、頁面責任、功能歸屬與跨頁資料契約。
  2. Bottom Navigation 固定為 Today、Calendar、Reports、AI、Driver，不增加第六個主要分頁。
  3. 每個可寫入功能只有一個 Primary owner；其他頁面只能 View、Link 或 None。
  4. Today 只處理今日工作與今日紀錄；Calendar 負責定位日期、補登、編輯與刪除過去紀錄；Reports 與 AI 唯讀；Driver 只管理持久設定。
  5. 收入、支出、淨收入、實際工時、平均時薪及週／月彙總必須共用 canonical calculation，不得由各頁複製公式。
  6. Calendar 週期為星期一至星期日；新啟動選今天，同一 App session 保留選取日期，未來日期不可建立紀錄。
  7. Calendar 與 Reports 月份狀態維持獨立；Reports 記住內部分頁。
  8. 現況差距記錄在 Current State Audit 與 `docs/TECH_DEBT.md`，本 Sprint 不修改 UI、資料、localStorage、PWA 或業務邏輯。
  9. 下一個正式工作為「Calendar Interaction and Implementation Specification」。
- Reason: 五頁資訊架構與功能數量增加後，需要一個能約束後續 PRD 與實作的責任矩陣、單一資料來源和跨頁行為契約，避免功能漂移、重複表單及計算分歧。
- Impact:
  - 所有後續 UI、元件、路由、資料 selector 與測試都必須核對 `docs/PRODUCT_SPEC.md`。
  - Today 與 Calendar 必須共用資料模型、validation、autosave 與 canonical calculations，但可依頁面任務採不同 composition。
  - Reports 與 AI 需要修正紀錄時只能連到 Calendar 的確切日期。
  - 改變頁面 owner、Bottom Navigation、canonical calculations、localStorage key 或 Calendar 決策需要新的 Product Owner 核准。
  - 本決策不代表 Calendar 日期格、工作紀錄卡片、deep link、未來日期 guard 或 AI 計算去重已實作。
- Rejected alternatives:
  - 不讓多個頁面各自擁有同一個寫入功能。
  - 不讓 Reports 或 AI 直接編輯紀錄。
  - 不把 Calendar 與 Reports 重新合併。
  - 不以文件 Sprint 為理由修改 production code、資料模型或 PWA cache。

## D-022

- Date: 2026-07-25
- Decision:
  1. Calendar 一般新 session 的 `selectedDate` 與 `displayedMonth` 都使用台北當地今天；同 session 返回時保留兩者，新 session 重設今天。
  2. Calendar 不自動選最近工作日，也不因今天無資料跳到其他日期。
  3. 單純使用月份箭頭或月份滑動只改 `displayedMonth`，不得偷偷改變 `selectedDate`；選取日期不在目前月份時，grid 不製造假選取。
  4. Calendar 固定 Monday-first。
  5. 月份箭頭、今天按鈕與日期點擊是必要操作；月份／日期滑動只是增強。
  6. Today、Selected 與 Income Heat 是不同且可組合的狀態；Selected 優先，Today indicator 保留。
  7. 收入熱度使用當月有效正淨收入的分位數四級；少於四筆採相對最大值 fallback，零與負值不使用正收入熱度。
  8. 工作紀錄卡片位於 Month Grid 正下方，第一版固定標準模式，不使用平台 Logo。
  9. 今天空狀態連到 Today；過去空日期可補登；未來日期可查看但不可新增。
  10. 編輯入口直接顯示於卡片；刪除放在次級位置並使用包含日期與影響範圍的確認。
  11. Calendar 必須使用 canonical calculations、Design System primitives 與單一可重用 Record Editor。
  12. Calendar 不加入即時工作控制、趨勢、平台排行或 AI 洞察，也不取代 Reports。
  13. Calendar Implementation 建議拆為 Read and Navigate、Record Mutation and Hardening 兩個 Sprint。
- Reason: 目前實作只有月份下拉與每日清單，Editor 又緊密綁定 Today。先固定狀態、互動、資料、錯誤與驗收契約，可避免下一輪同時猜測 UX、建立第二套表單或引入資料寫入風險。
- Impact:
  - `docs/CALENDAR_SPEC.md` 是 Calendar Implementation 的主要依據。
  - 一般新啟動不再由持久化 `settings.calendarMonth` 決定選取日期；舊欄位仍保留相容性，未經 migration 不刪除。
  - 日期格只顯示淨收入簡寫；完整資料由標準工作紀錄卡片顯示。
  - Calendar create/edit/delete 必須在下一輪先建立可回復的 persistence transaction 與同一 Record Editor origin/return contract。
  - 本決策不代表 UI、日期格、熱度、手勢、Editor、future guard 或資料寫入已完成。
- Rejected alternatives:
  - 不把手勢作為唯一月份或日期操作。
  - 不讓月份瀏覽偷偷改變使用者正在查看的紀錄。
  - 不在 Calendar 複製 Today 表單或 Reports 計算。
  - 不在規格 Sprint 修改 production UI、資料模型、PWA cache、導航或商業邏輯。

## D-023

- Date: 2026-07-25
- Decision:
  1. Calendar Sprint 4A 僅提供 Read and Navigate；create、edit、delete 與 Record Editor 延後至 Sprint 4B。
  2. Navigation Never Loses Context：外部有效日期覆蓋 session selection 並同步月份；無效日期回到台北今天，不建立紀錄。
  3. One Motion = One Meaning：水平位移只表達月份或日期改變；短淡入只表達卡片內容更新。
  4. `selectedDate`、`displayedMonth`、focus、gesture 與 transition 都是 session-only UI state，不寫入 `driverPayApp.v2`。
  5. 月份切換只改 `displayedMonth`；選取日期不在該月時不製造假 Selected，卡片保留原日期並顯示低干擾提示。
  6. 日期格式化、金額簡寫與熱度是 display-only，不回寫原始資料。
  7. Calendar 月份格、標準工作紀錄卡片與摘要重用 `entryTotal`、`entryExpenses`、`entryNet`、`workMetrics`、`hourlyRate`、`platformNetAmount` 與 `summarize`。
  8. `settings.calendarMonth` 保留舊資料相容性但不再驅動或保存新 Calendar session。
  9. Month switch preserving selectedDate 保留為正式規則，但標記 Needs UX Validation，真機 QA 前不得自行改成選月初或同日。
- Reason: 先將 Calendar 的日期與唯讀資料展示驗證完成，再於 Sprint 4B 引入單一 Record Editor 與交易式資料寫入，可避免同一 Sprint 同時承擔 UI 置換與資料遺失風險。
- Impact:
  - Calendar 已取代 legacy 月份下拉／每日表格，成為 Monday-first Month Grid。
  - 今天、過去與未來空狀態在 Sprint 4A 都不建立工作紀錄；只有今天空狀態可導向 Today。
  - Calendar 瀏覽不呼叫資料寫入函式，也不修改 localStorage schema 或 key。
  - 後續 Sprint 4B 必須遵守單一 Record Editor、past-only mutation、transaction rollback 與 SaveStatus 契約。
- Rejected alternatives:
  - 不在 Sprint 4A 暫接回舊 `editEntry()` 或 `deleteEntry()`。
  - 不把 selectedDate 寫入 localStorage 或 sessionStorage。
  - 不讓月份切換自動選最近工作日、同日或月初。
  - 不在 renderer 重新計算收入、淨收入、工時或時薪。

## D-024

- Date: 2026-07-25
- Decision:
  1. Calendar Sprint 4A.5 僅進行 Visual Polish，不改變 state、日期、手勢、鍵盤、ARIA、read-only 或資料行為。
  2. 頂部採更緊湊的頁內 spacing，但月份箭頭、今天與日期格觸控操作不得低於 44×44px。
  3. 工作紀錄卡片保持相同資料內容，以 typography、spacing 與低對比分隔線建立 Primary／Secondary metrics 層級。
  4. Income Heatmap 只微調 Design System 的四級 semantic tokens；分級演算法、fallback、同值規則、Selected 與 Today 語意不變。
  5. Month switch preserving `selectedDate` 維持 D-022／D-023，繼續列為 Needs UX Validation。
- Reason: Sprint 4A 的互動與資料契約已固定；以低風險 presentation 調整減少非必要留白，可讓手機更早看到 Work Record Card，並改善戶外閱讀與資料掃讀，不需承擔資料寫入風險。
- Impact:
  - 只修改 Calendar presentation、heat semantic tokens、相關 contract tests 與 Service Worker cache version。
  - `driverPayApp.v2`、WorkRecord schema、canonical calculations、heat algorithm、月份摘要、導航與其他頁面不變。
  - Human QA Gate 必須覆蓋實體 iPhone Safari、installed PWA、VoiceOver、iOS 返回手勢、safe area、Service Worker 更新及月份保留選取日期 UX。
- Rejected alternatives:
  - 不以縮小 touch target 或字級換取垂直空間。
  - 不新增圖例、裝飾圖示、卡片巢狀或額外指標標題。
  - 不在視覺 Sprint 修改 heat 分級、日期選取或月份切換規則。

## D-025

- Date: 2026-07-25
- Decision:
  1. Calendar Sprint 4B 只允許過去日期新增、編輯與刪除；今天仍由 Today 擁有，未來日期維持唯讀。
  2. Calendar 與 Today 使用同一組 `entryForm`／`detailForm` DOM、validation、WorkRecord schema 與 canonical calculations；不得建立第二套表單。
  3. Calendar 編輯採 UI draft 與明確「完成」commit；切換欄位、收入、班別、天氣或支出不直接寫入 durable state。
  4. Calendar mutation 使用 snapshot、寫入、讀回驗證、last-valid safety copy 與 failure rollback；成功後才替換 in-memory state。
  5. 損壞的 `driverPayApp.v2` 原始字串不得自動覆寫；有最近有效快照時只作安全顯示，沒有時顯示錯誤與重試。
  6. 歷史平台收入使用直接校正當日總額；不在本 Sprint 建立完整逐筆收入或支出明細模型。
  7. WorkRecord 不新增 `createdAt`／`updatedAt`；缺乏可靠 migration 與 sync 規格時，不以顯示日期或目前時間猜測 metadata。
- Reason: Calendar 成為過去紀錄 Primary owner 後，必須在不複製 Today 表單、不改 schema、不讓失敗寫入污染畫面的前提下提供完整 mutation。
- Impact:
  - Calendar 新增／編輯／刪除後，Month Grid、Work Record Card、月份摘要、Reports 與 AI 由同一 state 重新渲染。
  - 本機新增 `driverPayApp.v2.lastValid` 作為 recovery safety copy；正式資料 key 與 WorkRecord schema 不變。
  - Calendar 時間欄位被校正時，不再讓舊 `workSession` aggregate 覆蓋使用者的新時間。
  - Service Worker 使用 `driver-pay-pro-v10`。
- Rejected alternatives:
  - 不複製一套 Calendar-only 表單或計算。
  - 不讓歷史欄位變更立即自動寫入。
  - 不用 `overflow: hidden`、數字截斷或無條件歸零掩蓋資料／版面問題。
  - 不在沒有 migration 的情況新增 record metadata 或收入／支出明細 schema。

## D-026

- Date: 2026-07-25
- Decision:
  1. Calendar V1 的 Read、Navigate、Create、Edit、Delete、transactional rollback 與 Human QA Gate 驗收完成。
  2. Calendar UX Freeze — Version 1 正式生效，範圍包括 Header、Month Navigation、Weekday Header、Month Grid、Today／Selected、Heatmap、Work Record Card、Empty States、新增／編輯／刪除、手勢、Accessibility、Responsive 與 SaveStatus。
  3. 凍結後只接受可重現 Bug、Accessibility、Data Integrity 與重大使用障礙修正；一般視覺偏好與新功能進入 Backlog。
  4. 突破 Freeze 必須先說明使用者問題與影響範圍、取得正式產品決策、提供 Regression，並更新決策文件。
  5. `docs/FEATURE_FREEZE_CHECKLIST.md` 成為 Calendar、Reports、AI 與 Driver 的共同 Feature Freeze Gate。
  6. Reports 可安全重用 Calendar 日期工具、Monday-first 週期、date-key handling、canonical calculations、月份彙總、工作天判斷、平台總額、persistence read API、金額格式與 Design System states；可重用 record-change notification 仍屬待補能力，不宣稱現況已存在。
- Reason: Calendar 的讀取、導覽與完整 record lifecycle 已通過固定資料基準、自動 regression、瀏覽器回歸及 Product Owner iPhone／PWA Human QA。正式凍結可避免 Reports 開發重新設計 Calendar 或複製資料公式。
- Impact:
  - Calendar 後續只接受有限類型修正。
  - 新增 `docs/FEATURE_FREEZE_CHECKLIST.md`，後續主要模組必須提供自己的可追溯證據。
  - Reports Product and Implementation Sprint 成為下一個產品 Sprint。
  - `driverPayApp.v2`、WorkRecord schema、Heatmap algorithm、canonical calculations、Supabase 與 dependency 均不變。
- Rejected alternatives:
  - 不以封板名義隱藏或刪除仍存在的技術債。
  - 不在 Final Regression 新增 Calendar 功能或重設視覺。
  - 不讓 Reports 建立另一套日期、收入、工時或彙總公式。

## D-027

- Date: 2026-07-26
- Decision:
  1. `docs/REPORTS_SPEC.md` Version 1.0 成為 Reports Core Implementation 的唯一主要功能規格。
  2. Reports 固定包含週報、月報與平台；新 session 預設週報，所有 Reports navigation state 維持 session-only。
  3. 週報使用台北星期一至星期日，月報使用台北曆月；比較緊鄰的同等前期。
  4. KPI、comparison、trend、platform 與 important dates 必須使用 canonical calculations 與純 selector。
  5. 週趨勢使用七個每日淨收入點；月趨勢使用四至六個 Monday-first 週彙總。
  6. 平台頁只描述收入貢獻；小費不歸入平台總額，不推論效率或最佳平台。
  7. Reports 保持唯讀，record-level correction 只連到 Calendar 的 exact date。
  8. Implementation 分為 Sprint 5B1 Weekly and Monthly Core 與 Sprint 5B2 Platform, Drill-Down, and Hardening。
  9. 本決策取代 D-018 中 Reports 分頁／月份 durable 記憶部分；其五頁 IA 與 Calendar／Reports separation 仍有效。
  10. Trend 與 ranking 必須有 visible values 與 screen-reader text alternative，不得只靠顏色或圖形。
  11. Calendar UX Freeze 完整適用於 Reports implementation；可重用能力，不得回頭重設 Calendar。
- Reason: 現況基本彙總可用，但 period state、前期比較、淨收入趨勢、讀取狀態、date drill-down、return context 與 accessibility 尚無共同契約；先定案可避免下一階段公式與導航分裂。
- Impact:
  - Sprint 5A 只建立文件、稽核與 contract tests。
  - `index.html`、資料、schema、localStorage key、Calendar、PWA 與 Production 不變。
  - Reports Current-State Audit 發現的實際差距列入 Technical Debt。
- Rejected alternatives:
  - 不把現有 UI 偶然行為直接當作正式產品規格。
  - 不在 specification Sprint 順手改 renderer 或重新設計 Reports。
  - 不用第三方 chart/date library 解決現有 no-build 專案可由純函式處理的需求。

## D-028

- Date: 2026-07-26
- Decision:
  1. Platform Reports 只呈現本週／本月收入貢獻、排行、占比與安全前期比較。
  2. 小費與其他收入不歸入平台；未歸因與資料不一致需明確顯示。
  3. 核准內建別名只在 read adapter 正規化；未知自訂平台安全保留，不改寫歷史資料。
  4. Important dates 只 deep-link 到 Calendar exact date，不自動開啟 Editor 或建立資料。
  5. Return context 是 session-only，保留 tab、期間、scroll 與 source focus。
  6. 成功 mutation 以單一 `driverpay:recordchange` 通知可見 Reports 更新；read navigation 不發出事件。
  7. Platform visual 必須同時提供 visible income／share 與 screen-reader label。
  8. Sprint 5B2 後仍需 Final Regression 與 iPhone／PWA Human QA 才能 Freeze。
- Reason: 歷史平台資料以顯示名稱為 key，讀取層明確 alias 比 silent migration
  安全；exact-date drill-down 與 committed refresh 可在維持 Reports 唯讀時避免
  導航 context 遺失與 stale data。
- Impact:
  - 新增平台純 selector、平台 UI、Calendar drill-down、return context、
    record-change refresh、tests 與文件。
  - `driverPayApp.v2`、WorkRecord schema、Calendar UX、Today flow、AI、Driver、
    Supabase 與 dependencies 不變。
  - 自訂平台 rename 的 stable ID 仍為 TD-026，需要獨立 migration 決策。
- Rejected alternatives:
  - 不將 platform efficiency、best platform 或 platform hourly rate 加入 V1。
  - 不依模糊名稱自動合併未知平台。
  - 不在 Reports 建立第二套 Editor 或 persistence path。

## D-029

- Date: 2026-07-26
- Decision:
  1. QA 固定分為 L1 自動驗證、L2 Preview Smoke、L3 Module Human QA 與
     L4 Production Release QA。
  2. 小型 Sprint 不重複要求完整 L3；大模組完成 Final Regression 後集中
     執行一次完整 Human QA。
  3. Reports Sprint 5B2 只執行八項 L2 Preview Smoke；完整 Reports Human QA
     延後至 Reports Final Regression。
  4. 高風險資料、同步、Service Worker 與 iOS 特有行為仍依風險提高 QA 層級。
  5. iPhone QA 網址必須以未登入的新連線確認可直接開啟。
- Reason: 分離短版 Smoke 與完整模組驗收可減少重複 QA，同時保留高風險
  變更的人工 Gate。
- Impact: Sprint 文件與完成報告必須標示實際完成的 QA 層級；未執行 L3 時
  不得宣稱實體 iPhone／PWA 完整驗收完成。
- Rejected alternatives:
  - 不讓每個小型 Sprint 重複完整 iPhone／PWA／VoiceOver 驗收。
  - 不因延後 L3 而跳過高風險變更的必要即時人工確認。

## D-030

- Date: 2026-07-26
- Decision:
  1. Product Owner 已完成 Reports L3 Human QA；iPhone Safari、installed PWA、
     Offline、VoiceOver、Reduced Motion、safe area、responsive 與無 High
     Priority issue 全部通過。
  2. Reports Feature Freeze Checklist 14/14 Passed；Reports UX Freeze Version 1
     正式生效。
  3. Freeze 範圍涵蓋 Header、週報／月報／平台 Tabs、Period controls、KPI、
     Comparison、Weekly／Monthly Trend、Important Dates、Platform Ranking、
     Unattributed Income、資料狀態、Calendar drill-down、context restoration、
     record-change refresh、Accessibility 與 Responsive。
  4. Freeze 後只接受 Bug、Accessibility、Data Integrity、Security、重大使用
     障礙與 Production blocker；一般改善與新增功能進入 Backlog。
  5. AI 必須重用 Reports 已驗證的 period、aggregation、comparison、trend、
     Important Dates、platform、persistence、refresh、formatting、state 與
     drill-down 基礎，不得建立另一套 aggregation。
- Reason: Final Regression 88/88、L2 Preview Smoke 與 Product Owner L3 Human
  QA 已完成，Reports V1 已具備可重複驗證的穩定基礎。
- Impact: TD-023／TD-024 Resolved；TD-025 runtime/session requirement Resolved；
  TD-026 Partially resolved；所有其餘 Open／Deferred 技術債保持原狀。本次
  沒有產品程式、資料、PWA、dependency、merge 或 Production 變更。
- Rejected alternatives:
  - 不以 Freeze 為名關閉尚未完成的技術債。
  - 不允許後續 AI 複製另一套 Reports aggregation。

## D-031

- Date: 2026-07-26
- Decision:
  1. 靜態 PWA 維持無 bundler、無 framework、無大規模 TypeScript migration。
  2. ESLint、`globals` 與 `parse5` 是 Foundation V1 唯一新增 dev dependencies，
     並提交 lockfile。
  3. `npm run lint` 檢查 Node、tests、Service Worker 與 inline JavaScript；
     correctness errors 阻擋 release，既有 unused code 保留 warning。
  4. `npm run build` 是 static production validation，不產生 dist。
  5. `npm run release:check` 依序執行 lint、全部／專項 tests、syntax、Manifest、
     Service Worker、Production validation 與 `git diff --check`。
  6. `design-system.html` 保持內部、noindex、無 Bottom Navigation 且不進 App
     Shell。
  7. TD-004／TD-005 Resolved；TD-001 Partially resolved；TypeScript Deferred；
     TD-006 Open；TD-026 Partially resolved。
- Reason: 對目前靜態 PWA，最小驗證工具比導入 bundler 或重寫 inline
  architecture 更能降低 release 風險，且不突破 Calendar／Reports Freeze。
- Impact: 新增 tooling、tests、showcase evidence 與文件；產品功能、資料、
  schema、PWA cache、dependencies at runtime、merge 與 Production 均不變。
- Rejected alternatives:
  - 不為符合 build 名稱而導入 bundler。
  - 不為清除 lint warnings 而重構 frozen 產品程式。
  - 不在本 Sprint 抽取 AI aggregation 或拆分整個 inline JavaScript。

## D-032

- Date: 2026-07-26
- Decision:
  1. Local-first V1 不新增 Supabase、authentication、cloud sync、migration 或
     external AI。
  2. AI 固定唯讀三區塊並透過 `sharedAnalytics` 重用 Reports canonical
     analytics；TD-006 Resolved。
  3. Driver 只管理既有 durable settings 與 derived local App status；每日目標
     與 Today 共用同一 setting。
  4. 成功 WorkRecord mutation 只發出一次 committed-record notification。
  5. `driverPayApp.v2`、WorkRecord schema 與 Calendar／Reports Freeze 不變；
     candidate App Shell 為 v13。
  6. L1／公開 L2 後進入單次 V1 L3；通過前不 Freeze、merge main 或 Production。
- Reason: 以共用 analytics、單一 refresh 與既有 local persistence 完成五頁
  V1 閉環，同時避免雲端與 migration 風險。
- Impact: TD-006 Resolved；其他同步、metadata、multi-session、TypeScript 與
  iPhone native input 債保持 Open／Deferred。本決策尚未宣告 V1 Freeze。
- Rejected alternatives:
  - 不建立外部 AI、第二套 aggregation 或新的 durable storage。
  - 不在 Human QA 前更新 Production。

## D-033

- Date: 2026-07-26
- Decision:
  1. Product Owner 已確認 `Driver Pay Pro V1 L3 全部通過`。
  2. Driver Pay Pro Local-first V1 UX Freeze 正式生效。
  3. Freeze 包含 Today、Calendar、Reports、AI、Driver、Bottom Navigation、
     drill-down、context restoration、record-change refresh、資料狀態、
     Accessibility、Responsive、PWA 與 local-first data integrity。
  4. Freeze 後只接受 Bug、Accessibility、Data Integrity、Security、重大使用
     障礙與 Production blocker；一般新功能進入 V1.1／Cloud Sync Backlog。
  5. AI 必須持續重用 `sharedAnalytics`；`driverPayApp.v2` 與 WorkRecord schema
     不變。
- Reason: L1 120/120、公開 L2 與單次 Product Owner L3 已全部通過，21 項
  Local-first V1 Feature Freeze Gate 具備實際證據。
- Impact: TD-006 維持 Resolved；同步、備份、authentication、metadata、
  multi-session、TypeScript 與 native input 長期驗證保持 Open／Deferred。
  Freeze 文件本身不修改產品、資料、PWA 或 dependencies。
- Rejected alternatives:
  - 不以 V1 完成為由虛報尚未完成的 Cloud Sync 技術債。
  - 不允許後續頁面建立第二套 aggregation。

## D-034

- Date: 2026-07-29
- Decision:
  1. 完整有效的 `startTime`／`endTime`／`breakMinutes` 優先產生整數
     `workMinutes`；跨午夜維持單日規則。
  2. `workMinutes` 只屬 derived canonical value，不加入 WorkRecord。
     `manualHours` 在缺少完整 clock fields 時以四捨五入分鐘相容讀取。
  3. Today、Calendar、Reports、AI、CSV 與時薪共用 `workMetrics()`。
  4. Today 手動時間修正使用 transactional auto-save，成功 persistence
     read-back 後才更新記憶體與發出 committed-record notification。
  5. Today 主狀態不顯示秒；工作明細與手動新增預設收合，手動輸入使用
     小時／分鐘。
  6. `driverPayApp.v2`、WorkRecord schema 與歷史資料保持不變。
- Reason: 舊 `workMetrics()` 讓 stale session／manual value 蓋過剛修改的
  clock fields，造成跨頁工時不一致。衍生整數分鐘同時解決來源優先順序與
  小數工時可用性問題，而不需要 migration。
- Impact: Today workflow、canonical work-time、CSV、tests 與 App Shell cache
  更新；Calendar／Reports frozen UI、Supabase、同步、正式資料與多段工作模型
  不變。
- Rejected alternatives:
  - 不以 UI clamp 或最大值掩蓋 stale session。
  - 不新增 `workMinutes` durable 欄位或批量 migration。
  - 不為 Today 建立第二套工時計算。

## D-035

- Date: 2026-07-29
- Decision:
  1. Today、Reports 與 AI 共用 `hourlyRateQuality()`／
     `recordDataQuality()`；固定狀態為 complete、missing、insufficient、
     abnormal 與 invalid time range。
  2. 最低有效工時 10 分鐘，合理時薪上限 NT$2,000／小時；只排除不可信
     分析，不修改原始紀錄。
  3. 有收入無有效工時的明確儲存提供「補上工時／稍後再補」，autosave
     不重複提示，零工時不計算時薪。
  4. 每日紀錄第一層只保留收入與工時；其餘欄位保留在同一表單的預設收合
     「其他資料」。
  5. Today 自動天氣使用 Open-Meteo 且無 API key；先取得使用者同意，再
     使用一次性定位。精確位置不保存，結果只在 session 快取 30 分鐘。
  6. 拒絕、離線、API 失敗與歷史日期回退手動，手動值優先。
  7. `driverPayApp.v2` key 與 WorkRecord schema 不變；只相容加入
     `settings.weatherAutoConsent`，不需要 migration。
- Reason: 共用資料品質可防止極短或缺失工時生成誤導 AI 洞察；同時用明確
  同意、一次性定位和完整 fallback，在簡化 Today 流程時維持 Privacy by
  Default 與 Local-first。
- Impact: Today workflow、shared hourly-rate quality、AI／Reports selectors、
  tests 與 v15 App Shell 更新；Calendar／Reports frozen UI、Supabase、
  正式資料、精確定位儲存、merge main 與 Production 不變。外部天氣與 iOS
  權限長期覆蓋記錄於 TD-027。
- Rejected alternatives:
  - 不用 UI clamp 或魔術數字只隱藏極端時薪。
  - 不建立第二套 AI／Reports 時薪判斷。
  - 不把 API key、精確座標或持續定位加入前端與 localStorage。

## D-036

- Date: 2026-07-29
- Decision:
  1. D-035 的表單分層第 4 點由本決策取代；Today 固定為「工時設定／新增
     支出／其他資料」三個獨立收合區塊。
  2. `儲存支出` 與 `儲存詳細紀錄` 是互不重疊的 persistence 流程，成功
     read-back 前不得顯示成功。
  3. 工時一次只使用 clock 或 manual 一種輸入；模式由既有欄位推導，不新增
     durable mode 欄位，切換前必須確認清除範圍。
  4. legacy clock＋manual 同時存在時以 clock 為 canonical，但不靜默清除。
  5. 已收工 clock 紀錄可確認「再跑一段」；保留原始開始、把停止空檔加入
     休息、清除結束並沿用同一筆 WorkRecord。manual 模式必須先切換。
  6. 不建立完整 multi-session schema；所有頁面仍共用同一 canonical 工時。
  7. 全部實作、L1、公開 Preview smoke 與文件完成後，才交付一次 Final
     Human QA。
- Reason: 獨立支出可恢復高頻操作的可發現性；互斥工時避免兩個有效答案；
  將停止空檔視為休息可在不遷移資料下支援同日續跑。
- Impact: Today、tests、文件與 App Shell v16 更新；`driverPayApp.v2`、
  WorkRecord schema、計算公式、Calendar／Reports／AI UI、Supabase、同步與
  正式資料不變。Final Human QA 前不 merge main、不 Production deploy。
- Rejected alternatives:
  - 不把完整支出留在其他資料。
  - 不同時顯示兩套可生效的工時欄位。
  - 不為本次建立多段工作陣列或 migration。

## D-037

- Date: 2026-07-29
- Decision:
  1. Product Owner 已確認 Milestone 1 Final Human QA 通過；新的 Today 細節
     Sprint 在 Homepage Detail Human QA 前不 merge main、不 Production。
  2. 綠色摘要是正式工時的唯一高階顯示；工作狀態卡只保留 status、工作明細
     與下一步操作。
  3. manual 模式不顯示第二份工時摘要；clock 模式只保留一次共用格式結果。
  4. 支出快捷維持至少 44px；類別與方式使用同列兩個值即入口的 button。
  5. 快捷分類切換保留草稿金額、日期、方式與備註，並沿用完整既有選項及
     persistence。
  6. `driverPayApp.v2`、WorkRecord schema、canonical calculations 與下游
     Calendar／Reports／AI／CSV 不變。
- Reason: 移除沒有新增資訊的重複工時與支出標籤，可降低首頁高度，且不需要
  變更資料或公式。
- Impact: Today 顯示／草稿互動、tests、docs 與 App Shell v17 更新；其他頁面、
  schema、migration、main 與 Production 不變。
- Rejected alternatives:
  - 不以隱藏 canonical 工時或刪除完整支出功能換取高度。
  - 不建立第二套簡化類別或支出方式資料來源。
  - 不讓快捷分類切換清空尚未儲存的其他支出內容。

## D-038

- Date: 2026-07-29
- Decision:
  1. WorkRecord 只相容增加可選
     `expenseAllocations[category] = { months, startMonth }`；原始
     `expenses[category]` 與 `driverPayApp.v2` key 不變。
  2. 缺少有效 allocation 的舊紀錄視為一次支出；切回一次支出、移除分類或
     刪除紀錄時同步移除 metadata，不批量 migration。
  3. Calendar 保留原始付款；Reports／AI 共用 `reportExpenseSummary()` 依月
     衍生成本，尾差由最後月吸收。
  4. 月成本以該台北月份第一天作 report-only accounting anchor，使週／月
     期間與趨勢加總一致，但不建立或改寫 WorkRecord。
  5. CSV 同時輸出原始付款與分月資訊；App Shell 更新為 v18。
- Reason: 真正分月必須在重開 App 後仍知道月份數與開始月份；可選分類級
  metadata 是不複製未來紀錄、不改原始付款且相容舊資料的最小方案。
- Impact: Today expense、Reports／AI canonical expense、CSV、tests、docs 與
  v18；其他資料模型、Calendar UI、Supabase、main、Production 不變。
- Rejected alternatives:
  - 不把規則只留在 UI draft。
  - 不複製十二筆 WorkRecord。
  - 不建立第二個 localStorage key 或批量重寫舊資料。

## D-039

- Date: 2026-07-29
- Decision:
  1. Expense UX Human QA 已 Passed；新的 Today work-status header Sprint
     仍只 Push 功能分支與 Preview，不 merge main、不 Production。
  2. `#workDetailsToggle` 改為「今日工作狀態」整條 44px 原生 button，包含
     圖示、標題、空白、狀態與 chevron。
  3. 移除獨立「工作明細 ＋」列，沿用同一 `#workMetrics`、
     `setWorkDetailsExpanded()` 與 `aria-expanded` state。
  4. 工作操作與明細內容保持 toggle 外的事件範圍；狀態更新只同步
     accessible name，不重設 disclosure。
  5. 不修改工時計算、狀態機、WorkRecord、`expenseAllocations`、
     `driverPayApp.v2` 或下游功能。
- Reason: 放大 disclosure 點擊範圍並移除沒有資訊價值的空白列，可改善單手
  操作與垂直效率，且不需要第二份 state 或資料變更。
- Impact: Today work-status presentation、tests、docs 與 App Shell v19；其他
  UI、資料、main 與 Production 不變。
- Rejected alternatives:
  - 不保留第二個「工作明細」入口。
  - 不把工作操作包進 disclosure button。
  - 不建立新 modal、頁面、鉛筆或 Quick Edit。

## D-040

- Date: 2026-07-29
- Decision:
  1. Driver 新增標準／舒適／大字三個 `AI／報表文字大小` radio。
  2. 唯一來源為可選 `settings.aiReportsReadingSize`；缺欄位或未知值回退
     `standard`，不 migration。
  3. 切換即時以 `<html data-ai-reports-reading-size>` 套用共用 AI／Reports
     reading tokens，並交易式寫入既有 `driverPayApp.v2`。
  4. 只調整閱讀內文、次要文字、行高、間距與圖表標籤；主要 KPI 與頁面主
     標題不大幅放大，其他頁面與設定控制不受影響。
  5. 本 Sprint 不 merge main、不 Production deploy。
- Reason: 一個持久偏好和一套 presentation tokens 可提升長文與報表標籤
  可讀性，同時避免 zoom、頁面各自 state、重複元件及資料邏輯分歧。
- Impact: Driver display settings、AI／Reports presentation、tests、docs 與
  App Shell v20；WorkRecord、`expenseAllocations`、canonical calculations、
  CSV、Supabase、Today、Calendar、main 與 Production 不變。
- Rejected alternatives:
  - 不使用 zoom 或 transform scale。
  - 不在 AI 與 Reports 各自建立 setting 或 component copy。
  - 不讓閱讀偏好改變主要 KPI、Bottom Navigation 或資料計算。

## D-041

- Date: 2026-07-29
- Decision:
  1. Calendar V1.1 Today marker 是經 Product Owner 核准的 Calendar Freeze
     小範圍例外，只修改今天日期標記。
  2. 今天未選取時使用 28～30px、2px 品牌深綠日期圓形外框；移除小圓點，
     不使用短橫線、三點、文字、圖示或動畫。
  3. 今天被選取時使用品牌深綠實心日期圓圈與反差文字；日期格只保留低干擾
     surface，不疊加強烈 cell border。
  4. Today 與 Heat／Record 可組合，但只有一個 Today marker；日期格尺寸與
     觸控範圍保持不變。
  5. `aria-current="date"`、`aria-selected`、台北 date-only、Today button、
     exact-date route、Work Record Card 與其他 Calendar state 保持原契約。
  6. App Shell 更新為 v21；Final Human QA 通過前不 merge main、不
     Production deploy。
- Reason: 原 4px 小圓點在 iPhone 上過小且容易被忽略；包住日期數字可在不
  改月曆高度、熱度或操作模型下提供清楚的 Today 身分。
- Impact: Calendar Today presentation、tests、docs 與 PWA cache；不修改資料、
  計算、其他頁面、schema、localStorage、Supabase、main 或 Production。
- Rejected alternatives:
  - 不使用小圓點、短橫線、文字或額外圖示。
  - 不建立第二個 Today state 或按鈕。
  - 不以整格深色、厚框、陰影或動畫增加辨識度。

## D-042

- Date: 2026-07-29
- Decision:
  1. 將 D-040 的 AI／Reports 閱讀偏好升級為全 App `settings.displaySize`；
     缺少新欄位時才相容讀取合法 `aiReportsReadingSize`。
  2. `data-display-size` 與 Design System tokens 同步控制 Today、Calendar、
     Reports、AI、Driver、表單與 Bottom Navigation；不使用 zoom／scale。
  3. Driver 的資料狀態與 App 狀態合併為置底單一 disclosure；正常預設收合，
     讀取或 storage 異常顯示「需要注意」。
  4. Calendar 所有日期共用 34px day slot（320px 為 32px），Today 只改該
     slot 外觀，不使用 margin／position／translate 位移。
  5. App Shell 更新為 v22；Final Human QA／RC 核准前不 merge main、不
     Production deploy。
- Reason: 單一跨頁顯示層級可避免頁面設定分歧；合併狀態降低 Driver 垂直
  噪音；共用日期 geometry 從根本修正 Today 下沉。
- Impact: presentation、Driver disclosure、Calendar day geometry、tests、
  docs 與 v22；資料、公式、storage key、schema、main、Production 不變。
- Rejected alternatives:
  - 不保留第二套頁面字級偏好。
  - 不使用 CSS zoom、transform scale 或整頁複製。
  - 不用負 margin、translate 或縮小 cell 掩蓋 Calendar 對齊問題。
