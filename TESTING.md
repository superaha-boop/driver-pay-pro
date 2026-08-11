# Driver Pay Pro Testing

## Passed — Today Installed-PWA First-input Unification

- 自動契約覆蓋四個 Today 指定入口：日期、工時設定、新增支出、其他資料。
- 日期 touch 只先 focus 真正的 native input，後續仍由 iOS default action 開啟；
  測試持續禁止 `showPicker()` 與第二份日期 state。
- 三個 disclosure 的 standalone touchend 直接切換同一 details；同一次觸控補送的
  click 會被抑制。位移超過 10px 不切換；滑鼠、一般 Safari 與鍵盤維持原路徑。
- Listener 僅掛在 `#sharedDetailPanel`，不掛 document／window；沒有透明遮罩或
  synthetic `.click()`。
- App Shell：`driver-pay-pro-v34`。Product Owner 已於 2026-08-11 使用公開
  Preview 完成實體 iPhone installed-PWA 冷啟動驗收；日期、工時設定、新增支出、
  其他資料第一次觸控全部成功，所有問題均確認解決。
- `npm run release:check`：Passed；408/408 Node、Today 143/143、Calendar 69/69、
  Reports 90/90、AI 26/26、Driver 27/27、Integration 17/17；lint 0 errors／10 個
  既有 warnings，Inline JavaScript、Service Worker、Manifest、Production
  validation 與 `git diff --check` 全部通過。

## Released — Installed PWA First-input Recovery

- Product Owner trace 1：standalone 首次安裝啟動，Worker 未控制且 cache 為空；
  App 可正常操作。
- Product Owner trace 2：完全關閉後由同一主畫面圖示自然重開，Worker 已控制，
  active=true、waiting=false、installing=false，唯一 cache 為 v32。
- Trace 2 的「新增支出」一次點擊完整產生 pointerdown／touchstart／pointerup／
  touchend／click；`expense-toggle-handler` 於下一毫秒執行且 `open=true`。
- App listeners ready 113ms、interactive ready 196ms、pageshow 862ms；操作發生於
  18.2 秒，期間沒有 reload、focus takeover、handler 重複或 render rollback。
- 暫時診斷 code／UI／test 已從 release candidate 移除；release regression 必須
  繼續禁止 `skipWaiting()`、`clients.claim()` 與 `controllerchange` reload。
- App Shell：`driver-pay-pro-v33`。功能分支與合併後 `main` 的完整
  `npm run release:check` 均通過：407/407 Node、Today 142/142、Calendar
  69/69、Reports 90/90、AI 26/26、Driver 27/27、Integration 17/17；lint
  0 errors／10 個既有 warnings，Inline JavaScript、Service Worker、Manifest、
  Production validation 與 `git diff --check` 全部通過。
- Production deployment `dpl_G6D1bUn4owSqkPYbpEUEGmqFuZDp` 對應 merge commit
  `e98774c4b2c8b41a92e141724b83db660784b9b7`，狀態 `READY`。正式網址 HTTP
  200，線上 Service Worker 為 v33，Manifest `display: standalone`。
- Production 390px：`scrollWidth === clientWidth === 390`、Console 0
  error／warning、診斷入口為 0；「新增支出」第一次 click 後 `open=true` 且
  `aria-expanded=true`。

## Released — PWA First-tap and Driver Labels

- `npm test`：407/407 Passed。
- 新增契約確認：頁面不註冊 `controllerchange` 強制 reload；Service Worker 不含
  `skipWaiting()`／`clients.claim()`；`registration.update()` 與原生日期 input、
  原生「新增支出」details 均保留。
- Driver 四個標題精確為「常用／收支／資料／系統」，舊長標題不再出現在正式
  UI；內容與 disclosure ID 不變。
- `npm run release:check`：Passed；lint 0 errors／10 個既有 warnings，Today
  142/142、Calendar 69/69、Reports 90/90、AI 26/26、Driver 27/27、Integration
  17/17，Inline JavaScript、Service Worker、Manifest、Production validation
  與 `git diff --check` 全部通過。
- 320／375／390／393／430px：全部無水平 overflow。390px 乾淨啟動後，新增
  支出第一次 click 即展開；可見日期 input 第一次 click 即取得原生控制焦點，
  選日同步 Daily Record 與付款日期；Driver 標題正確。Console 0 error／warning。
- Production：`https://driver-pay-app.vercel.app`，deployment
  `36n9EHH5rH8MPdxi4cNfZHi9yLAe`，對應 merge commit `f415e3f`，App Shell
  `driver-pay-pro-v32`。
- Production 390px：新增支出第一次 click 即展開；日期第一次 click 即取得原生
  date control；Driver 四個短標題正確；無水平 overflow，Console 0
  error／warning。

## Released Hotfix — Driver Typography and Native Date First-tap

- Driver 390px computed sizes：每日目標 28／34／40px；「管理常用設定」
  14／15／16px；字體選項固定 14px。
- Today KPI 390px：主收入 54.6／58.5／62.4px；次要 KPI 28／31.2／35.1px。
- 3 modes × 320／375／390／393／430px：全部 `scrollWidth === clientWidth`，日期
  input 均完整位於父卡片內。
- 日期 input computed `opacity: 1`、native appearance、透明內部文字；選 8/7 後
  `activeRecordDate` context 與付款日期同步。Console 0 error／warning。
- `npm run release:check` Passed：404/404 Node、Today 142/142、Calendar 69/69、
  Reports 90/90、AI／Driver 各 26/26、Integration 16/16；lint 0 errors／10 個
  既有 warnings，Inline JavaScript、Service Worker、Manifest、Production
  validation 與 `git diff --check` 均通過。
- Production 390px smoke：每日目標 28／34／40px、副標題 14／15／16px、字體
  選項固定 14px；Today 主收入 54.6／58.5／62.4px、次要 KPI
  28／31.2／35.1px；日期切換到 2026-08-07 正確，Console 0 error／warning、
  無水平 overflow。App Shell v31；實體 iPhone 第一次點擊仍是發布後 QA 項目。

## Released Hotfix — First-tap Date Picker and Direct Work-time Mode Switch

- Today 日期卡固定只使用完整覆蓋卡片的原生 `input[type="date"]`；不再從冒泡
  click 重複呼叫 `showPicker()`。驗證第一次點擊的原生路徑、`max`、日期更新與
  `activeRecordDate` 綁定。
- 工時模式切換移除確認 Dialog；一次點擊立即切換，另一模式草稿保留於目前
  session，切換本身不呼叫 persistence。實際修改欄位後仍走既有安全 autosave。
- App Shell candidate：`driver-pay-pro-v30`。必測 320／375／390／393／430px、
  Console、無水平 overflow、日期切換、clock → manual → clock 草稿還原。
