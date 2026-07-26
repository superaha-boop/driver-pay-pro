# Driver Pay Pro — AI and Driver V1 Current-State Audit

Status: Phase 1 Passed  
Audit date: 2026-07-26  
Program branch: `codex/v1-completion-program-20260726`

## Audit scope

This audit records the implementation that existed before the Local-first V1 completion work.
It is intentionally descriptive: Phase 1 does not change product behavior, the WorkRecord
schema, or `driverPayApp.v2`.

## AI current state

### Existing UI

The AI view is implemented in `index.html` under `#view-ai`. It currently renders:

1. `今日建議`
2. `本月洞察`
3. `平台表現`
4. `智慧提醒`

The fourth top-level card, `平台表現`, overlaps with the responsibility of the frozen Reports
platform view. The approved V1 responsibility has three primary sections: `營運建議`,
`本月洞察`, and `智慧提醒`.

### Existing data flow

The AI view reads the in-memory `state.entries` collection loaded from `driverPayApp.v2`.
It is read-only and does not create, edit, or delete WorkRecord data. It refreshes through
`renderAll()`, Today refresh paths, and income refresh paths.

The current AI implementation has a separate calculation stack:

- `analysisPlatformRate()`
- `analysisPlatformIncome()`
- `analysisEntryTotal()`
- `analysisEntryExpenses()`
- `analysisSummary()`
- `analysisPlatformRows()`
- `bestIncomeDay()`
- `bestIncomeShift()`
- `recentRisingPlatform()`
- `hasRecentIncomeDecline()`
- `buildAiAnalysisContext()`
- `buildTodayAdvice()`
- `buildSmartAlerts()`

This stack independently calculates platform income, total income, expenses, net income,
work duration, average hourly income, platform shares, recent trends, and date sequences.
It also defines its own current-month filtering by matching a `YYYY-MM` prefix.

### TD-006 actual cause

TD-006 is caused by the AI calculation stack above running beside the canonical Reports
calculation stack:

- Period utilities
- `aggregateReport()`
- `compareReportPeriods()`
- `buildWeeklyNetTrend()`
- `buildMonthlyWeeklyNetTrend()`
- `findImportantReportDates()`
- `normalizePlatformKey()`
- `aggregatePlatformIncome()`

Both stacks ultimately read the same WorkRecord data, but they do not share a single
aggregation result. A future formula, alias, invalid-data, duration, or period-boundary change
could therefore update Reports without updating AI. This can produce different net income,
average hourly income, platform totals, or date selection for the same records.

### Existing strengths to preserve

- AI is local and read-only.
- No external AI service, API key, authentication, or network data source is present.
- The existing UI already has clear empty-state copy.
- Suggestions are rules-based and grounded in recorded income, work time, expenses, goals,
  mileage, and platform data.
- Formatting helpers such as `money()`, duration formatting, and local date-only utilities
  already exist.

### Required minimum correction

- Remove the duplicate AI aggregation path.
- Build AI insight candidates from canonical Reports period and aggregate results.
- Reuse canonical important-date, platform, comparison, formatting, persistence-read, and
  committed-record refresh behavior.
- Keep AI read-only and evidence based.
- Consolidate the view to the three approved primary sections.
- Add explicit loading, empty, error, and offline-safe presentation without clearing stored data.
- Do not change frozen Reports outputs to accommodate AI.

## Driver current state

### Existing UI

The Driver view is implemented in `index.html` under `#view-settings`. It currently contains:

- 快捷支出設定
- 平台設定
- 支出類別與目標
- CSV export
- 關於 Driver Pay Pro

The page begins with a placeholder note saying that Driver Space will be developed later.
The view is not empty, but its primary responsibility and local-first status are not explained.

### Existing setting sources

Driver uses the same `state.settings` object persisted within `driverPayApp.v2`.
Relevant existing values include:

- `state.settings.dailyGoal`
- `state.settings.monthlyGoal`
- platform profiles and input modes
- platform rates
- expense shortcuts

Today reads `state.settings.dailyGoal`; therefore Driver must continue editing this exact value.
No second goal store or parallel preference object is needed.

The current goal form exposes `#dailyGoal` and `#monthlyGoal`, then saves both from the
`#saveGoal` click handler. The user must press a manual save button. This is the primary
Driver V1 interaction gap for the existing daily goal.

### Existing persistence behavior

`saveState()` is the shared persistence boundary. It writes `driverPayApp.v2`, verifies the
write, and preserves a last-known-valid copy for recovery. Driver should reuse this function
and its failure handling rather than adding a second storage mechanism.

### Existing risks and gaps

- The daily target is buried inside a combined legacy panel and requires manual save.
- Driver does not summarize local record count or record date coverage.
- Driver does not clearly state that data stays in this browser/device and does not sync.
- Driver does not expose online/offline, installed PWA, or storage-read health in one place.
- The current placeholder note makes a working settings page appear unfinished.
- Platform and expense chips include per-item removal actions. These are existing scoped
  settings operations, not a global reset. V1 must not add a delete-all, reset-all, or
  destructive data-management action.

### Required minimum correction

- Establish Driver as the owner of durable local settings and App/data status.
- Move the existing daily goal into a clear direct-edit, auto-save control that still writes
  `state.settings.dailyGoal`.
- Add derived local data status without persisting new metadata.
- Add App status derived from runtime state without adding schema fields.
- Explain local-only storage and the absence of cross-device sync.
- Preserve the existing platform, expense, export, and About functionality.
- Do not add cloud backup, authentication, sync, schema migrations, or new preference fields.

## Shared data layer inventory

The following stable foundations are available and must be reused:

| Foundation | Current responsibility | V1 reuse |
| --- | --- | --- |
| `loadState()` / `saveState()` | Read and verified local persistence | AI read status and Driver autosave |
| Date-only period utilities | Taipei-local week/month boundaries | AI periods and labels |
| `aggregateReport()` | Canonical income, expense, net, duration, hourly metrics | AI evidence |
| `compareReportPeriods()` | Safe prior-period comparison states | AI change interpretation |
| Weekly/monthly trend builders | Canonical trend points | AI trend candidates |
| `findImportantReportDates()` | Canonical important-day selection | AI evidence and Calendar links |
| `normalizePlatformKey()` | Approved platform aliases | AI platform interpretation |
| `aggregatePlatformIncome()` | Canonical platform totals and shares | AI platform evidence |
| `driverpay:recordchange` | Committed-record refresh notification | Reports and AI refresh |
| `money()` / number helpers | Amount display | AI and Driver display |
| `formatReportDuration()` | Duration display | AI display |
| Reports → Calendar adapter | Exact-date read-only drill-down | AI exact-date navigation |

## Items that must not be rewritten

- WorkRecord storage shape
- `driverPayApp.v2`
- Work duration normalization
- income, expense, net income, and average hourly income formulas
- Monday-first Taipei period utilities
- Calendar or Reports renderers
- platform alias and attribution rules
- record mutation/editor flows
- Service Worker registration and PWA architecture

## Minimum implementation boundary

The safest implementation remains inside the existing static PWA:

1. Introduce one small shared analytics facade over the existing canonical functions.
2. Rebuild only the AI context and insight selection on that facade.
3. Improve only the Driver top-level responsibility, daily-goal interaction, and derived status.
4. Keep all existing write paths on `saveState()`.
5. Add targeted AI, Driver, and integration regression tests.
6. Update the App Shell cache once after product implementation is stable.

No framework, dependency, TypeScript migration, external AI API, backend, or schema migration
is justified for Local-first V1.

