# Driver Pay Pro — Local-first V1 Release

Status: V1 UX Freeze active; Production release in progress
Updated: 2026-07-26

## V1 Definition

Local-first V1 包含穩定的 Today、Calendar V1、Reports V1、唯讀 evidence-based
AI、Driver 既有持久設定／本機狀態、共用 canonical analytics、單一
record-change refresh 與離線 PWA App Shell。

V1 不包含 Supabase、登入、雲端備份、跨裝置同步、conflict resolution、
record metadata migration、多段工作模型、外部 AI 或 TypeScript migration。

## Release Gates

1. L1：完整自動驗證與固定 V1 regression fixture。
2. L2：公開、未登入 iPhone Safari 可直接開啟的 Preview smoke。
3. L3：`docs/V1_HUMAN_QA.md` 單次 Product Owner Human QA。
4. Freeze：L3 通過後才更新決策、清單與正式 V1 freeze 文件。
5. Production：Freeze 文件提交後才可正常合併 `main`，由既有 Vercel Git
   Integration 建立 Production，最後執行 L4。

## Rollback

- 發布前記錄目前 stable Production deployment 與 commit。
- 發布失敗優先由 Vercel 將 Production 指回已確認的 stable deployment，或以
  正常 revert commit 回復。
- 禁止 reset、rebase、force push、改寫 main 歷史、清除 localStorage 或批量
  修改正式資料。

## Current Release Candidate

- Branch: `codex/v1-completion-program-20260726`
- Baseline main: `dbaafba321fd3b108ef5d3b07e2adea7c1f23892`
- Service Worker candidate: `driver-pay-pro-v13`
- Persistence: `driverPayApp.v2`, unchanged
- L1: Passed, 120/120
- L2: Passed, public Safari／responsive／Manifest／SW v13／offline App Shell
- L3: Passed by Product Owner
- UX Freeze: Active, D-033, 21/21 Gate
- Production: Not deployed
