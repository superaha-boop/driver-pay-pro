# Driver Pay Pro 開發交接摘要

更新日期：2026-08-13
專案位置：Git repository 根目錄
GitHub：`superaha-boop/driver-pay-pro`

## Appearance / Dark Mode — Production Released

- Branch：`codex/appearance-dark-mode`；base：`1e7dffb`；功能 commit：`ded1393`；
  QA 文件 commit：`c48207f`；`main` merge commit：`b438755`。
- Driver「常用」新增單一「外觀」設定：跟隨系統／淺色／深色。缺少或非法舊值
  安全回到 `system`；新保存只寫入 `settings.appearance`。
- Root 使用 `data-appearance` 保存偏好語意、`data-theme` 表示實際 light／dark。
  `prefers-color-scheme` listener 只註冊一次；固定 Light／Dark 不受 OS change 覆蓋。
- Appearance 切換不呼叫 `renderAll()`、不 reload、不重建 view，不清除
  activeRecordDate、Calendar／Reports session state、表單草稿或 disclosure state。
- Semantic tokens、Dark palette、輸入、按鈕、Calendar heatmap、Reports CSS chart、
  AI、Driver、Snackbar、Bottom Navigation 與安全 PWA 啟動色已完成。Light 模式
  保留現有視覺，Dark 不使用純黑或高亮螢光綠。
- `manifest.webmanifest` 只將啟動背景改為非白色品牌深綠；Service Worker 升至 v41，
  仍禁止 `skipWaiting()`／`clients.claim()`／`controllerchange` reload。
- 439/439 Node tests、lint、inline JS、Manifest／SW syntax、瀏覽器 Console 與
  225 組響應式矩陣已通過。Product Owner 已於 2026-08-13 完成三個 Appearance、
  Safari／installed PWA、五個主分頁、三種 display size 與重開保留的 Human QA；
  High Priority 問題為無。
- 已一般合併並推送 `main`。Production deployment
  `dpl_8HPQNMTp2Qsq2AsUaRYdzdux4YBU` 為 `READY`，正式網址為
  `https://driver-pay-app.vercel.app`；390px 五頁、三種外觀、Console、Manifest、
  v41 Service Worker 與 Runtime errors Smoke QA 全部通過。

## Active Date + Today Save Feedback Hotfix — Human QA Pending

- Branch：`hotfix/active-record-date`；base／Production HEAD：`6bb2139`；candidate
  commit 以本分支最新 HEAD 為準。`main` 未合併，Production 未部署。
- Today 所有指定日期寫入與 Undo 以唯一 `activeRecordDate` 驗證；invalid／mismatch
  會顯示「日期狀態異常，未儲存。請重新選擇日期。」並保留草稿，絕不 fallback。
- Calendar 維持唯讀；返回 Today 會完整 render KPI、工作狀態、平台收入與 Daily
  Record，沒有 reload、延遲刷新或清除 localStorage。
- 支出日期直接繼承 Active Date；金額與備註入口同排。支出與小費新增都依序執行
  saving → durable persistence → saved → summary refresh → reset → 五秒 Snackbar Undo。
- 支出 Undo 連同 category amount、allocation 與 note 回復；小費 Undo 只回復同日期
  最近一筆加入。日期切換會清除舊 Undo，避免作用到其他日期。
- 小費五秒 Undo 過期後仍可點「這天已記錄」旁的「修改」，在同一個輸入中校正
  當天小費總額；可改為 0，成功後才離開修改模式，失敗保留輸入。
- 儲存失敗不清草稿、不顯示成功、不變更 summary；重複點擊由 in-progress／saved
  guard 阻止。既有 auto-save 欄位沒有新增多餘儲存按鈕。
- `index.html`、`sw.js`、回歸測試與永久文件是本次預期變更。App Shell v40；
  `driverPayApp.v2`、WorkRecord schema、Manifest、Calendar edit ownership 與
  Supabase 均未變。
- 目前自動測試 423/423 Passed；Public Preview、瀏覽器／responsive／PWA 最終
  evidence 完成後，狀態才可標記 `Ready for Final Human QA`。

## Today Expense Date Simplification — Production Released

- Branch：`codex/today-expense-date-simplify-20260812`；base：`6bd16ba`。
- Today Daily Record Editor 只保留唯一原生日期卡；「每日紀錄」與「支出紀錄」
  不再重複日期，也不再顯示第二個鎖定付款日期列。
- 支出付款日仍由 `activeRecordDate` 唯一決定，Calendar、WorkRecord、計算、
  `driverPayApp.v2`、Manifest 與 Supabase 均不變。
- 金額與備註入口同排；備註輸入框只在展開後顯示。
- v37 installed-PWA 日期／disclosure touch 管線未修改，App Shell 為 v38。
- Today 143/143、全部 408/408 Node tests 及 320／375／390／393／430px 本機
  瀏覽器驗證通過；Product Owner 已確認 Preview 測試正常。
- 功能 commit：`bbb7392f658d8c2d3e2272f83658735c51cb39a3`；已一般合併並
  推送 `main`，merge commit：`c49fb7654dc8d32a0c0ce68a8cac5e31df81894f`。
- Production：`https://driver-pay-app.vercel.app`；deployment
  `dpl_zCca7z7VGmMsnreB5nHhcJiE2yyZ` 為 `READY`。正式站與 Manifest HTTP 200，
  Service Worker v38，390px 無水平 overflow，Console 與 Runtime errors 為 0。

## Installed-PWA Native Date Focus Hotfix — Production Released

- Branch：`codex/date-picker-pointerdown-20260811`；base：`7979674`。
- Product Owner 在 v35 Production 依序關閉 Safari 正式站分頁、完全關閉 PWA、等待
  後重開，連續五次日期 Picker 測試皆失敗；正式部署、Git commit、v35 App Shell
  與 Runtime error 均已排除，問題不是使用者操作或 GitHub／Vercel漏更新。
- v36 Public Preview 實機 QA 失敗：日期在直接操作與先開啟工時／支出／其他資料
  後皆可能需要多次點擊，禁止合併或正式部署。
- 既有實機 trace 已顯示 summary focus 會跨事件殘留；程式也確認三個 disclosure
  在 capture pointerdown 強制 focus，而日期於下一個 capture pointerdown 尚未取得
  焦點前呼叫 `showPicker()`。WebKit iOS 官方 issue 顯示此 API 不是可靠原生路徑。
- v37 candidate 移除 disclosure 強制 focus 與日期 `showPicker()`；日期、disclosure
  各自使用 touch intent，日期只在有效 touchend 聚焦真正原生 input，已聚焦時讓
  native click 自行重開。suppression 改以控制項 WeakMap 隔離。
- 資料、計算、日期綁定、Manifest 與其他頁面不變；App Shell candidate 為 v37。
- 功能 commit：`6639cec5ab76edcaa59c050e5d3dd7881a2041de`；Public Preview
  deployment：`dpl_AC28Z9xXJvo6N37xX8UuQsMDAyau`，狀態 `READY`。
- Product Owner 已完成實體 iPhone installed-PWA 多次冷啟動與交錯操作 Human QA；
  直接日期及工時／支出／其他資料後再開日期均穩定通過，High Priority 問題為無，
  Release Candidate 已核准正式發布。
- QA 文件 commit：`422310bdef6939da366dcc85c5cf751b5b3850ee`；已一般合併並
  推送 `main`，merge commit：`5b45618ad9029e4a47036e9e1ce72e596afc0018`。
- Production：`https://driver-pay-app.vercel.app`；deployment
  `dpl_6kfjT63qpgo8pqN1gxj1ejVcdc3C`，狀態 `READY`，來源為上述 `main` merge
  commit。正式站、Manifest 與 Service Worker HTTP 200，App Shell 為 v37。
- Production 390px 無水平 overflow，Console 0 error／warning，發布後 Runtime
  errors 為 0。未使用 force push／rebase／reset，未修改資料、Schema、storage
  key、Manifest 或 Supabase。

## Installed-PWA Date Picker Single Activation — Production Released