- 2026-08-08 L1：`npm run release:check` Passed；403/403 Node、Today 142/142、
  Calendar 69/69、Reports 89/89、AI／Driver 各 25/25、Integration 16/16；lint
  0 errors／10 個既有 warnings。五個手機寬度皆無 overflow，Dialog 不存在，
  clock 08:00／17:00／休息 60 分與 manual 5 小時 30 分來回切換後均保留；
  Console 0 error／warning。
- Production 390px：HTTP 200；第一次日期 click 由原生 Picker 接管，工時模式
  雙向一次點擊切換且無 Dialog，clock 草稿還原，無 overflow，Console 0
  error／warning。Production App Shell 為 v30。

## Previous Hotfix — Active Record Date, Today KPI and Semantic Display Size

- `tests/active-record-date-hotfix.test.js` 固定 60 項：日期隔離、原生 Picker、
  導航完整渲染及 Today KPI／工時格式。`npm run test:today` 已納入此檔案。
- 日期測試涵蓋 2026-07-04、2026-08-02、2026-08-04、顯式目標日期、無效／
  未來／mismatch guard、支出 allocation、復原、整日刪除、十次切換與重載。
- 導覽測試涵蓋 Today／Calendar／Reports 組合、Calendar 精確日期導向 Today、
  返回 Calendar，以及 KPI、工作狀態、平台收入、每日紀錄、支出與後續模組完整恢復。
- KPI 測試涵蓋左對齊最大收入、等寬次級欄、目標 disclosure、0／29／59／60／
  70／120 分鐘格式、數字／單位分層、總收入時薪口徑，以及主／次 KPI 語意 token。
- 顯示大小契約驗證 Data／Controls／Structure 三層：主要資料 24／27／30px、
  每日目標與平台輸入值 26／29／32px、切換控制固定 14px，結構標題與 Bottom
  Navigation 不隨大字模式過度放大。
- 日期卡測試涵蓋可操作的原生 date input、`max` 為台北今天、切換後唯一
  `activeRecordDate` 重載、付款日期同步及未來日期拒絕。
- Date Picker follow-up 另驗證 native appearance 未被移除、整張 WebKit picker
  indicator 為 100% 觸發區、支援 `showPicker()` 時只開啟同一原生 input，並以
  實際瀏覽器點擊後由原生日期面板接管、Escape 可返回頁面作 Smoke。
- L2 必測 standard／comfort／large × 320／375／390／393／430px，Console、
  overflow、Calendar → Today、多次切頁、Manifest、App Shell v29 與 offline。
- 實體 iPhone Safari／installed PWA 是本次唯一 Human QA Gate；通過前不得 merge
  `main` 或 Production deploy。
- 2026-08-08 L1：`npm run release:check` Passed；完整 Node 403/403、Today
  142/142、Calendar 69/69、Reports 89/89、AI 25/25、Driver 25/25、Integration
  16/16；lint 0 errors／10 個既有 warnings，Inline JavaScript、Service Worker、
  Manifest、build 與 `git diff --check` 均通過。
- L2 本機瀏覽器：standard／comfort／large × 320／375／390／393／430px 共
  15 組皆 `scrollWidth === clientWidth`；Calendar 2026-07-04 → Today 同時綁定
  標題、每日紀錄日期與付款日期；連續導覽十輪後六個 Today 模組完整，Console
  0 error／warning。
- 2026-08-08 L2：標準／舒適／大字 × 五頁 × 320／375／390／393／430px 共
  75 組 `scrollWidth === clientWidth`，Console 0 error／warning；390px 三模式主收入為 54.6／58.5／62.4px、
  次要 KPI 28／31.2／35.1px、每日目標與平台收入 26／29／32px；字體切換與
  Bottom Navigation 固定 14px。日期卡 enabled、`max=2026-08-08`；8/7 寫入收入後切到 8/8
  不會帶入，再切回 8/7 可載入原值，支出付款日期全程同步，Console 0 error／warning。
- Date Picker follow-up 在 320／375／390／393／430px 均維持 input 完整位於
  日期卡內、native appearance、`max=2026-08-08`、零水平 overflow；390px 實際
  點擊由原生日期面板接管，Console 0 error／warning。

## Current Sprint — Expense、Hourly Rate、Calendar Read-only 與 KPI

- Calendar 測試以唯讀摘要為準：不得出現 `data-calendar-add`、
  `data-calendar-section`、支出編輯／刪除入口；Today 是唯一輸入／修改 owner。
- 週報需驗證支出總和與支出分類摘要；月報分類與分月成本口徑保持不變。
- Today、Calendar、Reports 與 AI 的時薪都必須使用總收入除以有效工時，支出不得降低
  時薪；切頁回 Today 需重繪摘要且保留表單草稿。
- 本候選 App Shell：`driver-pay-pro-v26`；本 Sprint 完成後才建立 Public Preview，
  並只進行一次 iPhone Safari／installed PWA Human QA。

## Expense Management、Calendar Inline Editing 與 KPI Production Release

- 新增 `tests/expense-calendar-kpi-integration.test.js`，覆蓋月報分類與分月／
  實際付款口徑、Today 單筆移除＋5 秒復原、Calendar 五區原地 Editor、唯一
  表單 DOM、更多操作刪除、重複標題、列高、Navigation active state、總收入
  時薪口徑與 Today KPI 層級。
- 瀏覽器 L2 必測：Today 新增／移除／即時復原；Calendar 歷史日期收入、工時、
  支出、其他資料、更多操作逐區展開；Reports 月分類與每日明細；五個 Bottom
  Navigation active state。
- Responsive matrix：standard／comfort／large × 320／375／390／393／430px，
  每頁需 `scrollWidth === clientWidth`，Calendar 70／76／84px 列高與 Bottom
  Navigation safe area 不得回歸。
- App Shell：`driver-pay-pro-v25`；主 key `driverPayApp.v2`、WorkRecord 與
  allocation schema 不變。Product Owner 唯一一次 iPhone Human QA 已 Passed，
  並已完成 main merge 與 Production deployment。
- 2026-08-04 實際結果：完整 Node 339/339、Today 80/80、AI 24/24、Driver
  24/24、Integration 16/16、Reports 86/86、Calendar 66/66；`release:check`
  全數通過，lint 0 errors／10 個既有 warnings，`npm audit` 0 vulnerabilities。
  Browser 的 standard／comfort／large × Today／Calendar／Reports ×
  320／375／390／393／430px 共 45 組全部無水平 overflow，active navigation
  `aria-current` 正確，Console 0 error／warning。Calendar 新增支出、重新載入
  保留、月報分類與原地明細展開均已完成端到端 smoke。Production 390px 五頁
  Smoke QA 通過，Console 無 error／warning，無水平 overflow。

更新日期：2026-08-04

## 基本規則

- 依本次變更風險選擇適用測試，不以桌面預覽取代 iPhone Safari 或 installed PWA 實機 QA。
- 專案已有最小 package、ESLint、static production validation 與 release gate；
  仍沒有 TypeScript 或 bundler。TypeScript 必須標示 Deferred／Not available。
