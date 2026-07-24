# Driver Pay Pro — Changelog

本文件依 Git commit、目前工作目錄差異與專案交接資料整理。專案尚未採 Semantic Versioning，因此以日期與 commit 為主。

## 目錄

- [Unreleased](#unreleased)
- [2026-07-19](#2026-07-19)
- [2026-07-18](#2026-07-18)
- [2026-07-17](#2026-07-17)
- [2026-07-14](#2026-07-14)
- [2026-07-08](#2026-07-08)
- [平行分支紀錄](#平行分支紀錄)
- [維護規則](#維護規則)

## Unreleased

目前工作目錄尚未提交的內容：

### Added

- 規則式「AI 營運助理」：今日建議、本月洞察、平台表現與智慧提醒。
- 可重用的 AI 資料正規化、彙總、最佳日／班別、平台趨勢與提醒函式。
- 月份明細天氣 inline SVG 與無障礙名稱。
- `docs/AI_INSTRUCTIONS.md`。
- 完整填寫 Project Spec、UI Guidelines、Features、Roadmap 與 Changelog。

### Changed

- 首頁每日目標改為右對齊狀態文字與真正進度條，支援未達標、達標、超標及異常目標。
- 班別與天氣改為直接選取並保存。
- 更新今日紀錄日期改為精簡橫向日期列。
- 週期改為不重複同年年份的精簡格式。
- 手機月份明細改為單一面板內的緊湊 row，只列有收入的平台。
- README Documentation 索引補充完整文件說明。

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
