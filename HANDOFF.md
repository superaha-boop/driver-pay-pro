# Driver Pay Pro 開發交接摘要

更新日期：2026-07-25
專案位置：Git repository 根目錄
GitHub：`superaha-boop/driver-pay-pro`

---

## 1. 目前整體狀態

Driver Pay Pro 目前是單頁式網頁 App，主要介面、樣式與邏輯集中在 `index.html`。首頁、平台收入、週報手機版、月份明細、目標進度條與規則式 AI 營運助理已有本機成果；平台輸入模式功能已建立獨立功能提交，Git 工作流程文件於本次 Sprint 更新。

目前首頁視為已完成並凍結。除非使用者明確提出新的首頁需求，後續不要順手調整首頁、平台收入輸入流程、工作計時或任何統計邏輯。本次資訊架構 Sprint 將月曆、報表與底部導覽重新分工，尚待完成最終發布紀錄。

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
- 本次工作分支尚未建立遠端 upstream；發布時應使用 `git push -u origin HEAD`，實際狀態以即時 Git 檢查為準。
- 操作前仍應 Fetch 並確認遠端目前 Branch 是否出現其他提交，不沿用舊交接資訊推測同步狀態。
- `.backups/` 只留本機並由 `.gitignore` 排除；不要刪除或部署。
- Product Owner 已確認 `assets/driver-pay-icon-512.png` 是錯誤且不需要的舊圖，本次可安全刪除；目前 manifest、Service Worker、favicon 與 Apple Touch Icon 均未引用此檔案。
- Vercel 專案 `driver-pay-pro` 已連結 GitHub；推送 `main` 會自動建立 Production Deployment。
- 最新遠端與 Production 狀態仍應以 `git status -sb`、Vercel deployment commit SHA 及本次完成回報為準。

### 本次資訊架構 Sprint（待發布）

- 底部導覽改為「今天｜月曆｜報表｜AI｜Driver」，圖示統一為 24px、2px stroke 的 Lucide inline SVG。
- 月曆只保留月份明細與每日歷史紀錄；週報、月報與平台分析移入固定主標題「報表」的三個內部分頁。
- 月曆與報表月份互相獨立；報表三個分頁共用月份並記住最後查看分頁。
- 每日歷史紀錄補齊總收入、平台收入、支出、淨收入與實際工時；編輯／刪除至少 44px，刪除仍有確認。
- 新增 hash 導覽與舊 `#week`、`#month`、`#platform`、`#analysis` 相容；瀏覽器返回可回到原本月曆或報表狀態。
- Service Worker cache 更新為 `driver-pay-pro-v06-calendar-report-navigation`。
- 沒有改變收入、支出、工時或報表計算公式；`driverPayApp.v2` key 不變，只在既有 `settings` 增加相容性的月曆／報表 UI 狀態。
- 自動測試 15/15 通過，並在 `Asia/Taipei` 與 `UTC` 各重跑一次；Inline JavaScript、Service Worker、manifest 與 `git diff --check` 通過。
- 375、390、393、430px 的頁面寬度均等於 viewport，五個導覽圖示為 24px、按鈕 56px、文字 14px 且不換行；1024px 桌面版仍顯示月份表格。
- 本機瀏覽器已驗證舊連結、返回、編輯、刪除確認、空白狀態、報表分頁記憶及月份獨立狀態；真實 iPhone Safari 與已安裝 PWA 仍需 Product Owner 實機驗收。

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

此專案目前沒有 `package.json`、TypeScript 設定、ESLint 設定或正式 build pipeline，因此無法執行傳統的 TypeScript、ESLint 與 npm build。現階段以 JavaScript 語法檢查、瀏覽器操作測試、Console、響應式尺寸及 Git diff 檢查作為驗證方式。

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
- 現有支出仍只寫入 `entry.expenses[category]`；固定與分月規則未持久化，也未修改月報算法或 `driverPayApp.v2` 結構。

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
