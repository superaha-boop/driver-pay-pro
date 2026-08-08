# Driver Pay Pro — Driver Specification

Version: 1.5
Status: V1.1 Candidate
Updated: 2026-08-08

## Responsibility

Driver 管理跨日持久設定與 App／本機資料狀態。它不得保存某一天的收入、班別、
天氣、備註或工作紀錄，也不得成為第二套 Record Editor。

## V1 Scope

Driver 第一層固定只有四個 disclosure：

1. 常用（預設展開）：每日目標與字體大小設定。
2. 收支（預設收合）：快速支出、平台、收入方式與目標。
3. 資料（預設收合）：Local-first 警告與 CSV 匯出。
4. 系統（預設收合）：About、版本、作者與衍生系統狀態。

- 每日目標：直接編輯既有 `state.settings.dailyGoal`，自動儲存；Today 與 Driver
  使用同一值。
- 字體大小設定：固定提供標準、舒適、大字，直接編輯可選
  `state.settings.displaySize` 並自動儲存；同一模式套用 Today、Calendar、
  Reports、AI、Driver 與 Bottom Navigation。
- 「常用」遵循同一概念只顯示一次：不再另外顯示收入目標、每日收入目標、
  顯示設定、顯示大小或一般「已套用」說明。離線與失敗回饋仍必須顯示。
- 平台設定與快速支出設定保留既有責任；About 不再使用獨立 row／route，
  直接位於「系統」內容。
- Header 摘要固定為：「常用」不顯示、「收支」顯示「平台、支出」、
  「資料」顯示「備份、匯出」、「系統」顯示「正常／需要注意」。
- 系統狀態：位於「系統」最後，只顯示此裝置與 App、本機資料、離線功能、
  Service Worker 四項可靠且可採取行動的狀態。正常預設收合，真實讀取、儲存或
  Service Worker 異常顯示「需要注意」並可自動展開一次。
- 資料警告：資料只存在目前瀏覽器／裝置，沒有雲端備份或跨裝置同步；清除
  Safari／App 資料可能造成遺失。

## Persistence Contract

- 固定使用 `driverPayApp.v2` 與既有 settings 結構。
- 每日目標自動儲存失敗時回復先前值，不得留下 UI 與 durable state 不一致。
- `displaySize` 合法值為 `standard`、`comfort`、`large`。合法新欄位優先；
  新欄位缺少時可讀取合法 `aiReportsReadingSize`；其他情況使用 `standard`。
  執行期與新寫入只使用 `displaySize`，寫入失敗必須同時回復視覺與 durable
  state。
- Driver 顯示的紀錄統計為衍生讀取，不回寫 WorkRecord。
- 本設定不新增 WorkRecord timestamp／metadata、migration 或第二個 storage
  key；只使用核准的可選 settings 欄位。

## Out of Scope

- 登入、Supabase、雲端備份、跨裝置同步
- 清除／重建資料
- 每日 WorkRecord 編輯
- 未另行核准的其他新設定類型或大規模 Driver UI 重構
