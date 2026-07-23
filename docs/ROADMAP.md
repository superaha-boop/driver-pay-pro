# Driver Pay Pro — Roadmap

更新日期：2026-07-19

## 目錄

- [Roadmap 原則](#roadmap-原則)
- [目前基線](#目前基線)
- [近期：穩定與版本整理](#近期穩定與版本整理)
- [下一階段：Driver Space 與維護性](#下一階段driver-space-與維護性)
- [候選方向](#候選方向)
- [目前不承諾的方向](#目前不承諾的方向)
- [發布與驗收門檻](#發布與驗收門檻)
- [風險](#風險)
- [待決策事項](#待決策事項)

## Roadmap 原則

- 先保護現有資料與核心收入／工時流程，再擴充功能。
- 已完成 UI 不因其他需求順手重做。
- 每個階段都要區分「已實作」、「已提交」、「已推送」、「已部署」。
- 未經確認的構想只能列為候選或 TODO，不得描述成已排程。
- 新功能必須能處理空資料、舊資料與異常數值。
- 手機操作與 320px 無 overflow 是發布必要條件。

## 目前基線

目前工作目錄具備：

- Home 今日儀表板、工作計時與收入輸入。
- 週報、月報、平台分析與月份明細。
- 平台／支出／比例／目標設定與 CSV。
- 規則式 AI 營運助理。
- PWA manifest 與 Service Worker。

目前分支：`codex/home-restore-ui-20260717`。最新文件提交為 `6d490d8`，但 `index.html` 與本輪文件仍有未提交變更。遠端、合併與部署狀態屬即時資訊，執行前必須重新檢查。

## 近期：穩定與版本整理

### 1. 保存目前工作目錄成果

- [ ] 核對 `index.html` 未提交 diff，只包含已確認變更。
- [ ] 重新執行 inline JavaScript 語法與 `git diff --check`。
- [ ] 對規則式 AI、月份明細、直接選項與進度條做回歸測試。
- [ ] 由使用者決定是否建立功能 commit；不要自動混入 `.backups/`。

### 2. 瀏覽器與實機驗收

- [ ] 320px、390px、1024px 全流程。
- [ ] iPhone Safari 實機。
- [ ] 加入主畫面後的 standalone PWA。
- [ ] safe-area、鍵盤、日期選擇器與長清單捲動。
- [ ] Service Worker 更新與舊 cache 清除。

### 3. 安全整合與發布

- [ ] 重新取得遠端狀態並比較本機分支、遠端 main 與平行週報分支。
- [ ] 確認 GitHub 登入與推送權限。
- [ ] 選擇 merge、cherry-pick 或其他非破壞性整合方式。
- [ ] 推送與部署只能在使用者明確授權後執行。
- [ ] TODO：確認目前正式部署服務與專案連結；程式庫內沒有部署設定。

## 下一階段：Driver Space 與維護性

### Driver Space

目前頁面只提供平台、支出、比例、目標與 CSV。詳細內容尚未定義。

- TODO：確認是否需要駕駛個人資料、車輛資料或偏好設定。
- TODO：確認 Driver Space 與一般「設定」的產品命名與資訊架構。
- TODO：定義資料欄位前先規劃 localStorage 相容策略。

### 程式維護性

- TODO：決定是否把單一 `index.html` 拆成 CSS／JS 模組。
- TODO：決定是否建立 schema migration、單元測試與瀏覽器回歸測試。
- TODO：決定是否引入 package manager、lint、type check 與 build；目前沒有工具鏈。
- TODO：若導入工具鏈，必須保持靜態 PWA 部署與既有資料相容。

## 候選方向

以下只是在現有缺口上可合理辨識的候選項目，尚未排程：

- 資料匯入與可驗證的備份還原。
- localStorage schema 版本與 migration。
- 更完整的每公里收益、每單收益與成本分析。
- 規則門檻可設定化。
- 對 AI 洞察增加「依據資料」說明。
- 更一致的 SVG icon 系統。
- 自動化瀏覽器回歸測試與 CI。

以上每一項都需先確認需求、資料安全與手機操作，不應直接開發。

## 目前不承諾的方向

- 真正生成式 AI、聊天或付費模型。
- 使用者帳號、雲端資料庫與跨裝置同步。
- 原生 iOS／Android App。
- 多人或車隊管理。

這些能力目前不存在，也沒有可由專案內容確認的正式時程。

## 發布與驗收門檻

每次發布前至少確認：

1. `driverPayApp.v2` 未更名且舊資料可讀。
2. 一般平台覆蓋、Yoxi 累加與單筆修改／刪除正確。
3. 計時開始、暫停、繼續、收工與跨午夜正確。
4. 今日／本月目標不產生 NaN、Infinity 或 overflow。
5. 月份明細手機清單與桌面表格互斥。
6. AI 空資料、單日資料、缺工時、缺平台與目標 0 正常。
7. 320px、390px、1024px 無水平 overflow。
8. Console 無 error／warning。
9. Service Worker cache 版本與 App Shell 正確。
10. Git 工作目錄、提交、推送與部署版本可追溯。

## 風險

| 風險 | 目前因應 |
| --- | --- |
| localStorage 被清除 | CSV 人工匯出；TODO：匯入／還原尚未實作 |
| 單檔修改互相影響 | 限縮變更區塊、備份、diff 與瀏覽器回歸 |
| 舊 Service Worker 快取 | 更新 cache name、發布後實測 |
| 文件落後於程式 | 以實際程式與 Git 為準，功能變更同步更新 docs |
| 遠端分支分歧 | 發布前 fetch／compare，不 force push |
| 規則式 AI 被誤認為模型 | UI 與文件清楚標示為本機規則計算 |

## 待決策事項

- TODO：下一個正式版本號與發布節奏。
- TODO：目前工作的 commit 分組方式。
- TODO：是否追蹤 `.backups/`、`PROJECT_CONTEXT.md` 與 `HANDOFF.md`。
- TODO：Driver Space 的產品範圍。
- TODO：測試與 build 工具鏈。
- TODO：資料同步、匯入與真正 AI 是否進入正式 Roadmap。