- 現行自動測試使用 Node.js 內建 `node:test`。
- 所有功能變更都必須確認 `driverPayApp.v2` 未被更名或清除。
- PWA 資源變更必須同步檢查 `sw.js` cache version 與 App Shell。

## QA 分級

- L1 自動驗證：語法、Node tests、Console、responsive、資料安全與適用回歸。
- L2 Preview Smoke QA：以未登入 iPhone Safari 可直接開啟的 Preview 快速驗證
  主要流程、導覽、即時更新、overflow、白畫面與阻擋性錯誤。
- L3 Module Human QA：模組 Final Regression 後驗收完整流程、installed PWA、
  Offline、VoiceOver、safe area 與 iOS 特有行為。
- L4 Production Release QA：正式發布後核對 Production commit、核心流程、
  Service Worker 更新與 rollback readiness。

小型 Sprint 原則上不重複執行完整 L3；大模組完成 Final Regression 後集中
執行一次。高風險資料、同步、Service Worker 或 iOS 特有變更仍須即時提高
驗證層級。

## Today Progress and Driver Simplification Candidate

- `tests/today-progress-driver-simplification.test.js` 有 47 項編號契約，覆蓋
  Today 固定收入／工時／時薪、只收合目標進度、跨日 reset、ARIA、Driver
  文案去重、四分類摘要、顯示偏好、responsive 基礎、既有 targeted gates、
  App Shell v24 與 `driverPayApp.v2` 保護。
- `npm run release:check` 已通過：完整 Node 314/314、Today 55/55、AI 24/24、
  Driver 24/24、Integration 16/16、Reports 61/61、Calendar 41/41；inline JS、
  Service Worker、Manifest、Production validation 與 `git diff --check` 均通過。
  Lint 0 errors／10 個既有 warnings；`npm audit` 0 vulnerabilities。
- 瀏覽器矩陣固定為 `standard／comfort／large` × Today／Driver ×
  320／375／390／393／430px；逐組檢查 `scrollWidth === clientWidth`、標題／
  選項無裁切、目標收合高度、整排互動、Console、Manifest 與 Service Worker。
- 實際 Chrome 30 組矩陣全部無 overflow；Console 0 error／warning，目標展開
  高度增加且收合不改 localStorage，320px 大字 Header 單行，v24 App Shell
  可控制頁面並可離線重載。
- Public Preview 必須是未登入 iPhone Safari 可直接開啟的 HTTPS 網址；唯一一次
  Human QA 驗證 iPhone Safari、installed PWA、Offline、VoiceOver、safe area。

## Progressive Disclosure and Display Size — Superseded Candidate

- `tests/progressive-disclosure.test.js` 有 60 項編號契約，直接覆蓋 Today 12、
  AI 8、Driver 12、顯示大小 12、Calendar typography 10、Chevron 6。
- 全部 Node regression 目前為 267/267；專項 Today、Calendar、Reports、AI、
  Driver 與 Integration 仍必須各自通過。
- 瀏覽器矩陣固定為 `standard／comfort／large` × Today／Calendar／Reports／
  AI／Driver × 320／375／390／393／430px，共 75 組，逐組檢查
  `scrollWidth === clientWidth` 與 Console。
- Calendar 必須以 computed style 驗證 month 18／20／22、weekday 12／14／16、
  date 14／16／20、Today button 16／17／20、detail 14／17／22、circle
  34／36／40px，且同一 row 七個 day center 完全一致。
- App Shell candidate 是 `driver-pay-pro-v23`；Manifest 與 `sw.js` 必須從
  Public Preview 同源回傳成功。實體 iPhone Safari、installed PWA、offline、
  VoiceOver 與 safe area 仍由一次 Human QA Gate 完成。

## V1.1 Final Display and Calendar Alignment

- `tests/reading-size.test.js` 驗證三個全域 radio、`displaySize` canonical
  source、舊 `aiReportsReadingSize` fallback、首次繪製、交易式保存、六個
  UI 區域共用 tokens、16／18px 層級、320px 重排與計算隔離。
- `tests/driver.test.js` 驗證單一置底系統狀態、正常收合、異常「需要注意」、
  disclosure ARIA／focus／44px target，且不保留舊兩個 status container。
- `tests/calendar.test.js` 驗證所有日期共用 34px day slot、320px 32px、
  Today outline／solid、無 dot、無位移補丁、完整 cell target 與既有
  Calendar state／mutation 回歸。
- 瀏覽器矩陣固定為三模式 × 320／375／390／393／430px × Today／Calendar／
  Reports／AI／Driver；每組必須 `scrollWidth === clientWidth`。
- Calendar 同列所有 day slot 必須具有相同 `top`、`height` 與垂直中心；
  Console 0 error／warning，Manifest 200，Service Worker v22 可控制頁面。
- 實際 L1：207/207 Node、Today 55/55、AI 24/24、Driver 24/24、
  Integration 16/16、Reports 61/61、Calendar 41/41；release check Passed，
  lint 0 errors／10 既有 warnings，npm audit 0 vulnerabilities。
- 實際 Chrome：75 組 responsive matrix 全部
  `scrollWidth === clientWidth`；390px 同列七個日期的 day center 均為
  `447.546875px`、高度 34px；Console 0 error／warning，Manifest 與
  Service Worker 正常，顯示偏好重載後仍保留。
- L2 必須提供未登入 iPhone Safari 可直接開啟的公開 HTTPS Preview。指定
  Final Human QA／RC 核准前不得 merge main 或 Production deploy。

## Calendar Today 日期標記（v21 歷史驗證）

- `tests/calendar.test.js` 驗證原 4px Today dot 已移除、日期數字使用
  30px／2px 品牌圓圈、Today + Selected 使用實心圓與反差文字，且
  `aria-current="date"` 只由既有 `isToday` 條件產生。
- `npm run release:check`：Passed；197/197 Node、Today 55/55、AI 19/19、
  Driver 16/16、Integration 16/16、Reports 56/56、Calendar 39/39。
- Lint：0 errors／10 既有 warnings；inline JavaScript、Service Worker、
  Manifest、static Production validation 與 `git diff --check` Passed；
  `npm audit` 為 0 vulnerabilities。
- 真實 Chrome mobile emulation 驗證台北 2026-07-29：
  - Today 未選取為 30×30px 透明品牌外框；選取為 30×30px 品牌實心圓與
    白色文字。
  - Today + Heat 仍保留 heat surface，圓圈可辨識；Today + Selected 只保留
    低干擾 brand-subtle cell surface，沒有第二個強烈 cell border。
  - `aria-current="date"` 數量固定為 1；Today button、exact-date route、
    Work Record Card、無紀錄與有紀錄狀態均正常。
  - 320／375／390／393／430px 的 selected／unselected 共 10 組皆
    `scrollWidth === clientWidth`，日期格維持既有 54／58px 高度。
  - `driverPayApp.v2` 在 Calendar 導覽前後完全一致；Service Worker
    `driver-pay-pro-v21` 離線重新載入通過；Console 0 error／0 warning。
