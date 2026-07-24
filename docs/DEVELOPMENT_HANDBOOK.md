# Driver Pay Pro Development Handbook

Version: 1.1

更新日期：2026-07-24

## 文件定位

本文件定義 Driver Pay Pro 的團隊角色、Sprint、PRD、開發、QA、Beta 與版本流程。所有工作仍須遵守根目錄 `AGENTS.md`；若本文件與當次核准 PRD 衝突，依 `AGENTS.md` 的優先順序處理。

## Team Roles

### Product Owner

負責：

- 提供真實司機需求
- 決定優先順序
- iPhone Beta Test
- 最終產品決策

### Product Manager / UX

負責：

- Backlog
- Sprint Planning
- PRD
- UI／UX 規格
- Acceptance Criteria
- QA 與需求整理

### Engineer — Codex

負責：

- 分析現有程式
- 技術實作
- Bug 修正
- 適用的自動化測試
- 清楚回報修改與結果

Codex 不負責自行決定產品方向。

## Development Workflow

1. Idea
2. Product Backlog
3. Sprint Planning
4. PRD
5. Codex Development
6. Local QA
7. iPhone Beta Test
8. Product Owner Approval
9. Done

## Sprint Rules

- 每個 Sprint 原則上只有一個主要目標。
- Task 數量以可完成、可驗收為準。
- 每個 Task 必須有 PRD。
- 每個 Task 必須有 Acceptance Criteria。
- Sprint 期間的新需求先放 Backlog。
- 可以先發布 Beta，再根據真實回饋改善。
- 不追求一次完美，但資料與計算不得出錯。
- 驗收完成的頁面進入凍結狀態；除非後續 PRD 明確指定，不再順便美化。

## PRD Template

每份 PRD 至少包含：

- Sprint
- Task ID
- Task Name
- Priority
- Status
- Objective
- User Story
- Requirements
- UI／UX Rules
- Acceptance Criteria
- Out of Scope
- Deliverables
- Notes

## Before Development

1. 閱讀本次核准 PRD。
2. 閱讀 `PROJECT_CONTEXT.md`、`HANDOFF.md`、`AGENTS.md` 與相關 `docs/`。
3. 確認專案根目錄、目前分支、最新 commit 與工作目錄狀態。
4. 閱讀實際相關程式與資料流，不只依賴文件。
5. 辨識既有未提交修改並保留使用者成果。
6. 確認修改檔案、Acceptance Criteria 與 Out of Scope。
7. 修改前建立不覆蓋唯一穩定版本的備份，並說明備份方式。
8. 發現文件、Git 與程式衝突時先回報。

## Implementation Rules

- 一次只處理一個頁面、功能或明確小範圍修改。
- 採最小差異，不回退整個專案、不整檔覆蓋 `index.html`。
- UI 任務不得更動資料欄位、計算公式、儲存流程或查詢邏輯。
- 不為未確認的未來需求預先重構架構。
- 不新增未核准套件、外部 AI、API Key 或付費服務。
- 不刪除 `.backups/`，也不把備份部署成網站內容。
- 不清除、更名或任意重塑 `driverPayApp.v2`。

## Current Technical Baseline

- 單頁靜態 App：HTML、CSS、JavaScript 集中在 `index.html`。
- PWA：`manifest.webmanifest`、`sw.js` 與 `assets/`。
- 儲存：瀏覽器 `localStorage`，key 為 `driverPayApp.v2`。
- 沒有 `package.json`、TypeScript、ESLint 或 npm build pipeline。
- 沒有 Supabase、後端、登入或跨裝置同步。

因此不得虛構 lint、type check 或 build 已執行。現行可用驗證為 inline JavaScript 語法檢查、`git diff --check`、瀏覽器 Console 與 320px／390px／1024px 響應式操作驗證。

## QA Checklist

### Function

- 功能正常
- 無明顯 Console Error
- 收入計算正確
- 工時計算正確
- 工作狀態正確
- 資料重開後仍存在
- 直接輸入模式覆蓋總額、累加模式正確加總且不重複提交

### Mobile

