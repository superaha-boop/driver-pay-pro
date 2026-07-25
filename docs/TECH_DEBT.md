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
| TD-011 | Historical edit actions in Calendar navigate to the Today form. | Page ownership is unclear and Today can become a general record editor. | P1 | Calendar implementation Sprint | No; target behavior is now specified. |
| TD-012 | Today can select and save non-today dates, including future dates. | Records can be created through the wrong page and future data is not prevented. | P1 | Calendar implementation Sprint, before enabling new Calendar creation | No; no business logic change authorized. |
| TD-013 | Calendar has no date grid, session-selected date, or date deep link. | The target Overview → Locate → Open → Edit flow is not yet implemented. | P1 | Next Calendar specification and implementation Sprints | No; specification prerequisite recorded. |
| TD-014 | Legacy expense category aliases use both ASCII and full-width slash variants. | Category totals or labels can split if compatibility normalization is bypassed. | P2 | Next approved expense data-quality Sprint | No; old data must remain intact. |
| TD-015 | Income terminology spans raw platform amount, rate-adjusted amount, `entryIncome`, gross income, total income, and net income. | Developers and users can misunderstand which value a report displays. | P1 | Before calculation refactor or new reports | Partially; canonical product terms are defined, code is unchanged. |
| TD-016 | Browser-local storage has no approved cross-device sync or server backup. | Clearing browser data or changing device/browser can lose records. | P1 | V1.5 backup design, then V2 sync architecture | No; this is a known product limitation. |
| TD-017 | Production browser data cannot be audited from repository tests. | Real historical anomalies require user-provided export or device inspection. | P2 | Add privacy-safe diagnostic export before complex migrations | No; no production data access or rewrite. |

## Maintenance Rules

- Update status, evidence, priority, and timing when a debt is addressed or re-evaluated.
- Do not delete resolved entries; mark them resolved with the relevant commit and date.
- Do not convert a debt item into implementation without an approved Sprint.
- Data-model, storage, sync, build-system, and architecture work requires explicit migration or architecture approval where applicable.