- Branch：`codex/date-picker-single-activation-20260811`；base：`eb9e0bd`。
- v34 Production 中，日期 Picker 於實體 iPhone installed PWA 開啟約 0.5 秒後關閉；
  正式站無 Runtime error，Git 差異確認 v34 新增的日期 `pointerdown → focus()` 與
  同一觸控原生啟用形成雙重啟用。
- 日期現在不再於 pointerdown／touchstart 提前 focus。standalone 有效 touchend
  只對同一原生 date input 呼叫一次 `showPicker()`，成功後才攔截 default 與補送
  click；不支援／失敗時保留原生 fallback。
- 工時、支出、其他資料不改；App Shell candidate 為 `driver-pay-pro-v35`。
- `npm run release:check` Passed：408/408 Node、Today 143/143、Calendar 69/69、
  Reports 90/90、AI 26/26、Driver 27/27、Integration 17/17；lint 0 errors／10 個
  既有 warnings，Inline JavaScript、Service Worker、Manifest、Production
  validation 與 `git diff --check` 全部通過。
- Product Owner 已於 2026-08-11 完成實體 iPhone installed-PWA Human QA：完全
  關閉後重開，日期第一次點擊即開啟並持續顯示，可正常選擇日期；工時、支出與
  其他資料亦正常。High Priority 問題為無，Release Candidate 已核准正式發布。
- 功能 commit：`83c038ee50619ad6747487ccae33cf22129e2a74`；QA 文件 commit：
  `c61e7f0e42d1f29236e189cbcbd239167c092cb6`；`main` merge commit：
  `bd73287b8e38f221258ec1ae82a1d17ade47905e`。
- Production：`https://driver-pay-app.vercel.app`；deployment
  `dpl_EgEUuhhtMiySJgpXXwHfAtHs4Lp8`，狀態 `READY`，Service Worker v35，
  Manifest standalone。390px 無水平 overflow、Console 0 error／warning，發布後
  Runtime errors 為 0。
- 發布未使用 force push／rebase／reset，未修改資料、Schema、storage key、
  Manifest 或 Supabase。

## Today Installed-PWA First-input Unification — Production Released

- Branch：`codex/today-first-input-unification-20260811`；base：`fab1d1b`。
- v33 Production 的「新增支出」第一次觸控正常，但 Product Owner 冷啟動實測確認
  日期、工時設定與其他資料仍需第二次。既有 trace 已捕捉「其他資料」收到 touch
  start／end 卻沒有 click，因此 D-055 的舊 cache 結論不足以涵蓋全部入口。
- `index.html` 只在 installed PWA 的 Today `#sharedDetailPanel` 對四個指定控制先
  focus。日期保留唯一原生 date input 與 default Picker；工時、支出、其他資料在
  未滑動的 touchend 切換現有 details，並抑制同一觸控的後續 click。
- 未建立第二份展開 state、全頁 touch handler、透明遮罩、自訂月曆或
  `showPicker()`；滑鼠、鍵盤、一般 Safari 行為不變。
- App Shell candidate：`driver-pay-pro-v34`。資料 key、schema、計算、Manifest、
  Supabase 與正式資料不變。
- `npm run release:check` Passed：408/408 Node、Today 143/143、Calendar 69/69、
  Reports 90/90、AI 26/26、Driver 27/27、Integration 17/17；lint 0 errors／10 個
  既有 warnings，其餘 release gates 全部通過。
- Product Owner 已於 2026-08-11 完成 Public Preview 的唯一一次實體 iPhone
  installed-PWA 冷啟動 Human QA；日期、工時、支出、其他資料第一次觸控全部
  成功，所有問題均確認解決，Release Candidate Approved。
- 功能 commit：`31afe484e61fbd224914bce685ff93677c6f7746`；QA 文件 commit：
  `9d8d38ce14118d7ae3cadaefc6d56cf7bddc077f`；一般合併 `main` 的 merge commit：
  `cc70178850a5d74c180489abc0b8e4e2eeca241b`。
- Production：`https://driver-pay-app.vercel.app`；deployment
  `dpl_3hRmCTYXGcTbvViye6VFNNr7X4ef`，狀態 `READY`。正式站 HTTP 200、Manifest
  standalone、Service Worker v34，發布後 Runtime errors 為 0。
- 發布未使用 force push／rebase，未修改資料、Schema、storage key 或 Manifest。

## Installed PWA First-input Recovery — Production Released

- 功能 branch：`codex/pwa-first-input-diagnostics-20260811`；base：`a6d4703`；
  功能 commit：`0202945a702da9ab0e210e5447d4b483b92ed7ec`。
- 已合併並推送 `main`；merge commit：
  `e98774c4b2c8b41a92e141724b83db660784b9b7`。
- Product Owner 的第二次自然啟動 trace 已確認：standalone、受 active Service
  Worker 控制、無 waiting／installing，cache 精確為 `driver-pay-pro-v32`。
- 「新增支出」第一次有效點擊完整觸發 pointer／touch／click，既有 toggle handler
  下一毫秒將 details 設為 `open: true`。App 於 196ms interactive ready、862ms
  pageshow，之後無 reload 或狀態回復。
- 這排除元件、事件 handler、v32 worker 與「WebView 先取得 focus」假說；根因
  範圍收斂為正式 origin 先前留下的 pre-v32 worker／cache 安裝狀態。
- 暫時診斷 script、Driver 診斷 UI、copy handler 與 diagnostic tests 均已移除；
  正式產品不保留事件追蹤或診斷入口。
- App Shell 升至 `driver-pay-pro-v33`，沿用安全 deferred activation：不
  `skipWaiting()`、不 `clients.claim()`、不 `controllerchange` reload。v33 會建立
  乾淨 cache 並在頁面自然關閉後接管。
- 不改 `driverPayApp.v2`、WorkRecord、計算、Manifest、Supabase 或正式資料。
- Production：`https://driver-pay-app.vercel.app`；deployment
  `dpl_G6D1bUn4owSqkPYbpEUEGmqFuZDp`，狀態 `READY`。正式站 HTTP 200、
  Manifest 正常、Service Worker v33；390px 無水平 overflow、Console 0
  error／warning，「新增支出」第一次 click 即展開。
- 完整 `npm run release:check` 在功能分支與合併後 `main` 均通過：407/407 Node、
  Today 142/142、Calendar 69/69、Reports 90/90、AI 26/26、Driver 27/27、
  Integration 17/17；lint 0 errors／10 個既有 warnings。

## PWA First-tap and Driver Labels — Production Released

- Branch：`codex/pwa-first-tap-driver-labels-20260808`；base：`4924018`；功能
  commit：`4b52464`；`main` merge commit：
  `f415e3fc118aba0836c033ccf9f3940b3522b853`。
- Production：`https://driver-pay-app.vercel.app`；Vercel deployment：
  `36n9EHH5rH8MPdxi4cNfZHi9yLAe`，狀態成功。
- 首次載入後日期與「新增支出」都可能需要第二次點擊的共同根因，已定位為舊
  Service Worker 更新流程：install `skipWaiting()`、activate `clients.claim()`，
  並由頁面的 `controllerchange` 強制 reload。這會在 UI 已可操作後中斷當下觸控。
- v32 移除這三個中途接管／重載路徑，保留 `registration.update()`；下載好的
  worker 等待既有 client 自然關閉，下次啟動再生效。
- Driver 四個第一層 disclosure 精簡為「常用／收支／資料／系統」；只修改可見
  名稱，不改 ID、內容、順序、摘要或互動。
- 新增自動契約防止 `window.location.reload()`、`skipWaiting()`、
  `clients.claim()` 回歸。App Shell 更新為 `driver-pay-pro-v32`。
- 不改 `driverPayApp.v2`、WorkRecord、canonical calculations、Manifest、
  Supabase 或正式資料。
- Production 390px smoke：新增支出第一次 click 即展開；可見日期 input 第一次
  click 即取得原生控制；Driver 標題為「常用／收支／資料／系統」；無水平
  overflow，Console 0 error／warning。

## Driver Typography and Native Date First-tap — Production Released

- Branch：`codex/driver-typography-date-first-tap-20260808`；base：`a99701f`；功能
  commit：`a7850cf`；已合併至 `main`，merge commit：
  `25d7e973c98925be054f69659afd6642acc2c7a6`。
