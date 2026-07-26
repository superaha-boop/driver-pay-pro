# Driver Pay Pro — Feature Freeze Checklist

Version: 1.0

Updated: 2026-07-26

## Purpose

本清單是 Calendar、Reports、AI 與 Driver 等主要模組宣告 UX Freeze 前的共用
驗收 Gate。每一項都必須附上可追溯證據；無法自動驗證的項目必須由 Product
Owner 完成人工 QA，不得以桌面模擬器代替實體 iPhone 或 installed PWA。

## Freeze Gate

- [ ] Product responsibility confirmed：頁面責任與 Primary owner 符合 `docs/PRODUCT_SPEC.md`。
- [ ] Specification complete：正式規格、Acceptance Criteria 與 Out of Scope 已核准。
- [ ] Automated tests pass：所有既有與新增自動測試通過，沒有刪除或弱化失敗測試。
- [ ] Cross-page consistency verified：共用資料在 Today、Calendar、Reports 與 AI 結果一致。
- [ ] Responsive verified：320、375、390、393、430、768、1024px 無水平 overflow。
- [ ] iPhone Safari verified：真機操作、鍵盤、原生 picker、safe area 與返回行為通過。
- [ ] Installed PWA verified：standalone、重開、safe area、最新版 Service Worker 通過。
- [ ] Offline verified：離線開啟、讀取與核准的寫入流程通過，恢復網路不覆蓋新資料。
- [ ] Accessibility verified：VoiceOver、label、live region、focus、鍵盤、reduced motion 與 44×44 touch target 通過。
- [ ] Human QA passed：Product Owner 已確認 Human QA Gate。
- [ ] Error recovery verified：讀寫失敗、rollback、損壞資料與 quota failure 不清除原始資料。
- [ ] Documentation updated：Context、Handoff、Testing、Decision、Changelog 與規格同步。
- [ ] Technical debt recorded：Resolved、Partially resolved、Remains open、Deferred 分類完整。
- [ ] UX Freeze declared：Freeze 範圍、允許修改類型與突破流程已正式記錄。

## Calendar UX Freeze — Version 1 Evidence

- Product responsibility: Calendar 是過去日期定位、補登、編輯與刪除的 Primary owner；Today 保留今日紀錄。
- Specification: `docs/PRODUCT_SPEC.md` 與 `docs/CALENDAR_SPEC.md`。
- Automated tests: 52/52 Node tests passed on 2026-07-25。
- Cross-page consistency: 固定 regression fixture 驗證 canonical income、expense、net、work time、hourly rate、work days 與 monthly summary。
- Responsive: 320、375、390、393、430、768、1024px 通過，沒有水平 overflow。
- Device/PWA/Offline: Product Owner 已確認 iPhone Safari、installed PWA、Preview 與 Offline Human QA 通過。
- Accessibility: 日期 ARIA、Editor 標題／label、assertive validation alert、SaveStatus、dialog、focus return、keyboard、reduced motion 與 touch target 通過。
- Error recovery: 主 key 讀回驗證、last-valid snapshot、serialization／quota／create／edit／delete rollback 通過。
- Technical debt: 狀態保留於 `docs/TECH_DEBT.md`，未以封板名義刪除。
- Freeze declaration: D-026 與 `AGENTS.md`。

Calendar V1 的 Freeze Gate 已通過。下一個主要模組使用本清單時，必須建立該
模組自己的 Evidence 區塊，不得直接複製 Calendar 的通過狀態。

## Reports UX Freeze — Version 1 Evidence

- [x] Product responsibility confirmed：Reports 是週／月／平台唯讀比較與分析
  Primary owner；紀錄修正只連到 Calendar exact date。
- [x] Specification complete：`docs/PRODUCT_SPEC.md` 與 `docs/REPORTS_SPEC.md`。
- [x] Automated tests pass：固定 28 情境 fixture；全部 Node tests 88/88 passed。
- [x] Cross-page consistency verified：Today、Calendar、Weekly、Monthly 與
  Platform 使用 canonical calculations 與同一 record-change notification。
