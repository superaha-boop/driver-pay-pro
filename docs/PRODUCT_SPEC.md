# Driver Pay Pro — Product Specification

Version: 1.0

Status: Approved product architecture baseline

Owner: Mark Hu

Updated: 2026-07-25

> This document defines what Driver Pay Pro is, which page owns each capability, and how data and interactions must remain consistent across the app. Implementation status is recorded separately in the Current State Audit.

## 1. Product Vision

Driver Pay Pro is a mobile-first PWA for Taiwan-based multi-platform taxi and professional drivers. It helps a driver record daily work quickly, understand income and work time, review history, and make better operating decisions.

Product tagline:

> Designed to simplify everyday work.

Driver Pay Pro is not:

- An accounting or tax filing system.
- A fleet administration console.
- A social network.
- An income guarantee or prediction service.
- A traditional enterprise BI dashboard.

## 2. Primary Persona

The primary user is a self-managed driver who works across multiple platforms and needs to operate the app between trips, often with one hand and limited attention.

Design and product constraints:

- iPhone Safari and installed PWA are the primary environments.
- High-frequency actions should take one or two taps.
- Information must be readable at a glance.
- The product must tolerate intermittent connectivity because current records are local-first.
- The user should not need to understand technical terms, data schemas, or accounting jargon.
- Destructive actions require clear confirmation.

## 3. Product Architecture

Bottom Navigation is permanently limited to five primary destinations:

1. Today
2. Calendar
3. Reports
4. AI
5. Driver

Do not add a sixth primary destination. Secondary screens must remain within the two-level navigation principle.

### 3.1 Today

Purpose: capture and monitor the current working day.

Primary responsibilities:

- Show today's income, actual work time, hourly rate, and goal progress.
- Start, pause, resume, and end today's work session.
- Enter or correct today's platform income.
- Add today's expenses.
- Record today's shift, weather, orders, distance, and note.
- Provide immediate save and work-status feedback.

Today must not become:

- A history browser.
- A weekly or monthly analysis page.
- A persistent settings page.
- A place to create future records.

Target information order:

1. Core green summary.
2. Current work status.
3. Work controls.
4. Platform income.
5. Today's supporting data.
6. Goal progress and update controls where not already integrated above.

### 3.2 Calendar

Purpose: locate a date and manage a past work record in context.

Primary responsibilities:

- Navigate months and select a date.
- Distinguish today, the selected date, recorded days, and days without records.
- Show a concise monthly overview.
- Open the selected date's Work Record Card below the calendar.
- Create a missing past record.
- Edit or delete an existing past record.

Calendar must not:

- Contain live work-session controls.
- Become an analytics dashboard.
- Own persistent settings.
- Permit future record creation.
- Depend on days with data to define the displayed month.

### 3.3 Reports

Purpose: compare and analyze performance over time.

The formal Reports period, state, KPI, comparison, trend, platform, drill-down, and
acceptance contract is defined in `docs/REPORTS_SPEC.md`. Reports implementation
must use that document as its primary feature specification.

Primary responsibilities:

- Weekly summaries.
- Monthly summaries.
- Platform performance and ranking.
- Read-only trends and comparisons.

Reports must not:

- Directly mutate a work record.
- Duplicate record-entry forms.
- Own persistent platform, goal, or display settings.

When a report needs record-level correction, it must link to the responsible Calendar date instead of editing in place.

### 3.4 AI

Purpose: turn existing records into understandable observations and practical suggestions.

Primary responsibilities:

- Structured daily advice.
- Monthly insights.
- Platform observations.
- Anomaly and data-quality reminders.

AI output must distinguish:

- Facts derived directly from stored records.
- Inferences based on those facts.
- Advice that the user may choose to follow.

AI must not:

- Modify records or settings.
- Guarantee future earnings.
- Present uncertain inference as fact.
- create a second calculation source for income, work time, or reports.

### 3.5 Driver

Purpose: manage persistent preferences and app-level configuration.

Primary responsibilities:

- Platform management and income input modes.
- Platform rates.
- Quick expense settings and expense categories.
- Persistent monthly and daily goal settings.
- Work Record Card display preferences.
- Export and About.
- Future sync, backup, and account status if those capabilities are approved.