- Production：`https://driver-pay-app.vercel.app`；Vercel deployment：
  `JD4TKPq2wrgmsZAoDKidiPgpQp8s`，狀態成功，App Shell 為
  `driver-pay-pro-v31`。
- v30 在實體 iPhone Safari／PWA 仍需第二次點日期。根本實作問題是原生 date input
  整體 `opacity: 0`；v31 將 input 本體保持可命中，只隱藏原生內部文字與 indicator，
  不新增 `showPicker()` 或第二份日期 state。
- Driver 每日目標值由 26／29／32px 強化為 28／34／40px；頁面副標題由原本
  14／13／15px 修正為 14／15／16px；字體選項固定 14px。
- Today 主收入與次要 KPI 改用獨立安全下限 token，維持既有大數字比例。
- 本機三模式 × 320／375／390／393／430px 無 overflow；日期 input 完整位於
  日期卡內，選 8/7 後標題、歷史 context 與付款日期同步。
- Production 390px：每日目標 28／34／40px、副標題 14／15／16px、切換選項
  固定 14px；Today 主收入 54.6／58.5／62.4px、次要 KPI
  28／31.2／35.1px。日期 input 為可命中的 native control，選 8/7 後 context
  正確更新；Console 0 error／warning、無水平 overflow。
- `npm run release:check` Passed：404/404 Node、Today 142/142、Calendar 69/69、
  Reports 90/90、AI／Driver 各 26/26、Integration 16/16；lint 0 errors／10 個
  既有 warnings。

## Today First-tap Date Picker and Direct Work-time Switch — Production Released

- 功能 Branch：`codex/today-first-tap-direct-work-mode-20260808`；功能 commit：
  `4e25b16`。已合併至 `main`，merge commit：
  `463c949f5e1a1bb40a2f598d1375f39fcc01fd64`。
- Production：`https://driver-pay-app.vercel.app`；Vercel deployment：
  `Cc8BV7rWsKejxTEWRC4zNv93toVT`，狀態成功，App Shell 為
  `driver-pay-pro-v30`。
- 日期卡移除 click 冒泡後再次呼叫 `showPicker()` 的路徑；整張卡只使用同一個
  原生 date input，保留 native appearance、完整 WebKit indicator 與 44px 以上
  觸控區，目標是 iPhone Safari／PWA 第一次點擊即開啟。
- 工時輸入模式改為一次點擊直接切換；確認 Dialog 已移除。離開模式的 clock／
  manual 草稿只保留於目前日期的 session cache，切換本身不呼叫 persistence，
  使用者實際修改目前模式欄位後才沿用既有 autosave。
- App Shell candidate：`driver-pay-pro-v30`。不改 `driverPayApp.v2`、WorkRecord、
  canonical 工時計算、Calendar／Reports／AI、Manifest、Supabase 或正式資料。
- L1：`npm run release:check` Passed；403/403 Node、Today 142/142、Calendar
  69/69、Reports 89/89、AI／Driver 各 25/25、Integration 16/16；lint 0 errors／
  10 個既有 warnings。320／375／390／393／430px 無 overflow，日期 input 完整
  位於卡片內；clock／manual 雙向一次點擊切換、雙方草稿還原及 Console 均通過。
- Production 390px：日期卡第一次 click 後原生 Picker 直接接管；重新載入後
  clock → manual → clock 一次點擊完成、無 Dialog，08:00／17:00／休息 60 分
  草稿完整還原。HTTP 200、Console 0 error／warning、無水平 overflow。

## Active Record Date and Today KPI Hotfix — Production Released

- 功能 Branch：`hotfix/active-record-date`；日期 Picker follow-up commit：
  `fde37a1`。已合併至 `main`，merge commit：
  `719dc9cecad85dbb7e164959938917edafb5211f`；GitHub 與 Vercel 狀態均成功。
- Production：`https://driver-pay-app.vercel.app`；Vercel deployment：
  `4cSAPvqZ4njbUZYSu6nhyGDFDQHR`，對應上述 merge commit，App Shell 為
  `driver-pay-pro-v29`。
- 根本原因一：舊 Calendar inline editor 曾把 Today 的實體
  `#sharedIncomePanel`／`#sharedDetailPanel` 搬進 `#recordEditorContent`；若關閉
  還原流程未完成，Today 只剩 KPI 與工作狀態。現在 Calendar 只透過精確日期
  導向 Today，`setView("today")` 亦完整恢復並重繪所有必要模組。
- 根本原因二：舊寫入路徑混用 `#date`、`expenseDraft.paymentDate`、
  `todayString()` 與 fallback 日期。現在 `activeRecordDate` 是唯一 session 日期，
  所有 mutation 必須顯式傳入並通過 `validateActiveRecordWrite()`。
- Today 歷史模式顯示「正在編輯歷史紀錄」、完整日期、回到今天／返回月曆；
  每日紀錄日期卡可直接選今天或過去日期，付款日期鎖定跟隨同一天。日期 mismatch
  顯示「日期狀態異常，未儲存。請重新選擇日期。」並停止寫入。
- Today KPI 已使用左對齊最大今日收入、等寬今日工時／平均時薪、右側 disclosure
  chevron；只有目標進度收合。標準模式主收入／次要 KPI 使用參考版
  `50–64px`／`28–32px` 比例；三者共用 700、line-height 1、tabular numerals，
  工時單位以較小字級顯示。保留 `formatWorkDurationCompact()`，KPI 使用新增的
  `formatWorkDurationKpi()`。
- 顯示大小以 Data／Controls／Structure 三層 token 運作：主數據 24／27／30px、
  每日目標與平台輸入值 26／29／32px；結構標題與導覽固定或只小幅變化，三個
  字體大小選項固定 14px，不再讓標題比主要數據更強勢。
- `tests/active-record-date-hotfix.test.js` 現為 60 項：日期隔離、原生 Picker、
  導航及 KPI／工時格式。Typography commit 的 App Shell candidate 為
  `driver-pay-pro-v28`。
- Date Picker follow-up：原透明 date input 的 `appearance: none` 讓 Chrome／部分
  WebKit 點擊後只取得焦點、不開啟原生月曆。現改回 native appearance，WebKit
  indicator 覆蓋完整日期卡，支援 `showPicker()` 時由同一原生 input 直接開啟；
  不支援時保留原生點擊 fallback。App Shell 更新為 `driver-pay-pro-v29`。
- Follow-up L1：403/403 Node、Today 142/142、Calendar 69/69、Reports 89/89、
  AI／Driver 各 25/25、Integration 16/16；release check、Manifest、SW syntax、
  static Production validation 與 `git diff --check` 通過，lint 0 errors／10 個
  既有 warnings。320～430px 無 overflow，日期 input 完整位於卡片內，390px
  實際點擊由原生 Picker 接管，Console 0 error／warning。
- Production smoke：正式站回傳 HTTP 200；日期卡在 390px 可切換至 2026/8/7，
  日期標題與工時／新增支出／其他資料同步載入，`scrollWidth === clientWidth`
  且 Console 0 error／warning。Manifest 有效，線上 Service Worker 已是 v29。
- L1：release check Passed；402/402 Node、Today 141/141、Calendar 69/69、
  Reports 89/89、AI／Driver 各 25/25、Integration 16/16；lint 0 errors／10 個
  既有 warnings。L2 的精確日期 handoff、十輪切頁完整重繪與 Console 檢查均
  通過。2026-08-08 再驗證三種顯示模式 × 五頁 × 320／375／390／393／430px
  共 75 組無 overflow；390px 標準／舒適／大字的
  主收入為 54.6／58.5／62.4px、次要 KPI 為 28／31.2／35.1px、每日目標為
  26／29／32px。日期卡可選 8/7／8/8 且資料互不串寫。
- 不改 `driverPayApp.v2`、WorkRecord、`expenseAllocations`、Manifest、Supabase
  或正式資料。iPhone 正式 localStorage 無法由 repo 直接讀取；資料稽核需要裝置
  匯出，Hotfix 僅提供 `window.auditDriverPayRecords()` 唯讀診斷。

## Expense、Hourly Rate、Calendar Read-only 與 KPI — Production Released

- 功能 Branch：`codex/expense-readonly-hourly-kpi-20260804`；功能 commit
  `e91a7c38450084f76bc4851b31881bd71f72c559`。
