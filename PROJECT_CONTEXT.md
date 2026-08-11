# Driver Pay Pro 專案固定背景

更新日期：2026-08-11

> 本文件記錄已確認的產品與介面決策。新的 ChatGPT／Codex 任務開始前應先閱讀本文件與 `HANDOFF.md`。分支、提交、推送、PR 與部署屬於即時狀態，操作前仍須重新檢查實際 Git 與遠端狀態。

## Installed PWA First-input Diagnostics — Current Sprint

- Branch：`codex/pwa-first-input-diagnostics-20260811`；base：`a6d4703`。
- Product Owner 實體 iPhone 再驗證：問題只在由主畫面圖示冷啟動／恢復的
  installed PWA 發生，Safari 分頁沒有；日期與原生 `details`「新增支出」等
  不同元件都可能第一次無反應。
- D-053 的中途 Service Worker 接管與 reload 風險確實已移除，但 v32 正式版仍可
  重現，因此不得再把該機制宣告為殘留症狀的完整根因。
- 本 Sprint 先加入只存在記憶體的 privacy-safe 事件診斷：記錄
  `pointerdown/up`、`touchstart/end`、`click`、頁面生命週期、App ready marker、
  目標元素識別與 Service Worker／cache 狀態；不讀取收入、工時、支出、輸入值
  或 `driverPayApp.v2`。
- 診斷入口只在 installed PWA 或 `?pwa-diagnostic=1` 顯示於 Driver「系統」，供
  使用者複製一次實機 trace。收到 trace 前不加入假點擊遮罩、不全面改用
  `touchstart`／`pointerdown`，也不宣告根治完成。
- 本診斷版不改 Service Worker、Manifest、資料 key、WorkRecord、計算或正式資料；
  App Shell 維持 `driver-pay-pro-v32`，只建立非 Production Preview。

## PWA First-tap and Driver Labels — Production Released

- Branch：`codex/pwa-first-tap-driver-labels-20260808`；功能 commit：`4b52464`；
  `main` merge commit：`f415e3fc118aba0836c033ccf9f3940b3522b853`。
- Production：`https://driver-pay-app.vercel.app`；Vercel deployment：
  `36n9EHH5rH8MPdxi4cNfZHi9yLAe`，狀態 `Deployment has completed`。
- 根本原因不是日期或支出各自的控制元件，而是 Service Worker 在 App 已可操作後
  使用 `skipWaiting()`／`clients.claim()` 接管，`controllerchange` 再強制
  `window.location.reload()`；第一次觸控若剛好發生在此時會被重載中斷。
- v32 保留更新檢查與離線 App Shell，但不在既有頁面中途接管或重新載入；新
  worker 等待既有頁面自然關閉，於下次自然啟動生效。
- Driver 四個第一層名稱縮短為「常用／收支／資料／系統」；內容、順序、摘要、
  展開狀態與資料來源不變。
- App Shell：`driver-pay-pro-v32`。不改 `driverPayApp.v2`、WorkRecord、計算、
  Manifest、Supabase 或正式資料。
- Production 390px：日期與新增支出第一次 click 均生效；Driver 四個短標題正確，
  無水平 overflow，Console 0 error／warning。

## Driver Typography and Native Date First-tap — Released

- Branch：`codex/driver-typography-date-first-tap-20260808`；功能 commit：
  `a7850cf`；`main` merge commit：
  `25d7e973c98925be054f69659afd6642acc2c7a6`。
- Production：`https://driver-pay-app.vercel.app`；Vercel deployment
  `JD4TKPq2wrgmsZAoDKidiPgpQp8s`；App Shell `driver-pay-pro-v31`。
- v30 實體 iPhone QA 證實全透明 date input 第一次仍只 focus。v31 保留唯一原生
  input，但 input 本體改為 `opacity: 1`，只隱藏內部文字與 indicator；選日仍只
  更新 `activeRecordDate`。
- Driver 每日目標值為 28／34／40px；「管理常用設定」為 14／15／16px；字體
  選項固定 14px。Today KPI 使用獨立安全下限，不因本次 Driver 調整縮小。
- 本機與 Production 390px 已量測三模式單調增加；320／375／390／393／430px
  無 overflow，日期 input 完整位於父卡片內。正式站 Console 0 error／warning。
- 不改 `settings.displaySize`、`driverPayApp.v2`、WorkRecord、計算、Manifest、
  Supabase 或正式資料。

## Today First-tap Date Picker and Direct Work-time Switch — Released

- 功能 Branch：`codex/today-first-tap-direct-work-mode-20260808`；功能 commit：
  `4e25b16`；`main` merge commit：
  `463c949f5e1a1bb40a2f598d1375f39fcc01fd64`。
- Production：`https://driver-pay-app.vercel.app`；Vercel deployment
  `Cc8BV7rWsKejxTEWRC4zNv93toVT`；App Shell `driver-pay-pro-v30`。
- Today 日期卡固定只走原生 `input[type="date"]` 點擊；不再於同一 click 使用
  `showPicker()` 建立第二條路徑。選日後仍更新唯一 `activeRecordDate`。
- 「改用手動工時／改用開始／結束時間」一次點擊立即切換；移除確認 Dialog。
  另一模式草稿僅保存於目前 session，切換本身不清除或寫入既有紀錄。
- App Shell candidate：`driver-pay-pro-v30`；資料 key、schema、計算、Manifest、
  Supabase 與跨裝置能力均不變。
- L1／本機瀏覽器已通過：403/403 Node、Today 142/142、五個手機寬度無 overflow、
  日期原生 input 完整覆蓋卡片、clock／manual 直接切換與兩邊草稿還原正常，
  Console 0 error／warning。
- Production 390px 已確認第一次日期 click 由原生 Picker 接管；工時模式雙向
  一次點擊切換、無 Dialog、clock 草稿還原正常，Console 0 error／warning。

## Active Record Date and Today KPI Production Hotfix — Released

- Hotfix branch：`hotfix/active-record-date`；日期 Picker follow-up commit：
  `fde37a1`。已合併至 `main`，merge commit：
  `719dc9cecad85dbb7e164959938917edafb5211f`，並由既有 Vercel Git Integration
  完成 Production deployment `4cSAPvqZ4njbUZYSu6nhyGDFDQHR`。
- Production URL：`https://driver-pay-app.vercel.app`；App Shell：
  `driver-pay-pro-v29`。
- `activeRecordDate` 是 Today 唯一 session 日期來源。Calendar 維持唯讀，過去
  日期的「新增紀錄／編輯這天」把精確日期交給 Today 唯一 Daily Record Editor。
- 所有 Today 收入、工時、支出、其他資料、復原與整日刪除均顯式綁定目標日期；
  無效、未來或跨日期 mismatch 會阻止寫入，不再 fallback 到今天。
- Calendar 不再移動 `#sharedIncomePanel`／`#sharedDetailPanel`。返回 Today 時會
  恢復並重繪 KPI、工作狀態、平台收入、每日紀錄、支出與其他資料，修正半頁渲染。