- App Shell candidate：`driver-pay-pro-v21`。本小型 Sprint 只做 L1、公開
  L2 與一次 Final Calendar Today Marker Human QA；不重複完整 L3。

## AI／報表閱讀文字大小（已由全域顯示大小取代）

- `tests/reading-size.test.js` 覆蓋三個固定 radio、原生語意、44px target、
  舊資料 fallback、單一 settings source、交易式保存、首次 render 前套用、
  AI／Reports 共用 tokens、主要 KPI 不大幅放大與其他頁面隔離。
- AI、Reports、Driver 專項測試都會包含 reading-size contract；全部 Node
  tests 也會執行同一份測試。
- 瀏覽器矩陣需驗證標準／舒適／大字立即生效、重新載入保留、離線保存、
  320／375／390／393／430px 無水平 overflow、Console 無錯誤，且 Today、
  Calendar、Driver 設定控制與 Bottom Navigation 尺寸不變。
- L1 實際結果：`release:check` Passed；196/196 Node、Today 55/55、
  AI 19/19、Driver 16/16、Integration 16/16、Reports 56/56、
  Calendar 38/38。Lint 0 errors／10 既有 warnings；`npm audit` 0
  vulnerabilities。
- Chrome mobile emulation 實際結果：三個模式的 AI／Reports typography
  即時更新；AI 主標題與 Reports 主要 KPI 保持同尺寸；重新載入與離線保存
  通過；Arrow 鍵更新 radio 與 root attribute；五個 viewport、兩頁、三模式
  共 30 組均 `scrollWidth === clientWidth`，Console 0 error／warning。
- App Shell candidate：`driver-pay-pro-v20`。本小型 Sprint 只做 L1、公開
  L2 與一次指定 Human QA，不重複完整 L3。

## Today Work Status Header

- Contract tests 驗證整條原生 button、唯一 `aria-expanded` state、正確
  `aria-controls`、動態狀態 accessible name、44px focusable target、
  chevron 與操作按鈕事件隔離。
- 真實瀏覽器已驗證標題文字、中間空白、狀態 badge 與 chevron 四個位置都
  可切換同一 `#workMetrics`；再次點擊可收合。
- 開始、暫停、繼續、收工、再跑一段與修改時間均不改變明細展開狀態；
  idle、running、paused、stopped 與 continue 後共用相同標題控制。
- 320、375、390、393、430px 均無水平 overflow；標題、狀態、chevron
  完整，收合時標題與操作列只保留既有 7px grid gap。
- `npm run release:check`：Passed；185/185 Node、Today 55/55、AI 8/8、
  Driver 5/5、Integration 16/16、Reports 45/45、Calendar 38/38。
- Lint：0 errors／10 既有 warnings；inline JavaScript、Service Worker、
  Manifest、static build、Console 0 error／warning 與 `git diff --check`
  Passed；`npm audit` 為 0 vulnerabilities。
- App Shell candidate：`driver-pay-pro-v19`。尚待一次 Work Status Header
  iPhone Safari／installed PWA Human QA。

## Today Expense UX Batch 2 — Human QA Passed

- 新增 `tests/expense-allocation.test.js`，涵蓋 legacy WorkRecord、重開保存、
  一次／分月切換、金額／月份／開始月重算、刪除同步、Calendar／Reports／
  AI／CSV 口徑與尾差總額。
- 瀏覽器隔離 origin 驗證 $12,000／12 個月：月報與 AI 為 $1,000，
  Calendar 付款日仍為 $12,000；重新載入後月份、開始月、金額與備註保留。
- 快捷分類切換保留金額、日期、分月方式與備註；類別 DOM 只有一個 select。
- 320、375、390、393、430px 均 `scrollWidth === clientWidth`；320px 使用
  「今天・7月29日」且不與備註按鈕重疊。
- `npm run release:check`：Passed；183/183 Node、Today 53/53、AI 8/8、
  Driver 5/5、Integration 16/16、Reports 45/45、Calendar 38/38。
- Lint：0 errors／10 既有 warnings；inline JavaScript、Service Worker、
  Manifest、static build／Production validation 與 `git diff --check` Passed。
  `npm audit`：0 vulnerabilities。
- App Shell candidate：`driver-pay-pro-v18`。Product Owner 已確認 Expense UX
  Human QA Passed；臨時 Preview 已停止。

## V1.1 Milestone 1 — Today／Work-Time／QA Follow-up

- Product Owner 已確認 Milestone 1 Final Human QA 通過；舊 Preview tunnel
  已停止。本次 Homepage Detail 只需要新的公開 L2／一次細節 Human QA。
- `npm run test:today`：51/51，涵蓋 stale session 修正、正常／無休息／跨午夜、
  break validation、不完整時間、舊小數工時轉換、整數分鐘、自然語言格式、
  zero-hour hourly rate、Today 同列明細、reduced-motion 捲動、未填工時提醒、
  三個獨立收合區塊、工時模式確認、9 小時 10 分＝550 分鐘、續跑休息累加、
  manual／clock 顯示去重複、支出同列選擇按鈕、快捷草稿保留、支出防重複
  與 transactional persistence、天氣權限／映射／手動覆蓋及 CSV。
- `npm test`：173/173；Calendar、Reports、AI 與 integration regression 全部
  保持通過。
- 共用時薪界線：0～9 分鐘不計算；10 分鐘且時薪不高於 NT$2,000 可計算；
  超過 NT$2,000 標記異常，不參與 AI 正常洞察、百分比或排班建議。
- 真實瀏覽器隔離 origin：
  - start → pause → resume → end 狀態與主要操作正確。
  - 工時模式一次只顯示一種；雙向切換均先確認，manual 模式的「再跑一段」
    會提示先切換。
  - clock 模式「再跑一段」保留原始開始時間、清空結束時間並把收工空檔加入
    休息；不建立第二筆日期紀錄。
  - 「新增支出」與「其他資料」獨立收合；46px 快捷、同列類別／方式按鈕、
    完整類別、三種支出方式、付款日期、備註與獨立儲存流程正常。
  - 快捷切換後 `$1,234`、日期、分月方式與備註草稿保持不變。
  - 手動修改 10:00–18:08 後立即顯示 8 小時 8 分，重開仍保留。
  - Calendar 與 Reports 對同一筆紀錄皆顯示 8 小時 8 分。
  - 320、375、390、393、430px 皆為 `scrollWidth === clientWidth`；支出
    兩個按鈕保持同列、快捷 46px、選擇按鈕 48px、工作明細 44px。
  - 有收入無工時時，「補上工時」保留表單並捲動但不彈鍵盤；「稍後再補」
    可儲存，AI 顯示未計算原因而非極端時薪。
  - 天氣首次展開只顯示隱私說明；未同意不呼叫定位，手動選擇可獨立保存。
    自動定位成功、iOS 權限拒絕及 installed-PWA 權限行為留給最終一次真機 QA。
  - Console：0 error／0 warning。