Driver must not contain single-day work data such as a particular day's weather, shift, note, or income.

## 4. Feature Ownership Matrix

Legend:

- **Primary**: the only page allowed to own the interaction or setting.
- **View**: read-only presentation.
- **Link**: navigation to the Primary page.
- **None**: feature must not appear.

Every writable capability has exactly one Primary owner.

| Capability | Today | Calendar | Reports | AI | Driver |
| --- | --- | --- | --- | --- | --- |
| View today's summary | Primary | View | View | View | None |
| Start/pause/resume/end today's work | Primary | None | None | None | None |
| Enter or correct today's platform income | Primary | View | Link | Link | None |
| Add or edit today's expense | Primary | View | Link | Link | None |
| Record today's shift/weather/note | Primary | View | Link | Link | None |
| Locate a historical date | None | Primary | Link | Link | None |
| Create a missing past record | None | Primary | None | None | None |
| Edit a past record | None | Primary | Link | Link | None |
| Delete a work record | None | Primary | Link | Link | None |
| View weekly/monthly/platform analysis | View | View | Primary | View | None |
| Generate structured operational insights | View | Link | View | Primary | None |
| Configure platforms and input modes | None | None | None | None | Primary |
| Configure platform rates | None | None | None | None | Primary |
| Configure expense shortcuts/categories | None | None | None | None | Primary |
| Configure goals | View | None | View | View | Primary |
| Configure Work Record Card display | None | View | None | None | Primary |
| Export stored records | None | None | Link | None | Primary |
| View app/backup/sync status | View | None | None | None | Primary |

## 5. Cross-page Record Behavior

### 5.1 Legal creation paths

- Today creates or updates only today's record.
- Calendar creates or updates only past records.
- Future dates are read-only and cannot create records.
- Reports and AI are read-only and may only link to Calendar for corrections.

### 5.2 Shared record contract

Today and Calendar must use:

- The same record model.
- The same validation.
- The same income, expense, work-time, net-income, and hourly-rate calculations.
- The same autosave and error-feedback behavior.
- The same reusable record form or field components where their interactions are equivalent.

They may use different page composition because Today is live-work focused while Calendar is history focused.

### 5.3 Deep links

The navigation contract must support stable destinations for:

- Today.
- A selected Calendar date.
- Reports week/month/platform views.
- Driver settings sections when a direct link is useful.

Reports and AI links to a record must carry the exact date. If the date is invalid or unavailable, Calendar opens safely without creating data.

### 5.4 State persistence

- On a fresh app launch, Calendar starts on today.
- During the same app session, Calendar retains its selected date.
- Selecting a date in another month updates both selected date and visible month.
- Calendar month and Reports month remain independent.
- Reports retains its internal tab only during the same App session; a fresh session
  starts on Weekly according to `REPORTS_SPEC.md`.
- Persistent configuration belongs in `state.settings`; transient view state does not.
- No page may silently choose the nearest working day when the requested day has no record.

## 6. Single Source of Truth

### 6.1 Storage

The current canonical local storage key is:

`driverPayApp.v2`

The current top-level state contains platforms, expense categories, entries, and settings. This Sprint does not change that structure.

### 6.2 Canonical values

Raw values are stored once on the work record. Derived values are calculated, not independently persisted unless a separately approved migration defines a reason.

Canonical calculations:

- Recognized platform income: each platform amount after its configured platform rate.
- Total income: recognized platform income plus tips.
- Total expenses: sum of the record's expense amounts.
- Net income: total income minus total expenses.
- Actual work duration: the canonical duration in milliseconds returned by the shared work-time calculation.
- Average hourly rate: net income divided by actual work hours; zero when duration is zero or invalid.
- Weekly summary: records in a complete Monday-to-Sunday calendar week.
- Monthly summary: records whose local date belongs to the selected calendar month.

The current canonical implementation functions are `entryIncome`, `entryTotal`, `entryExpenses`, `entryNet`, `workMetrics`, `hourlyRate`, and `summarize`. Future refactors may rename them but must leave one shared source.

### 6.3 Data safety

- Do not rename or clear `driverPayApp.v2`.
- Do not change the data model without an approved migration and rollback plan.
- Do not delete or normalize historical user data merely to simplify UI work.
- Input-mode changes must not change the final daily platform total.
- Current storage is browser-local and does not sync across devices.