- Today KPI 將今日收入置於左上並作為最大數字；今日工時與平均時薪為等寬兩欄；
  目標進度仍是唯一可收合區。標準模式以 `50–64px` 主收入與 `28–32px` 次要
  KPI 恢復參考版比例；三者共用 700、line-height 1 與 tabular numerals，工時
  的分鐘／小時單位降階顯示。
- 顯示大小改為 Data／Controls／Structure 語意分層。主要資料 24／27／30px、
  每日目標與平台收入輸入值 26／29／32px；結構標題與 Bottom Navigation 固定
  或只小幅變化，字體切換控制固定 14px。
- 每日紀錄日期卡已恢復可操作；原生 date input 可選今天或過去日期，選擇後
  直接切換同一 `activeRecordDate` 並載入該日全部欄位。付款日期仍鎖定跟隨，
  不允許未來日期，也不建立第二份日期 state。
- App Shell candidate：`driver-pay-pro-v28`。`driverPayApp.v2`、WorkRecord、
  `expenseAllocations`、Manifest、Supabase 與正式資料均不變。
- 2026-08-08 Date Picker follow-up 修正透明原生 date input 的
  `appearance: none` 回歸：恢復 native appearance、把 WebKit picker indicator
  擴至整張日期卡，並在支援時呼叫 `showPicker()`。點擊日期卡不再只顯示焦點框；
  App Shell follow-up 為 `driver-pay-pro-v29`。
- Follow-up 驗證為 403/403 Node、Today 142/142；320／375／390／393／430px
  原生 date input 均完整位於卡片內且無水平 overflow，390px 實際點擊可由原生
  Picker 接管，Console 0 error／warning。
- Production 390px smoke 已確認可切換至過去日期，工時、支出與其他資料編輯區
  跟隨同一日期載入；無水平 overflow，Console 0 error／warning，Manifest 與
  Service Worker v29 正常。
- Repository 無法直接讀取 iPhone Production origin 的 localStorage；2026-07-04、
  2026-08-02、2026-08-04 的正式資料稽核需 Product Owner 提供備份匯出或在裝置
  執行唯讀診斷。Hotfix 不會自動搬移、刪除或猜測修復任何紀錄。

## Expense、Hourly Rate、Calendar Read-only 與 KPI — Current Sprint

- 功能分支：`codex/expense-readonly-hourly-kpi-20260804`；目前尚未建立 commit，
  `main` 與 Production 不變。
- 本 Sprint 將首頁綠色摘要卡的收入設為最醒目焦點，目標進度只在下方 disclosure
  展開；週報補上支出分類摘要；Calendar 工作紀錄卡改為純唯讀，Today 保持唯一
  輸入／修改 owner；切回 Today 時只重繪衍生摘要，不重置輸入草稿。
- 全 App 時薪維持 canonical `總收入 ÷ 有效工時`，支出只影響淨收入與成本分析。
  `driverPayApp.v2`、WorkRecord、`expenseAllocations` 與現有資料均不變。
- 本候選 App Shell cache 為 `driver-pay-pro-v26`；完成 L1 與 Public Preview 後，
  只進行一次 iPhone Safari／installed PWA Human QA。

## Expense Management、Calendar Inline Editing 與 KPI — Production Release

- 功能分支：`codex/expense-calendar-kpi-integration-20260804`；功能 commit
  `d1f7e269c8970ddf37b5442748375aeb999bd2e6`。Product Owner 已完成唯一一次
  Expense Management、Calendar Inline Editing and KPI Human QA：Passed。
- 已合併至 `main`，release merge commit：`b17b6d9b49f3cbe025af2264c976d75aca4f16f0`。
- Production：`https://driver-pay-app.vercel.app`；Vercel deployment
  `dpl_Goj84FfTsGga2wfNfF7xQBMsFLGy`，狀態 `READY`，對應 `main` 與上述 merge
  commit。
- Today 在新增支出旁提供預設收合的「今日支出」；可只移除該日期與類別的
  金額、備註及 allocation，成功後提供 5 秒最近一次復原，不影響收入、工時
  或其他支出。
- Calendar 過去日期改為收入／工時／支出／其他資料／更多操作五個原地
  disclosure；重用 Today 唯一表單 DOM，不再使用全頁或 Modal Editor。整天
  刪除只在更多操作內，仍需包含日期與影響範圍的確認。
- 月報使用擴充後的 `reportExpenseSummary()` 顯示所選月份支出分類；油錢優先，
  其餘按成本排序，原地展開日期、金額與備註。分月分類主數字是月成本，只有
  實際付款不同時才補充付款金額。
- 所有「時薪／平均時薪／每小時收入」統一為總收入 ÷ 有效工時；支出仍只
  影響淨收入、成本與支出分析。Today 綠色摘要以置中的今日收入及等寬工時／
  時薪兩欄呈現。
- Calendar／Reports 內容區重複大標題移除，Calendar 列高依顯示模式為
  70／76／84px；Bottom Navigation 五頁共用淡綠 active surface、品牌綠、
  semibold 與 `aria-current="page"`。
- App Shell 為 `driver-pay-pro-v25`；`driverPayApp.v2`、WorkRecord、
  `expenseAllocations`、Manifest、Supabase 與 Local-first 原則不變。
- L1／Preview／Production 驗證已通過：完整 Node 339/339、`release:check`、lint 0 errors
  （10 個既有 warnings）、build、Manifest、Service Worker syntax、
  `git diff --check` 與 `npm audit` 0 vulnerabilities。Browser 已驗證 Today、
  Calendar、Reports 在 standard／comfort／large × 320／375／390／393／430px
  共 45 組無水平 overflow，Console 無 error／warning；Calendar 原地新增支出
  及月報分類展開的端到端流程正常。正式站 390px 五頁 Smoke QA 通過，Console
  無 error／warning，Manifest、Service Worker 與 Production URL 回傳正常。

## V1.1 Production Release — Current State

- 正式分支：`main`；merge commit
  `4282b378538e1fa99db67106aad8bb9c36560532`。Product Owner 已確認 Human QA
  通過，V1.1 Today Progress 與 Driver Simplification 已正式發布。
- Production：`https://driver-pay-app.vercel.app`；Vercel deployment
  `3HprP2dJgPG3PH75ksG6DRCV92AC`，狀態 `success / Deployment has completed`。
- Today 綠色摘要的收入、今日實際工時與目前時薪固定顯示；整排 Header 只控制
  每日目標的未設定提示、達成百分比、尚差金額與進度條。目標 disclosure state
  僅存在 session，跨台北日期回到收合。
- Driver 常用設定只顯示單一「每日目標」欄位與單一「字體大小設定」選擇；
  刪除重複標題、說明與一般成功狀態文字。四個第一層分類、既有設定、About、
  Local-first 警告與資料安全功能全部保留。
- Driver Header 摘要固定為：常用設定無摘要、工作與收入設定「平台、支出」、
  資料與備份「備份、匯出」、App 與系統「正常／需要注意」。系統狀態只保留
  此裝置與 App、本機資料、離線功能、Service Worker 四項可靠狀態。