- App Shell：`driver-pay-pro-v17`；Manifest 與 localStorage key
  `driverPayApp.v2` 保持原契約。
- Homepage Detail 新公開 Preview：
  `https://cord-diagnosis-quite-cancel.trycloudflare.com`；未登入外部 HTTPS
  200、HTML／Manifest／Service Worker SHA-256 與本機一致、Service Worker
  v17、390px 無 overflow、Console 0 error／warning，且沒有登入或警告頁。
- 尚待：Product Owner 於 iPhone Safari／installed PWA 驗證本次細節去重複、
  支出操作、safe area 與離線更新。

## Local-first V1 Release Candidate

Date: 2026-07-26

Status: L1, public L2 and Product Owner L3 passed; V1 UX Freeze active.

- Fixed fixture: `tests/fixtures/v1-regression.json`，覆蓋 45 個核准情境。
- `npm test`：120/120 passed。
- `npm run test:calendar`：38/38 passed。
- `npm run test:reports`：44/44 passed。
- `npm run test:ai`：5/5 passed。
- `npm run test:driver`：5/5 passed。
- `npm run test:integration`：16/16 passed。
- lint：0 errors／10 existing unused-code warnings。
- `npm ci`：Passed；`npm audit`：0 vulnerabilities。
- `npm run release:check`：Passed；inline JavaScript、Service Worker syntax、
  Manifest、static Production validation 與 `git diff --check` 全部通過。
- AI／Reports shared analytics、AI read-only／exact-date deep link、Driver goal
  persistence／rollback、single committed-record refresh、five-tab navigation、
  corrupt-data safety、offline App Shell、Accessibility／responsive contracts
  passed。
- Service Worker candidate：`driver-pay-pro-v13`。
- Public L2 QA：
  `https://mystery-kijiji-publicity-tech.trycloudflare.com`，未登入 Safari 可直接
  開啟，沒有第三方登入或警告頁。
- L2 browser：Today、Calendar、Reports 三個 tabs、AI 三區、Driver、跨頁
  deep link、Driver 即時狀態與 390px `scrollWidth === clientWidth` 通過；
  320／375／393／430px responsive regression contracts 通過。
- Safari Console：0 error／0 warning；Manifest 與 Service Worker v13 可由
  同源直接取得。
- Offline App Shell：停止本機來源、由 Cloudflare 收到 502 時，Safari
  navigation 會回退至已快取的 `index.html`；恢復來源後重新載入正常。
- QA 後 `driverPayApp.v2` 沒有測試紀錄，每日目標維持未設定。
- `driverPayApp.v2`、WorkRecord schema、Supabase 與 Production data 未變。
- TypeScript：Deferred／Not available；目前靜態 PWA 沒有 TypeScript pipeline。
- L3：Product Owner 於 2026-07-26 回覆
  `Driver Pay Pro V1 L3 全部通過`；iPhone Safari、installed PWA、Offline、
  VoiceOver、safe area、responsive、跨頁資料一致與無 High Priority issue
  全部通過。
- Driver Pay Pro Local-first V1 UX Freeze 已生效。

## Foundation Cleanup Validation

Date: 2026-07-26

Status: L1 and L2 passed; no L3 required by approved PRD.

- `npm run lint`：passed，0 errors／10 existing unused-code warnings。
- `npm test`：94/94 passed。
- `npm run test:reports`：44/44 passed。
- `npm run test:calendar`：38/38 passed。
- `npm run check:inline`：1 inline JavaScript block passed。
- `npm run check:sw`：passed。
- `npm run check:manifest`：2 icons and required PWA metadata passed。
- `npm run validate:production`／`npm run build`：HTML、assets、navigation、
  App Shell、fallback、storage key、forbidden URL／secret checks passed。
- `npm run release:check`：全部 gate 依序 passed；任一步失敗會非零退出。
- L2 browser：Today、Calendar、Reports 三個 Tabs、showcase、offline App Shell
  passed；online Console 0 error／warning。
- 390px Chrome：Today、Calendar、Reports weekly／monthly／platform 與 showcase
  全部 `scrollWidth === clientWidth === 390`。
- `driverPayApp.v2`、schema 與 product files 不變；Service Worker 維持 v12。

## Reports Final Regression Matrix

Date: 2026-07-26

Status: L1, L2 and L3 passed; Reports UX Freeze Version 1 active.

- Fixed fixture: `tests/fixtures/reports-final-regression.json`，覆蓋 28 個核准情境。
- Automated suite: `tests/reports-final-regression.test.js` 與全部既有
  `tests/*.test.js`。
- Result: 88/88 Node tests passed；Reports targeted tests 在
  `TZ=Asia/Taipei` 與 `TZ=UTC` 各 38/38 passed。
- Weekly: Monday-first 七天、canonical KPI、期間平均時薪、比較、正負跨越、
  七點趨勢與重要日期 passed。
- Monthly: 曆月、跨月週 clipping、跨年週、閏年、4–6 週趨勢與重要日期 passed。
- Platform: aliases、unknown、tips、unattributed、inconsistent、invalid、
  equal-order、large value、share 及來源不變 passed。
- Drill-down／context／refresh: exact date、no auto-editor、session-only return、
  Calendar create/delete refresh、Today notification 與 single-frame refresh passed。
- Error／Offline／Recovery: corrupt／last-valid／retry／read-only contracts、
  Offline presentation 與 Service Worker App Shell passed；Product Owner 已
  完成真機飛航模式與 installed-PWA relaunch。
- Accessibility／Responsive: tabs、ARIA、visible values、44px、reduced-motion
  contracts passed；320、375、390、393、430、768、1024px 均無 document-level
  horizontal overflow，Reports tabs 單行。
- L2 Preview Smoke: Weekly、Monthly、Platform、平台週／月、Calendar mutation
  refresh、important-date drill-down、return context、390px 與 Console passed。
- TypeScript：Not available；ESLint 與 static Production build：Passed。
- L3 清單：`docs/REPORTS_HUMAN_QA.md`；iPhone Safari、installed PWA、
  Offline、VoiceOver、Reduced Motion、safe area、responsive 與無 High Priority
  issue 全部由 Product Owner 確認通過。
- Reports Feature Freeze Checklist 14/14 Passed。
- Reports UX Freeze Version 1 已於 2026-07-26 正式生效。

## Reports Sprint 5B2 Platform and Drill-Down Validation

Date: 2026-07-26

- `tests/reports-platform.test.js` 驗證平台週／月 session control、收入貢獻語意、
  distinct data states、Calendar exact-date drill-down、return context、
  committed-record refresh、read-only、Accessibility、responsive 與 PWA v12。
