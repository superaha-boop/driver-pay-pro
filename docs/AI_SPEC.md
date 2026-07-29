# Driver Pay Pro — AI Specification

Version: 1.2
Status: V1.1 Milestone 1 Candidate
Updated: 2026-07-29

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

分月支出必須沿用 Reports 的 `reportExpenseSummary()`；AI 本月成本、淨收入
與平均時薪使用分月後成本，不得使用付款日原始總額另算一套結果。

## Hourly-rate Data Quality

AI 與 Reports 必須重用 `hourlyRateQuality()` 與 `recordDataQuality()`：

- `complete`：有效工時至少 10 分鐘、收入與工時為 finite，且時薪大於 0、
  不高於 NT$2,000。
- `missing-work-time`：收入大於 0，但沒有有效工時。
- `insufficient-work-time`：有效工時為 1～9 分鐘。
- `abnormal-hourly-rate`：推算時薪高於 NT$2,000。
- `invalid-time-range`：時間範圍不合法。

不完整或異常資料保留原始 WorkRecord，但不得進入正常時薪、百分比、排行、
星期／班別比較或排班建議。AI 必須顯示分析期間、紀錄數、有效工時與未計算
原因，不得以 UI clamp 隱藏問題。

## State and Refresh

- 分析資料只來自目前裝置的 `driverPayApp.v2`。
- 成功的 committed-record notification 會在 AI 可見時觸發一次更新。
- 單純導覽、選期或開啟 Calendar 不得發出 mutation notification。
- 離線時仍使用本機資料，並清楚標示本機／離線狀態。
- 讀取錯誤不得清除、覆寫或修補原始資料。

## Accessibility and Safety

- 三個主要區塊維持清楚標題、可讀證據與螢幕閱讀器描述。
- AI 閱讀文字重用 Driver 的 canonical `settings.displaySize`。舊
  `settings.aiReportsReadingSize` 只可作缺少新欄位時的讀取 fallback。
  只分層調整內文、次要文字、行高與閱讀間距；頁面主標題與主要數值不得
  大幅放大。
- 深連結具備明確目的，且不自動開啟 Editor。
- AI 所有操作維持唯讀，沒有儲存按鈕、聊天輸入或外部資料傳送。

## Out of Scope

- 外部 LLM、API key、聊天介面
- 預測性模型或自動決策
- 雲端同步、跨裝置比較
- 新增 KPI、第二套 aggregation 或資料模型