- App Shell 為 `driver-pay-pro-v24`。新增 47 項本 Sprint contract；
  `release:check` 與完整 Node regression 314/314 已通過。Chrome 3 模式 ×
  Today／Driver × 5 寬度共 30 組無 overflow，Console 0 error／warning，離線
  App Shell 正常；Production 390px smoke check 通過且無水平 overflow。
- 資料結構、canonical calculations、`settings.displaySize`、WorkRecord、
  `driverPayApp.v2`、Calendar、Reports、AI、CSV 與 Supabase 均未改動。

## Progressive Disclosure、全 App 字級與一致性 — Superseded Candidate

- 工作分支：`codex/v1-1-m1-today-workflow`；base
  `da1a467168426346bfdad9ac2c297c5f052942d4`。Human QA 前不 merge
  `main`、不 Production deploy。
- Today「今日收入」由整排原生 button 控制；金額永遠顯示，目標進度、尚差、
  進度條及原有補充資訊只在展開時顯示。展開 state 只存在 session，跨台北
  日期回到收合，不寫入 WorkRecord 或 settings。
- AI 首屏只完整顯示「本週重點」；本月洞察、收入變化來源、資料與分析依據
  預設收合，展開後仍使用原 `buildAIInsights()` 與 `sharedAnalytics`。
- Driver 固定四類：常用設定（預設展開）、工作與收入設定、資料與備份、
  App 與系統（預設收合）。About 與系統狀態已合併到 App 與系統；舊獨立
  About route／row 與獨立 system-status card 不再存在。
- 全 App `settings.displaySize` 不變；body／secondary 為 standard 13／12px、
  comfort 17／15px、large 22／19px。Calendar 使用獨立 tokens：日期
  14／16／20px、Today circle 34／36／40px，窄螢幕不再覆寫為較小值。
- `.app-chevron` 統一 navigation 與 disclosure 圖示：20px、stroke 2；向右
  是導覽，向下／上是收合／展開，一般動作不帶箭頭。
- App Shell candidate 為 `driver-pay-pro-v23`。自動契約 267/267 通過；其中
  60 項直接覆蓋本 Sprint。Chrome 3 模式 × 5 頁 × 5 寬度共 75 組無水平
  overflow，Console 0 error／warning，Calendar computed sizes 與七日中心
  對齊均通過。仍需一次 iPhone Safari／installed PWA Human QA。

## V1.1 最終顯示體驗與 Calendar 對齊 — Superseded Candidate

- 工作分支：`codex/v1-1-m1-today-workflow`；base `8badf1946184aaa0644d020517cb2016407dda16`。
- Driver「顯示大小」固定提供標準／舒適／大字，canonical durable source
  改為可選 `settings.displaySize`。合法新欄位優先；缺少時相容讀取合法
  `settings.aiReportsReadingSize`；未知值回退 `standard`。執行期與新寫入
  只使用 `displaySize`，不改 `driverPayApp.v2` key 或 WorkRecord。
- `<html data-display-size>` 與 `styles/design-system.css` 共用 tokens 套用
  Today、Calendar、Reports、AI、Driver 與 Bottom Navigation。標準維持既有
  視覺；舒適一般內文 16px；大字一般內文 18px；主要 KPI 與主標題只維持或
  小幅調整，不使用 zoom／scale。
- Driver 原「資料狀態」與「App 狀態」合併為置底的「系統狀態」。正常時
  預設收合；讀取或 storage 異常時顯示「需要注意」並可自動展開一次；展開
  內容只使用既有可驗證資料。
- Calendar 所有日期數字共用 34px 固定 day slot（320px 為 32px）；Today
  只改該槽位的外框／實心狀態，不使用 margin、position 或 translate 位移。
  日期格高度、Heat、Selected、Today button、Work Record Card 與資料邏輯
  保持不變。
- L1 已通過：207/207 Node、Today 55/55、AI 24/24、Driver 24/24、
  Integration 16/16、Reports 61/61、Calendar 41/41；release check、lint
  0 errors、inline JavaScript、Service Worker、Manifest、static validation、
  `git diff --check` 與 npm audit 0 vulnerabilities。
- Chrome mobile emulation 的 3 模式 × 5 頁 × 320／375／390／393／430px
  共 75 組均無水平 overflow；Console 0 error／warning。390px 同列七個
  day slot 的 `top`、34px 高度與垂直中心完全一致。
- App Shell candidate 為 `driver-pay-pro-v22`。本階段只 Push 功能分支與
  Public Preview；收到指定 V1.1 Final Human QA／Release Candidate 核准前
  不 merge `main`、不 Production deploy。

## Calendar Today 日期標記 — Prior Candidate

- 工作分支：`codex/v1-1-m1-today-workflow`；base `49ef956`。AI／Reports
  Reading Size Human QA 已由 Product Owner 確認 Passed。
- Calendar 今天未選取時以 30px、2px 品牌深綠外框包住日期數字；被選取時
  改為品牌深綠實心圓與反差文字。原 4px 小圓點已移除，不使用短橫線、
  文字、額外圖示或動畫。
- 今天與 Heat／Record 可組合；日期格尺寸、44px 級操作範圍、其他日期
  Selected、Heat 演算法、Today button、exact-date route 與 Work Record
  Card 均保持原契約。
- `aria-current="date"` 只套用真正台北今天，`aria-selected` 繼續表達選取。
- L1 已通過：197/197 Node、Calendar 39/39、其他專項 regression、lint
  0 errors、inline JavaScript、Service Worker、Manifest 與 static Production
  validation。Chrome mobile emulation 的 320／375／390／393／430px、
  selected／unselected、Heat、Today button、exact-date route、離線重載與
  Console 均通過。
- App Shell candidate 為 `driver-pay-pro-v21`。本階段只 Push 功能分支與
  Public Preview；Final Calendar Today Marker Human QA 通過前不 merge
  `main`、不 Production deploy。

## AI／報表閱讀文字大小 — Superseded by Global Display Size

- 工作分支：`codex/v1-1-m1-today-workflow`；base `d7571dc`。本 Sprint 只新增
  AI／Reports 的閱讀層級設定，不 merge `main`、不 Production deploy。
- Driver「顯示設定」提供標準／舒適／大字三個原生 radio。唯一來源為可選
  `settings.aiReportsReadingSize`；舊資料或未知值回退 `standard`。
- 切換後立即以 `<html data-ai-reports-reading-size>` 和共用 CSS variables
  更新 AI／Reports，並交易式寫回 `driverPayApp.v2`；失敗會回復前一設定。
- 主要 KPI 與頁面主標題不大幅放大；內文、次要文字、行高、閱讀間距及
  Reports 圖表標籤依層級調整。Today、Calendar、一般 Driver、Bottom
  Navigation 與 canonical calculations 不受影響。
- App Shell candidate 為 `driver-pay-pro-v20`；Product Owner 已確認
  AI／Reports Reading Size Human QA Passed，臨時 Preview 已停止，尚未
  merge `main` 或 Production deploy。

## Today Work Status Header — Current Candidate

- 工作分支：`codex/v1-1-m1-today-workflow`；base `e0b3dc9`。Expense UX
  Human QA 已由 Product Owner 確認 Passed。
