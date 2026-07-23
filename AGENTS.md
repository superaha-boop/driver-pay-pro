# Driver Pay Pro — Codex Instructions

Version: 1.0

## Project Documentation

開始任何工作前，必須先依需求讀取：

- `docs/PRODUCT_GUIDE.md`
- `docs/DESIGN_KIT.md`
- `docs/DEVELOPMENT_HANDBOOK.md`
- `docs/DECISION_LOG.md`
- 本次核准的 PRD

涉及目前產品狀態或接手工作時，也必須核對 `PROJECT_CONTEXT.md`、`HANDOFF.md`、實際 Git 狀態與現有程式碼；技術狀態以即時檢查結果為準。

文件用途：

- `PRODUCT_GUIDE.md`：產品方向與範圍
- `DESIGN_KIT.md`：UI、UX 與品牌規則
- `DEVELOPMENT_HANDBOOK.md`：開發、測試與發布流程
- `DECISION_LOG.md`：重要產品決策與原因

## Instruction Priority

規則衝突時，依照以下優先順序：

1. 使用者本次明確指令
2. 本次核准的 PRD
3. `AGENTS.md`
4. `PRODUCT_GUIDE.md`
5. `DESIGN_KIT.md`
6. `DEVELOPMENT_HANDBOOK.md`
7. Codex 自行判斷

若指令可能造成資料遺失、覆蓋正式版本、刪除分支或改寫 Git 歷史，必須先停止並說明風險。

## Before Starting Work

開始修改前必須：

1. 讀取本次 PRD。
2. 執行 `git status`。
3. 檢查相關現有程式與資料結構。
4. 說明預計修改哪些檔案。
5. 確認 Acceptance Criteria。
6. 確認 Out of Scope。
7. 發現規格矛盾時先回報，不可自行猜測。

## Core Engineering Rules

- 一次只處理目前指定的 Task。
- 使用最小修改原則。
- 不自行新增功能。
- 不自行改變已核准的 UX。
- 不因「順便優化」擴大任務。
- 不任意重寫整個架構。
- 不任意增加套件或更換技術。
- 不修改與任務無關的檔案。
- 不大範圍格式化無關程式。
- 額外發現的問題只列入 Known Issues 或 Backlog Suggestions。

## Data Safety

- 不得任意刪除或重設使用者資料。
- 不得任意修改 localStorage key。
- 目前主要 key 為 `driverPayApp.v2`。
- 資料模型變更前必須提出 Migration 方案。
- UI 修改不得改變收入、支出、工時或設定邏輯。
- 若有資料遺失風險，立即停止並回報。

## Existing Feature Protection

除非 PRD 明確要求，不得刪除或破壞：

- 收入紀錄
- 支出資料
- 工時計算
- 平台管理
- 週報與月報
- 平台分析
- CSV 匯出
- 設定資料
- PWA
- Official App Icon

## PWA Protection

不得破壞：

- `manifest.webmanifest`
- `sw.js`
- Service Worker 註冊
- Apple Touch Icon
- PWA Icons
- standalone 模式
- 離線基本功能

修改 Service Worker 時，必須檢查快取版本與所有資源路徑。

## Git and Deployment Safety

除非本次任務明確要求：

- 不自行 Commit。
- 不自行 Push。
- 不自行 Force Push。
- 不自行 Deploy。
- 不刪除遠端分支。
- 不修改既有 Commit 歷史。
- 不刪除 `backup-old-version` 或 `.backups/`。
- 不直接修改正式 Production。

## Required Validation

完成修改後必須：

1. 執行適用的語法檢查。
2. 執行可用的測試。
3. 檢查 Console Error。
4. 檢查 `git diff`。
5. 再次執行 `git status`。
6. 確認 localStorage key 是否更動。
7. 確認 PWA 是否受影響。
8. 列出需要人工完成的 iPhone QA。

Codex 內建預覽不能取代 Chrome、Safari、iPhone 與 PWA 實機測試。

## Completion Status

Codex 完成程式後只能標示：

`Status: Ready for Human QA`

只有經過以下程序才能標示 Done：

- Acceptance Criteria 通過
- 本機 QA 通過
- iPhone Beta Test 通過
- 沒有 High Priority 問題
- Product Owner 確認

## Required Final Response

完成每個 Task 後必須回報：

1. 完成摘要
2. 修改檔案
3. 實際修改內容
4. 執行過的測試
5. 測試結果
6. 資料結構是否更動
7. localStorage key 是否更動
8. PWA 是否受影響
9. 已知問題
10. 人工 QA 步驟
11. `Status: Ready for Human QA`

不得只回答「已完成」。