- 已合併至 `main`；merge commit：
  `d22f9a40f7f9b50599dcf6cc55647d4414ea70ad`。
- 已推送 `main`，本機與 `origin/main` 一致。Vercel Production deployment
  `5742354568` 已成功完成，Production URL：
  `https://driver-pay-app.vercel.app`。
- Calendar 現在只輸出日期、收入、工時、時薪、支出與其他資料摘要；不提供新增、編輯、
  分區 disclosure 或刪除入口。Today 保留每日紀錄的輸入與修改責任。
- 週報新增與月報一致的支出分類 selector；時薪沿用總收入除以有效工時，沒有更動資料
  schema 或 `driverPayApp.v2`。
- `sw.js` cache 已升至 `driver-pay-pro-v26`。完整 release check 通過後已正式部署；
  實體 iPhone Safari／installed PWA 的正式版 L4 smoke QA 仍依發布流程執行。

---

## Expense Management、Calendar Inline Editing 與 KPI — Production Handoff

- 功能 Branch：`codex/expense-calendar-kpi-integration-20260804`；功能 commit
  `d1f7e269c8970ddf37b5442748375aeb999bd2e6`；Human QA：Passed。
- 已合併至 `main`，release merge commit：`b17b6d9b49f3cbe025af2264c976d75aca4f16f0`。
- Production：`https://driver-pay-app.vercel.app`；Vercel deployment
  `dpl_Goj84FfTsGga2wfNfF7xQBMsFLGy`，狀態 `READY`。
- `reportExpenseSummary()` 同時提供 `byDate` 與 `byCategory`，並區分月成本及
  實際付款；Reports 月報分類以油錢優先、其餘金額降序，native disclosure
  原地顯示日期、金額與選填備註。
- Today `#todayExpenseManager` 預設收合，使用 category 作為現有資料模型下的
  單筆識別；`removeTodayExpense()`／`undoLastExpenseRemoval()` 交易式保存並
  在 5 秒內完整復原金額、備註與 allocation。
- Calendar `#recordEditorInline` 以五個 section toggle 控制同一份
  `#sharedIncomePanel`／`#sharedDetailPanel`；舊 `#recordEditorDialog` 已移除。
  支出可原地新增、修改、移除與復原；整天刪除只在更多操作及確認 dialog。
- Canonical hourly source 仍是 `hourlyRateQuality()`／`hourlyRate()`，輸入改為
  total income 與有效工時；支出不再降低時薪。Calendar 顯示也重用相同品質
  門檻，不足或異常時不顯示誤導數字。
- Today KPI、Calendar spacing、Reports 重複標題與 Bottom Navigation active
  presentation 已依 D-045 調整；全 App `settings.displaySize` 規則保持。
- App Shell：`driver-pay-pro-v25`。localStorage key 仍是
  `driverPayApp.v2`，無 schema、migration、Supabase 或 dependency 變更。
- `npm run release:check` 已通過：完整 Node 339/339、Today 80/80、AI 24/24、
  Driver 24/24、Integration 16/16、Reports 86/86、Calendar 66/66；lint 0
  errors／10 個既有 warnings，build、Inline JavaScript、Service Worker、
  Manifest、`git diff --check` 與 `npm audit` 0 vulnerabilities 均通過。
- Browser 已完成三種顯示模式 × Today／Calendar／Reports × 五種手機寬度共
  45 組 overflow 檢查，全部 `scrollWidth === clientWidth`，Console 無
  error／warning；Calendar 歷史日支出由原地表單提交後，月曆淨收入與月報
  分類／明細同步更新。Production 390px 五頁 Smoke QA 已通過，Console 無
  error／warning，Manifest 與 Service Worker 正常。

---

## V1.1 Production Release — Current Handoff

- Branch：`main`；merge commit `4282b378538e1fa99db67106aad8bb9c36560532`。
- Production：`https://driver-pay-app.vercel.app`；Vercel deployment
  `3HprP2dJgPG3PH75ksG6DRCV92AC`，狀態 `success / Deployment has completed`。
- Product Owner 已確認 Human QA 通過；V1.1 Today Progress 與 Driver Simplification
  已正式發布。
- `#todayIncomeToggle` 維持整排原生 button，但 `todayGoalExpanded`／
  `todayGoalDisclosureDate` 只控制 `#todayGoalDetails`。收入金額、
  `.today-secondary` 的今日實際工時與目前時薪永遠顯示；跨台北日期重設收合。
- Driver 常用設定只有 `#dailyGoal` 與 `displaySize` 三個 radio；成功時不顯示
  重複的「已套用」訊息，離線與失敗回饋仍保留。四個 disclosure 及所有原設定
  功能不變。
- Driver summaries：common 空白、work「平台、支出」、data「備份、匯出」、
  app 使用「正常／需要注意」。`renderDriverStatus()` 只呈現此裝置與 App、
  本機資料、離線功能及 Service Worker 的可靠狀態；About 與資料安全警告保留。
- App Shell `driver-pay-pro-v24`。新增
  `tests/today-progress-driver-simplification.test.js` 47 項契約；`release:check`
  通過，完整 Node 314/314、Today 55/55、Driver 24/24。Chrome 30 組 Today／
  Driver responsive matrix 無 overflow，Console 0，Manifest、Service Worker 與
  offline reload 正常，`npm audit` 0 vulnerabilities。Production 390px smoke
  check 通過，Console 0，無水平 overflow。
- 不修改 WorkRecord、收入／工時／支出公式、`expenseAllocations`、
  `settings.displaySize`、`driverPayApp.v2` 或 Supabase。
- 發布後仍維持 Local-first V1 原則；未合併以外的功能分支、資料模型與正式資料
  均未變更。

## Progressive Disclosure and Display Size — Superseded Handoff

- Branch：`codex/v1-1-m1-today-workflow`；base `da1a467168426346bfdad9ac2c297c5f052942d4`。
- Today `#todayIncomeToggle` 是今日收入卡唯一 disclosure header；
  `todayIncomeExpanded`／`todayIncomeDisclosureDate` 僅為 session state，
  點擊只重繪 presentation，不儲存、不清除草稿。
- AI `aiDisclosureState` 管理 month／sources／metadata 三個詳細區，預設皆
  false；`#aiTodayAdvice` 只呈現一個本週重點或單一資料不足說明。
- Driver `driverDisclosureState` 固定 common／work／data／app；common 預設
  true，其餘 false。`#driverSystemStatusContent` 同時包含 About 與衍生系統
  狀態；舊 `#view-about`／`#openAbout` 已移除，legacy `#about` route 安全回
  Driver。
- Design tokens：body／secondary standard 13／12、comfort 17／15、large
  22／19；Calendar month 18／20／22、weekday 12／14／16、date 14／16／20、
  detail 14／17／22、Today circle 34／36／40px。
- 共用 `.app-disclosure*` 與 `.app-chevron` 處理 44px+ header、ARIA、focus、
  hidden content、20px stroke-2 chevron 與 180° 展開旋轉。
- App Shell `driver-pay-pro-v23`。目前 267/267 Node tests 通過；瀏覽器 75
  responsive 組合、互動、computed typography、Calendar 七日中心、Manifest、
  Service Worker 與 Console 均通過。開發工具的 transitive
  `brace-expansion` 已由 5.0.8 更新至 5.0.9，`npm audit` 為 0
  vulnerabilities。需建立 Public Preview 後進行唯一一次
  iPhone Safari／installed PWA Human QA。
- Human QA 前不得 merge `main` 或 Production deploy。預期完成狀態：
  `Ready for Progressive Disclosure and Display Size Human QA`。

## V1.1 最終顯示體驗與 Calendar 對齊 — Superseded Handoff

- Branch：`codex/v1-1-m1-today-workflow`；base `8badf1946184aaa0644d020517cb2016407dda16`。
- 全 App 顯示偏好 canonical source 是可選 `settings.displaySize`，合法值為
  `standard`／`comfort`／`large`。讀取時相容舊 `aiReportsReadingSize`，
  但 normalize 後與新寫入只保留 `displaySize`。
