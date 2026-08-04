# Driver Pay Pro — Local-first V1 Integration Specification

Version: 1.2
Status: V1.1 Release Candidate
Updated: 2026-08-04

## Canonical Flow

```text
driverPayApp.v2
  → validated persistence read
  → canonical WorkRecord calculations / reportExpenseSummary
  → sharedAnalytics
  → Today / Calendar / Reports / AI
```

收入、支出、淨收入、實際工時、平均時薪、期間、趨勢、重要日期與平台歸因
不得由頁面 renderer 各自重算。

## Mutation and Refresh

```text
Today or Calendar successful write
  → persistence verification succeeds
  → one committed-record notification
  → visible Calendar / Reports / AI refresh once
```

失敗或 rollback 不發出成功通知。導覽、切換日期／月份／報表期間與唯讀深連結
不發出通知。AI、Reports 與 Driver 的衍生狀態不得建立 WorkRecord。

## Cross-page Contracts

- Today：今日即時工作與今日紀錄。
- Calendar：過去日期定位與唯一歷史 Record Editor。
- Reports：唯讀週／月／平台比較。
- AI：唯讀且以相同 canonical analytics 產生證據式洞察。
- Driver：既有持久設定與本機 App 狀態。
- AI／Reports 連到 Calendar 時保留 exact date，且不自動開啟 Editor。
- Reports 與 Calendar session state 彼此獨立，不寫入 durable storage。
- Calendar Record Editor 固定在月曆下方原地展開，並移動 Today 的同一份表單
  DOM；不得建立全頁／Modal 複本或第二套 draft。
- 時薪與平均時薪的唯一口徑是總收入 ÷ 有效工時；支出只影響淨收入與成本。
- Reports 月支出分類與 AI 成本分析重用同一 `reportExpenseSummary()`。

## Offline and Data Safety

- Local-first；沒有網路仍可讀取與執行核准的本機流程。
- 主 key 固定為 `driverPayApp.v2`；唯一核准的相容擴充是可選
  `expenseAllocations[category] = { months, startMonth }`。
- 跨日顯示偏好使用既有 settings 中可選
  `displaySize = "standard" | "comfort" | "large"`；新欄位缺少時可相容讀取
  合法 `aiReportsReadingSize`，無效值回退 `standard`，不得寫入 WorkRecord。
- `displaySize` presentation tokens use body／secondary 13／12px (standard),
  17／15px (comfort), and 22／19px (large). Calendar uses its own constrained
  typography tokens so the seven-column grid remains stable.
- Today、AI、Driver disclosure state is session-only UI state. It must not be added
  to `driverPayApp.v2`, WorkRecord, reports state, or analytics input.
- 損壞或讀取失敗時不得清除原始 payload。
- Service Worker Expense／Calendar／KPI candidate cache 為 `driver-pay-pro-v25`。
- 沒有 Supabase、authentication、cloud sync、migration 或外部 AI。