- `tests/reports-core.test.js` 驗證 alias normalization、未知平台 fallback、小費
  排除、同額排序、負值／無效值與來源資料不變。
- Result: 全部 Node tests 79/79 passed；Inline JavaScript 與
  `git diff --check` passed。
- Browser: 週／月切換、`#calendar/2026-07-24` exact-date、無自動 Editor、
  返回週報／scroll／focus、Console 0 error／warning passed。
- Responsive: 320、375、390、393、430、768、1024px 均為
  `scrollWidth === clientWidth`；重要日期與 Reports tabs 至少 44px。
- TypeScript、ESLint、Production build：Not available。
- L2 Preview Smoke：平台頁、本週／本月、排行／占比、正確用語、exact-date
  drill-down、return context、mutation refresh 與手機無阻擋性錯誤 passed。
- 本 Sprint 依核准 PRD 不執行完整 L3；實體 iPhone Safari、installed PWA、
  VoiceOver、offline relaunch 與 safe area 集中於 Reports Final Regression
  後的 Module Human QA。

## Reports Sprint 5A Specification Validation

Date: 2026-07-26

- `tests/reports-spec.test.js` 驗證 `docs/REPORTS_SPEC.md` 的 30 個正式章節。
- 契約涵蓋固定 tabs、session-only state、Monday-first Taipei periods、canonical
  KPI、comparison、weekly/monthly trend、platform semantics、Calendar drill-down、
  data safety、35 個 edge cases 與 20 題 Current-State Audit。
- 同步驗證 `AGENTS.md` Reports 永久規則、`PRODUCT_SPEC.md` owner contract 與
  `FEATURE_FREEZE_CHECKLIST.md`。
- Sprint 5A 不改正式 UI；iPhone Safari／installed PWA 視覺驗收不適用，
  並不得沿用 Calendar Human QA 宣稱 Reports UI 已通過。
- TypeScript、ESLint、Production build：Not available。
- Result: 全部 Node tests 58/58 passed；Reports／Reporting／Calendar regression
  targeted tests 21/21 passed；`TZ=UTC` 與 `TZ=Asia/Taipei` 子集各 14/14 passed。
- Inline JavaScript、Service Worker syntax、Manifest JSON、App Shell 與
  `git diff --check`：passed。

### Reports Core Implementation Future Acceptance

- [ ] Weekly：完整台北星期一至星期日、canonical KPIs、前週比較與七日淨收入趨勢。
- [ ] Monthly：完整台北曆月、canonical KPIs、前月比較與 Monday-first 週趨勢。
- [ ] Platform：週／月期間、收入總額、排行、占比與安全前期比較，不推論效率。
- [ ] Comparison：無資料、前期零值、負值與正負跨越不顯示誤導百分比。
- [ ] Trend：無紀錄、零、負值分開，具 visible values 與文字替代。
- [ ] Deep link：開啟 Calendar exact date，返回時保留同 session Reports context。
- [ ] Accessibility：tabs、44px targets、focus、live region、chart alternative 與 reduced motion。
- [ ] Responsive：375、390、393、430px 無 document-level horizontal overflow。
- [ ] Offline：本機有效資料可讀，損壞資料與 last-valid fallback 有明確狀態。
- [ ] Cross-page consistency：Today、Calendar、Reports、AI 共用 fixture 產生相同 canonical values。

## Calendar Final Regression Matrix

Date: 2026-07-25

- Fixed fixture: `tests/fixtures/calendar-regression.json`。
- Automated suite: `tests/calendar-regression.test.js` 與所有既有 `tests/*.test.js`。
- Result: 52/52 passed。
- Read／Navigate: fresh session Today、same-session selection、relaunch reset、
  Monday-first、month arrows、Today、swipe、adjacent month、Today／Selected／Heat、
  out-of-month selection、5／6-week months、future／empty／zero／negative passed。
- Create: past empty date、blank rejection、future guard、Today routing、grid／heat／
  card／summary refresh、selected-date retention、reload persistence passed。
- Edit: income、expense、work time、weather、note、cancel／discard、duplicate-date
  prevention、immediate derived values and selected-date retention passed。
- Delete: cancel／confirm、single-date scope、grid／heat／summary／empty-state refresh、
  rollback and reopen passed。
- Cross-page: Today、Calendar、Reports share canonical total、net、expense、work time、
  hourly rate、work days and monthly aggregation.
- Error／Data Integrity: corrupt JSON preservation, write／serialization／quota
  failures, create／edit／delete rollback, original data preservation and stable
  `driverPayApp.v2` passed。
- Accessibility: date ARIA, Editor title and labels, assertive validation alert,
  SaveStatus live region, confirmation dialog, focus return, keyboard, reduced
  motion and 44×44 targets passed。
- Responsive: 320、375、390、393、430、768、1024px passed without horizontal
  overflow；Final Regression only changed JavaScript behavior and documentation,
  not responsive CSS。
- Browser verification: validation error exposes `role="alert"`,
  `aria-live="assertive"`, `aria-atomic="true"`; forms point to
  `recordEditorStatus`; closing returns focus to the rerendered add button。
- PWA／Offline: Product Owner previously confirmed physical iPhone Safari,
  installed PWA, Preview and offline Human QA; App Shell remains
  `driver-pay-pro-v10` with no resource change in this Sprint。
- TypeScript: Not available。
- ESLint: Not available。
- Production build: Not available。
- Inline JavaScript、Service Worker syntax、manifest JSON、fixture JSON、
  App Shell and `git diff --check`: passed。

### Feature Freeze

正式共用 Gate 位於 `docs/FEATURE_FREEZE_CHECKLIST.md`。Calendar V1 已提供完整
Evidence 並宣告 UX Freeze — Version 1；Reports、AI 與 Driver 必須建立各自證據，
不得沿用 Calendar 的通過狀態。

## Calendar Sprint 4A validation record

Date: 2026-07-25

- Automated Node tests: 40/40 passed.
- Inline JavaScript syntax: passed.
- Service Worker syntax, manifest JSON, and App Shell resource checks: passed.
- Browser Console: no errors or warnings after Calendar interaction and reporting regression checks.
- Responsive browser checks: 320, 375, 390, 393, 430, 768, and 1024px passed without horizontal overflow.
- Verified: fresh/reload Today selection, same-session selection retention, valid/invalid date deep links, month-only navigation, Today action, adjacent-month selection, future/past empty states, keyboard selection, four-level heat, canonical Work Record Card, month summary, Reports fixture consistency, Bottom Navigation clearance, and time-input borders.
- TypeScript: Not available.
- ESLint: Not available.
- Production build: Not available.
- Physical iPhone Safari and installed PWA: pending Product Owner human QA.
- Needs UX Validation: month navigation preserves an out-of-month selected date and keeps that date's card visible with a quiet context label.