- Root 使用 `data-display-size`；全域 typography tokens 位於
  `styles/design-system.css`。AI／Reports 既有分層 token 轉接同一模式，
  Today、Calendar、Driver、表單控制與 Bottom Navigation 也同步套用。
- Driver 只保留一個置底 `#driverSystemStatusDetails` disclosure；整條原生
  button 具 `aria-expanded`／`aria-controls`、44px 以上 target、focus state
  與正常／需要注意 badge。舊 `driverDataStatus`／`driverAppStatus` 已移除。
- Calendar `.calendar-date__day` 對所有日期固定為 34×34px（320px 為
  32×32px），透明 border 保留相同 geometry；Today 只切換 border／背景。
  同列七日的 day center 實測完全一致。
- `npm run release:check` Passed：207/207 Node、Today 55/55、AI 24/24、
  Driver 24/24、Integration 16/16、Reports 61/61、Calendar 41/41；lint
  0 errors／10 既有 warnings，npm audit 0 vulnerabilities。
- 真實 Chrome mobile emulation：三模式 × 五頁 × 五寬度共 75 組無水平
  overflow，Console 0 error／warning；顯示偏好重載保留，Manifest 與
  Service Worker 控制正常，已產出 23 張 QA 截圖。
- App Shell candidate：`driver-pay-pro-v22`。需完成完整 release check、
  Public Preview 與一次 V1.1 Final Display and Calendar Human QA；不得提前
  merge main 或 Production。

## Calendar Today 日期標記 — Prior Handoff

- Branch：`codex/v1-1-m1-today-workflow`；base `49ef956`。AI／Reports
  Reading Size Human QA：Passed。
- `renderCalendarGrid()` 沿用同一 `isToday` 與 `aria-current="date"`；
  Today day number 改為 30px／2px 品牌深綠圓圈，未選取為透明外框，選取為
  深綠實心與反差文字。
- 原 `.calendar-date__today-dot` DOM／CSS 已移除。Today + Selected 只保留
  低干擾 brand-subtle cell surface，不疊加強烈 cell border。
- 其他日期、Selected、Heat levels、月份／日期 state、Today button、
  exact-date route、Work Record Card、Editor、資料與 canonical calculations
  不變。
- L1：`npm run release:check` Passed；197/197 Node、Today 55/55、AI 19/19、
  Driver 16/16、Integration 16/16、Reports 56/56、Calendar 39/39。Lint
  0 errors／10 既有 warnings；inline JavaScript、Service Worker、Manifest、
  static Production validation 與 `git diff --check` 均通過；`npm audit`
  0 vulnerabilities。
- 真實 Chrome mobile emulation 驗證 selected／unselected、Heat、Today
  button、exact-date route、Work Record Card、storage read-only 與離線重載；
  320／375／390／393／430px 均無水平 overflow，Console 0 error／warning。
- App Shell candidate：`driver-pay-pro-v21`。完成後只 Push 功能分支與
  Public Preview；Final Human QA 通過前不 merge main、不 Production。

## AI／報表閱讀文字大小 — Superseded by Global Display Size

- Branch：`codex/v1-1-m1-today-workflow`；base `d7571dc`。
- Driver 新增「顯示設定 → AI／報表文字大小」，固定標準／舒適／大字三個
  原生 radio；變更即時生效、自動儲存，不增加確認或儲存按鈕。
- 唯一 durable source 是可選 `settings.aiReportsReadingSize`，存於既有
  `driverPayApp.v2`。舊 payload 缺欄位或值無效時為 `standard`，不修改
  WorkRecord、`expenseAllocations` 或其他資料。
- `<html data-ai-reports-reading-size>` 控制 AI／Reports 共用閱讀 tokens。
  AI 長文、證據、分析依據及 Reports 標籤、趨勢、比較、平台文字與空狀態
  會分層調整；主要 KPI 金額與頁面標題保持原視覺尺度。
- 設定 UI、Today、Calendar、一般 Driver、Bottom Navigation、analytics、
  CSV 與資料公式不受閱讀層級影響。
- L1：`npm run release:check` Passed；196/196 Node、Today 55/55、AI 19/19、
  Driver 16/16、Integration 16/16、Reports 56/56、Calendar 38/38。Lint
  0 errors／10 既有 warnings；inline JavaScript、Service Worker、Manifest、
  static build、`git diff --check` 與 `npm audit` 0 vulnerabilities 均通過。
- 真實 Chrome mobile emulation 驗證三個模式、鍵盤 Arrow 操作、重開保留、
  離線保存、fallback、圖表文字更新、主要 KPI 尺寸穩定、Console 0
  error／warning；320／375／390／393／430px 的 AI 與 Reports 共 30 組
  均無水平 overflow。
- App Shell candidate `driver-pay-pro-v20`。Product Owner 已確認
  AI／Reports Reading Size Human QA Passed；Preview 已停止，尚未 merge
  main 或 Production。

## Today Work Status Header — Current Handoff

- Branch：`codex/v1-1-m1-today-workflow`；base `e0b3dc9`。Expense UX Human
  QA：Passed。
- 工作狀態卡最上方 `#workDetailsToggle` 是唯一明細 disclosure：原生 button、
  44px、`aria-expanded`／`aria-controls="workMetrics"`、動態狀態朗讀與
  Lucide-style chevron。
- 原 `.work-time-overview` 與可見「工作明細 ＋」獨立列已移除；繼續沿用
  同一 `#workMetrics`、同一 `setWorkDetailsExpanded()` 與同一 state。
- 開始、暫停、繼續、收工、再跑一段、修改時間及明細內容均在 toggle 外，
  不會誤觸 disclosure；狀態／計時更新不改變展開 state。
- L1：`npm run release:check` Passed；185/185 Node、Today 55/55、AI 8/8、
  Driver 5/5、Integration 16/16、Reports 45/45、Calendar 38/38。Lint
  0 errors／10 既有 warnings；inline JavaScript、Service Worker、Manifest、
  static build、`git diff --check` 與 `npm audit` 0 vulnerabilities 均通過。
- 真實瀏覽器驗證整排四個區域、所有 work-session 狀態、操作按鈕隔離、
  accessible name、Console 0 error／warning 與 320～430px 無 overflow。
- App Shell candidate `driver-pay-pro-v19`。完成後只 Push 功能分支並建立
  Public Preview；不 merge main、不 Production。

## Today Expense UX Batch 2 — Human QA Passed

- Branch：`codex/v1-1-m1-today-workflow`；base `1e21bfa`。
- 類別控制改為單一原生 `#smartExpenseCategory`，移除第二層 select；
  油錢／停車費／洗車快捷仍只更新同一 draft 且保留金額、日期、方式、備註。
- 核准的唯一 schema 擴充為可選
  `expenseAllocations[category] = { months, startMonth }`；原始
  `expenses[category]`、其他 WorkRecord 欄位與 `driverPayApp.v2` key 不變。
- `reportExpenseSummary()` 從原始付款衍生各月成本，最後月吸收尾差；
  Reports／AI 共用，Calendar 保留付款日原始金額，CSV 增加分月資訊。
- 一次支出保存時移除 allocation；Calendar 移除支出時同步移除；刪除整筆
  WorkRecord 自然一併移除。舊紀錄無 allocation 時安全維持一次支出。
- 分月卡片已移除預覽警語並精簡；日期／備註改同列，400px 以下使用短日期。
- L1：`npm run release:check` Passed；183/183 Node、Today 53/53、AI 8/8、
  Driver 5/5、Integration 16/16、Reports 45/45、Calendar 38/38。Lint
  0 errors／10 既有 warnings，Production validation、Manifest、inline
  JavaScript、Service Worker syntax、`git diff --check` 與 `npm audit`
  0 vulnerabilities 均通過。
- 真實瀏覽器 320、375、390、393、430px 均無水平 overflow；單一類別
  select、分月重開保留、一次／分月切換、Calendar 原始付款、Reports／AI
  分月成本及日期／備註同列已驗證。
- App Shell candidate `driver-pay-pro-v18`。Product Owner 已確認 Expense UX
  Human QA Passed；臨時 Public Preview 已停止，未 merge main、未 Production。

## V1.1 Milestone 1 — Current Handoff

- Branch：`codex/v1-1-m1-today-workflow`；base：
  `8041e84591c76b16582e41403ae7267f5fd1bc90`。