## 7. Single Component Principle

A user-visible concept should have one reusable component or primitive when it appears in more than one place.

Required examples:

- Work Record Card used by Calendar and any approved record view.
- Shared record fields and validation for Today and Calendar.
- Shared date presentation and date navigation rules.
- Shared calculation selectors for Today, Reports, and AI.
- Shared Design System primitives from `styles/design-system.css`.

Do not create page-specific copies that differ only slightly. A page may compose the same primitive differently, but business semantics, validation, accessibility, and calculations must remain shared.

## 8. Interaction Principles

1. Apply the three-second principle to every primary page.
2. Keep important information and actions within two levels.
3. Prefer safe defaults and automatic saving.
4. Keep high-frequency actions reachable with one hand.
5. Use one clear primary focus and at most one primary CTA per screen.
6. Start with overview, then locate, open, and edit.
7. Prefer direct manipulation over unnecessary dialogs.
8. Give immediate, low-interruption feedback.
9. Keep destructive actions explicit and confirmed.
10. Never rely on color alone to communicate state.
11. Use touch targets of at least 44×44px.
12. Preserve iPhone safe areas and prevent horizontal overflow.
13. Respect `prefers-reduced-motion`.
14. Keep Bottom Navigation stable and predictable.
15. Do not expose implementation terminology or internal field names to users.

## 9. Product Terminology

| Approved term | Meaning | Avoid |
| --- | --- | --- |
| 今天 | Current-day live work and recording page | 首頁 Dashboard |
| 月曆 | Date location and historical record management | Detail、月份明細 as page name |
| 報表 | Weekly, monthly, and platform analysis | 分析 as a separate bottom tab |
| AI | Structured observations and advice | 收入預測、保證 |
| Driver | Persistent personal and app settings | Single-day work data |
| 工作紀錄 | One date's stored work data | Data row、entry |
| 工作紀錄卡片 | Calendar detail area for a selected date | Detail card |
| 總收入 | Recognized platform income plus tips | Gross unless explicitly labelled |
| 淨收入 | Total income minus expenses | Profit guarantee |
| 實際工時 | Elapsed work time minus breaks or canonical manual correction | Online time without definition |
| 平均時薪 | Net income divided by actual work hours | Guaranteed hourly income |
| 直接輸入總額 | Replace the day's platform total | overwrite / total mode |
| 每筆收入累加 | Add one amount to the current platform total | increment / cumulative mode |

## 10. Calendar Product Decisions

- Weeks run Monday through Sunday.
- Calendar and Reports remain separate primary pages.
- A fresh launch selects today; the same session retains the selected date.
- Month arrows are required. Gestures may be added but cannot be the only navigation.
- Optional horizontal swipe on the Work Record Card must have a visible alternative.
- Selecting a date outside the visible month changes the visible month.
- Date cells may show abbreviated net income and a soft, relative income heat indicator.
- Today and selected-date states must remain visually distinct.
- The Work Record Card appears below the calendar without a page jump.
- Editing is explicit; delete is secondary and confirmed.
- Future dates cannot create a record.
- The month overview stays concise and does not show platform logos.
- Work Record Card v1 uses Standard mode. Compact, Full, and Custom modes remain later roadmap work unless separately approved.

## 11. Current State Audit

This audit describes the code at branch base `bf29913` and is not an instruction to fix gaps in this documentation Sprint.

