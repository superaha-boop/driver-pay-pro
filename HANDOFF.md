# Driver Pay Pro 開發交接摘要

更新日期：2026-07-23
專案位置：Git repository 根目錄
GitHub：`superaha-boop/driver-pay-pro`

---

## 1. 目前整體狀態

Driver Pay Pro 目前是單頁式網頁 App，主要介面、樣式與邏輯集中在 `index.html`。首頁、平台收入、週報手機版、月份明細、目標進度條與規則式 AI 營運助理已有本機成果；其中部分最新修改與文件仍未提交。

目前首頁視為已完成並凍結。除非使用者明確提出新的首頁需求，後續不要順手調整首頁、平台收入輸入流程、工作計時或任何統計邏輯。

### Git 現況

- 目前分支：`codex/home-restore-ui-20260717`
- 最新提交：`6d490d8 docs: add project documentation structure`
- 此分支目前沒有 upstream；不可直接把 GitHub Desktop 的 Publish／Push 視為已核准操作。
- 本機保存的遠端參照：`origin/main` 為 `93b4be5 Add files via upload`；操作前仍應先 Fetch 重新確認。
- 已追蹤且有未提交修改：`.gitignore`、`README.md`、六份既有 `docs/` 文件與 `index.html`。
- 尚未追蹤但應納入版本管理：`AGENTS.md`、`PROJECT_CONTEXT.md`、`HANDOFF.md`、`docs/AI_INSTRUCTIONS.md`、`docs/PRODUCT_GUIDE.md`、`docs/DESIGN_KIT.md`、`docs/DEVELOPMENT_HANDBOOK.md`、`docs/DECISION_LOG.md`。
- `.backups/` 只留本機並由 `.gitignore` 排除；不要刪除或部署。
- 尚未 commit、push、merge 或部署目前工作目錄中的最新成果。

### 本機提交順序

由新到舊：

1. `cc42cda feat: optimize weekly report for mobile`
2. `2ee29d0 backup: preserve app before weekly report responsive update`
3. `d5ca72d style: finalize platform income visuals`
4. `3dd83a0 backup: preserve home before next adjustments`
5. `f8a4d2a fix: restore home dashboard income editing`
6. `7104f13 backup: preserve pre-home-restore UI`
7. `af9aae0 Initial Driver Pay Pro`

相關分支：

- `codex/home-restore-ui-20260717`：目前完成版本
- `codex/backup-pre-home-restore-20260717`：首頁還原前的完整備份
- `main`：仍在初始版本
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

提交：`f8a4d2a`

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

非 Yoxi 平台：

- 輸入的是當日總收入。
- 新值直接覆蓋舊值，不進行累加。
- 儲存後立即同步今日收入、時薪、目標與相關統計。

Yoxi：

- 點擊總額欄位可直接修正當日累計總額。
- 右側加號用來輸入單筆新車資。
- 單筆車資會累加到當日 Yoxi 總額並建立明細紀錄。
- Yoxi 明細仍可編輯與刪除。
- 加號操作不會向下展開大型表單。

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
- 非 Yoxi 使用總額覆蓋；Yoxi 才使用單筆累加。

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
- 非 Yoxi 總額覆蓋正常。
- Yoxi 單筆累加與總額修正正常。
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

- 本機完成版本尚未推送到 GitHub。
- 尚未把目前分支整合回 `main`。
- 尚未確認遠端在這段期間是否有其他變更；整合前應先取得並比較遠端狀態。
- 先前 GitHub CLI 憑證曾失效，目前登入狀態尚未重新確認。
- 不要直接覆蓋遠端；先比較提交與檔案差異，再決定 merge、cherry-pick 或其他安全整合方式。
- 推送後需確認 Vercel 是否自動部署成功。
- 正式站需檢查 `manifest.webmanifest`、`sw.js`、圖示資源路徑與 Service Worker 快取更新。

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
- 不可讓非 Yoxi 收入變成累加。
- 不可讓 Yoxi 加號變成覆蓋總額。
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
3. 修改前建立新的備份提交或分支，不要覆蓋既有備份。
4. 只改需求指定範圍，並重新驗證資料持久化與相關計算。

如果下一步是發布：

1. 先確認 GitHub 登入狀態並取得最新遠端紀錄。
2. 比較 `codex/home-restore-ui-20260717` 與遠端 `main`。
3. 確認沒有需要保留的遠端變更後，再安全整合及推送。
4. 檢查 Vercel 部署、PWA 資源、Service Worker 與正式站完整流程。
5. 最後安排 iPhone Safari／PWA 實機驗收。

---

## 11. 給下一個對話的簡短交接提示

Driver Pay Pro 的首頁、平台收入最終美術及週報手機版已在本機分支 `codex/home-restore-ui-20260717` 完成，最新提交是 `cc42cda`。首頁目前凍結；不要修改既有收入、Yoxi、計時、天氣、目標、歷史紀錄或統計邏輯。遠端 `main` 尚未包含這些提交，正式發布與 iPhone Safari／PWA 實機驗收仍待完成。開始任何修改前，請先檢查 Git 狀態並建立新的完整備份。