- Product Owner 已確認 Milestone 1 Final Human QA 全部通過；舊的 Final
  Preview tunnel 已停止。本次在同一功能分支進行 Homepage Detail
  去重複與版面精簡，新的 Human QA 前不 merge main、不 Production deploy。
- 根本原因：Today 表單保留舊 `workSession`，且舊 `workMetrics()` 先採用
  `manualHours`／session，導致手動修正開始與結束時間後，畫面與報表仍讀取
  舊計時值。
- 修正後 canonical precedence：完整且有效的 clock fields → 缺少 clock 時的
  legacy manual minutes → live session。所有輸出都以整數分鐘建立
  `durationMs` 與 `hours`。
- 新增 `decimalHoursToMinutes()`、`minutesToHourMinuteParts()`、
  `validateWorkTimeRange()`、`calculateWorkMinutes()` 與
  `formatWorkDuration()`；Today、Calendar、Reports、AI、CSV 共用同一出口。
- Today 手動工時 UI 使用小時／分鐘欄位；綠色摘要是正式工時唯一高階顯示，
  工作狀態卡只保留 status、44px「工作明細」與下一步操作。manual 模式
  不再顯示第二份摘要，clock 模式保留一次 `formatWorkDuration()` 結果。
- 每日紀錄固定為三個獨立收合區塊：「工時設定／新增支出／其他資料」。
  完整智慧支出元件已從「其他資料」恢復為獨立區塊，保留快捷類別、完整類別、
  一次／固定／分月預覽、付款日期、備註與獨立 `儲存支出`；持久化使用
  clone → validate → persist/read-back，失敗不污染既有 state。
- 支出快捷按鈕縮為 46px 且使用選中勾號；支出類別與方式改為同列 48px
  真正按鈕，VoiceOver 朗讀目前值。快捷切換保留未儲存的金額、日期、方式
  與備註，完整 legacy／自訂類別來源不變。
- 工時一次只顯示 clock 或 manual 一種輸入；模式由現有欄位推導，不新增
  durable mode 欄位。切換前顯示清除範圍，確認後才交易式保存；舊雙值資料
  仍優先使用 clock 且不靜默清除。
- 已收工的 clock 紀錄提供同列「再跑一段／修改時間」。續跑確認會保留
  原始開始時間、把收工空檔累加至休息時間、清除結束時間並沿用同一筆
  WorkRecord；manual 模式先提示切換。
- 明確儲存有收入但無有效工時的紀錄時，使用既有輕量 dialog 提供「補上工時」
  或「稍後再補」；前者保留輸入並定位工時，後者允許儲存但不計算時薪。
- `hourlyRateQuality()` 與 `recordDataQuality()` 是 Today、Reports、AI 共用
  資料品質出口：少於 10 分鐘不計算，超過 NT$2,000／小時標記異常，原始
  收入與工時不修改。
- 自動天氣使用 Open-Meteo，無 API key。只有 Today 且使用者同意後才取得
  一次性位置；精確位置不保存，session 建議快取 30 分鐘。拒絕、離線、
  API 失敗及歷史補登均安全回到手動選擇，手動值優先。
- Today 時間欄位自動儲存使用 clone → validate → persist/read-back →
  update-memory → notify，儲存失敗不會先污染畫面狀態。
- `driverPayApp.v2`、WorkRecord schema、收入／支出公式、Calendar／Reports
  frozen UI 均未改變；舊 `manualHours` 不遷移、不批量改寫。
- L1 evidence：`npm run release:check` Passed；173/173 Node、Today 51/51、
  Calendar 38/38、Reports 44/44、lint 0 errors、responsive／原生 time input
  contract、開始／暫停／繼續／收工、重開保留、Calendar／Reports 8 小時
  8 分一致、桌面瀏覽器 Console 0 error／warning；`npm audit` 為
  0 vulnerabilities。
- Service Worker candidate：`driver-pay-pro-v17`。
- Follow-up implementation commit：`882bfcd fix: complete Today workflow QA follow-up`，
  已推送至同名遠端功能分支。
- Final follow-up implementation commit：
  `57ba512 fix: complete Milestone 1 final QA follow-up`，已推送至同名遠端
  功能分支。
- Homepage Detail 公開 Preview：
  `https://cord-diagnosis-quite-cancel.trycloudflare.com`。未登入外部 HTTPS
  回傳 200；公開 `index.html`、Manifest、Service Worker SHA-256 與本機
  候選完全一致，Service Worker 為 v17。390px
  `scrollWidth === clientWidth`、支出雙按鈕同列、Console 0 error／warning，
  沒有登入或警告頁。這是暫時 tunnel，Human QA 期間開發用 Mac 必須保持
  開機與連線。
- 下一步只進行 Homepage Detail Human QA；通過前不合併 main、不部署
  Production。

---

## Local-first V1 Completion Program — Current Handoff

- Branch：`codex/v1-completion-program-20260726`，追蹤同名遠端；base
  `dbaafba321fd3b108ef5d3b07e2adea7c1f23892`。
- 已推送：`7fb8d3f` audit、`36b746b` canonical analytics、`35815ab` AI、
  `f22073f` Driver、`97ea42d` integration、`98f64cd` 45-scenario regression、
  `b856857` L3 docs、`eab40ed` AI exact-date route。
- AI 現在只有「營運建議／本月洞察／智慧提醒」三個主要區塊，唯讀並重用
  Reports 的 `sharedAnalytics`；TD-006 已解決。
- Driver 的每日目標與 Today 共用 `state.settings.dailyGoal`，自動儲存失敗會
  rollback；本機資料與 App 狀態不寫入 WorkRecord。
- 成功 mutation 使用單一 committed-record notification 更新 Reports／AI；
  `driverPayApp.v2` 與 WorkRecord schema 未變。
- Service Worker candidate 已由 v12 更新一次至 `driver-pay-pro-v13`。
- 最新自動結果：120/120 Node、Calendar 38/38、Reports 44/44、AI 5/5、
  Driver 5/5、Integration/V1 16/16；lint 0 errors、10 existing warnings。
- 完整 L1 已通過：`npm ci`、audit 0 vulnerabilities、120/120、全部專項、
  lint 0 errors、inline JS、SW、Manifest、static build 與 `release:check`。
- 公開 L2 已通過：`https://mystery-kijiji-publicity-tech.trycloudflare.com`；
  未登入 Safari 直開、五分頁、AI deep link、Driver 即時狀態、390px、
  Manifest、SW v13、Console 0 error／warning 與 Offline App Shell 通過。
- L2 發現並修正兩個真實整合問題：AI 日期洞察現在導向確切 Calendar 日期；
  每次進入 Driver 都重新計算本機紀錄狀態。Service Worker navigation 在來源
  回傳 502 時也會安全回退 App Shell。
- Product Owner 已於 2026-07-26 回覆 `Driver Pay Pro V1 L3 全部通過`；
  iPhone Safari、installed PWA、Offline、VoiceOver、safe area、responsive
  與跨頁整合正式 Passed。
- Driver Pay Pro Local-first V1 UX Freeze 已生效；21 項 Freeze Gate Passed。
- 臨時 Cloudflare QA tunnel 與本機 QA server 已停止。
- 下一步：完整 release:check、Freeze 文件 Commit、origin/main audit、PR、
  一般 main 合併、既有 Vercel Production 與自動 L4 驗證。

---

## Production Release — Calendar and Reports Stable Milestone

### 正式狀態

- Status：Completed。
- Product Owner 於 2026-07-26 正式確認：`Production L4 全部通過`。
- 本次是 Calendar UX Freeze Version 1、Reports UX Freeze Version 1 與
  Foundation Cleanup Version 1 的穩定 Production milestone，不是完整
  Driver Pay Pro V1。

### Git 與 Production

- Release branch：`codex/production-release-20260726`。
- Base：`origin/codex/foundation-cleanup-20260726`，
  `1166d571c1b152ef84ebef3dfd61c99c2533a45d`。
- Release Candidate HEAD：
  `37e7fe913af0039c9457de9f1139694e10b82d20`。
- Pull Request：
  `https://github.com/superaha-boop/driver-pay-pro/pull/2`。