- iPhone SE／320px 寬度
- 一般 iPhone／390px 寬度
- Pro Max
- 無水平捲動
- 無手動縮放
- 字體清楚
- 按鈕容易操作
- 鍵盤不阻擋主要操作
- 固定底部導覽不遮住內容
- Safe Area 正常

### PWA

- Manifest 正常
- Service Worker 正常
- Icon 正確
- standalone 正常
- 離線基本功能正常
- PWA 關閉後重開，資料與計時狀態仍存在

### Regression

- 舊功能未被刪除
- localStorage key 未被改動
- 舊資料仍可讀取
- 報表與 CSV 正常
- 首頁與月份明細凍結區塊未受無關修改影響

### Code and Git

- Inline JavaScript 語法檢查通過
- `git diff --check` 通過
- `git diff` 只包含核准範圍
- `git status` 已重新確認
- 若未提供 lint、type check 或 build 工具，明確標示不適用

## Beta Test Workflow

```text
Codex Implementation Complete
→ Local QA
→ Git Commit
→ GitHub
→ Vercel Preview
→ iPhone Beta Test
→ Driver Feedback
→ Product Owner Approval
→ Ready for Review
→ Merge and Production Verification
→ Done
```

未經預覽與授權，不直接覆蓋正式站。

## Driver Feedback Format

- Date
- Version
- Screen
- Problem
- Expected Result
- Priority
- Screenshot
- Status

## Version Management

- 版本名稱以主要修改內容命名。
- 一個 Sprint 原則上對應一個主要版本。
- Hotfix 可以使用次版本。
- 每個版本都必須有 Release Notes。
- Git、GitHub 與部署狀態每次開始工作時重新確認，不沿用舊對話資訊。

Release Notes：

- Version
- Date
- New Features
- Improvements
- Bug Fixes
- Known Issues

## Git and Release Safety

Sprint 完成並通過適用驗證後，Codex 可以直接：

1. 檢查 `git diff`、`git diff --check` 與 `git status`。
2. 只 stage 本 Sprint 核准的檔案。
3. 建立符合規範的 Commit。
4. Push 到目前工作 Branch。
5. 更新 `HANDOFF.md` 及必要開發文件。
6. 回報 Branch、Commit Hash、修改檔案、驗證結果、已知問題與人工 QA。

Commit Message 前綴：

- `feat:`
- `fix:`
- `refactor:`
- `docs:`
- `style:`
- `test:`
- `chore:`

工作目錄若包含其他 dirty changes，必須明確辨識來源並採檔案級 staging，不得默認使用 `git add -A` 混入其他成果。

以下操作必須先取得 Product Owner／使用者明確確認：

- Merge Pull Request。
- Production Deploy。
- Push 到 `main` 或非目前工作 Branch。
- Git Reset、Git Rebase 或 Force Push。
- 刪除分支或改寫既有 Commit 歷史。
- 修改 Supabase Schema 或建立／執行 Migration。
- 刪除正式資料。
- 修改主要架構或大規模重構已凍結 UI。
- 任何可能造成資料遺失的操作。

建立 Pull Request、Draft PR、Vercel Preview 與 iPhone 實機驗收仍依當次 Sprint 指令進行；push 工作 Branch 不代表可以自動 merge 或 deploy。

## Documentation Maintenance

- 長期產品方向更新至 `PRODUCT_GUIDE.md`。
- 視覺與互動決策更新至 `DESIGN_KIT.md`。
- 穩定流程與 QA 規範更新至本文件。
- 重大決策與原因更新至 `DECISION_LOG.md`。
- 實作規格、功能狀態與 Git 變更分別維護在既有 `PROJECT_SPEC.md`、`FEATURES.md`、`CHANGELOG.md`。
- 不建立名稱相近的平行文件；一次性除錯紀錄不堆入長期文件。
- 每個 Sprint 完成後更新交接文件，但技術狀態仍以即時 Git 與程式為準。

## Definition of Done

功能只有在以下全部完成後才算 Done：

- Implementation Complete
- Acceptance Criteria 通過
- Local QA 通過
- iPhone Beta Test 通過
- 沒有 High Priority 問題
- Product Owner 確認

Codex 完成實作與可用自動驗證後，只能回報：

`Status: Ready for Human QA`
