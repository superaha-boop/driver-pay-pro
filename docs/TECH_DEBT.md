# Driver Pay Pro — Technical Debt Register

Updated: 2026-07-26

This register records known limitations and follow-up work. An entry does not authorize implementation. Each item requires its own approved Sprint when scheduled.

Priority:

- P0: data loss or production-blocking.
- P1: high correctness or delivery risk.
- P2: maintainability, QA, or UX risk.
- P3: low urgency or developer experience.

| ID | Issue | Impact | Priority | Recommended timing | Handled now |
| --- | --- | --- | --- | --- | --- |
| TD-001 | `design-system.html` is a static development showcase rather than an automated component environment. | Visual states can drift without broader interaction and screenshot coverage. | P3 | After Calendar v1 | No; documented only. |
| TD-002 | Service Worker cache names previously included long feature-specific version labels. | Manual release naming was error-prone and obscured which application revision was cached. | P2 | Resolved 2026-07-25 | Resolved; App Shell releases use the short sequential cache, currently `driver-pay-pro-v12`. Release automation remains a separate TD-005 concern. |
| TD-003 | The project has no TypeScript. | Data contracts and component APIs are not compile-time checked. | P2 | Before a larger modularization, with an approved architecture plan | No; adding TypeScript is out of scope. |
| TD-004 | The project has no lint configuration. | Style and common JavaScript errors rely on review and tests. | P2 | Before multi-file JavaScript growth | No; adding lint tooling is out of scope. |
| TD-005 | The project has no build pipeline. | Asset validation, minification, and reproducible production packaging are manual. | P2 | Before connected services or larger modularization | No; adding a build system is out of scope. |
| TD-006 | AI duplicates platform-income, entry-total, expense, and summary calculations. | Reports and AI can diverge when a formula changes. | P1 | Before the next AI or calculation feature | No; product documentation Sprint only. |
| TD-007 | Legacy `.button`, `.panel`, `.empty`, and page-specific cards coexist with `.ds-*` primitives. | New UI can accidentally create a third visual pattern or inconsistent accessibility behavior. | P2 | Gradually, one approved page Sprint at a time | No; global UI migration is prohibited. |
| TD-008 | Physical iPhone Safari and installed-PWA QA is not automated. | Safe area, keyboard, native picker, caching, and standalone behavior can regress undetected. | P1 | Every visual or PWA release | Partially resolved; Product Owner device QA passed for Calendar V1, but automation is still unavailable and real-device QA remains mandatory. |
| TD-009 | Time-input width and border behavior still requires recurring real-device coverage. | Desktop emulation cannot fully reproduce iOS intrinsic sizing and picker behavior. | P1 | Every change touching forms or Design System time controls | Partially resolved; Calendar V1 Product Owner iPhone/PWA QA passed and the wrapper contract is automated, but long-term real-device coverage remains open. |
| TD-010 | Major features previously lacked a recurring product-level UX review checklist. | Page responsibilities and interaction principles could drift across Sprints. | P2 | Resolved 2026-07-25 | Resolved; `docs/FEATURE_FREEZE_CHECKLIST.md` is the required reusable Gate for Calendar, Reports, AI and Driver. |
| TD-011 | Historical edit actions in Calendar navigate to the Today form, and the single record form is tightly coupled to Today DOM/state. | Page ownership is unclear; Calendar cannot safely reuse it without an origin/return editor controller. | P1 | Calendar Implementation Sprint B | Resolved in Sprint 4B: Calendar moves the same form DOM into an origin-aware full-screen editor and restores it to Today on close. |
| TD-012 | Today can select and save non-today dates, including future dates. | Records can be created through the wrong page and future data is not prevented. | P1 | Calendar implementation Sprint, before enabling new Calendar creation | No; no business logic change authorized. |
| TD-013 | Calendar previously had no date grid, session-selected date, or date deep link and persisted only `settings.calendarMonth`. | Sprint 4A now provides Overview → Locate → Open with session-only state; mutation remains separate. | P1 | Calendar Implementation Sprint B | Resolved for read/navigation in Sprint 4A; legacy setting is preserved but no longer drives Calendar. |
| TD-014 | Legacy expense category aliases use both ASCII and full-width slash variants. | Category totals or labels can split if compatibility normalization is bypassed. | P2 | Next approved expense data-quality Sprint | No; old data must remain intact. |
| TD-015 | Income terminology spans raw platform amount, rate-adjusted amount, `entryIncome`, gross income, total income, and net income. | Developers and users can misunderstand which value a report displays. | P1 | Before calculation refactor or new reports | Partially; canonical product terms are defined, code is unchanged. |
| TD-016 | Browser-local storage has no approved cross-device sync or server backup. | Clearing browser data or changing device/browser can lose records. | P1 | V1.5 backup design, then V2 sync architecture | No; this is a known product limitation. |
| TD-017 | Production browser data cannot be audited from repository tests. | Real historical anomalies require user-provided export or device inspection. | P2 | Add privacy-safe diagnostic export before complex migrations | No; no production data access or rewrite. |
| TD-018 | `loadState()` preserves damaged localStorage but other pages can still fall back to default in-memory state without a user-visible read error. | A non-Calendar page can still appear empty and mislead the user into thinking records are missing. | P1 | Before the next cross-page persistence Sprint | Partially resolved; Calendar shows read error/retry, preserves the raw value and has fixed corruption fixtures; non-Calendar presentation remains open. |
| TD-019 | Legacy Today writes can still mutate in-memory state before confirming durable storage. | A non-Calendar write can display a value that was not safely persisted. | P1 | Before the next Today persistence Sprint | Partially resolved: Calendar create/edit/delete use draft plus transactional commit and rollback; serialization, quota and rollback regressions pass. Legacy Today paths remain open. |
| TD-020 | WorkRecord has no record-level `createdAt` or `updatedAt`. | Calendar cannot display or use reliable record timestamps, and conflict logic cannot assume them. | P2 | Reassess only with an approved data migration or future sync design | No; Calendar Data Contract marks both fields unavailable. |
| TD-021 | Calendar mutation, transactional failure, and physical iPhone/PWA behavior previously lacked final coverage. | Record writing and true Safari/standalone behavior could regress without detection. | P1 | Resolved for Calendar V1 on 2026-07-25 | Resolved for Calendar V1: final fixture, mutation, validation, rollback and browser flows pass; Product Owner confirmed iPhone Safari, installed PWA and offline QA. Recurring device automation remains tracked by TD-008. |
| TD-022 | `workSession` stores aggregate/current session state rather than a list of completed work segments. | Calendar can show canonical aggregate duration but cannot render a trustworthy multi-segment timeline. | P2 | Later Work Record detail/data-model Sprint with migration plan | No; detailed session history is out of Calendar v1 scope. |
| TD-023 | Reports period selection and aggregation are embedded in weekly, monthly, trend, and platform renderers. | New comparisons or trends can rescan state, duplicate rules, or diverge across tabs. | P1 | Resolved 2026-07-26 | Resolved across Sprint 5B1／5B2:週／月使用共用 period、aggregator 與 comparison；平台使用獨立純 aggregation selector 與相同期間工具。 |
| TD-024 | Reports refresh relies on direct renderer calls from several flows and has no reusable committed-record notification. | As page controllers become more modular, Reports can become stale or refresh multiple times after a mutation. | P1 | Resolved 2026-07-26 | Resolved in Sprint 5B2：成功 mutation 發出單一 committed-record notification，Reports 可見時以單一 animation frame 更新。 |
| TD-025 | Reports transient tab and month choices are stored in durable `lastReportView` and `reportMonth` settings. | A fresh App session can reopen stale analysis context and UI-only state remains coupled to the user-data payload. | P2 | Resolved for weekly/monthly runtime 2026-07-26 | Sprint 5B1 no longer reads or writes these fields for weekly/monthly Reports. Legacy fields remain untouched for compatibility and require no migration. |
| TD-026 | Historical platform income is keyed by platform display name rather than a stable platform ID. | Renaming a custom platform can split historical ranking, while silently merging names could corrupt attribution. | P1 | Stable-ID migration requires a separate approved data Sprint | Partially resolved in Sprint 5B2：核准的內建別名在讀取層合併，未知自訂平台安全保留；自訂平台重新命名後的歷史穩定 ID 仍未解決，且未改寫資料。 |

## Maintenance Rules

- Update status, evidence, priority, and timing when a debt is addressed or re-evaluated.
- Do not delete resolved entries; mark them resolved with the relevant commit and date.
- Do not convert a debt item into implementation without an approved Sprint.
- Data-model, storage, sync, build-system, and architecture work requires explicit migration or architecture approval where applicable.