## Calendar Sprint 4A.5 Visual Polish validation record

Date: 2026-07-25

- Automated Node tests: 41/41 passed.
- Inline JavaScript, Service Worker syntax, manifest JSON, App Shell, and `git diff --check`: passed.
- Browser Console: no errors or warnings.
- Responsive checks: 320, 375, 390, 393, 430, 768, and 1024px passed without horizontal overflow; seven columns, month navigation, nowrap amounts, selected border, bounded desktop width, and Work Record Card alignment remained intact.
- Six-row month: August 2026 passed at 390 and 430px with 42 date cells, seven columns, a 12px Calendar/Card gap, and no horizontal overflow.
- 390px before/after measurement: Month Navigation moved from y=109.5 to y=105.5; Month Grid from y=207.0 to y=191.0; Work Record Card from y=519.0 to y=495.0, so the card appears about 24px earlier without reducing control hit areas.
- Verified presentation contracts: Today button remains at least 44px high, weekday header keeps seven columns, date amount is nowrap/tabular, selected/current ARIA remains, Work Record Card keeps the same accessible header label, and heat remains a four-level semantic-token presentation.
- Verified regressions: Monday-first, exact date route, month-only navigation, Today action, selected/current separation, canonical card calculations, read-only behavior, unchanged `driverPayApp.v2`, and unchanged heat algorithm.
- TypeScript: Not available.
- ESLint: Not available.
- Production build: Not available.
- Physical iPhone Safari, installed PWA, VoiceOver, iOS return gesture, safe area, Service Worker lifecycle, relaunch-to-today, and month-switch UX: pending Product Owner Human QA.

### Calendar Visual Polish human checklist

- [ ] Header feels clearly shorter without losing brand recognition.
- [ ] Month navigation remains understandable and all controls are comfortable to tap.
- [ ] Today button is visible but does not compete with the month title.
- [ ] Weekday labels are easier to read outdoors and remain secondary.
- [ ] Date and compact income amount feel related without touching or wrapping.
- [ ] Heat levels are slightly easier to distinguish while remaining soft.
- [ ] Selected remains the strongest visual state and Today remains identifiable.
- [ ] Work Record Card date is primary and weekday is secondary; VoiceOver wording is unchanged.
- [ ] Primary and secondary metrics scan clearly without new visual noise.
- [ ] 390px reveals the Work Record Card earlier; 430px retains comfortable spacing.
- [ ] Physical iPhone Safari and installed PWA preserve safe area, Bottom Navigation, gestures, focus, offline shell, and relaunch behavior.

## Cross-page product contract checklist

Use this checklist for every feature that affects navigation, records, calculations, or more than one primary page.

### Page ownership

- [ ] Bottom Navigation remains Today, Calendar, Reports, AI, Driver.
- [ ] Every writable capability has exactly one Primary owner in `docs/PRODUCT_SPEC.md`.
- [ ] Today only creates or updates today's record.
- [ ] Calendar owns past-record creation, editing, and deletion.
- [ ] Reports remains read-only and links to Calendar for record correction.
- [ ] AI remains read-only and separates facts, inference, and advice.
- [ ] Driver contains only persistent multi-day settings.
- [ ] Future dates cannot create work records.

### Shared data and calculations

- [ ] Today and Calendar use the same record model, validation, and autosave behavior.
- [ ] Income uses the canonical platform-rate and entry-total functions.
- [ ] Expenses use the canonical entry-expense function.
- [ ] Net income uses the canonical total-minus-expenses function.
- [ ] Work duration uses `workMetrics()` or its approved successor.
- [ ] Hourly rate uses `hourlyRate()` or its approved successor.
- [ ] Weekly and monthly summaries use one shared summary source.
- [ ] Zero or invalid duration produces `$0`, never `Infinity` or `NaN`.
- [ ] The same fixture produces the same values in Today, Calendar, Reports, and AI.

### Date and route behavior

- [ ] Calendar starts on today after a fresh app launch.
- [ ] Calendar retains the selected date during the same app session.
- [ ] Calendar and Reports month state remain independent.
- [ ] Selecting a date in another month updates the visible Calendar month.
- [ ] Monday-through-Sunday week boundaries remain complete and timezone-safe.
- [ ] Reports or AI record links preserve the exact target date.
- [ ] Invalid routes or dates do not create records.

### Product regression review

- [ ] No feature was moved to a page that has View, Link, or None ownership.
- [ ] No page-specific copy of a shared calculation or record form was introduced.
- [ ] No sixth Bottom Navigation destination was added.
- [ ] `driverPayApp.v2` and the existing data structure remain intact unless an approved migration exists.
- [ ] `docs/TECH_DEBT.md` is updated when an approved Sprint intentionally leaves a known gap.

## Calendar implementation checklist

This checklist applies across Calendar Implementation Sprints. Sprint 4A read/navigation
and Sprint 4B mutation/hardening automated results are recorded in the repository tests
and `HANDOFF.md`. Physical iPhone Safari and installed-PWA items remain Human QA. Full
expected behavior is defined in `docs/CALENDAR_SPEC.md`.

### Month grid and dates

- [ ] Fresh Calendar entry selects Taipei-local today.
- [ ] Same session preserves selected date and displayed month.
- [ ] New session resets normal entry to today.
- [ ] Grid is Monday-first with headers 一 through 日.
- [ ] Normal February has 28 days.
- [ ] Leap-year February has 29 days.
- [ ] Month starting Monday aligns day 1 to the first column.
- [ ] A six-row month renders without clipping or overflow.
- [ ] Leading/trailing adjacent-month dates are valid and selectable.
- [ ] Previous/next arrows change displayed month only.
- [ ] Today button selects and displays current today.
- [ ] Month-only navigation does not silently change selected date.
- [ ] Rapid month changes settle on the final requested month.
- [ ] Date utilities pass in Asia/Taipei and UTC test processes.

### Date-cell states and heat

- [ ] Today and Selected are distinct and can coexist.
- [ ] Focus and Selected are visually distinct.
- [ ] Record with no net displays `—`; no record displays no amount.
- [ ] Negative net displays a signed compact amount and no positive heat.
- [ ] Future date displays no heat and cannot create.
- [ ] One to three positive days use maximum-ratio fallback.
- [ ] Four or more positive days use quantile levels 1–4.
- [ ] All equal positive values receive the same Level 2.
- [ ] One extreme value does not erase differentiation among other days.
- [ ] Compact values cover under 1,000, one-decimal k, integer k, negative, and very large amounts.
- [ ] Heat uses semantic Design System tokens and Selected overrides its surface.

### Work Record Card and empty states

