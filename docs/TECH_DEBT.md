# Driver Pay Pro — Technical Debt Register

Updated: 2026-07-25

This register records known limitations and follow-up work. An entry does not authorize implementation. Each item requires its own approved Sprint when scheduled.

Priority:

- P0: data loss or production-blocking.
- P1: high correctness or delivery risk.
- P2: maintainability, QA, or UX risk.
- P3: low urgency or developer experience.

| ID | Issue | Impact | Priority | Recommended timing | Handled now |
| --- | --- | --- | --- | --- | --- |
| TD-001 | `design-system.html` is a static development showcase rather than an automated component environment. | Visual states can drift without broader interaction and screenshot coverage. | P3 | After Calendar v1 | No; documented only. |
| TD-002 | Service Worker cache names include long feature-specific version labels. | Manual release naming is error-prone and can obscure which application revision is cached. | P2 | Before expanding release automation | No; no PWA change in this Sprint. |
| TD-003 | The project has no TypeScript. | Data contracts and component APIs are not compile-time checked. | P2 | Before a larger modularization, with an approved architecture plan | No; adding TypeScript is out of scope. |
| TD-004 | The project has no lint configuration. | Style and common JavaScript errors rely on review and tests. | P2 | Before multi-file JavaScript growth | No; adding lint tooling is out of scope. |
| TD-005 | The project has no build pipeline. | Asset validation, minification, and reproducible production packaging are manual. | P2 | Before connected services or larger modularization | No; adding a build system is out of scope. |
| TD-006 | AI duplicates platform-income, entry-total, expense, and summary calculations. | Reports and AI can diverge when a formula changes. | P1 | Before the next AI or calculation feature | No; product documentation Sprint only. |
| TD-007 | Legacy `.button`, `.panel`, `.empty`, and page-specific cards coexist with `.ds-*` primitives. | New UI can accidentally create a third visual pattern or inconsistent accessibility behavior. | P2 | Gradually, one approved page Sprint at a time | No; global UI migration is prohibited. |
| TD-008 | Physical iPhone Safari and installed-PWA QA is not automated. | Safe area, keyboard, native picker, caching, and standalone behavior can regress undetected. | P1 | Every visual or PWA release | No; requires Product Owner device QA. |
| TD-009 | Time-input width and border behavior still requires real-device coverage. | Desktop emulation cannot fully reproduce iOS intrinsic sizing and picker behavior. | P1 | Every change touching forms or Design System time controls | No; current tests only preserve the known wrapper contract. |
| TD-010 | Major features lack a recurring product-level UX review checklist. | Page responsibilities and interaction principles may drift across Sprints. | P2 | At each major feature acceptance | Partially; a permanent contract checklist is added to `TESTING.md`. |
| TD-011 | Historical edit actions in Calendar navigate to the Today form, and the single record form is tightly coupled to Today DOM/state. | Page ownership is unclear; Calendar cannot safely reuse it without an origin/return editor controller. | P1 | Calendar Implementation Sprint B | Resolved in Sprint 4B: Calendar moves the same form DOM into an origin-aware full-screen editor and restores it to Today on close. |
| TD-012 | Today can select and save non-today dates, including future dates. | Records can be created through the wrong page and future data is not prevented. | P1 | Calendar implementation Sprint, before enabling new Calendar creation | No; no business logic change authorized. |
| TD-013 | Calendar previously had no date grid, session-selected date, or date deep link and persisted only `settings.calendarMonth`. | Sprint 4A now provides Overview → Locate → Open with session-only state; mutation remains separate. | P1 | Calendar Implementation Sprint B | Resolved for read/navigation in Sprint 4A; legacy setting is preserved but no longer drives Calendar. |
| TD-014 | Legacy expense category aliases use both ASCII and full-width slash variants. | Category totals or labels can split if compatibility normalization is bypassed. | P2 | Next approved expense data-quality Sprint | No; old data must remain intact. |
| TD-015 | Income terminology spans raw platform amount, rate-adjusted amount, `entryIncome`, gross income, total income, and net income. | Developers and users can misunderstand which value a report displays. | P1 | Before calculation refactor or new reports | Partially; canonical product terms are defined, code is unchanged. |
| TD-016 | Browser-local storage has no approved cross-device sync or server backup. | Clearing browser data or changing device/browser can lose records. | P1 | V1.5 backup design, then V2 sync architecture | No; this is a known product limitation. |
| TD-017 | Production browser data cannot be audited from repository tests. | Real historical anomalies require user-provided export or device inspection. | P2 | Add privacy-safe diagnostic export before complex migrations | No; no production data access or rewrite. |
| TD-018 | `loadState()` preserves damaged localStorage but other pages can still fall back to default in-memory state without a user-visible read error. | A non-Calendar page can still appear empty and mislead the user into thinking records are missing. | P1 | Calendar Implementation Sprint B before mutation release | Partially resolved; Calendar shows read error/retry while preserving the raw value. |
| TD-019 | Detail save and record deletion mutate in-memory state without transactional rollback when `saveState()` fails. | Calendar could display an unsaved edit/delete or lose a recoverable draft. | P1 | Calendar Implementation Sprint B | Partially resolved: Calendar uses draft plus transactional commit/delete and rollback; legacy Today writes still use existing immediate paths. |
| TD-020 | WorkRecord has no record-level `createdAt` or `updatedAt`. | Calendar cannot display or use reliable record timestamps, and conflict logic cannot assume them. | P2 | Reassess only with an approved data migration or future sync design | No; Calendar Data Contract marks both fields unavailable. |
| TD-021 | Calendar mutation, transactional failure, and physical iPhone/PWA behavior are not yet covered. | Record writing and true Safari/standalone behavior can still regress without detection. | P1 | Calendar Implementation Sprint B and device QA | Partially resolved in Sprint 4B: automated mutation, validation, rollback contracts and browser flows pass; physical iPhone Safari/PWA QA remains open. |
| TD-022 | `workSession` stores aggregate/current session state rather than a list of completed work segments. | Calendar can show canonical aggregate duration but cannot render a trustworthy multi-segment timeline. | P2 | Later Work Record detail/data-model Sprint with migration plan | No; detailed session history is out of Calendar v1 scope. |

## Maintenance Rules

- Update status, evidence, priority, and timing when a debt is addressed or re-evaluated.
- Do not delete resolved entries; mark them resolved with the relevant commit and date.
- Do not convert a debt item into implementation without an approved Sprint.
- Data-model, storage, sync, build-system, and architecture work requires explicit migration or architecture approval where applicable.
