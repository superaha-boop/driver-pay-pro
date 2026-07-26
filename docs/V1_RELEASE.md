# Driver Pay Pro — Local-first V1 Release

Status: Completed
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
- Freeze commit: `2c79a87aef61776347b6630f3da2680e1bcfdacc`
- Pull Request: `https://github.com/superaha-boop/driver-pay-pro/pull/3`
- Main merge: `8041e84591c76b16582e41403ae7267f5fd1bc90`
- Production URL: `https://driver-pay-app.vercel.app`
- Production deployment: `dpl_cXh2FzfHMLCdZxh1HufBm1j6HbGS` (`READY`)
- Production deployment commit: `8041e84591c76b16582e41403ae7267f5fd1bc90`
- Service Worker: `driver-pay-pro-v13`
- Persistence: `driverPayApp.v2`, unchanged
- L1: Passed, 120/120
- L2: Passed, public Safari／responsive／Manifest／SW v13／offline App Shell
- L3: Passed by Product Owner
- UX Freeze: Active, D-033, 21/21 Gate
- Production automated verification: Passed
- Production Safari: direct open／reload Passed; Console 0 error／0 warning
- Responsive: 320／375／390／393／430px Passed, no horizontal overflow
- Vercel runtime error／fatal logs: 0

## Production Content Identity

`origin/main` 在合併前是 Program branch 的直接 ancestor，分歧為 0 behind／11
ahead；PR #3 使用一般 merge，沒有 rebase、force push 或歷史改寫。Production
merge commit 與 Freeze commit 的 Git tree 均為：

`6b1764729034ff698db3516610fe0eaba741f8a8`

因此 Production 內容與 L3／Freeze 驗證候選內容一致。

## Rollback Target

- Previous stable deployment: `dpl_A3wt3sRW7hNDVHFZrWtSPaHpAjKJ`
- Previous stable main: `dbaafba321fd3b108ef5d3b07e2adea7c1f23892`
- Rollback must use Vercel deployment reassignment or a normal revert commit.
- Rollback does not rename or clear `driverPayApp.v2` and requires no schema action.

Driver Pay Pro Local-first V1 is formally completed. Production-closeout
documentation is kept on the Program branch and is not merged again, avoiding a
second documentation-only Production deployment.
