# Driver Pay Pro — Changelog

本文件依 Git commit、目前工作目錄差異與專案交接資料整理。專案尚未採 Semantic Versioning，因此以日期與 commit 為主。

## 目錄

- [Unreleased](#unreleased)
- [2026-07-26](#2026-07-26)
- [2026-07-19](#2026-07-19)
- [2026-07-18](#2026-07-18)
- [2026-07-17](#2026-07-17)
- [2026-07-14](#2026-07-14)
- [2026-07-08](#2026-07-08)
- [平行分支紀錄](#平行分支紀錄)
- [維護規則](#維護規則)

## Unreleased

### 2026-08-08 — PWA First-tap and Driver Labels

- 修正 App 首次開啟後第一次點日期或「新增支出」可能被吞掉：Service Worker
  更新不再於互動中的頁面 `skipWaiting()`、claim clients 或強制 reload。
- 保留更新檢查與離線能力；等待中的新 worker 於既有頁面自然關閉後，在下次
  自然啟動生效。
- Driver 四個第一層名稱精簡為「常用／收支／資料／系統」，內容、順序、摘要
  與 disclosure 行為不變。
- App Shell 更新為 `driver-pay-pro-v32`；資料 key、schema、計算與 Manifest 不變。
- 功能 commit `4b52464` 已合併至 `main`；merge commit：
  `f415e3fc118aba0836c033ccf9f3940b3522b853`。Vercel Production deployment
  `36n9EHH5rH8MPdxi4cNfZHi9yLAe` 已完成。

### 2026-08-08 — Driver Typography and Native Date First-tap Hotfix

- 修正 Driver 頁面副標題 standard 14px、comfort 13px 的反向縮小；改為
  14／15／16px 單調級距。
- 每日目標值改為 28／34／40px，字體選項仍固定 14px；Today 主收入與次要 KPI
  改用獨立安全下限，避免一般數據 token 調整再次把首頁數字縮小。
- Today 日期卡不再把整個原生 date input 設為 `opacity: 0`；只隱藏內部文字與
  indicator，保留唯一原生控制與同一 `activeRecordDate`。
- App Shell 更新為 `driver-pay-pro-v31`；資料 key、schema、計算與 Manifest 不變。
- 功能 commit `a7850cf` 已合併至 `main`；merge commit：
  `25d7e973c98925be054f69659afd6642acc2c7a6`。Vercel Production deployment
  `JD4TKPq2wrgmsZAoDKidiPgpQp8s` 已完成，正式網址：
  `https://driver-pay-app.vercel.app`。
- 正式站 390px 已驗證三種字級、日期切換、Console 與水平 overflow；實體
  iPhone 第一次點擊列為發布後 Human QA。

### 2026-08-08 — Today First-tap Date Picker and Direct Work-time Switch

- 移除 Today 日期卡 click 冒泡後的第二次 `showPicker()` 路徑，整張卡只由同一
  原生 date input 接管，避免 iPhone 第一次點擊只取得焦點。
- 「改用手動工時／改用開始／結束時間」改為一次點擊直接切換；移除確認
  Dialog，離開模式的草稿只保留於 session，切換本身不寫入或清除既有紀錄。
- App Shell 更新為 `driver-pay-pro-v30`；`driverPayApp.v2`、WorkRecord、
  canonical 工時計算、Manifest 與 Supabase 不變。
- 功能 commit `4e25b16` 已合併至 `main`；merge commit：
  `463c949f5e1a1bb40a2f598d1375f39fcc01fd64`。Vercel Production deployment
  `Cc8BV7rWsKejxTEWRC4zNv93toVT` 已完成，正式網址：
  `https://driver-pay-app.vercel.app`。

### 2026-08-08 — Today Daily Record Native Date Picker Hotfix Production Release

- 修正每日紀錄日期卡只取得焦點、不開啟原生月曆的回歸；透明 date input 恢復
  native appearance，WebKit picker indicator 覆蓋完整日期卡。
- 支援 `showPicker()` 的瀏覽器由同一原生 input 直接開啟；不支援時維持原生點擊
  fallback。選定日期仍只更新 `activeRecordDate`，支出付款日期同步，未來日期禁止。
- App Shell 更新為 `driver-pay-pro-v29`；資料 key、WorkRecord、計算、Manifest
  與 Supabase 不變。
- 功能 commit `fde37a1` 已合併至 `main`；merge commit：
  `719dc9cecad85dbb7e164959938917edafb5211f`。Vercel Production deployment
  `4cSAPvqZ4njbUZYSu6nhyGDFDQHR` 已完成，正式網址：
  `https://driver-pay-app.vercel.app`。
- 正式站 390px 已驗證可切換過去日期並載入同日工時、支出與其他資料；HTTP、
  Manifest、Service Worker v29、Console 與水平 overflow 檢查均通過。

### 2026-08-08 — Semantic Display Size and KPI Hierarchy

- 新增 Data／Controls／Structure 語意 typography tokens；主要數據與輸入值在
  標準／舒適／大字有清楚級差，結構標題、導覽與切換控制保持穩定。
- Today 主收入、工時與時薪統一 system font、700、line-height 1 與 tabular
  numerals；工時單位降階，不增加新的卡片或資料狀態。
- Driver 每日目標與平台收入輸入值重用 `--font-input-value`，三模式為
  26／29／32px。App Shell 更新為 `driver-pay-pro-v28`。
- 不改 `settings.displaySize` 儲存方式、`driverPayApp.v2`、WorkRecord、計算、
  Manifest、Supabase、main 或 Production。

### 2026-08-04 — Active Record Date and Today KPI Production Hotfix Candidate

- 新增 session-only `activeRecordDate` 與統一日期綁定 guard；收入、工時、支出、
  其他資料、復原與整日刪除不再各自猜測或 fallback 到今天。
- Calendar 維持唯讀並把精確日期交給 Today 唯一 Daily Record Editor；不再搬動
  Today 表單 DOM，返回 Today 時完整恢復 KPI、工作狀態、平台收入及每日紀錄。
- Today KPI 改為左對齊最大今日收入與等寬次級 KPI；新增簡潔工作時數格式。
- 標準模式 KPI 恢復參考版 `50–64px` 主收入與 `26–32px` 次要數字比例。
- 每日紀錄日期卡恢復可操作，可直接切換今天或過去日期；所有欄位與付款日期
  仍由同一 `activeRecordDate` 隔離，未來日期禁止。
- 新增 57 項 Hotfix contract，原 Hotfix App Shell 更新為 `driver-pay-pro-v27`；
  本次字級層級補強後 candidate 為 `driver-pay-pro-v28`。
- 不改 `driverPayApp.v2`、WorkRecord、allocation、Manifest、Supabase 或正式資料；
  Human QA 前不 merge `main`、不 Production deploy。

### 2026-08-04 — Expense、Hourly Rate、Calendar Read-only 與 KPI Sprint

- 首頁綠色摘要卡保留兩段式 disclosure，收入成為主要視覺焦點，底部目標進度預設收合。
- 週報補上支出分類摘要；時薪全 App 維持總收入除以有效工時。
- Calendar 改為純唯讀工作紀錄摘要，Today 保持輸入與修改 owner；切回 Today 會重繪衍生摘要。
- App Shell 更新為 `driver-pay-pro-v26`；localStorage key 與 WorkRecord schema 不變。

### 2026-08-04 — Expense Management、Calendar Inline Editing 與 KPI Production Release

- 月報新增支出分類彙總與原地每日明細；油錢優先，分月成本與實際付款使用
  `reportExpenseSummary()` 的同一口徑。
- Today 新增預設收合的今日支出清單，可交易式移除單一類別並在 5 秒內復原
  金額、備註與 allocation。
- Calendar 改為五個區段式原地編輯，重用唯一表單 DOM；移除全頁 Editor、
  全域編輯與固定大型整天刪除，並精簡月份格及詳細卡垂直空間。
- 所有時薪改為總收入除以有效工時；Today KPI 重排，Calendar／Reports 重複
  標題移除，Bottom Navigation active state 統一加強。
- App Shell 更新為 `driver-pay-pro-v25`；`driverPayApp.v2`、
  WorkRecord、`expenseAllocations`、Manifest 與 Supabase 不變。
- Product Owner Human QA：Passed；已合併 `main` 並由 Vercel Production 部署。
- Production：`https://driver-pay-app.vercel.app`；merge commit
  `b17b6d9b49f3cbe025af2264c976d75aca4f16f0`；deployment
  `dpl_Goj84FfTsGga2wfNfF7xQBMsFLGy`；Service Worker cache `driver-pay-pro-v25`。
- Production 390px 五頁 Smoke QA 通過，無 Console error／warning，無水平 overflow。

### 2026-08-04 — V1.1 Production Release

- Today Progress 與 Driver Simplification 已通過 Product Owner Human QA，合併至
  `main` 並由 Vercel Production 部署。
- Production：`https://driver-pay-app.vercel.app`；merge commit
  `4282b378538e1fa99db67106aad8bb9c36560532`；Service Worker cache
  `driver-pay-pro-v24`。
- 正式站 390px smoke check 通過；無 Console error／warning、無水平 overflow。

### Today Progress and Driver Simplification

- Today 綠色摘要固定顯示收入、今日實際工時與目前時薪；整排 disclosure 只
  收合每日目標的未設定提示、百分比、尚差金額與進度條。
- Driver 常用設定精簡為單一每日目標與單一字體大小設定，移除重複標題、說明
  及一般成功狀態文字；既有自動儲存與錯誤／離線回饋不變。
- Driver 四個 Header 摘要改為無摘要／平台、支出／備份、匯出／正常或需要
  注意；App 與系統只保留可可靠判定且可採取行動的狀態。
- 新增 47 項 Sprint contracts，App Shell candidate 更新為
  `driver-pay-pro-v24`；資料結構、公式與 `driverPayApp.v2` 不變。

### Progressive Disclosure and Display Size Integration

- Today 今日收入改為整排 disclosure；收合仍保留收入金額，展開才顯示目標
  進度與補充資訊，session state 不寫入資料。
- AI 預設只完整顯示本週重點；本月洞察、收入變化來源、資料與分析依據改為
  原地收合列，仍重用原分析資料。
- Driver 重整為常用設定、工作與收入設定、資料與備份、App 與系統四類；
  About 與系統狀態合併，移除獨立 About route／row。
- 顯示大小更新為 13／17／22px body 層級；Calendar 使用專用月份、星期、
  日期、完整紀錄與 Today circle tokens，窄螢幕不反向縮小。
- 全 App chevron 重用 20px／stroke-2 `.app-chevron`；新增 60 項 Sprint
  contracts，App Shell candidate 更新為 `driver-pay-pro-v23`。
- 更新開發工具的 transitive `brace-expansion` 5.0.8 → 5.0.9，修正 audit
  報告的 high severity 問題；此套件不進入 App runtime bundle。

### V1.1 Final Display and Calendar Alignment

- 將原 AI／報表閱讀設定升級為全 App「顯示大小」，標準／舒適／大字共同
  套用 Today、Calendar、Reports、AI、Driver 與 Bottom Navigation。
- 新 canonical 偏好為可選 `settings.displaySize`；合法新值優先，缺欄位時
  相容舊 `settings.aiReportsReadingSize`，不 migration、不改 storage key。
- Driver 的資料與 App 狀態合併為置底「系統狀態」disclosure；正常預設收合，
  異常顯示「需要注意」。
- Calendar 所有日期共用固定 34px day slot（320px 為 32px），Today 圓圈
  與同列日期完全同基線，不改日期格高度或資料互動。
- App Shell candidate 更新為 `driver-pay-pro-v22`。

### Calendar Today 日期標記

- 以 30px、2px 品牌深綠日期圓圈取代 Today 下方 4px 小圓點。
- 今天未選取時使用透明圓形外框；今天被選取時使用深綠實心圓與反差文字，
  並降低整格 Selected 視覺競爭。
- 保留 Heat、其他日期 Selected、完整日期格點擊、`aria-current="date"`、
  Today button、exact-date route 與 Work Record Card。
- App Shell candidate 更新為 `driver-pay-pro-v21`。

### AI／報表閱讀文字大小

- Driver 新增「顯示設定」，提供標準／舒適／大字三個立即生效的閱讀層級。
- AI 與 Reports 共用 `settings.aiReportsReadingSize` 及同一組 CSS reading
  tokens；舊資料安全回退標準，不增加第二份頁面 state。
- 放大閱讀內文、次要資訊、行高、段落間距與 Reports 圖表標籤；主要 KPI、
  Today、Calendar、一般 Driver 與 Bottom Navigation 維持原尺寸。
- App Shell candidate 更新為 `driver-pay-pro-v20`。
- Product Owner 已確認 AI／Reports Reading Size Human QA Passed。

### Today Work Status Header

- 將「今日工作狀態」整條 44px 標題列改為現有工作明細的唯一展開入口。
- 移除獨立「工作明細 ＋」列；狀態 badge 與 chevron 留在同一列。
- 工作操作與明細內容維持 toggle 外的獨立事件範圍，不修改工時或狀態邏輯。
- App Shell candidate 更新為 `driver-pay-pro-v19`。

### Today Expense UX Batch 2

- 支出類別改為單一直接原生選擇器，移除重複第二層 select。
- 新增可選 `expenseAllocations` metadata，原始付款與 localStorage key 不變；
  Reports／AI 使用分月成本，Calendar 保留原始付款。
- CSV 同時匯出原始付款與分月資訊；切回一次支出或刪除支出會清理 allocation。
- 精簡分月卡片，付款日期與備註同列，窄螢幕使用短日期。
- App Shell candidate 更新為 `driver-pay-pro-v18`。
- Product Owner 已確認 Expense UX Human QA Passed。

### V1.1 Milestone 1 — Today Workflow and Work-Time Unification

- 修正 Today 手動變更開始／結束時間後仍沿用舊 `workSession` 工時的 P0
  data-integrity bug。
- 工時統一為衍生整數分鐘：有效 clock fields 優先，缺少完整時間時才相容
  legacy `manualHours` 或 live session。
- 新增共用轉換、驗證與自然語言格式函式；Today、Calendar、Reports、AI、
  CSV 與平均時薪共用 `workMetrics()`。
- Product Owner 已確認 Milestone 1 Final Human QA 通過。
- Today 綠色摘要改為正式工時唯一高階顯示；工作狀態卡只保留 status、
  工作明細與下一步操作，不再重複主工時。
- manual 模式只顯示小時／分鐘輸入；clock 模式只保留一次共用格式計算結果。
- 支出快捷按鈕縮短但維持 44px 以上；類別與方式使用同列兩個目前值按鈕，
  並保留完整選項及快捷切換前的草稿內容。
- Human QA follow-up 將主工時與 44px 工作明細控制固定同列；修改工作時間
  會展開並安全捲動，不自動 focus 或彈出鍵盤。
- 每日紀錄使用三個獨立收合區塊：「工時設定／新增支出／其他資料」；完整
  智慧支出流程恢復為獨立區塊，且 `儲存支出` 與 `儲存詳細紀錄` 分離。
- 工時輸入改為互斥 clock／manual 模式，切換前明確確認並在成功 persistence
  後才清除另一組欄位；模式由既有欄位推導，不新增 schema。
- 已收工 clock 紀錄新增同列「再跑一段／修改時間」；確認續跑保留原開始、
  將收工空檔累加為休息並沿用同一筆 WorkRecord。
- 有收入無有效工時時提供「補上工時／稍後再補」；共用資料品質規則排除
  少於 10 分鐘或高於 NT$2,000／小時的異常時薪，AI 顯示原因而不輸出誤導
  數字、比較或建議。
- 新增使用者同意後的一次性自動天氣：Open-Meteo、無 API key、精確位置不
  保存、session 快取 30 分鐘；拒絕／離線／失敗／歷史補登維持手動選擇，
  手動值優先。
- Today 工時欄位改為 transactional auto-save，成功 persistence 後才更新
  記憶體與通知 dependent views。
- `test:today` 增為 51 項；全套測試增為 173 項。
- Service Worker App Shell candidate 更新為 `driver-pay-pro-v17`。
- `driverPayApp.v2` 與 WorkRecord schema 未變更，舊資料不遷移、不批量改寫。

### Local-first V1 Release Candidate

- 完成唯讀 evidence-based AI：營運建議、本月洞察、智慧提醒，並透過
  `sharedAnalytics` 重用 Reports canonical analytics；TD-006 Resolved。
- 完成 Driver 既有每日目標自動儲存、本機資料狀態、App／PWA／離線狀態與
  local-first 資料警告。
- 完成單一 committed-record refresh、AI exact-date deep link、45 情境 V1
  fixture 與 AI／Driver／Integration targeted tests。
- L2 修正 AI 日期洞察的 Calendar 路由、Driver 本機紀錄狀態重算，以及
  Service Worker 對 navigation HTTP 502 的 Offline App Shell fallback。
- Service Worker candidate 更新為 `driver-pay-pro-v13`；`driverPayApp.v2` 與
  WorkRecord schema 不變。
- L1 120/120、公開 iPhone L2 與 Product Owner L3 全部通過；Driver Pay Pro
  Local-first V1 UX Freeze 正式生效，21 項 Freeze Gate Passed。

目前工作目錄尚未提交的內容：

### Added

- Foundation Cleanup Version 1：新增最小 `package.json`、ESLint、HTML／Manifest／
  Service Worker／App Shell Production validation 與單一 `release:check`；
  Node tests 增為 94 項。
- Design System 內部展示頁補齊 segmented control、KPI、Empty／Loading／Error、
  list row、44px touch target、focus-visible 與 reduced-motion evidence，並維持
  正式導覽與 PWA App Shell 隔離。
- Reports Final Regression 與 UX Freeze Version 1：新增 28 情境固定 fixture、
  9 項 Final Regression tests、一次性 L3 Human QA 清單及 Reports Feature
  Freeze evidence；全部 Node tests 增為 88 項。Product Owner L3 Human QA
  已通過，Feature Freeze Checklist 14/14 Passed，Reports V1 正式凍結。
- Reports Sprint 5B2：新增本週／本月平台收入總額、排行、占比、安全前期比較、
  內建 alias 讀取層正規化、未知平台 fallback、未歸因／不一致資料狀態。
- 建立 L1 自動驗證、L2 Preview Smoke、L3 Module Human QA 與
  L4 Production Release QA 分級；Sprint 5B2 完成短版 Smoke，完整 Reports
  Human QA 延後至 Final Regression。
- 報表重要日期新增 Calendar exact-date drill-down、同 session return context、
  來源焦點復原及單一 committed-record refresh notification。
- 新增 8 項 Reports Platform contract tests；全套自動測試增為 79 項。
- Reports Sprint 5B1：新增共用台北週／月 period utilities、單一 report
  aggregator、comparison calculator、session-only Reports state、週／月 KPI、
  前期比較、七日／月份週淨收入趨勢、重要日期及 Empty／Loading／Error／Offline
  presentation。
- 新增 10 項 Reports Core 自動測試，涵蓋 Monday-first 期間、月份邊界、
  canonical aggregation、零工時、比較 edge cases、無紀錄／stored zero、
  月週彙總、重要日期、唯讀 session state 與 PWA v11；全部測試增為 68 項。
- Reports Sprint 5A：新增正式 `docs/REPORTS_SPEC.md`，定義週／月／平台 state、台北期間、canonical KPI、前期比較、淨收入趨勢、平台貢獻、Calendar drill-down、資料狀態、35 個 edge cases、實作架構與完整驗收契約。
- 新增 20 題 Reports Current-State Audit、D-027、Reports 永久執行規則及 `tests/reports-spec.test.js` 文件契約測試；全部自動測試增為 58 項。
- Calendar Final Regression：新增固定 12 情境 fixture、跨頁 canonical calculation、月份摘要、heatmap、serialization rollback、validation accessibility 與 focus-return contract tests；全部自動測試增為 52 項。
- 新增共用 `docs/FEATURE_FREEZE_CHECKLIST.md` 與 D-026，正式宣告 Calendar UX Freeze — Version 1。
- Calendar Sprint 4B：過去日期新增／編輯／刪除、共用 Record Editor、UI draft、dirty close confirmation、日期明確刪除確認與 SaveStatus。
- 新增本機交易式 persistence adapter：主 key 寫入後讀回驗證、最近有效快照、失敗回復與損壞資料 fallback；主 key 仍為 `driverPayApp.v2`。
- Calendar mutation／validation／rollback／共享表單／future guard contract tests；自動測試由 41 項增為 45 項。
- Calendar Sprint 4A.5 Visual Polish：壓縮頁內垂直節奏、強化月份導覽與星期辨識、拉近日期／收入、改善工作紀錄卡片 Primary／Secondary metrics 層級。
- Calendar heat semantic tokens 增加柔和的級距差異，演算法、Selected／Today 語意與資料保持不變；PWA cache 更新為 `driver-pay-pro-v9`。
- 新增 D-024 Calendar Visual Polish 決策與非脆弱的視覺結構 contract test。
- Calendar Sprint 4A：Monday-first Month Grid、session-only 日期選取、精確日期 deep link、相鄰月份日期、Today／Selected／Focus／Future 狀態。
- Calendar 唯讀標準工作紀錄卡片、四級收入熱度、月份摘要、鍵盤操作、ARIA、水平手勢與 reduced-motion 支援。
- `tests/calendar.test.js` 純函式與 Calendar contract 測試，並擴充導航、Design System、Reporting 與 PWA 回歸測試。
- 新增正式 `docs/CALENDAR_SPEC.md`，定義 Calendar 狀態、月份／日期互動、日期格矩陣、熱度、工作紀錄卡片、Editor、錯誤／離線、實作架構與完整驗收契約。
- 新增 Calendar Implementation 未來測試清單，涵蓋月份格、日期狀態、熱度、手勢、Accessibility、紀錄寫入、localStorage 錯誤與 PWA。
- 新增 D-022 Calendar 正式產品決策。
- 新增正式 `docs/PRODUCT_SPEC.md`，固定產品願景、五頁責任、Feature Ownership Matrix、跨頁紀錄契約、單一資料來源、產品術語、Calendar 決策、Current State Audit 與 Roadmap。
- 新增 `docs/TECH_DEBT.md`，集中記錄計算重複、legacy primitives、工具鏈、PWA／iPhone 實機 QA、Calendar 責任差距與資料限制。
- 新增跨頁產品契約測試清單，供後續 Calendar、Reports、AI 與 Driver Sprint 做責任與資料回歸檢查。
- 新增正式 Design System：CSS custom property tokens、共用 UI primitives、獨立開發展示頁、永久規格與測試清單。
- 新增 `tests/design-system.test.js`，驗證 token、primitive、無障礙、PWA 接線、showcase 隔離與 time input 安全 wrapper。
- 新增 hash 導覽與舊報表連結相容、報表分頁記憶、月曆／報表獨立月份及三分頁共用報表月份。
- 新增導覽架構自動測試，涵蓋 Lucide 圖示、路由、空白狀態、44px 操作與月份狀態。
- 新增無套件的 `node:test` 報表測試，涵蓋星期一週期、跨月／跨年、工時標準化、619 小時舊算法重現與 PWA 更新。
- 規則式「AI 營運助理」：今日建議、本月洞察、平台表現與智慧提醒。
- 可重用的 AI 資料正規化、彙總、最佳日／班別、平台趨勢與提醒函式。
- 月份明細天氣 inline SVG 與無障礙名稱。
- `docs/AI_INSTRUCTIONS.md`。
- 完整填寫 Project Spec、UI Guidelines、Features、Roadmap 與 Changelog。

### Changed

- Foundation Cleanup 建立可重現的 lockfile 與三個最小開發相依套件：
  ESLint、`globals`、`parse5`；未加入 bundler、framework 或 TypeScript。
- Release 前驗證改為 `npm run release:check`；Service Worker 維持
  `driver-pay-pro-v12`，正式產品 App Shell 未修改。
- Reports 平台頁移除 legacy 月份下拉與日均語意，改為收入貢獻視圖；
  Service Worker cache 更新為 `driver-pay-pro-v12`。
- Reports 週報／月報由 renderer 內各自選期與彙總，改為共用純 selector 流程；
  tab 與週／月選擇不再寫入 `driverPayApp.v2`，App Shell cache 更新為
  `driver-pay-pro-v11`。
- 下一個產品實作增量定為 Reports Sprint 5B1 — Weekly and Monthly Core；Sprint 5A 沒有修改 Production 程式、PWA 或資料。
- Calendar persistence 在任何 clone／serialization 前保存主 key 與 last-valid 快照，失敗時完整回復；Record Editor validation error 與關閉後 focus return 完成無障礙 hardening。
- Calendar V1 Read／Navigate／Create／Edit／Delete、Product Owner iPhone Safari／installed PWA／Offline Human QA 與 Final Regression 完成；下一個產品 Sprint 為 Reports。
- Calendar 由唯讀 Read and Navigate 進入 past-only mutation；Today 仍擁有今日紀錄，未來日期仍不可建立。
- Service Worker cache 更新為 `driver-pay-pro-v10`。
- Calendar 由 legacy 月份下拉／每日清單改為唯讀 Overview → Locate → Open 體驗；新增、編輯、刪除保留至 Sprint 4B。
- Service Worker cache 使用短版 `driver-pay-pro-v8`，並快取本 Sprint 使用的 App Shell。
- Calendar 下一步由規格階段更新為兩個可控 Implementation Sprint：Read and Navigate、Record Mutation and Hardening；本次未修改產品程式。
- `AGENTS.md`、專案背景、決策紀錄與交接文件改以正式 Product Specification 約束功能 owner、canonical calculations 與下一個 Calendar 規格 Sprint。
- 現有 legacy variables 改由 Design System tokens 提供相同視覺值；Service Worker 更新為 v07 並快取共用樣式。
- 底部導覽重整為「今天｜月曆｜報表｜AI｜Driver」，統一 24px Lucide 圖示與 14px 文字。
- 月份明細完整移入月曆；週報、月報、平台統一移入固定標題「報表」。
- 月曆每日列補齊總收入、支出、淨收入、實際工時與 44px 編輯／刪除操作；平台效率改名平台收入排行。
- Service Worker 更新為 v06，讓已安裝 PWA 取得新的資訊架構。
- 週報正式改為星期一至星期日的完整 7 天，日期運算不再受 UTC／台灣時區轉換影響。
- Service Worker 更新為 v05，強制檢查新版本並淘汰舊 App Shell，避免已安裝 PWA 繼續執行舊工時與週期演算法。
- 首頁每日目標改為右對齊狀態文字與真正進度條，支援未達標、達標、超標及異常目標。
- 班別與天氣改為直接選取並保存。
- 更新今日紀錄日期改為精簡橫向日期列。
- 週期改為不重複同年年份的精簡格式。
- 手機月份明細改為單一面板內的緊湊 row，只列有收入的平台。
- README Documentation 索引補充完整文件說明。

## 2026-07-26

### Calendar and Reports Stable Milestone

- Calendar UX Freeze Version 1、Reports UX Freeze Version 1 與 Foundation
  Cleanup Version 1 已透過
  [PR #2](https://github.com/superaha-boop/driver-pay-pro/pull/2) 正常合併至
  `main`。
- Main Release merge：
  `dbaafba321fd3b108ef5d3b07e2adea7c1f23892`。
- Production：
  `https://driver-pay-app.vercel.app`；Deployment
  `dpl_A3wt3sRW7hNDVHFZrWtSPaHpAjKJ`，狀態 READY。
- Release Gate 通過：94/94 Node tests、Calendar 38/38、Reports 44/44、
  lint、Production validation、build、`release:check`、Manifest、Service
  Worker、responsive、Console 與 Offline App Shell。
- Product Owner 於 2026-07-26 確認 `Production L4 全部通過`，本次穩定
  milestone 正式標記 Completed。
- 本次 Release 收尾沒有新增功能、UI、schema、migration、dependency 或正式
  測試資料；localStorage key 維持 `driverPayApp.v2`，Service Worker cache
  維持 `driver-pay-pro-v12`。
- 本次不是完整 Driver Pay Pro V1；AI、Driver、正式同步與其他已記錄技術債
  仍保持 Open／Deferred。

## 2026-07-19

### `6d490d8 docs: add project documentation structure`

- 新增 README 的 Project Documentation 區塊。
- 新增 PROJECT_SPEC、UI_GUIDELINES、FEATURES、ROADMAP、CHANGELOG 空白架構。

## 2026-07-18

### `cc42cda feat: optimize weekly report for mobile`

- 建立 700px 以下的週報／月份明細手機呈現。
- 手機週摘要改為兩欄 Dashboard。
- 保留 700px 以上桌面表格與相同資料來源。
- 改善標題、月份選單、底部 safe-area 與水平 overflow。

### `2ee29d0 backup: preserve app before weekly report responsive update`

- 建立週報響應式調整前的備份提交標記。

## 2026-07-17

### `d5ca72d style: finalize platform income visuals`

- 定稿平台名稱、收入框、未輸入提示與 Yoxi 加號的手機視覺。
- 統一深綠／灰綠文字，移除逐列重複單位與亮藍收入字。

### `3dd83a0 backup: preserve home before next adjustments`

- 建立首頁後續調整前的備份提交標記。

### `f8a4d2a fix: restore home dashboard income editing`

- 還原 Home 儀表板、工作狀態與原位平台收入輸入。
- 一般平台使用總額覆蓋；Yoxi 使用單筆累加並保留總額修正。
- 開始工作不再依賴天氣，收入提交同步更新統計。

### `7104f13 backup: preserve pre-home-restore UI`

- 保存首頁還原前的 UI 與程式狀態。

## 2026-07-14

### `af9aae0 Initial Driver Pay Pro`

- 建立目前 Git 分支共同基線：單頁 App、PWA、assets、manifest、Service Worker 與 `.gitignore`。

### `7d607b1 Create Driver Pay Pro assets`

- 建立歷史 asset 標記檔；目前主要資產已整理到 `assets/`。

### `6808b5b Add files via upload`

- 加入完整圖像資產、manifest、Service Worker，並大幅更新 Driver Pay Pro UI。

## 2026-07-08

### `b20fa4e Add files via upload`

- 增加 AI 預留分頁、每日收入目標、工作開始／收工與 PWA 初始化能力。

### `2abc802 Add files via upload`

- 增加平台實拿比例、原始／實拿收入計算與 CSV 對應欄位。

### `b0bdbd6 Add files via upload`

- 增加業績總覽顯示切換。

### `32e23ad Add files via upload`

- 建立最初 SPA：每日輸入、週報、月報、平台分析、設定、localStorage 與 CSV。

### `bf2418c Initial commit`

- 建立最初 README。

## 平行分支紀錄

下列提交存在 Git 歷史但不在目前分支 ancestry，不應誤寫成目前工作目錄的發布版本：

- `527fbde`：加入平台切換卡、Yoxi 快速新增與「先選天氣」流程。
- `cfa11d3`：調整平台卡與工作／天氣狀態顯示。
- `88a9aaa`：改為平台直式收入列、原位提交與 Yoxi 加號。
- `906886f`：調整首頁工作狀態與天氣區。
- `475a28e`：調整平台名稱、更新今日紀錄與 Yoxi 區塊。
- `93b4be5`：Git 訊息為 `Add files via upload`；diff 中沒有足夠語意可形成可靠功能摘要。
- `45234c5 feat: optimize weekly report for mobile`：遠端週報分支的對應提交。

## 維護規則

- 新紀錄需附日期、commit hash 與可驗證的變更摘要。
- 工作目錄尚未提交內容放在 Unreleased，不得宣稱已發布。
- 備份 commit 應標示為快照，不推測不存在的功能。
- Git 訊息過於籠統時，以 diff 可確認內容描述；仍無法確認則標示 TODO。
- 推送、合併與部署狀態必須即時查證，不從舊交接文件推定。