- Main merge：
  `dbaafba321fd3b108ef5d3b07e2adea7c1f23892`，正常 PR merge。
- Production URL：`https://driver-pay-app.vercel.app`。
- Production Deployment：`dpl_A3wt3sRW7hNDVHFZrWtSPaHpAjKJ`，
  target Production、狀態 READY、commit 與 main Release merge 一致。
- Previous stable Deployment：`dpl_ApoBCEihJtpt2MxB34tjkEkSNTar`，
  commit `dd7b26cf3d6b411e8efd55d4aecfa10dcbd2c11f`，保留為 rollback target。

### 驗證與資料安全

- `npm audit`：0 vulnerabilities。
- lint：0 errors、10 個既有 unused-code warnings。
- Node tests：94/94；Calendar：38/38；Reports：44/44。
- Production validation、build、`release:check`、Inline JavaScript、
  Service Worker、Manifest、`git diff --check`：Passed。
- 320、375、390、393、430px：Today、Calendar、Reports 無水平 overflow。
- Production Console：0 error／warning；Vercel runtime errors：0。
- Manifest、正式 icons、Service Worker、Offline App Shell：Passed。
- Service Worker cache：`driver-pay-pro-v12`。
- WorkRecord schema、`driverPayApp.v2`、Supabase 與正式資料未變更。
- 沒有建立或污染 Production 測試紀錄。

### Rollback 與下一步

- Rollback 優先將 Production 指回
  `dpl_ApoBCEihJtpt2MxB34tjkEkSNTar`；必要時建立正常 revert commit。
- 禁止 reset main、force push、改寫歷史、清除 localStorage 或刪除資料。
- 未完成項目維持 Open／Deferred：AI 正式實作、TD-006、Driver 完整功能、
  Supabase／跨裝置同步、conflict resolution、record metadata、多段工作模型、
  TypeScript 與 iPhone native input 長期驗證。
- 後續功能不得破壞 Calendar／Reports Freeze，並必須重用 Reports 已驗證的
  period、aggregation、comparison、trend、platform、persistence、refresh、
  formatting、state 與 drill-down 基礎。

---

## iPhone Human QA 網址交付規則

- Vercel 受保護 Preview 的 `_vercel_share` 連結曾實測仍導向登入頁；不可只依
  工具回傳成功就交付。
- 每次 iPhone QA 必須先用未登入的新連線確認網址直接顯示 Driver Pay Pro，
  並驗證 Manifest、Service Worker、手機 viewport 與目前頁面 Console。
- 若 Vercel 分享機制失效，可使用臨時公開 HTTPS tunnel，但需說明 Mac 必須
  保持開機、網路連線及 tunnel 執行中；Human QA 結束後再關閉。

---

## Foundation Cleanup Sprint Version 1

### 分支與基準

- 工作分支：`codex/foundation-cleanup-20260726`。
- Base branch：`codex/reports-final-regression-20260726`。
- Base commit：`293c1878d09f95e507311e7ae2b531b7718ac62b`。
- 本 Sprint 只建立開發工具、release gate、內部 Design System showcase evidence、
  tests 與文件；沒有修改 `index.html`、正式 CSS、Manifest、Service Worker 或
  產品資料。

### Repository Audit

- 既有產品是單一 inline JavaScript 的靜態 PWA，原本沒有 package、lint、build、
  CI 或單一 release command。
- Node `node:test` 基準為 88/88 passed；新增 Foundation contracts 後為
  94/94 passed。
- `design-system.html` 原已存在且與正式導覽／App Shell 隔離，本 Sprint 只補齊
  segmented control、KPI、資料狀態、list row 與 44px evidence。
- AI aggregation duplication 仍是 TD-006；inline coupling、可疑重複 assets 與
  stable platform ID 不符合低風險抽取條件，因此只保留技術債，不重構或刪除。

### Tooling

- 最小 dev dependencies：ESLint（correctness lint）、`globals`（正確 browser／
  Node／Service Worker global definitions）、`parse5`（HTML parse validation）。
- `npm run lint`：0 errors、10 existing unused-code warnings。
- `npm run build`／`npm run validate:production`：靜態驗證，不產生 dist。
- `npm run release:check`：lint、94 tests、Reports 44、Calendar 38、inline
  JavaScript、Service Worker、Manifest、Production validation 及
  `git diff --check` 全部 passed。

### L2 Preview

- Today、Calendar、Reports weekly／monthly／platform 與 Design System showcase
  均可開啟。
- 真實 Chrome 390px：所有頁面及 showcase 均為
  `scrollWidth === clientWidth === 390`。
- 線上 Preview Console：0 error／warning。
- 停止本機伺服器後 App Shell 仍可離線重新載入；離線時 Service Worker 更新
  嘗試記錄預期 warning，不影響快取內容。
- Service Worker cache 維持 `driver-pay-pro-v12`。

### Technical Debt 與下一步

- TD-004 lint、TD-005 static production validation／release gate：Resolved。
- TD-001 showcase automation：Partially resolved。
- TypeScript：Deferred；TD-006：Open；TD-026：Partially resolved。
- sync、conflict resolution、record metadata、multi-session model、native input
  recurring QA 仍為 Open／Deferred。
- 下一步：Production Release Sprint。本 Sprint 不 merge `main`、不 Production
  deploy。

---

## Reports UX Freeze — Version 1

### 分支與範圍

- 工作分支：`codex/reports-final-regression-20260726`。
- Base branch：`codex/reports-platform-drilldown-20260726`。
- Base commit：`62b0be08eb5f27d95d2e39f30b5aa9f9ceb52be4`。
- Final Regression 新增固定 fixture、測試與一次性 L3 Human QA 清單；本次
  文件收尾正式記錄 Product Owner 通過 L3 與 Reports UX Freeze Version 1 生效。
- 本次未修改 `index.html`、CSS、JavaScript、Service Worker、Manifest 或任何
  正式產品功能。

### L1／L2 結果

- Reports Final fixture 覆蓋 28 個核准情境；全套 Node tests 88/88 passed。
- Reports targeted tests 在 `TZ=Asia/Taipei` 與 `TZ=UTC` 各 38/38 passed。
- Weekly、Monthly、Platform、comparison、trend、drill-down、context、
  committed refresh、error／recovery、read-only、Accessibility 與 PWA contract
  全部通過。
- Browser L2：Calendar 建立 2026-07-25 Uber NT$2,500 後，平台本月與週報不需
  reload 即更新；重要日期導向正確 Calendar 日期，返回週報 context 保留。
  測試紀錄已刪除。
- 320、375、390、393、430、768、1024px：
  `scrollWidth === clientWidth`，Reports tabs 單行；Console 0 error／warning。
- Service Worker 維持 `driver-pay-pro-v12`；本 Sprint 未修改 App Shell。

### Freeze Gate 狀態

- L1 Automated Verification：passed。
- L2 Preview Smoke：passed。
- L3 Module Human QA：passed；Product Owner 於 2026-07-26 確認。
- L4 Production Release QA：留給 Production Release Sprint。
- 一次性 L3 清單：`docs/REPORTS_HUMAN_QA.md`。
- Reports Feature Freeze Checklist 14/14 Passed。
- Reports UX Freeze Version 1 已正式生效。
- 凍結範圍包含 Header、Tabs、Period controls、KPI、Comparison、Trends、
  Important Dates、Platform Ranking、Unattributed Income、資料狀態、
  Calendar drill-down、context、refresh、Accessibility 與 Responsive。
- Freeze 後只接受 Bug、Accessibility、Data Integrity、Security、重大使用障礙
  與 Production blocker；一般改善與新增功能放入 Backlog。

### Technical Debt

- TD-023／TD-024：Resolved。
- TD-025：runtime／session requirement resolved；永久 durable state 不需要，
  legacy 欄位保留相容且不做 migration。
- TD-026：Partially resolved；自訂平台重新命名的 stable ID 仍需資料 Sprint。
- TD-006、cross-device sync、Supabase conflict resolution、record metadata、
  multi-session work model、TypeScript 與 iPhone native input long-term
  validation 保持 Open／Deferred；lint／static build 已由 Foundation V1 解決，
  showcase automation 為 Partially resolved。

### 下一步

