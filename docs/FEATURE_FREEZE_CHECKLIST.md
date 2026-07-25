# Driver Pay Pro — Feature Freeze Checklist

Version: 1.0

Updated: 2026-07-25

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

## Change After Freeze

凍結模組只接受 Bug、Accessibility、Data Integrity 或重大使用障礙修正。
突破 Freeze 前必須：

1. 說明可觀察的使用者問題。
2. 說明影響範圍與資料風險。
3. 取得正式產品決策。
4. 新增或更新 Regression。
5. 更新 `DECISIONS.md`、正式決策紀錄與本清單的 Evidence。