- [ ] Selecting a date updates the card without navigation or auto-creation.
- [ ] Card uses canonical total, expenses, net, duration, and hourly calculations.
- [ ] Platform rows use text, recognized values, and no logos/colors.
- [ ] Empty platform section is hidden.
- [ ] Today empty state shows `前往今天`.
- [ ] Past empty state shows `新增紀錄`.
- [ ] Future empty state has no action.
- [ ] Card and grid update after another page changes records.
- [ ] Monthly net and shared work-day count are correct.

### Record mutation

- [x] Past backfill prefills and locks selected date.
- [x] Existing record opens the one reusable Record Editor.
- [x] Calendar editing does not navigate into or masquerade as Today.
- [x] Successful create/edit returns to the same selected date.
- [x] Routine saves show SaveStatus without success Toast spam.
- [x] Dirty grouped fields cannot be silently discarded.
- [x] Delete is secondary and confirmation includes exact date and affected data.
- [x] Delete success keeps selected date and updates card/grid/heat/summary.
- [x] localStorage write failure rolls back create/edit/delete and preserves a retryable draft.
- [x] Corrupted localStorage shows read error/retry and does not appear as an empty month when a last-valid safety copy exists.
- [x] Offline create/edit/delete accurately says locally saved and does not claim cloud sync.

### Gesture, motion, and accessibility

- [ ] Grid swipe changes one month and arrows remain available.
- [ ] Card swipe changes one day and crossing month syncs displayed month.
- [ ] Vertical scrolling is not intercepted by horizontal gesture detection.
- [ ] iOS screen-edge browser gesture is not hijacked.
- [ ] Reduced motion removes transforms and smooth scrolling.
- [ ] Grid supports roving focus and Arrow/Enter/Space behavior.
- [ ] Date labels announce full date, Today/Selected, record, full net, and future status.
- [ ] Selected uses `aria-selected`; Today uses `aria-current="date"`.
- [ ] Month/card announcements are polite and not repetitive.
- [ ] IconButtons have accessible names.

### Responsive, PWA, and regression

- [ ] 375, 390, 393, and 430px have no horizontal overflow.
- [ ] 320px stress layout remains usable without forcing 44px-wide columns.
- [ ] 768 and 1024px retain a bounded Calendar width and information order.
- [ ] Full date cells remain at least 44px high; primary widths meet the touch target where physically possible.
- [ ] Compact amounts never wrap.
- [ ] Bottom Navigation and installed-PWA safe area do not cover Calendar content.
- [ ] Today, Reports, AI, Driver, navigation, Service Worker, and manifest do not regress.
- [ ] Today, Calendar, Reports, and AI return identical values for shared fixtures.
- [ ] `driverPayApp.v2` and old records remain intact.

## Design System checklist

### Viewport and layout

- [ ] 375px iPhone viewport 無水平 overflow。
- [ ] 390px iPhone viewport 無水平 overflow。
- [ ] 393px iPhone viewport 無水平 overflow。
- [ ] 430px iPhone viewport 無水平 overflow。
- [ ] installed PWA viewport 正確保留 safe area。
- [ ] Desktop 1024px 以上不無限拉寬、不破壞既有響應式。
- [ ] Bottom Navigation 不遮住最後內容。
- [ ] 長繁體中文不截斷必要資訊。
- [ ] 大額金額使用 tabular numerals 且不撐破容器。

### Interaction and accessibility

- [ ] 主要元件可用鍵盤操作。
- [ ] Tab 導覽出現 focus-visible。
- [ ] 滑鼠點擊不留下不必要永久 focus ring。
- [ ] IconButton 具備 `aria-label`。
- [ ] 選取狀態具備 `aria-pressed`、`aria-selected` 或合適語意。
- [ ] 主要 touch target 至少 44×44px。
- [ ] Disabled 元件無法觸發。
- [ ] Button loading 保留原寬度、防止重複提交並顯示文字狀態。
- [ ] SaveStatus 的 saving／saved／offline 可由 `aria-live` 感知。
- [ ] SaveStatus error 可持續顯示並由輔助技術感知。
- [ ] 狀態不只依靠顏色。

### Motion and loading

- [ ] `prefers-reduced-motion: reduce` 時轉場縮短或停止。
- [ ] Skeleton reduced motion 時停止 shimmer。
- [ ] Skeleton 尺寸接近實際內容，不造成明顯 layout shift。
- [ ] 短暫本機狀態不濫用 Skeleton。

### Forms

- [ ] Input、Select、Textarea 與 Time input 高度至少 44px。
- [ ] Label 不只依賴 placeholder。
- [ ] 金額／數字欄位使用適當 input mode。
- [ ] Time input 在 iPhone Safari 的左、右、上、下框線完整。
- [ ] Time input focus 與 value 狀態不讓 border 消失。
- [ ] Time input wrapper 與 input 都沒有超出父容器。
- [ ] Disabled 與 read-only 可清楚區分。

### Visual foundations

- [ ] 新 UI 使用 `styles/design-system.css` tokens。
- [ ] 沒有新增孤立色彩、圓角、陰影或間距。
- [ ] 沒有新增第二套 Button、Card、EmptyState、Skeleton 或 SaveStatus。
- [ ] Lucide 是唯一正式 UI icon 形式。
- [ ] 每頁最多一個主要 CTA。
- [ ] 沒有 Card inside Card 或 KPI card wall。
- [ ] 一般卡片沒有厚重陰影、粗框或高飽和大型漸層。

### Engineering and release

- [ ] Inline JavaScript syntax。
- [ ] Service Worker syntax。
- [ ] Node automated tests。
- [ ] Console 無新增 error／warning。
- [ ] `npm run validate:production`／`npm run build`。
- [ ] TypeScript（目前無 TypeScript，標示 Not available）。
- [ ] `npm run lint`。
- [ ] `npm run release:check`。
- [ ] `git diff --check`。
- [ ] `git diff` 人工核對。
- [ ] `git status` 人工核對。
- [ ] localStorage key 保持 `driverPayApp.v2`。
- [ ] PWA App Shell 資源完整。
- [ ] Showcase 不在 Bottom Navigation 或 PWA App Shell。

## Design System automated tests

```text
node --test tests/*.test.js
```

`tests/design-system.test.js` 驗證 tokens、primitives、PWA 接線、showcase 隔離、無障礙契約與 time input 安全 wrapper。自動測試不能取代真實 iPhone Safari／PWA 驗收。

## Documentation-only Sprint validation

When a Sprint explicitly prohibits product-code changes:

- [ ] `git diff --name-only` contains only approved documentation files.
- [ ] `git diff --exit-code -- index.html design-system.html sw.js manifest.webmanifest styles tests` succeeds.
- [ ] Inline JavaScript syntax still passes against the unchanged `index.html`.
- [ ] Service Worker syntax still passes against the unchanged `sw.js`.
- [ ] `manifest.webmanifest` parses as JSON.
- [ ] Existing Node tests pass.
- [ ] Service Worker cache version is unchanged.
- [ ] No dependency, schema, localStorage, navigation, UI, or business-logic change is present.