- `#workDetailsToggle` 改為「今日工作狀態」整條 44px 原生 button；圖示、
  標題、中間空白、狀態與 chevron 共用同一展開入口。
- 原獨立「工作明細 ＋」列與空白高度已移除；`#workMetrics`、
  `setWorkDetailsExpanded()` 與原 `aria-expanded` state 繼續沿用。
- 工作操作與明細內容都在 toggle button 外，不會冒泡改變展開狀態。狀態
  更新只同步 accessible name，不會重設展開 state 或清除工時草稿。
- App Shell candidate 為 `driver-pay-pro-v19`；完成後只 Push 功能分支與
  Public Preview，不 merge main、不 Production。

## Today Expense UX Batch 2 — Human QA Passed

- Homepage Detail Human QA 已通過；本批只處理支出操作與分月成本，仍在
  `codex/v1-1-m1-today-workflow`，完成後不 merge main、不 Production。
- 支出類別改為唯一原生 select；快捷仍寫入同一 draft，沒有第二份 state。
- WorkRecord 只增加可選
  `expenseAllocations[category] = { months, startMonth }`。原始付款仍在
  `expenses[category]`，舊紀錄缺欄位時視為一次支出，無 migration。
- Calendar 使用原始付款；Reports／AI 使用 `reportExpenseSummary()` 的分月
  衍生成本，尾差由最後月吸收。CSV 同時保留原始付款與分月資訊。
- 付款日期與備註同列；400px 以下日期縮為「今天・7月29日」等短格式。
- App Shell candidate 為 `driver-pay-pro-v18`；Product Owner 已確認
  Expense UX Human QA Passed，臨時 Public Preview 已停止。

## V1.1 Milestone 1 — Today Workflow and Work-Time Unification

- 工作分支：`codex/v1-1-m1-today-workflow`，基準為最新
  `origin/main` `8041e84591c76b16582e41403ae7267f5fd1bc90`。
- Product Owner 已確認 Milestone 1 Final Human QA 通過；原 Final Preview
  tunnel 已停止。後續 Homepage Detail Sprint 通過前仍不合併 `main`、不
  部署 Production。
- Today、Calendar、Reports、AI、CSV 與時薪現在都透過同一個
  `workMetrics()` 讀取整數 `workMinutes` 衍生結果。
- 有效 `startTime`／`endTime`／`breakMinutes` 優先；缺少完整時間時才相容
  讀取舊 `manualHours` 或即時 `workSession`。舊小數工時以
  `Math.round(hours × 60)` 轉為整數分鐘，不改寫歷史紀錄。
- Today 手動修正工作時間採 transactional localStorage 寫入；成功讀回後才
  更新記憶體並發出一次 committed-record notification。開始／暫停／繼續／
  收工與原生 time picker 共用相同欄位。
- Today 綠色摘要是正式工時的唯一高階顯示；工作狀態卡只保留 status、
  44px 工作明細與下一步操作，不再重複主工時。每日紀錄固定為三個可獨立
  收合的區塊：「工時設定／新增支出／其他資料」。
- 新增支出保留完整類別與方式資料，但快捷高度縮為 46px，類別與方式使用
  同列 48px 選擇按鈕；快捷切換不清除草稿金額、日期、方式或備註。
- 工時設定一次只顯示 clock 或 manual 一種輸入。模式由既有欄位推導，
  切換前必須確認，確認後才交易式清除另一組欄位；舊資料同時含兩組值時
  仍以 clock 結果優先，且不會靜默清除。manual 模式只顯示小時／分鐘
  輸入；clock 模式只保留一個共用格式的計算結果。
- 已收工的 clock 紀錄提供同列「再跑一段／修改時間」。確認續跑後保留原始
  `startTime`、將收工空檔加入既有 `breakMinutes`、清除 `endTime` 並沿用
  同一筆 WorkRecord；manual 模式會提示先切換，不建立多段資料模型。
- 有收入但沒有有效工時時，明確儲存流程會提供「補上工時／稍後再補」；選擇
  稍後再補仍保留紀錄，但 Today、Reports 與 AI 均不計算該筆時薪。
- 共用資料品質狀態固定為 `complete`、`missing-work-time`、
  `insufficient-work-time`、`abnormal-hourly-rate` 與
  `invalid-time-range`。最低有效工時為 10 分鐘；高於 NT$2,000／小時只視為
  待檢查資料，不修改原始紀錄，也不產生正常 AI 建議或比較。
- 今日天氣採使用者明確同意後的一次性定位，透過 Open-Meteo（無 API key）
  取得 `weather_code` 並映射為既有有限分類。精確經緯度不寫入 WorkRecord
  或 localStorage；只保存 `settings.weatherAutoConsent` 偏好，建議結果僅在
  session 記憶體快取 30 分鐘。拒絕、離線或服務失敗時保留完整手動流程；
  歷史補登永不套用目前天氣，手動值永遠優先。
- `driverPayApp.v2` 與 WorkRecord schema 均未更名或遷移；`manualHours` 只保留
  作舊資料相容欄位，`workMinutes` 是衍生值而非新儲存欄位；僅相容擴充上述
  settings 偏好，不需要 migration。
- 自動測試目前 173/173，Today targeted 51/51；320、375、390、393、430px
  必須無水平 overflow，Calendar 與 Reports 維持相同 canonical 結果。
- Service Worker App Shell candidate 更新為 `driver-pay-pro-v17`。Follow-up
  implementation commits `882bfcd`、`57ba512` 已推送；Homepage Detail 的
  公開 Preview
  `https://cord-diagnosis-quite-cancel.trycloudflare.com` 已通過未登入 HTTPS、
  390px、Manifest、Service Worker v17、檔案一致性與 Console smoke；Human
  QA 狀態記錄於 `HANDOFF.md` 與 `TESTING.md`。

## Driver Pay Pro Local-first V1 UX Freeze

- 工作分支：`codex/v1-completion-program-20260726`；Production baseline：
  `dbaafba321fd3b108ef5d3b07e2adea7c1f23892`。
- Phase 1～5 已完成：AI／Driver audit、Reports canonical analytics 重用、
  evidence-based AI、Driver 每日目標與本機狀態、跨頁 refresh、45 情境
  regression fixture。
- AI 固定為唯讀「營運建議／本月洞察／智慧提醒」；Driver 只管理既有持久
  設定與本機／App 狀態。
- TD-006 已由 `sharedAnalytics` 與 AI／Reports shared-result tests 解決。
- `driverPayApp.v2`、WorkRecord schema、Calendar／Reports Freeze 保持不變；
  Service Worker candidate 為 `driver-pay-pro-v13`。
- L1 120/120、公開 iPhone L2 與單次 Product Owner L3 全部通過。
- Product Owner 已於 2026-07-26 回覆 `Driver Pay Pro V1 L3 全部通過`；
  Driver Pay Pro Local-first V1 UX Freeze 正式生效。
- 臨時 QA tunnel 已停止；下一步是安全 main audit、PR、一般合併與既有
  Vercel Production 發布。