| Area | Status | Evidence and implication |
| --- | --- | --- |
| Five primary pages | Confirmed | `index.html` exposes Today, Calendar, Reports, AI, and Driver; About is secondary. |
| Calendar and Reports separation | Confirmed | Calendar holds month entries; Reports holds week/month/platform panels with independent month state. |
| Reports record mutation | Confirmed compliant | Reports renders summaries and does not directly edit records. |
| AI record mutation | Confirmed compliant | AI renders rule-based analysis and does not write records. |
| Driver single-day data | Confirmed compliant | Driver stores persistent platform, expense, goal, export, and About settings; it does not own a particular day's weather or note. |
| Shared work-time/hourly calculation | Confirmed | `workMetrics()` and `hourlyRate()` are used by summaries and AI. |
| Duplicate income/expense summary logic | Confirmed gap | AI has `analysisPlatformIncome`, `analysisEntryTotal`, `analysisEntryExpenses`, and `analysisSummary` in parallel with canonical entry/summarize functions. |
| Historical edit responsibility | Confirmed gap | Calendar's edit action calls `editEntry()`, which navigates to Today and fills the shared form. Target ownership requires Calendar to own past edits. |
| Today date responsibility | Confirmed gap | Today's date control can select another date and the submit path saves by that date. |
| Future record prevention | Confirmed gap | The date input has no `max` and the submit path has no future-date guard. |
| Calendar date interaction | Confirmed gap | Current Calendar is a month filter plus record list, not a date grid with session-selected date and Work Record Card. |
| Calendar selected-date persistence | Not applicable yet | There is no selected-day Calendar model; only a persisted calendar month exists. |
| Similar field naming | Confirmed risk | Raw platform totals, recognized totals, `entryIncome`, `entryGrossIncome`, and UI “總收入” need a single terminology contract during later refactor. |
| Legacy expense category aliases | Confirmed risk | Slash variants such as `油錢/電費` and `油錢／電費` coexist for backward compatibility. |
| Duplicate UI primitives | Confirmed debt | Existing `.button`, `.panel`, and `.empty` coexist with new `.ds-*` primitives during progressive migration. |
| Historical record shape variation | Suspected | Normalization and compatibility code indicate that older browser data may use earlier optional fields, but no user's live localStorage was inspected in this Sprint. |
| Supabase or cross-device synchronization | Not applicable | Current product has no backend, account, or approved sync layer. |
| Production data integrity | Needs further inspection | Browser-local user data cannot be inspected from repository code; no bulk correction is authorized. |
| iPhone Safari/PWA interaction behavior | Needs further inspection | Automated and desktop checks cannot replace physical-device QA. |

## 12. Roadmap

### V1 — Reliable daily operation

- Stable Today recording and live work controls.
- Configurable platform income input modes.
- Correct shared income, expense, work-time, and report calculations.
- Five-page information architecture.
- Calendar date location and Standard Work Record Card.
- Read-only Reports and rule-based AI.
- Local export and PWA offline baseline.

### V1.5 — Quality and flexibility

- Work Record Card Compact, Full, and Custom display modes.
- Deeper cross-page links.
- Safer local backup/restore.
- Progressive migration to Design System primitives.
- Better automated accessibility and browser coverage.
- Clearer data-quality diagnostics.

### V2 — Approved connected services

- Optional account and cross-device synchronization.
- Conflict resolution and recovery.
- Server-backed backup.
- More advanced AI insights with transparent evidence.

V2 requires separate architecture, privacy, migration, security, and rollback approval. It is not implied by this specification.

## 13. Calendar Implementation Prerequisites

The approved Calendar interaction, state, data, architecture, and acceptance contract is now defined in:

`docs/CALENDAR_SPEC.md`

Implementation must:

1. Follow the selected-date session state and route contract.
2. Enforce Today-versus-Calendar record editing boundaries.
3. Reuse canonical calculations and Design System primitives.
4. Add future-date validation tests.
5. Add Calendar month/date, leap-year, timezone, heat, empty-state, interaction, and accessibility tests.
6. Complete physical iPhone Safari and installed-PWA acceptance checks.

Calendar implementation status (2026-07-25):

- Sprint 4A Read and Navigate implemented.
- Sprint 4A.5 Visual Polish implemented.
- Sprint 4B Record Mutation and Hardening and Calendar Final Regression implemented on their feature branches.
- Product Owner confirmed physical iPhone Safari, installed-PWA, Preview and offline Human QA on 2026-07-25.
- Calendar UX Freeze — Version 1 is active.
- Reports Specification and Current-State Audit completed on 2026-07-26; the next
  implementation increment is Reports Sprint 5B1 — Weekly and Monthly Core.

## 14. Change Control

Changes to page ownership, Bottom Navigation, record creation paths, canonical calculations, localStorage key, or Calendar decisions require:

- An explicit Product Owner decision.
- An approved PRD.
- Updates to this document and both decision logs.
- Migration and rollback planning when stored data is affected.
