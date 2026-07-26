# Driver Pay Pro — AI Specification

Version: 1.0
Status: V1 Release Candidate
Updated: 2026-07-26

## Responsibility

AI 是唯讀的本機營運分析頁。V1 固定提供三個主要區塊：

1. 營運建議
2. 本月洞察
3. 智慧提醒

AI 不建立、修改或刪除 WorkRecord，不使用外部模型或 API，也不宣稱雲端 AI。
需要修正紀錄時，只能連到 Calendar 的確切日期；需要查看彙總時，只能連到
Reports 的既有分頁。

## Single Source of Truth

AI 必須透過 `sharedAnalytics` 重用 Reports 已驗證的 period、aggregation、
comparison、trend、Important Dates、platform normalization／aggregation、
persistence read、formatting 與 drill-down 基礎。禁止在 renderer 建立第二套
收入、支出、工時、時薪或平台公式。

`buildAIInsights()` 只把 canonical 結果轉為可讀洞察。每項建議必須包含可追溯
依據、期間與資料充足度；資料不足、前期為零、正負跨越或讀取錯誤時，不顯示
誤導百分比、`Infinity` 或 `NaN`。

## State and Refresh

- 分析資料只來自目前裝置的 `driverPayApp.v2`。
- 成功的 committed-record notification 會在 AI 可見時觸發一次更新。
- 單純導覽、選期或開啟 Calendar 不得發出 mutation notification。
- 離線時仍使用本機資料，並清楚標示本機／離線狀態。
- 讀取錯誤不得清除、覆寫或修補原始資料。

## Accessibility and Safety

- 三個主要區塊維持清楚標題、可讀證據與螢幕閱讀器描述。
- 深連結具備明確目的，且不自動開啟 Editor。
- AI 所有操作維持唯讀，沒有儲存按鈕、聊天輸入或外部資料傳送。

## Out of Scope

- 外部 LLM、API key、聊天介面
- 預測性模型或自動決策
- 雲端同步、跨裝置比較
- 新增 KPI、第二套 aggregation 或資料模型