- Local-first V1 沒有 Supabase、登入、雲端備份、跨裝置同步、migration 或
  外部 AI；相關技術債保持 Open／Deferred。

## Calendar and Reports Stable Milestone — Production

- Calendar UX Freeze Version 1、Reports UX Freeze Version 1 與 Foundation
  Cleanup Version 1 已透過 PR
  `https://github.com/superaha-boop/driver-pay-pro/pull/2` 正常合併至
  `main`。
- Release Candidate HEAD：
  `37e7fe913af0039c9457de9f1139694e10b82d20`；main Release merge：
  `dbaafba321fd3b108ef5d3b07e2adea7c1f23892`。
- Production：`https://driver-pay-app.vercel.app`；Deployment：
  `dpl_A3wt3sRW7hNDVHFZrWtSPaHpAjKJ`，環境 Production、狀態 READY，部署
  commit 與 main Release merge 一致。
- Release Gate：94/94 Node tests、Calendar 38/38、Reports 44/44、lint、
  Production validation、build、`release:check`、Manifest、Service Worker、
  responsive、Console 與 Offline App Shell 全部通過。
- Product Owner 已於 2026-07-26 回覆 `Production L4 全部通過`；本次
  Calendar and Reports Stable Milestone 正式標記 Completed。
- 本次不是完整 Driver Pay Pro V1。AI 正式實作、TD-006、Driver 完整功能、
  Supabase／跨裝置同步、conflict resolution、record metadata、多段工作模型、
  TypeScript 與 iPhone native input 長期驗證仍未完成。
- 正式資料、WorkRecord schema、`driverPayApp.v2`、Supabase 與 Service
  Worker cache 均未因 Release 收尾變更；cache 維持
  `driver-pay-pro-v12`。

## Calendar V1 完成狀態

- Calendar V1 的 Read、Navigate、Create、Edit、Delete 與 transactional rollback 已完成。
- Calendar Final Regression 固定 fixture 與 52 項自動測試通過；Today、Calendar、Reports 共用 canonical calculations。
- Product Owner 已完成並確認 iPhone Safari、installed PWA、Preview 與 Offline Human QA。
- Calendar UX Freeze — Version 1 已生效；後續只接受 Bug、Accessibility、Data Integrity 與重大使用障礙修正。
- `driverPayApp.v2`、WorkRecord schema、Heatmap 演算法與計算公式均未因封板改變。
- Reports Sprint 5B1 與 5B2 已完成週／月核心、平台貢獻、重要日期下鑽與
  hardening；Final Regression、L3 Human QA 與 Feature Freeze Gate 已完成。
- Reports UX Freeze — Version 1 已生效；後續只接受 Bug、Accessibility、
  Data Integrity、Security、重大使用障礙與 Production blocker。
- Reports 實作必須以 `docs/REPORTS_SPEC.md` 為唯一主要功能規格，不得因此回頭改造 Calendar。

## Reports Specification 狀態

- `docs/REPORTS_SPEC.md` Version 1.0 已定案，涵蓋週／月／平台資訊架構、session state、台北期間、canonical KPI、前期比較、淨收入趨勢、平台貢獻、Calendar exact-date drill-down、empty／loading／error／offline 與驗收規格。
- 新 App session 固定預設週報；Reports 的 tab、週、月、平台期間與返回 context 都是 session-only，不新增到 `driverPayApp.v2`。
- 週報固定星期一至星期日；月報採完整台北曆月；月趨勢採四至六個 Monday-first 週彙總。
- 平台頁只描述收入貢獻、排行、占比與安全比較，不得推論效率或最佳平台；小費不歸入平台收入。
- Sprint 5B1／5B2 已實作 canonical 週／月 KPI、前期比較、淨收入趨勢、
  平台週／月收入貢獻、exact-date Calendar drill-down、return context、
  committed-record refresh 及 Empty／Loading／Error／Offline 狀態。
- 平台內建別名只在讀取層正規化；未知自訂平台安全保留顯示，歷史資料不被
  改寫，小費不歸入平台收入。
- Reports Final Regression 固定 28 情境 fixture；全套 Node tests 88/88 通過。
- L2 Preview Smoke 與 Product Owner L3 Human QA 已完成，包含 iPhone Safari、
  installed PWA、Offline、VoiceOver、Reduced Motion、safe area 與 responsive。
- Reports Feature Freeze Checklist 全項 Passed；一般視覺改善與新增功能轉入
  Backlog，不得直接修改凍結介面。

## Foundation Cleanup Version 1 狀態

- Foundation branch：`codex/foundation-cleanup-20260726`，base commit：
  `293c1878d09f95e507311e7ae2b531b7718ac62b`。
- 專案維持靜態 PWA，不加入 bundler、framework 或 TypeScript migration。
- `package.json` 提供 lint、全部／Calendar／Reports 測試、Production
  validation、build alias 與單一 `release:check`。
- ESLint 檢查 Node scripts、tests、Service Worker 與 `index.html` inline
  JavaScript；correctness errors 阻擋 release，既有 unused code 保留 warning。
- Production validation 檢查 HTML、資源、Manifest、Service Worker App Shell、
  navigation fallback、五個主要導覽、`driverPayApp.v2`、敏感字串與 Preview／
  tunnel URL。
- `design-system.html` 保持獨立內部展示頁，已補齊 segmented control、KPI、
  Empty／Loading／Error、list row、44px touch target、focus-visible 與 reduced
  motion evidence；不進入正式導覽或 App Shell。
- Calendar／Reports UX Freeze、Today／AI／Driver、schema、資料與 PWA cache
  保持不變；Service Worker 仍為 `driver-pay-pro-v12`。

## 1. App 的核心設計原則

- Driver Pay Pro 是給多元計程車司機使用的收入與工時管理 App。
- 手機版優先，需適合單手操作、快速閱讀及駕駛工作情境。
- 首頁與報表優先提供清楚總覽，不做成層層展開的傳統表單，也不採傳統企業 Dashboard 或 KPI 卡片牆。
- 重要資訊直接顯示；能直接點選或原位編輯，就不增加額外輸入畫面。
- 能自動儲存就不增加「完成」或「確認」按鈕。
- 避免水平捲動、過度留白、大型套卡與沒有資訊價值的零值欄位。
- 主視覺使用深綠、灰綠與白色，不使用亮藍色資料文字或各平台品牌色。
- 已完成的畫面應凍結；除非使用者明確提出需求，不順手重做其他區塊。
- 任何視覺修改不得改變收入、工時、平台比例、統計或 localStorage 資料結構。

### 全域產品設計摘要