- [x] Responsive verified：320、375、390、393、430、768、1024px 無水平 overflow。
- [x] iPhone Safari verified：Product Owner L3 真機驗收通過。
- [x] Installed PWA verified：Product Owner L3 standalone／重開驗收通過。
- [x] Offline verified：自動 contract、Preview、真機飛航模式及 PWA 重開通過。
- [x] Accessibility verified：ARIA／keyboard／44px／reduced-motion contract
  與 Product Owner VoiceOver L3 通過。
- [x] Human QA passed：Product Owner 於 2026-07-26 正式確認。
- [x] Error recovery verified：corrupt／last-valid／retry／partial-invalid／rollback
  contracts 通過，原始資料不被清除。
- [x] Documentation updated：Context、Handoff、Testing、Decision、Changelog、
  規格與 L3 清單已同步。
- [x] Technical debt recorded：TD-023～TD-026 與永久 Open 項目保留。
- [x] UX Freeze declared：Reports UX Freeze Version 1 正式生效。

Reports V1 的 14 項 Freeze Gate 全部 Passed。L3 evidence 位於
`docs/REPORTS_HUMAN_QA.md`，正式決策為 D-030。

## Production Release Gate — Calendar and Reports Stable Milestone

- [x] Release branch created from the verified Foundation Cleanup remote head.
- [x] Ancestry and divergence audited without reset, rebase, force push, or
  history rewrite.
- [x] Full Release Gate passed：94/94 Node tests、Calendar 38/38、Reports
  44/44、lint、Production validation、build 與 `release:check`。
- [x] Release Candidate Preview passed L2 smoke。
- [x] PR #2 reviewed and merged normally into `main`。
- [x] Production Deployment `dpl_A3wt3sRW7hNDVHFZrWtSPaHpAjKJ` is READY
  and matches main Release merge
  `dbaafba321fd3b108ef5d3b07e2adea7c1f23892`。
- [x] Manifest、icons、Service Worker v12、Console、responsive 與 Offline
  App Shell passed Production verification。
- [x] Product Owner completed the single L4 Production Human QA and confirmed
  `Production L4 全部通過` on 2026-07-26。
- [x] Rollback target `dpl_ApoBCEihJtpt2MxB34tjkEkSNTar` re-confirmed。
- [x] WorkRecord schema、`driverPayApp.v2`、Supabase、Production data 與
  Service Worker cache remained unchanged。

Calendar and Reports Stable Milestone is formally Completed. This evidence does
not declare the complete Driver Pay Pro V1 finished.

## Local-first V1 Candidate Evidence

- [x] Product responsibility confirmed：Today／Calendar／Reports／AI／Driver
  符合 Product Ownership Matrix。
- [x] Specification complete：AI、Driver、Integration 與 Release Candidate
  規格已建立。
- [x] Automated tests pass：120/120 Node tests；45-scenario V1 fixture。
- [x] Cross-page consistency verified：AI 與 Reports 共用 `sharedAnalytics`；
  committed-record notification 與 Driver goal contracts 通過。
- [x] Responsive verified：L2 390px 無水平 overflow；320／375／393／430px
  responsive regression evidence 通過。
- [ ] iPhone Safari verified：等待 Product Owner L3。
- [ ] Installed PWA verified：等待 Product Owner L3。
- [x] Offline verified：自動 contract 與 Safari source-outage／502 App Shell
  fallback 通過；installed PWA 飛航模式仍由 L3 確認。
- [ ] Accessibility verified：自動 contract 已通過，等待 VoiceOver L3。
- [ ] Human QA passed：Pending。
- [x] Error recovery verified：read error、invalid data、rollback 與 corrupt
  payload contracts 通過且不清除原始資料。
- [x] Documentation updated：Release Candidate 文件已同步。
- [x] Technical debt recorded：TD-006 Resolved；其餘 Open／Deferred 保留。
- [ ] UX Freeze declared：必須等 Product Owner L3 Passed。

本區塊不是 Freeze 宣告。只有收到
`Driver Pay Pro V1 L3 全部通過` 後，才能完成剩餘項目與 V1 Freeze。

## Change After Freeze

凍結模組只接受 Bug、Accessibility、Data Integrity 或重大使用障礙修正。
突破 Freeze 前必須：

1. 說明可觀察的使用者問題。
2. 說明影響範圍與資料風險。
3. 取得正式產品決策。
4. 新增或更新 Regression。
5. 更新 `DECISIONS.md`、正式決策紀錄與本清單的 Evidence。