Foundation Cleanup Sprint 已執行；下一步為 Production Release Sprint。
後續 AI 必須重用 Reports 已驗證的共用期間、aggregation、comparison、trend、
Important Dates、platform、persistence、refresh、formatting、state 與 drill-down
基礎，不得建立第二套 aggregation。本次不合併 `main`、不部署 Production。

---

## Reports Sprint 5B2 — Platform, Drill-Down, and Hardening

### 分支與範圍

- 工作分支：`codex/reports-platform-drilldown-20260726`。
- Base commit：`732929f4980b55eddb913604e0b4024a085c31ad`。
- 本 Sprint 完成平台週／月貢獻報表、平台名稱讀取層正規化、重要日期精確
  Calendar 下鑽、同 session 返回 context、record-change refresh 與資料狀態
  hardening。
- 未修改 Calendar UX、Today 操作流程、AI、Driver、WorkRecord schema、
  `driverPayApp.v2`、Supabase、dependency 或 Production。

### 實作摘要

- 平台頁 fresh session 預設本週，可切換本週／本月；顯示平台收入總額、排行、
  收入、占比與安全的前期比較，不顯示效率、最佳平台或平台時薪。
- `normalizePlatformKey()`／`aggregatePlatformIncome()` 合併已核准的內建別名，
  排除小費，未知平台以安全 fallback 顯示；不改寫歷史資料或顯示名稱。
- 無紀錄、無平台收入、未歸因收入、平台合計不一致與無效平台值各自有不同
  呈現；圖形為輔助，收入與占比都有可見文字及完整 ARIA label。
- 週／月重要日期改為 44px 整列按鈕，僅導向 `#calendar/{date}` 的精確日期，
  不自動開啟編輯器、不新增資料。
- 返回 Reports 會復原原 tab、週／月期間、平台期間、捲動位置與來源按鈕焦點；
  context 只存在記憶體，不寫入 localStorage。
- 成功的既有 record mutation 會發出單一 `driverpay:recordchange` 通知；Reports
  只在可見時以單一 animation frame 更新，避免 stale 或重複 refresh。
- App Shell 變更後 Service Worker cache 更新為 `driver-pay-pro-v12`。

### 驗證摘要

- Node 自動測試：79/79 passed。
- Inline JavaScript syntax 與 `git diff --check`：passed。
- 真實瀏覽器：平台週／月切換、重要日期 exact-date deep link、返回 context、
  焦點復原及 Console 0 error／warning passed。
- 320、375、390、393、430、768、1024px：
  `scrollWidth === clientWidth`；平台列、tabs、Bottom Navigation 與 44px targets
  未溢出。
- TypeScript、ESLint、production build：專案未配置，Not available。
- 本 Sprint 依 PRD 只執行 L2 Preview Smoke：平台頁、週／月切換、排行／
  占比、用語、exact-date drill-down、return context、mutation refresh 與
  手機阻擋性錯誤檢查均通過。
- 完整實體 iPhone Safari、installed PWA、VoiceOver、Offline 與 safe area
  驗收延後至 Reports Final Regression 後的 L3 Module Human QA。

### 下一步

執行 Reports Final Regression and UX Freeze Gate；不得在封板前宣稱 Reports
已完成實體 iPhone／PWA QA，也不得回頭改造 Calendar。

### QA 分級

- L1 自動驗證；L2 Preview Smoke；L3 Module Human QA；L4 Production Release QA。
- 小型 Sprint 只執行核准 PRD 指定的層級；大模組在 Final Regression 後集中
  執行一次完整 L3。高風險資料、同步、Service Worker 與 iOS 特有行為例外。

---

## Reports Sprint 5B1 — Weekly and Monthly Core

### 分支與範圍

- 工作分支：`codex/reports-weekly-monthly-core-20260726`。
- Base branch：`codex/reports-specification-20260726`。
- Base commit：`f3cf76320ccc1cea489291aaae0fb97269fafa91`。
- 本 Sprint 只實作 Reports 的週報／月報核心、共用期間與彙總、比較、趨勢、
  重要日期、session-only state、基本資料狀態與回歸測試。
- 明確未正式實作平台頁、Calendar deep link／return context、平台名稱
  normalization、AI refactor、Calendar／Today／Driver 修改、schema、migration、
  dependency、main merge 或 Production deploy。

### Reports Core 實作

- 新增台北 date-only 的週／月期間 utilities：Monday-first 完整七天、曆月半開
  區間、前期、標籤、月份週桶與範圍篩選。
- 新增單一 `aggregateReport()`，統一輸出總收入、支出、淨收入、工作天數、
  實際工時、期間平均時薪、日期群組及平台 totals；收入與工時仍重用既有
  canonical calculations。
- 新增 `compareReportPeriods()`／`compareReportMetric()`，明確區分無本期、
  無上期、上期為零、負值／正負跨越、可比較百分比與方向。
- 週報顯示本週期間、主要／次要 KPI、上週比較、固定七日淨收入趨勢與最高／
  最低淨收入日。
- 月報顯示曆月期間、同一套 KPI、上月比較、四至六個 Monday-first 週淨收入
  彙總、重要日期及既有月目標的次要呈現；跨月週只計入選定月份日期。
- 新的 Reports runtime state 不再讀寫 legacy `lastReportView`／`reportMonth`；
  同一頁面 session 保留 tab 與期間，重新載入 `#reports` 回到本週。舊
  `#reports/{tab}` 路由仍可安全解析。
- Tabs 使用正式 tab semantics、箭頭鍵導覽與焦點移動；期間控制至少 44px，
  重要日期目前是靜態文字，不偽裝為 Calendar 連結。
- Empty、Loading、Error、Offline 與 last-valid recovery presentation 已具備；
  Reports 瀏覽與選期不呼叫 `saveState()`。
- App Shell 變更後 Service Worker cache 更新為 `driver-pay-pro-v11`。

### 驗證摘要

- Node 自動測試：68/68 passed；本 Sprint 新增 10 項 Reports Core 測試。
- Inline JavaScript、Service Worker syntax、Manifest JSON 與
  `git diff --check`：passed。
- 瀏覽器 Console：0 error／warning。
- 320、375、390、393、430、768、1024px：
  `scrollWidth === clientWidth`，tabs 單行，period controls 與兩欄 primary KPI
  未溢出；Bottom Navigation 與結尾內容保留可捲動空間。
- 實測 tab 點擊、左右鍵導覽、上一／下一期間、未來期間中性空狀態、同 session
  返回與 reload 回本週。
- `driverPayApp.v2` key、WorkRecord schema、Manifest 與 assets 不變。
- TypeScript、ESLint、production build：專案未配置，Not available。
- 實體 iPhone Safari、installed PWA、VoiceOver、reduced-motion 與離線重開仍需
  Human QA；完成狀態只能是 `Status: Ready for Human QA`。

### 下一步

Sprint 5B2 — Platform, Drill-Down, and Hardening。屆時再處理平台正式報表、
重要日期到 Calendar 精確日期、return context、record-change notification 與
完整 hardening；不得回頭破壞 Calendar UX Freeze。

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
- 週／月共用 canonical KPI；此歷史段落原採淨收入時薪，已由 D-045 的
  「期間總收入除以期間有效工時」取代。
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
- Calendar 以原本的 `#entryForm`、`#detailForm`、收入欄位與支出元件作為唯一
  Record Editor。此歷史段落原使用全螢幕 dialog，已由 D-045 的 Calendar
  原地 host 取代；單一 DOM／資料模型／公式原則不變。
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
- 390／393／430px 的 `scrollWidth === clientWidth`；此歷史全螢幕驗證已由
  D-045 原地 Editor responsive matrix 取代。
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

專案已有最小 `package.json`、ESLint、static production validation 與
`release:check`，但仍沒有 TypeScript 或 bundler。Release 前使用
`npm run release:check`；`npm run build` 只做靜態 PWA 驗證，不產生 dist。

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
- 當時現有支出仍只寫入 `entry.expenses[category]`；固定與分月規則尚未
  持久化，也未修改月報算法或 `driverPayApp.v2` 結構。此為歷史狀態，後續
 已由 D-038 核准的可選 `expenseAllocations` 相容擴充取代。

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