- Driver Pay Pro 是 mobile-first PWA，主要體驗目標依序為 iPhone Safari、installed PWA、其他手機、平板與 Desktop。
- 視覺方向採 Apple-like 的低彩度、清楚層級與柔和深度感；Apple-like 不等於只增加圓角。
- Driver Pay Pro 已建立正式 Design System，作為後續 Calendar、Reports、AI 與 Driver UI 的共用基礎。
- `styles/design-system.css` 的 CSS custom properties 是 spacing、radius、typography、語意色彩、shadow、border、motion、touch target 與 safe area 的單一視覺來源。
- Design System 採 Apple-inspired、mobile-first、one-hand、calm interface；後續頁面逐步遷移，不進行一次性全站重寫。
- 全 App 遵循三秒原則、兩層原則、免思考原則、單手操作原則與 Apple 美學原則；完整永久規則以 `AGENTS.md` 為準。
- 月曆採 `Overview → Detail`：先定位日期與辨識工作狀況，再開啟當日工作紀錄。
- 月曆點選日期後顯示的正式區域名稱為「工作紀錄卡片」，採核心資訊雙欄、延伸資訊單欄的混合式布局。
- Calendar V1 已實作標準工作紀錄卡片與過去日期新增／編輯／刪除；精簡、完整、自訂顯示模式仍屬後續核准規格。

### 正式產品架構摘要

- 正式產品邊界、頁面責任、功能歸屬、跨頁資料契約與 Roadmap 以 `docs/PRODUCT_SPEC.md` 為準。
- 底部主要資訊架構固定為「今天｜月曆｜報表｜AI｜Driver」，不增加第六個主要分頁。
- 今天只負責今日即時工作與今日紀錄；月曆負責定位日期及管理過去紀錄；報表與 AI 唯讀；Driver 只管理持久設定。
- 每個可寫入功能只能有一個 Primary owner。跨頁需要修正紀錄時，必須連到負責頁面，不在報表或 AI 複製表單。
- 收入、支出、淨收入、實際工時、平均時薪及週／月彙總必須共用單一計算來源。
- 月曆正式定義為星期一至星期日；新啟動選今天，同一 App session 保留選取日期，未來日期不可建立紀錄。
- Calendar V1 已完成 Monday-first 月份格、session-only selected date、日期 deep link、收入熱度、標準工作紀錄卡片、月份摘要與過去日期安全 mutation。
- Calendar Sprint 4A.5 已完成低風險 Visual Polish：壓縮頁內垂直節奏、強化月份導覽／星期標題、拉近日期與收入、微調 heat tokens，並以字重、間距與淡分隔線強化工作紀錄卡片層級。
- Sprint 4A.5 沒有改變 Calendar state、日期／手勢／鍵盤／ARIA、heat 演算法、canonical calculation 或資料；Calendar 仍完全 read-only。
- 現況差距與技術限制集中記錄於 `docs/TECH_DEBT.md`，不因文件建立而自動授權實作。

### Calendar Specification 摘要

- `docs/CALENDAR_SPEC.md` 已定案；Calendar 定位是歷史日期定位、查看、補登與修正，不取代 Today 或 Reports。
- Calendar 採 Monday-first；一般新 session 選今天，同 session 保留 selectedDate／displayedMonth，不自動選最近工作日。
- 單純切換月份不改 selectedDate；點日期或滑動日期才更新工作紀錄卡片，跨月時同步 displayedMonth。
- 日期格只顯示淨收入簡寫與柔和相對熱度；Today 與 Selected 分開，未來日期可查看但不可新增。
- 工作紀錄卡片第一版固定標準模式，數值使用 canonical calculations 與 Design System primitives；Calendar 與 Today 共用同一套 Record Editor。
- Calendar Read／Navigate／Create／Edit／Delete、Final Regression 與 Human QA Gate 已完成；Calendar UX Freeze — Version 1 已生效。
- 單純月份切換保留原 `selectedDate`，若選取日不在顯示月份，卡片保留該日並提示；此行為已在 Human QA Gate 驗收。

# Development Principles

## 1. 一次只做一個 Sprint

每次只處理：

- 一個頁面
- 一個功能
- 或一個明確的小範圍修改

不要在同一個任務裡同時修改多個未確認區塊，避免：

- 改到不該改的畫面
- 產生回歸問題
- 驗收時無法判斷是哪一項修改造成錯誤

---

## 2. 先討論，再交給 Codex

固定流程：

1. 使用者提出想法、問題或截圖。
2. ChatGPT 以產品經理與 UI／UX 角度分析。
3. 雙方討論並確認方向。
4. ChatGPT 整理成完整 Codex 規格。
5. Codex 才開始修改程式。

沒有確認前，不要讓 Codex 自行決定大幅改版方向。

---

## 3. 所有給 Codex 的內容放在複製框

已確認：

- 所有要貼給 Codex 的內容，都放進可直接複製的區塊。
- 不把說明、聊天內容或額外評論混入任務規格。
- 規格需清楚分段。

標準 Codex 規格應包含：

- 任務目標
- 修改範圍
- 詳細需求
- 操作邏輯
- 視覺規格
- 禁止事項
- 驗收條件
- 完成後回報項目

---

## 4. 修改前先備份

每次修改前要求 Codex：

- 建立備份
- 說明備份方式
- 不覆蓋唯一可用版本
- 不刪除目前穩定版本

涉及 Git 時，不可未經確認執行：

- `reset`
- `rebase`
- `force push`
- 任意切換分支
- 刪除本機完成版本

---

## 5. 完成後一定要驗收

Codex 完成後要回報：

- 修改檔案清單
- 修改內容摘要
- TypeScript 檢查
- lint 結果
- build 結果
- 手機版截圖
- 是否影響其他頁面
- 是否修改資料庫或計算邏輯

不能只看 Codex 說「完成」，必須實際檢查。

---

## 6. 以 iPhone Safari／PWA 為主要驗收環境

Driver Pay Pro 是手機優先 App，所以主要驗收環境為：

- iPhone Safari
- iPhone PWA
- 真實手機寬度

驗收重點：

- 是否有水平 overflow
- 固定底部導覽是否遮住內容
- safe-area 是否正常
- 輸入框是否容易操作
- 鍵盤是否正確
- 自動儲存是否正常
- PWA 關閉後重開資料是否保留

桌面版正常不代表手機版完成。

---

## 7. 完成一頁就凍結

頁面驗收完成後：

- 標記為已完成
- 進入凍結狀態
- 後續任務不可順便修改
- 除非使用者明確提出問題，否則不再反覆美化

目前已確認：

- 首頁主要 UI 已凍結
- 平台收入設計已凍結
- 週報表第一輪手機響應式優化已完成
- 後續只允許明確指定的小範圍修改

---

## 8. 不可為了 UI 破壞功能邏輯

所有視覺修改都必須保留：

- 收入計算
- 工時計算
- 時薪計算
- 淨收入計算
- 資料儲存
- Supabase 資料
- 日期查詢
- 週報／月報統計結果

若只是 UI 任務，禁止修改：

- 資料庫欄位
- 計算公式
- API
- 查詢邏輯
- 儲存流程

---

## 9. 手機優先，但不能破壞桌面版

響應式原則：

- 手機版優先設計
- 手機版不使用大型橫向表格
- 手機版避免水平滑動
- 桌面版可保留較完整表格
- 不同 breakpoint 可以使用不同呈現方式
- 不可同時顯示兩套重複內容

---

## 10. 不做過度工程

目前階段以 MVP 為主。

不要過早加入：

