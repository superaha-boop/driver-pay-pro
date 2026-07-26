# Driver Pay Pro — Driver Specification

Version: 1.0
Status: V1 Release Candidate
Updated: 2026-07-26

## Responsibility

Driver 管理跨日持久設定與 App／本機資料狀態。它不得保存某一天的收入、班別、
天氣、備註或工作紀錄，也不得成為第二套 Record Editor。

## V1 Scope

- 每日目標：直接編輯既有 `state.settings.dailyGoal`，自動儲存；Today 與 Driver
  使用同一值。
- 平台設定、快速支出設定、工作紀錄卡片設定與 About：保留既有入口與責任。
- 本機資料狀態：顯示可讀紀錄數、可靠時才顯示日期範圍、儲存 key 狀態與讀取
  錯誤；無可靠 metadata 時明確顯示無法判定最後更新時間。
- App 狀態：顯示 Local-first V1、App Shell cache、PWA／Safari、線上／離線與
  更新方式。
- 資料警告：資料只存在目前瀏覽器／裝置，沒有雲端備份或跨裝置同步；清除
  Safari／App 資料可能造成遺失。

## Persistence Contract

- 固定使用 `driverPayApp.v2` 與既有 settings 結構。
- 每日目標自動儲存失敗時回復先前值，不得留下 UI 與 durable state 不一致。
- Driver 顯示的紀錄統計為衍生讀取，不回寫 WorkRecord。
- 本 V1 不新增 timestamp、metadata、schema、migration 或第二個 storage key。

## Out of Scope

- 登入、Supabase、雲端備份、跨裝置同步
- 清除／重建資料
- 每日 WorkRecord 編輯
- 新設定類型或大規模 Driver UI 重構
