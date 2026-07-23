# Driver Pay Pro Product Guide

Version: 1.0

更新日期：2026-07-21

## 文件定位

本文件定義 Driver Pay Pro 的長期產品方向、使用者、價值、優先順序與範圍。實際已完成狀態以現有程式碼與 `docs/FEATURES.md` 為準；技術細節以 `docs/PROJECT_SPEC.md` 為準。

## Product Definition

Driver Pay Pro 是專為多元計程車與職業駕駛設計的收入及工作管理 App。

它不是一般記帳 App，而是：

- Driver Dashboard
- Driver Work Console
- 未來逐步發展為 Driver Operating System

目前產品是繁體中文、手機優先的單頁式 PWA，主要協助駕駛記錄收入、工時、支出與每日營運資料，並查看日、週、月及平台分析。

## Target Users

主要族群：

- 20～50 歲
- 全職、兼職或新手職業司機
- 使用 Uber、LINE GO、Yoxi、55688、大都會、台灣大車隊等平台
- 主要使用 iPhone
- 每天可能多次開啟 App
- 重視速度、正確性、可讀性與單手操作

主要使用情境：

司機完成一趟行程後，在安全停車或等待下一張訂單時，快速記錄收入及查看今日營運狀況。

不得鼓勵使用者在車輛行進中操作。

## Mission

讓職業司機用最少時間完成每日收入與工時管理，並逐步透過資料分析改善營運決策。

## Core Values

### Fast

主要操作必須快速完成。

### Simple

第一次使用也能理解，不需要複雜教學。

### Reliable

收入、工時、時薪與資料必須正確可靠。

### Driver First

所有產品設計均以真實司機工作流程為準。

### Daily Companion

App 必須適合司機每天頻繁使用。

## Product Priorities

功能優先順序：

1. 正確性
2. 資料安全
3. 司機操作效率
4. 手機使用體驗
5. 視覺精修

## Current Product Baseline

目前已確認的基準：

- 以 `index.html` 為單頁 App；HTML、CSS、JavaScript 與資料邏輯集中管理。
- 資料保存於目前瀏覽器 origin 的 `localStorage`，核心 key 為 `driverPayApp.v2`。
- 沒有帳號、Supabase、後端資料庫或跨裝置同步。
- 不同瀏覽器／裝置的資料各自獨立；清除網站資料可能遺失紀錄。
- Home、週報、月報、平台分析、月份明細、Driver 設定與規則式 AI 營運助理已有實作。
- AI 分頁只使用本機既有資料與規則計算，不連接外部 AI 模型或付費 API。
- PWA 具 manifest、Service Worker、standalone 設定與基本 App Shell 離線快取。

## MVP Scope

以下「現行」表示目前程式可確認；「規劃」表示產品方向，不能視為已完成，也不可未經 PRD 直接實作。

### Home — Driver Console

現行：

- 今日收入
- 今日實際工時
- 目前時薪
- 開始跑車
- 暫停休息
- 繼續跑車
- 收工
- 平台快速收入輸入
- 今日目標
- 班別、天氣、里程、訂單、支出、罰單與備註

### Calendar

現行：

- 每日收入與月份明細清單
- 月份下拉選擇
- 編輯與刪除每日紀錄
- 每週與每月彙總

規劃／TODO：

- 真正的月曆格狀視圖
- 點選月曆日期查看明細
- 休息日標示

### Dashboard

現行資訊分布於 Home 與報表，尚無獨立名為 Dashboard 的分頁：

- 今日、每週、每月收入
- 平台收入分析
- 時薪分析
- 目標進度與規則式營運洞察

### Driver Space

現行：

- 收入目標
- 平台管理
- 平台實拿比例
- 支出類別
- 基本設定
- CSV 匯出

規劃／TODO：

- Driver Profile
- 固定休息日

### Core

現行：

- PWA
- iPhone Mobile First
- 本機資料保存
- Apple-inspired UI

規劃／TODO：

- 雲端同步；目前尚未實作，且在使用者隔離、migration、RLS 與資料搬移方案確認前不得宣稱可用。

## Current Product Boundaries

- 目前採「方案 A：Local Storage」，適合小規模 MVP 測試，但不能跨裝置同步或從雲端恢復。
- 一般平台輸入的是當日總額，新值覆蓋舊值；只有 Yoxi 加號流程新增單筆收入並累加。
- 目前沒有登入、註冊、登出、聊天、付費 AI、車隊或多使用者管理。
- 目前沒有 npm build、TypeScript 或 ESLint 流程；驗證必須如實使用現有可用工具。
- 已凍結的 UI 與資料計算只能依明確 PRD 小範圍修改。

## Later / Backlog

- AI Coach
- Widget
- Apple Watch
- Siri
- 車輛保養
- 保險提醒
- 油耗分析
- ETC
- 車隊管理
- 多車管理

新想法必須先放入 Backlog，不可直接加入目前 Sprint。

任何 Backlog 項目在排入 Sprint 前，都必須補齊使用情境、資料安全、驗收條件與 Out of Scope。