- 複雜動畫
- 過多設定
- 大型狀態管理重構
- 不必要元件抽象化
- 尚未確認的 AI 功能
- 過度完整的桌面版功能
- 為未來可能需求提前改動大量架構

先完成司機最常用的核心流程。

---

## 11. 文件是新對話的唯一穩定交接基準

每次新對話先閱讀：

1. `PROJECT_CONTEXT.md`
2. `HANDOFF.md`
3. 實際 Git 狀態
4. 現有程式碼

文件分工：

### `PROJECT_CONTEXT.md`

保存：

- 長期產品原則
- 已確認 UI
- 操作流程
- 不可退回的舊設計
- Roadmap
- 開發原則

### `HANDOFF.md`

保存：

- 當前分支
- commit
- PR
- 未提交變更
- 推送狀態
- 部署狀態
- 本輪完成內容
- 下一個安全步驟

---

## 12. 技術狀態以實際 Git 為準

舊對話裡的分支、commit、PR 狀態可能過期。

因此每次開始工作前都要重新確認：

- 目前分支
- 最新 commit
- 工作目錄是否乾淨
- 是否已 push
- PR 是否存在
- PR 是否已 merge
- `main` 是否更新
- Vercel 是否部署

若文件與 Git 不一致：

- 技術狀態以 Git／GitHub／Vercel 為準
- 產品原則以 `PROJECT_CONTEXT.md` 為準

---

## 13. Codex 先檢查，再修改

新任務開始時，Codex 不應直接寫程式。

應先：

1. 閱讀交接文件。
2. 檢查 Git 狀態。
3. 確認目標檔案。
4. 回報理解。
5. 再依規格修改。

若文件與實際狀態衝突，先回報，不可自行修正。

---

## 14. Sprint 完成後的 Git 工作流程

專案已進入多人測試與持續開發階段。Codex 完成一個 Sprint 並通過適用驗證後，可以直接依序：

1. 完成核准範圍內的修改。
2. 執行專案實際具備的 TypeScript、lint 與 build；工具不存在時必須標示「不適用」，不得虛構通過。
3. 完成必要的語法、功能、回歸、Console、手機響應式、資料與 PWA 影響驗證。
4. 檢查 `git diff`、`git diff --check` 與 `git status`。
5. 只 stage 本 Sprint 核准的檔案，不混入不相關 dirty changes。
6. 依 Commit Message 規範建立 commit。
7. push 到目前工作 Branch。
8. 使用一般 Git 合併整合最新 `main` 與目前工作 Branch；不得使用 reset、rebase 或 force push 改寫歷史。
9. push `main`，由既有 Vercel Git Integration 自動建立 Production Deployment，並核對正式部署 commit。
10. 更新 `HANDOFF.md`，記錄本次修改、驗證、branch、commit、merge、push 與 Production 狀態。
11. 回報 Branch、Commit Hash、`main` Merge Commit、Production 狀態、修改檔案、驗證結果、已知問題與人工 QA。

Commit Message 使用以下前綴：

- `feat:` 新功能
- `fix:` Bug 修正
- `refactor:` 不改變外部行為的重構
- `docs:` 文件
- `style:` 純樣式或格式
- `test:` 測試
- `chore:` 維護工作

Codex 無需為每次 commit、push 工作 Branch、合併至 `main`、push `main` 或 Production Deploy 重複詢問。此持續授權由 Product Owner 於 2026-07-25 明確提供，目的是讓每次完成且驗證通過的 Sprint 可直接更新手機正式版。若當次使用者明確要求不部署、驗證失敗、遠端衝突無法安全判定或可能造成資料遺失，必須停止發布並回報。若工作目錄包含其他未提交變更，必須先確認範圍並採明確檔案 staging；不可使用會混入不相關內容的方式。

建立或修改 Pull Request、切換分支及 Preview 流程仍依當次 Sprint 指令處理。Production 只能由已驗證的 `main` 透過既有部署整合產生，不可繞過 Git 直接修改正式站。

---

## 15. 必須等待使用者確認的高風險操作

以下操作必須先說明原因、影響與風險，並等待使用者明確確認：

- 修改 Supabase Schema
- 建立或執行 Migration
- 刪除正式資料
- 刪除分支
- force push
- reset
- rebase
- 修改主要架構
- 大規模 UI 重構
- 任何可能造成資料遺失的操作

完成且驗證通過的 Sprint 預設會依第 14 節合併及正式部署；這不包含改寫 Git 歷史、資料庫變更或任何資料破壞操作。

---

## 文件維護規則

1. 每次新任務開始前，Codex 必須先閱讀 `PROJECT_CONTEXT.md` 與 `HANDOFF.md`。
2. 每個 Sprint 完成後，要更新：
   - 已確認的介面樣式
   - 已修改事項
   - 最新完成進度
   - 下一步工作
3. 新的穩定開發規則要加入 `Development Principles`。
4. 已被明確否決的開發方式要加入「不能退回的舊設計」或相應禁止事項。
5. 不得刪除仍有效的開發原則。
6. 技術狀態必須以實際 Git、GitHub 與部署狀態更新。
7. 不要把一次性的除錯紀錄大量堆進 `PROJECT_CONTEXT.md`。

## 2. 已確認的介面樣式

### 首頁

- 首頁核心區塊已凍結，順序為：核心數據、工作狀態、工作控制、平台收入、更新今日紀錄及次要功能。
- 最上方深綠核心卡顯示今日收入、今日實際工時與目前時薪，並整合今日目標、完成比例、達標狀態與進度條。
- 今日工作狀態直接顯示總經過、休息及實際工作時間，不使用展開／收合。
- 平台收入維持一個平台一行、圓角收入框、原位編輯及自動儲存。
- 每個平台可獨立設定直接輸入總額或每筆收入累加；預設只有 Yoxi 使用累加。
- 首頁不再顯示獨立天氣列；班別與天氣位於「其他資料」內，以五個直接選項呈現，點擊後自動儲存。
- 「更新今日紀錄」日期使用 56px 高的完整置中日期卡：四邊圓角框線、整卡可點，底層保留原生日期選擇功能；新增支出付款日期共用同一元件樣式。

### 新增支出

- 第一層依序顯示油錢、停車費、洗車快捷新增、支出類別、金額、三段式支出方式、付款日期與單一儲存按鈕。
- 使用者文字固定為「一次支出」、「每月固定」、「分月計算」，不使用會計術語。
- 一次支出沿用既有 `entry.expenses[category]` 儲存方式；分月計算只以可選
  `expenseAllocations[category] = { months, startMonth }` 保存必要規則。
  Calendar 保留原始付款口徑，Reports／AI 使用衍生後的每月成本；舊紀錄
  沒有 allocation 時仍視為一次支出。
- 分月計算自訂期間限制 2～60 個月；不能整除時由最後一個月補齊差額。

### 月曆與報表

- 底部導覽固定為「今天｜月曆｜報表｜AI｜Driver」，使用 24px Lucide inline SVG 與 14px 單行文字。
- 月曆只顯示月份明細與每日歷史紀錄，不放週報、月報或平台分析。
- 報表使用固定主標題「報表」，內含週報、月報與平台三個分頁；同一 App session 會記住分頁，fresh session 固定回到週報。
- 月曆月份與報表期間互相獨立；正式 Reports period state 以 `docs/REPORTS_SPEC.md` 為準。
- 每日歷史紀錄顯示總收入、平台收入、支出、淨收入與實際工時；編輯與刪除操作至少 44px，刪除保留確認。
- 舊 `#week`、`#month`、`#platform`、`#analysis` 連結仍會導向對應報表內容。

### 週報手機版

- 週期固定為星期一至星期日的完整 7 天，不因最後一筆資料日期、今日日期或有紀錄的日期範圍而縮短。
- 週期日期採精簡格式：同年不重複年份；例如 `7/13－7/19`、跨月 `6/29－7/5`，跨年才顯示 `2026/12/28－2027/1/3`。
- 週期標籤與日期同列，日期不可逐字換行或超出卡片。
- 每週總額保留週期、總收入、支出、淨收入、工時與平均時薪；手機版摘要數字使用兩欄排列。
- 週報不再承載月份明細；月份明細已完整移至月曆。

### 月曆每日清單

- 「月份明細」以單一外層白色卡片承載每日清單，不再每一天套大型圓角卡片。
- 每日清單第一行顯示月／日、星期、班別、天氣及當日總收入。
- 後續顯示收入大於 0 的平台、支出、淨收入與實際工時；平台過多時自然換行，每個平台名稱與金額不可拆開。
- 無平台收入時只顯示「尚無收入紀錄」，不列出所有 `$0` 或 `—`。
- 每日紀錄以 `#E3E9E5` 細線分隔，最後一筆沒有分隔線。
- 手機版保留完整文字的編輯與刪除操作；不加入展開、收合或查看更多。
- 700px 以下顯示精簡每日清單；700px 以上保留桌面表格，兩套版型不可同時顯示。
- 底部保留固定導覽列與 iPhone safe-area 所需空間，不得遮住最後一筆資料。

## 3. 使用者操作流程

- 直接輸入總額：點擊同列收入框輸入當日總額，鍵盤完成或失焦後覆蓋儲存。
- 每筆收入累加：點擊總額仍可校正；點擊加號輸入單筆收入並累加。
- 班別與天氣：展開「其他資料」後直接點選，無下拉選單與確認按鈕。
- 日期：點擊完整置中日期卡即可開啟原生日期選擇器，選擇後立即更新。
- 月曆：使用獨立月份選擇器閱讀每日歷史紀錄，並可直接編輯或刪除既有紀錄。
- 報表：從「報表」進入週報、月報或平台收入排行；同 session 保留各自期間與分頁，fresh session 回到週報。

## 4. 不能退回的舊設計

- 平台切換卡片、第二行收入輸入框、鉛筆圖示及每列完成按鈕。
- 寫死只有 Yoxi 可累加、每列重複顯示 `NT$`、亮藍色收入數字。
- 今日工作時間的展開／收合，以及工作狀態內重複顯示收入與時薪。
- 天氣占用首頁獨立一列、強制先選天氣才能開始工作、使用下拉選單再確認。
- 日期使用過高、置中的大型表單框。
- 把週報、月報或平台分析重新放回月曆，或讓報表切換時改變底部 Active State。
- 手機月曆或週報使用超寬表格或水平捲動。
- 每天一張大型卡片、卡片套卡片，以及列出所有無收入平台的 `—`。
- 為縮短畫面而隱藏有效收入、增加查看更多或展開／收合。

## 5. 最新完成進度

- 首頁核心卡放大並整合今日目標。
- 首頁獨立天氣列已移除；「其他資料」內班別與天氣已改為直接選取、自動儲存。
- 「更新今日紀錄」與新增支出付款日期已改為共用的完整置中日期卡。
- 新增支出已加入三個快捷按鈕與一次支出、每月固定、分月計算；本次
  Expense UX Batch 2 已讓分月計算保存可選 allocation metadata，重新載入
  後仍可由 Reports／AI 依月份重算，原始付款紀錄保持一筆。
- 週報週期已改為精簡日期格式。
- 週報手機版月份明細已改為單一外層卡片內的精簡每日清單。
- 手機清單只顯示有收入的平台，無收入日顯示「尚無收入紀錄」。
- 390px 下常見三平台可維持同一收入列；320px 下允許自然換行且沒有水平 overflow。
- 桌面版仍保留原表格，週報與月份明細的資料來源維持不變。
- 工時已統一由毫秒制的 `workMetrics()` 計算，平均時薪統一由 `hourlyRate()` 計算；歷史未收工紀錄不再持續累加到今天。
- 週報週期已改用不受 UTC 轉換影響的 date-only 曆法計算星期一至星期日；星期日仍歸屬前一個星期一開始的週。
- 底部導覽已重整為今天、月曆、報表、AI、Driver；月曆與報表資料責任、月份狀態及 hash 路由已分離。
- 月份明細已完整移入月曆；報表固定包含週報、月報與平台收入排行；Reports
  runtime state 已改為 session-only，legacy durable 欄位只為相容而保留、不再讀寫。
- PWA Service Worker 使用短版 cache `driver-pay-pro-v12`、略過 HTTP cache
  檢查更新並在新 worker 接管後安全重載。
- 產品程式仍集中在 `index.html`；Foundation V1 已建立 package、ESLint 與
  static production validation／release gate，但仍沒有 TypeScript 或 bundler。
- 目前 Foundation 工作位於 `codex/foundation-cleanup-20260726`，base commit
  為 `293c1878d09f95e507311e7ae2b531b7718ac62b`。依本次 PRD 不合併 `main`、
  不 Production deploy；實際 push 狀態仍以即時 Git／GitHub 檢查為準。

## 6. 下一步工作

1. 下一步是 Production Release Sprint；Foundation Cleanup 本身不合併
   `main`、不部署 Production。
2. AI 後續必須重用 Reports 的 period utilities、`aggregateReport()`、
   `compareReportPeriods()`、trend／Important Dates／platform selectors、
   persistence read、record-change refresh、formatting、state patterns 與
   drill-down adapter，不建立第二套 aggregation。
3. Calendar 已 UX Freeze；一般視覺偏好與新想法加入 Backlog，不直接修改。
4. 每次 Calendar、PWA 或原生 input 相關發布仍需實體 iPhone Safari 與 installed PWA 回歸。
5. 未經使用者確認，不修改已凍結首頁或重新設計週報。
6. 分月支出已依 D-038 使用可選 metadata 與讀取層衍生方式完成，不建立未來
   月份 WorkRecord，也不需要 migration；若未來要改變此資料契約，仍需另立
   PRD 與相容方案。

### QA 分級

- L1：自動驗證。
- L2：可由未登入 iPhone Safari 直接開啟的 Preview Smoke。
- L3：模組 Final Regression 後的完整 Human QA。
- L4：Production Release QA。
- 小 Sprint 不重複要求完整人工 QA；高風險資料、同步、Service Worker 與
  iOS 特有行為仍依風險即時提升驗證層級。
