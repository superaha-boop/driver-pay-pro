# Driver Pay Pro — Reports Specification

Version: 1.1
Status: Approved implementation specification
Updated: 2026-07-26
Implementation status: Sprint 5B1 and 5B2 implemented; Final Regression and Product Owner L3 Human QA passed; UX Freeze Version 1 active

This document remains the sole primary implementation source and regression
specification for Reports. If it conflicts with a later, explicitly approved PRD, the later PRD wins.
General product, Calendar, design, engineering, and data-safety rules continue to come
from `PRODUCT_SPEC.md`, `CALENDAR_SPEC.md`, `DESIGN_SYSTEM.md`, and `AGENTS.md`.

## Reports UX Freeze — Version 1

Product Owner 已於 2026-07-26 完成 L3 Human QA，且
`docs/FEATURE_FREEZE_CHECKLIST.md` 的 Reports Gate 14/14 Passed。正式凍結
Header、週報／月報／平台 Tabs、Period controls、KPI hierarchy、Comparison
layout、Weekly Trend、Monthly Trend、Important Dates、Platform Ranking、
Unattributed Income、Empty／Loading／Error、Reports → Calendar drill-down、
Reports context restoration、Record-change refresh、Accessibility 與 Responsive。

Freeze 後只接受 Bug、Accessibility、Data Integrity、Security、重大使用障礙與
Production blocker；一般視覺改善與新增功能進入 Backlog。後續 AI 必須重用
本規格已驗證的 period、aggregation、comparison、trend、Important Dates、
platform、persistence、refresh、formatting、state 與 drill-down 基礎，不得
建立另一套 aggregation。

## 1. Purpose

Reports helps drivers compare and understand performance over time. It is a read-only analysis surface. It does not own income, expense, work-time, goal, platform, or record mutation.

Within three seconds, a driver should understand:

- which period is being reviewed;
- the period's total income and net income;
- whether performance improved or declined;
- where to open the exact source date when a record needs inspection or correction.

## 2. User Goals

- Review a complete Monday-to-Sunday week.
- Review a complete Taipei-local calendar month.
- Compare the selected period with the immediately preceding equivalent period.
- Understand income, expenses, net income, work days, work time, and average hourly income through one canonical calculation path.
- See an accessible net-income trend without reading a dense chart.
- Understand platform contribution without implying platform efficiency.
- Open an important date in Calendar without losing the Reports context.
- Continue reading the most recently loaded local data while offline.

## 3. Scope

The first formal Reports implementation includes:

- the fixed tabs `週報`, `月報`, and `平台`;
- session-only report navigation state;
- previous, next, and current-period navigation;
- weekly and monthly canonical KPI summaries;
- prior-period comparisons;
- weekly daily-net trend;
- monthly weekly-net trend;
- important-date links to Calendar;
- platform income ranking, share, period total, and safe comparison;
- empty, loading, error, offline, accessibility, responsive, and performance behavior;
- record-change refresh behavior;
- automated calculation, contract, and navigation tests.

The existing monthly goal progress may remain as secondary supporting information. It must not replace the required KPI, comparison, or trend hierarchy.

## 4. Out of Scope

- Editing or deleting records inside Reports.
- A second record editor or a Reports-only calculation formula.
- AI insights, forecasting, or recommendations.
- Platform efficiency, hourly efficiency by platform, best-platform claims, or inferred platform work time.
- New income, expense, work-time, platform, or Supabase schemas.
- Migration or rewriting existing local data.
- Cross-device synchronization.
- Export redesign.
- Changing the bottom navigation or Calendar interaction model.
- New third-party charting, date, or state-management dependencies.
- Production changes during Sprint 5A.

## 5. Information Architecture

The bottom navigation label remains `報表`. The Reports page contains one segmented tab row:

1. `週報`
2. `月報`
3. `平台`

Fresh App sessions always enter `週報`. Switching tabs during the same App session retains each tab's selected period. Reports stays within two information layers:

- Layer 1: period, primary KPIs, comparison, and trend/ranking.
- Layer 2: an exact Calendar date opened for record inspection or correction.

Reports must not introduce a new detail page between these layers.

## 6. State Model

Reports state is transient runtime state. It is not added to `driverPayApp.v2`.

| Field | Type | Default | Persistence | Responsibility |
| --- | --- | --- | --- | --- |
| `activeReportTab` | `"week" \| "month" \| "platform"` | `"week"` | Current App session only | Visible Reports tab |
| `selectedWeek` | `YYYY-MM-DD` Monday key | Taipei-local current week Monday | Current App session only | Weekly period |
| `selectedMonth` | `YYYY-MM` | Taipei-local current month | Current App session only | Monthly period |
| `selectedPlatformPeriod` | `"week" \| "month"` | `"week"` | Current App session only | Platform period grain |
| `loadingState` | `"idle" \| "loading" \| "ready"` | `"idle"` | Derived | Read lifecycle |
| `errorState` | `null \| ReportReadError` | `null` | Derived | Non-destructive read error |
| `offlineState` | `boolean` | `!navigator.onLine` | Derived | Connectivity message only |
| `currentPeriod` | `ReportPeriod` | Derived | Derived | Selected half-open period |
| `previousPeriod` | `ReportPeriod` | Derived | Derived | Immediately preceding equivalent period |
| `reportRecords` | normalized record array | Derived | Derived | Records within `currentPeriod` |
| `previousRecords` | normalized record array | Derived | Derived | Records within `previousPeriod` |
| `summary` | `ReportSummary` | Derived | Derived | Canonical current-period totals |
| `comparison` | comparison map | Derived | Derived | Safe KPI differences |
| `trendData` | trend point array | Derived | Derived | Accessible net-income trend |
| `platformData` | platform row array | Derived | Derived | Income contribution only |
| `drillDownSource` | `ReportReturnContext \| null` | `null` | Current App session only | Restores Reports context |

The existing legacy settings `lastReportView` and `reportMonth` remain readable for backward compatibility, but the new Reports controller must not use them to override fresh-session defaults or keep writing transient navigation state. Sprint 5B must not delete or migrate those fields.

## 7. Period Definitions and Navigation

All period calculations use local calendar-date keys in `Asia/Taipei`. Date-only arithmetic must reuse Calendar's safe date utilities and must not depend on UTC parsing of bare ISO dates.

### Week

- Starts Monday at 00:00:00 Taipei time.
- Ends at the next Monday at 00:00:00 as a half-open boundary.
- Contains exactly seven local dates.
- `weekStart` is the Monday `YYYY-MM-DD` key.
- `weekEndDisplay` is `weekStart + 6` days.

### Month

- Starts on the first local calendar day of `YYYY-MM`.
- Ends at the first local calendar day of the following month as a half-open boundary.
- Includes every date in the selected calendar month, regardless of record presence.

### Controls

- Previous moves exactly one week or one month backward.
- Next moves exactly one week or one month forward.
- Next is disabled when the resulting period would start after the current Taipei-local week or month.
- `本週` or `本月` returns to the current period.
- A current, incomplete period is valid and clearly presented as current.
- Period labels never shrink to the first or last recorded date.

Cross-month weekly labels use `6/29－7/5`. Cross-year labels include years: `2026/12/28－2027/1/3`.

## 8. Weekly Report

Order:

1. Page title and three-tab switcher.
2. Week label with previous, next, and `本週` controls.
3. Primary KPIs: total income and net income.
4. Secondary KPIs: expenses, work days, work time, average hourly income.
5. Prior-week comparison.
6. Seven-day net-income trend, Monday through Sunday.
7. Important dates with Calendar links.

Weekly behavior:

- The range always displays all seven dates even if there are no records.
- Trend points use daily net income, not gross income.
- Dates with no record and dates with a stored zero result are visually and semantically distinct.
- Important dates may include highest net income, lowest net income among recorded dates, and highest expense.
- The same date must not be repeated merely to fill all important-date slots.
- If fewer than two meaningful recorded dates exist, show only the defensible links.

## 9. Monthly Report

Order:

1. Month label with previous, next, and `本月` controls.
2. Primary KPIs: total income and net income.
3. Secondary KPIs: expenses, work days, work time, average hourly income.
4. Prior-month comparison.
5. Weekly-aggregation net-income trend.
6. Important dates with Calendar links.
7. Existing goal progress, if retained, as secondary content.

Monthly trend uses calendar-week buckets rather than 28–31 daily bars. This produces four to six readable groups on narrow iPhones, reuses the Monday-first date contract, and creates a better accessible text alternative. Edge buckets include only dates inside the selected month; they do not pull adjacent-month values into the selected month's totals.

## 10. Platform Report

The Platform tab contains a compact `本週｜本月` segmented control. The default is
`本週`, as approved by the Sprint 5B2 PRD.

For the selected period it shows:

- recognized platform income total;
- ranked platform income;
- share of recognized platform income;
- comparison with the immediately previous equivalent period when mathematically meaningful.

Platform report rules:

- It measures income contribution only.
- It must be named `平台收入排行`, not platform efficiency.
- It must not claim which platform is best, most efficient, or produces a higher hourly rate.
- Tips are not assigned to a platform and are excluded from platform totals and shares.
- Platform totals therefore do not need to equal total income when tips exist.
- A union of configured platforms and platform keys found in historical records must be considered so deleted or legacy custom-platform income is not silently hidden.
- Historical income is currently keyed by stored platform display name. V1 must not silently merge renamed keys without a separately approved migration or alias contract.
- Zero-value platforms may be omitted from the ranking but remain representable in an accessible empty/zero explanation.
- Negative stored platform income is included in period arithmetic but receives no misleading percentage share; it is shown as signed value with explanatory text.

## 11. Canonical KPI Definitions

Every page must reuse the same canonical functions or selectors. Reports must not copy formulas into renderers.

| KPI | Canonical definition | Unit | Zero/no-data behavior |
| --- | --- | --- | --- |
| Total income | Sum of `entryTotal(record)` | Integer NT$ | Stored record with zero shows `NT$0`; no records shows `—` |
| Expenses | `reportExpenseSummary(records, range)`；allocated categories use derived monthly cost, legacy/one-time categories use original payment | Integer NT$ | Same distinction |
| Net income | Period total income minus the canonical report expense summary | Integer NT$ | Signed values allowed |
| Work days | Count of unique dates where `isWorkDayRecord(record)` is true | Integer days | `0 天` |
| Work time | Sum of canonical `workMetrics(record).durationMs`; each record is derived from integer `workMinutes` | Milliseconds at aggregation boundary | `0 分` |
| Average hourly income | Period net income ÷ period valid work hours | NT$/hour | `NT$0` when duration is zero |
| Platform income | Sum of recognized `platformNetAmount` for that stored platform key | Integer NT$ | No tips included |
| Platform share | Positive platform income ÷ sum of positive recognized platform income | Percentage | Not available when denominator is zero |

Average hourly income is calculated from period totals. It is never the arithmetic average of daily hourly rates. Invalid, open historical timers, non-finite values, and negative duration must follow the canonical work-time normalization contract.

## 12. Comparison Rules

Comparison always uses the immediately preceding equivalent period and the same KPI definition.

`difference = current - previous`

Percentage is shown only when:

- both periods contain relevant records;
- the previous value is finite and greater than zero;
- the current and previous values do not require a misleading sign-crossing interpretation.

Otherwise show an amount-only or textual comparison.

| Situation | Required output |
| --- | --- |
| Both periods have no records | `暫無可比較資料` |
| Previous has no records | `前期無紀錄` |
| Current has no records | `本期無紀錄` |
| Previous value is zero | Signed amount difference; no percentage |
| Positive-to-positive | Signed amount and percentage |
| Negative or sign crossing | Signed amount and plain-language direction; no percentage |
| Duration is zero | Average hourly comparison unavailable; never `Infinity` or `NaN` |

Color is supplementary. Every change includes an arrow or text. For income/net/hours/work days, increase is positive semantics; for expenses, decrease is positive semantics. Neutral changes use neutral color and text.

## 13. Trend Rules

V1 uses semantic DOM rows and CSS bars. It does not use Canvas, SVG-only content, or a third-party chart library.

- Weekly: exactly seven daily net-income points.
- Monthly: four to six Monday-first weekly buckets clipped to the selected month.
- Each row has a visible label, signed formatted value, and screen-reader name.
- Decorative bar tracks are `aria-hidden`.
- Positive and negative values use a visible zero baseline or an equivalent signed layout.
- `無紀錄` is different from `NT$0`.
- Bar scaling uses the largest absolute finite value in the displayed set.
- All-zero data still renders readable text without dividing by zero.
- A negative value is never represented as a positive green bar.
- The trend renderer uses Design System semantic tokens and respects reduced motion.

## 14. Date Drill-Down

Important-date and trend-date interactions open Calendar on the exact date:

```js
window.openCalendar({
  selectedDate: "YYYY-MM-DD",
  source: "reports"
});
```

The interaction must:

- use a real button or link with a 44×44px target;
- state the full date and why it is important;
- open Calendar's existing Work Record Card;
- keep Reports read-only;
- never create, update, or delete a record by navigation alone;
- disable mutation in Calendar for future dates according to Calendar rules.

## 15. Deep Linking and Return Context

Canonical report routes:

- `#reports/week/YYYY-MM-DD`, where the date is the Monday week key;
- `#reports/month/YYYY-MM`;
- `#reports/platform/week/YYYY-MM-DD`;
- `#reports/platform/month/YYYY-MM`.

Existing `#week`, `#month`, `#platform`, `#analysis`, and `#reports/{tab}` routes remain backward compatible and resolve to the appropriate current period.

Before opening Calendar, Reports stores an in-memory `ReportReturnContext`:

```text
tab
selectedWeek
selectedMonth
selectedPlatformPeriod
scrollAnchor
```

Browser Back or the bottom Reports navigation restores this context during the same App session. A direct Calendar deep link has no invented Reports return context. No return context is written to localStorage.

## 16. Empty States

Empty is a valid data state, not an error.

- Weekly: `這一週尚無工作紀錄` with seven-date period still visible.
- Monthly: `這個月尚無工作紀錄`.
- Platform: `這段期間尚無平台收入`.
- Comparison: state-specific copy from Section 12.
- Trend: keep labels; display `無紀錄` rather than fabricated zero values.

Empty states do not include a record editor. When useful, one clear link can open Calendar at the selected valid date or period.

## 17. Loading States

Local data normally resolves immediately. A loading state is still required for a stable future adapter contract:

- retain period header and layout;
- use existing Design System skeleton primitives only when loading lasts long enough to avoid flashing;
- keep previously valid report content visible during a background refresh;
- mark refreshing with a low-interruption status;
- never replace known data with zero while loading.

## 18. Error States

Reports consumes the persistence adapter's explicit read result.

- If the primary payload is invalid and a verified last-valid snapshot is available, show the snapshot and a non-blocking `顯示上次可用資料` message.
- If no valid data can be read, show a clear read error and retry action.
- Errors must not clear, overwrite, normalize back into, or silently save over the primary localStorage payload.
- A renderer exception must be isolated from record persistence.
- No report error is represented as a valid zero result.

## 19. Data Contract

### Stored

- Main data remains under `driverPayApp.v2`.
- Existing entries, platforms, goals, rates, and settings retain their schema except
  the approved optional `expenseAllocations[category] = { months, startMonth }`.
- No Reports summary, comparison, trend, tab, selected period, or return context is stored.

### Normalized input

The read adapter provides:

- validated local date key;
- normalized incomes, tips, expenses, work-time fields, and platform settings;
- canonical handling of legacy/missing fields;
- explicit read status and last-valid fallback information.

### Derived

Pure selectors produce:

- half-open period ranges;
- normalized period records;
- canonical summaries;
- comparison state;
- trend points;
- platform ranking;
- important dates.

### UI-only

Renderers own only focus, expanded explanatory copy, transient loading visibility, and scroll anchor. Renderers never mutate financial records.

Record absence, recorded zero, and invalid data are three different states and must remain distinguishable.

## 20. Dependencies

Reports must reuse:

- Calendar date-only utilities for Monday-first weeks, month arithmetic, and formatting;
- `entryTotal`, `entryExpenses`, `entryNet`, `workMetrics`, `hourlyRate`, `summarize`, and `isWorkDayRecord`;
- platform recognized-income helpers;
- `money`, numeric, duration, and date formatters;
- the verified local persistence adapter;
- `window.openCalendar` and exact Calendar date deep links;
- `styles/design-system.css` tokens and `.ds-*` primitives;
- the existing App Shell, Lucide icons, bottom navigation, and safe-area rules.

Reports must not depend on AI aggregation helpers. AI and Reports should eventually consume the same extracted canonical selectors rather than call each other's renderers.

## 21. Formatting Rules

- Currency: integer NT$, localized thousands separators, explicit minus sign.
- KPI no-data: `—`; recorded zero: `NT$0`.
- Work time under one hour: `X 分`; one hour or more: `X 小時 Y 分`.
- Average hourly: integer `NT$X／小時`; zero duration: `NT$0／小時`.
- Percentage: at most one decimal place.
- Week labels: omit year only when both dates are in the same displayed year and context is unambiguous.
- Month labels: `2026 年 7 月`.
- Numeric KPI content uses tabular numerals.
- No `Infinity`, `NaN`, raw milliseconds, technical state names, or English metric labels appear in the UI.

## 22. Accessibility

- The report switcher uses `role="tablist"`, each control uses `role="tab"` and `aria-selected`, and panels use linked `role="tabpanel"`.
- Arrow-key tab navigation follows the standard horizontal tab pattern.
- All controls meet 44×44px touch targets and show focus.
- Period controls have explicit labels including their destination period.
- Trends include visible values and accessible text; bars are never the only information source.
- Comparison direction is conveyed by text/icon as well as color.
- Tables include caption/header semantics and remain readable without horizontal scrolling at 375px.
- Dynamic tab, period, loading, error, and restored-data changes use a restrained live region.
- Reduced-motion preferences disable nonessential bar transitions.

## 23. Responsive Rules

Primary targets:

1. iPhone Safari at 375px, 390px, 393px, and 430px.
2. Installed iPhone PWA.
3. Other mobile sizes.
4. Tablet and desktop.

Requirements:

- no document-level horizontal overflow;
- bottom navigation never covers the final report item;
- tab labels remain one line;
- period label and controls do not collide;
- primary KPIs remain dominant without a KPI-card wall;
- secondary KPIs can reflow without truncating currency or duration;
- platform rows use flexible name and fixed numeric columns;
- long custom platform names truncate accessibly or wrap within their row, never push content off-screen;
- dynamic type does not hide a control or critical value.

## 24. Performance

- Aggregate each visible current/previous period once per data revision.
- Build date-indexed normalized records once, then reuse them across weekly, monthly, and platform selectors.
- Render at most 7 weekly trend points, 6 monthly trend buckets, and the actual platform count.
- Avoid repeated full-state scans inside each row.
- No layout measurement loop or chart dependency.
- Record-change refresh is debounced/coalesced per committed mutation, not per keystroke.
- Period/tab changes must not write financial data or trigger service-worker updates.

## 25. Offline Behavior

Reports remains fully usable from locally stored data while offline.

- Show an unobtrusive offline status.
- Period navigation, comparisons, trends, platform ranking, and Calendar deep links continue locally.
- Do not claim cloud sync or cross-device freshness.
- If no valid local payload exists, show the read error rather than an online login action.
- Service Worker and App Shell behavior remain unchanged unless a later implementation changes shipped assets and deliberately bumps the cache.

## 26. Edge Cases and Expected Behavior

| # | Edge case | Calculation behavior | UI behavior | Required test |
| --- | --- | --- | --- | --- |
| 1 | No records in selected week | Empty record set | Full seven-day label and weekly empty state | Unit + DOM |
| 2 | No records in selected month | Empty record set | Full month and monthly empty state | Unit + DOM |
| 3 | Stored record with all zero values | Counts as stored record; sums zero | `NT$0`, distinct from `無紀錄` | Unit |
| 4 | Income only | Total/net equal income | Valid KPIs | Unit |
| 5 | Expense only | Total zero, net negative | Signed net and expense | Unit |
| 6 | Expense exceeds income | Negative net retained | Negative semantics, no clipping | Unit + visual |
| 7 | Zero work duration with income | Average hourly returns zero | Never Infinity/NaN | Unit |
| 8 | Open historical timer | Canonical normalization rejects live growth | Show stable valid duration or zero | Regression |
| 9 | Cross-midnight shift | End adjusted by one local day, break deducted | Correct duration | Unit |
| 10 | Break exceeds elapsed time | Canonical duration floors safely at zero | No negative hours | Unit |
| 11 | Invalid time string | Invalid duration excluded | Other financial data remains visible | Unit |
| 12 | Duplicate date records | Current model's one-entry-per-date normalization wins | No double counting | Unit |
| 13 | Monday date | Week starts that date | Monday first | Unit |
| 14 | Sunday date | Belongs to preceding Monday week | Same seven-day label | Unit |
| 15 | Cross-month week | Seven dates retained | `6/29－7/5` | Unit |
| 16 | Cross-year week | Seven dates retained | Both years displayed | Unit |
| 17 | Leap-year February | Calendar month has 29 dates | Correct month trend buckets | Unit |
| 18 | Current incomplete week | Only recorded elapsed dates aggregate | Still displays through Sunday | Unit + DOM |
| 19 | Previous period has no records | No percentage | `前期無紀錄` | Unit + DOM |
| 20 | Previous value is zero | Amount difference only | No infinite percentage | Unit |
| 21 | Current period has no records | Comparison unavailable | `本期無紀錄` | Unit + DOM |
| 22 | Negative comparison baseline | No misleading percentage | Signed amount and text | Unit |
| 23 | All trend values zero | Scale does not divide by zero | Readable zero rows | Unit + DOM |
| 24 | Mixed positive/negative trend | Scale by maximum absolute value | Clear zero baseline and signs | Unit + visual |
| 25 | Tips present | Included in total, excluded from platform total | Explain reconciliation difference | Unit |
| 26 | Deleted custom platform in history | Historical key remains aggregated | Row remains visible | Unit |
| 27 | Renamed custom platform | Stored names remain separate absent alias contract | No silent merge | Unit |
| 28 | Long custom platform name | Arithmetic unaffected | No page overflow; accessible name | DOM + visual |
| 29 | Corrupt primary local payload with valid fallback | Use verified last-valid snapshot | Non-blocking restored-data message | Integration |
| 30 | Corrupt payload without fallback | No fabricated summary | Error and retry | Integration |
| 31 | Offline reload | Use local payload | Offline status; reports available | PWA |
| 32 | Calendar mutation while Reports exists | Recompute once after committed mutation | Returning Reports shows new values | Integration |
| 33 | Calendar navigation without mutation | No data revision | Reports values unchanged | Integration |
| 34 | Future period navigation | Do not create/select a future report period | Next disabled at current period | Unit + DOM |
| 35 | Bare ISO date under non-Taipei test timezone | Date-only utility remains stable | No date shifts | Unit in multiple TZs |

## 27. Implementation Architecture

Recommended structure within the existing no-build architecture:

```text
Canonical record calculations
        ↓
Date-indexed normalized read model
        ↓
Pure Reports selectors
  ├─ period selectors
  ├─ summary selector
  ├─ comparison selector
  ├─ trend selector
  ├─ platform selector
  └─ important-date selector
        ↓
Reports controller / transient state
        ↓
Weekly, Monthly, Platform renderers
        ↓
Calendar date navigation adapter
```

Required pure functions or equivalent selectors:

- `getReportWeekPeriod(dateKey)`
- `getReportMonthPeriod(monthKey)`
- `recordsInPeriod(records, period)`
- `aggregateReportPeriod(records)`
- `compareReportMetric(current, previous, options)`
- `buildWeeklyNetTrend(records, period)`
- `buildMonthlyWeeklyNetTrend(records, period)`
- `buildPlatformIncomeRows(records, configuredPlatforms)`
- `findImportantReportDates(records)`
- `parseReportRoute(hash)` and `formatReportRoute(state)`

Renderers consume prepared view models and do not calculate raw totals.

### Record-change notification

The implementation introduces one lightweight in-memory notification after a successful committed record mutation, for example `driverpay:recordchange` with the affected date. Today, Calendar, Reports, and AI may subscribe or use a single centralized refresh coordinator. Failed drafts and simple Calendar navigation emit nothing.

### Implemented Sprint sequence

The approved implementation was delivered in two increments:

- **Sprint 5B1 — Weekly and Monthly Core:** transient state, periods, canonical aggregation, comparisons, accessible trends, empty/error/loading states, and tests.
- **Sprint 5B2 — Platform, Drill-Down, and Hardening:** platform segmented period, ranking/share/comparison, exact-date links and return context, record-change notification, full responsive/PWA regression.

Both increments leave existing Reports usable and do not ship a second formula path.

## 28. Testing Strategy

Automated:

- pure period tests in `TZ=Asia/Taipei` and at least one non-Taipei environment;
- canonical fixture tests for weekly/monthly KPIs;
- comparison state matrix;
- trend empty/zero/negative scaling;
- platform tips, legacy, deleted, and custom-name cases;
- route parsing and exact Calendar date linking;
- record-change one-commit/one-refresh behavior;
- localStorage fallback/error behavior;
- DOM contracts for tabs, touch targets, focus, accessible trend text, and no mutation controls;
- existing Calendar, navigation, reporting, PWA, and design-system regression suites.

Manual:

- 375px, 390px, 393px, and 430px browsers;
- iPhone Safari and installed PWA;
- VoiceOver reading order and control names;
- dynamic type;
- offline reload;
- Back navigation after a Calendar drill-down;
- no horizontal overflow;
- bottom navigation safe area;
- Console free of errors and warnings.

Sprint 5A itself validates documentation contracts only and does not claim iPhone UI validation.

## 29. Acceptance Criteria

- Reports has the fixed weekly, monthly, and platform tabs.
- A fresh session defaults to weekly; same-session state is retained without durable storage.
- Weekly periods are complete Taipei-local Monday-to-Sunday ranges.
- Monthly periods are complete Taipei-local calendar months.
- Previous, next, and current controls use deterministic period arithmetic.
- Weekly/monthly KPIs use canonical total, expense, net, work-day, work-time, and hourly selectors.
- Average hourly income is period net divided by period valid work hours.
- Comparisons never display Infinity, NaN, or misleading percentages.
- Weekly trend uses seven daily net values.
- Monthly trend uses readable weekly net buckets.
- Platform report describes contribution, not efficiency.
- Tips and platform totals have an explicit reconciliation contract.
- Important dates open the exact Calendar date.
- Browser Back restores Reports context in the same session.
- Reports contains no record mutation UI.
- Empty, loading, error, restored-data, and offline states are distinct.
- No report transient state is added to `driverPayApp.v2`.
- Existing local records and schema remain unchanged.
- UI uses Design System primitives, Lucide icons, 44px targets, and accessible tab/chart semantics.
- 375px–430px layouts have no page-level horizontal overflow.
- Record mutations refresh Reports once; navigation alone changes nothing.
- All automated and applicable manual checks pass before implementation release.

## 30. Current Reports Audit

Audit baseline:

- Branch base: `codex/calendar-final-regression-20260725`
- Commit: `2c8b30fb588e2a262a69b24e82f548a3b253d639`
- Main implementation: `index.html`
- Audit date: 2026-07-26
- Baseline tests: 52/52 passing

Status vocabulary:

- `Confirmed`: directly verified in code/tests.
- `Suspected`: evidence exists but needs implementation-time proof.
- `Not present`: required behavior does not exist.
- `Needs further inspection`: cannot be reliably concluded from current static audit.

| # | Audit question | Status | Evidence and conclusion |
| --- | --- | --- | --- |
| 1 | Where is Reports implemented? | Confirmed | Weekly, monthly, and platform DOM, state, aggregation, and renderers are all in `index.html`. |
| 2 | Which tabs exist? | Confirmed | `週報`, `月報`, and `平台` exist through `data-report-view`. |
| 3 | What is the week definition? | Confirmed | Shared `weekStart`/`weekEnd` use Monday-first date-only arithmetic. |
| 4 | Which weekly KPIs exist? | Confirmed | Total, expenses, net, work hours, and average hourly are rendered; work days are missing. |
| 5 | Does prior-period comparison exist? | Not present | No weekly or monthly comparison selector or UI exists. |
| 6 | Does an income trend exist? | Confirmed | Monthly daily gross-income bars exist; weekly trend is absent and the metric is not required daily net. |
| 7 | Does platform ranking exist? | Confirmed | Monthly platform income ranking, share, total, and daily-average table exist. |
| 8 | Is platform ranking mislabeled as efficiency? | Confirmed | Current heading is correctly `平台收入排行`; however `每日平均` is an ambiguous unsupported metric. |
| 9 | Can Reports mutate records? | Confirmed | No mutation control is present in Reports. |
| 10 | Is Reports state separate from Calendar? | Confirmed | `reportMonth`/`lastReportView` and Calendar runtime state are separate, but Reports state is durably persisted. |
| 11 | Are canonical calculations reused? | Confirmed | Weekly/monthly use `summarize`, `entryTotal`, `entryExpenses`, `entryNet`, and `workMetrics`; platform uses recognized-income helpers. |
| 12 | Is report aggregation centralized outside renderers? | Not present | Period selection and aggregation remain embedded in `renderWeeks`, `renderMonthSummary`, `renderDailyBars`, and `renderPlatformAnalysis`. |
| 13 | Are Report dates timezone-safe? | Confirmed | Report week/month selection uses date-key utilities and prefix filtering; future implementation must keep this path. |
| 14 | Are deep links complete? | Not present | Tab hashes exist and Calendar accepts exact dates, but Reports has no period route, exact-date interaction, or return context. |
| 15 | Are empty/loading/error states distinct? | Not present | Per-tab empty copy exists; explicit loading, read-error, restored-data, and retry states do not. |
| 16 | Does Reports use the Design System? | Suspected | It inherits some variables but relies on legacy `.panel`, `.week-item`, `.bars`, and hard-coded presentation instead of `.ds-*` primitives. |
| 17 | Is Reports accessible? | Suspected | Labels and visible values exist, but the switcher lacks tab semantics, chart alternatives are incomplete, and some targets are 40px. |
| 18 | Is mobile responsiveness covered? | Confirmed | Existing CSS and prior navigation regressions cover basic mobile layout; there is no dedicated Reports 375–430px automated matrix. |
| 19 | Which tests protect Reports? | Confirmed | `reporting.test.js`, `navigation.test.js`, and `calendar-regression.test.js` cover weeks, canonical calculations, routes, titles, empty copy, and some renderer contracts. |
| 20 | Is any aggregation duplicated elsewhere? | Confirmed | AI defines `analysisEntryTotal`, `analysisEntryExpenses`, `analysisSummary`, and platform aggregators, creating divergence risk already tracked as technical debt. |

### Root Findings

1. The current week arithmetic is sound, but the weekly UI is a list of data-bearing weeks selected through a month, not a single complete selected week with comparison/trend.
2. Current Reports transient choices are written into durable settings, so a fresh session can reopen an old tab/month.
3. Weekly/monthly canonical math is mostly reused; report-specific aggregation and selection are still coupled to rendering.
4. The monthly chart measures daily gross income, while the approved comparison surface requires net income.
5. Platform ranking is useful and correctly named, but `每日平均` divides by all stored dates and does not express a defensible platform-performance metric.
6. Calendar already supplies exact-date navigation and safe date arithmetic, but Reports does not yet use them for drill-down.
7. Reports refresh depends on direct render calls from multiple flows rather than a reusable committed-record notification.
8. Historical platform entries are keyed by display name, so aliasing renamed platforms cannot be solved safely in UI rendering alone.

### Freeze Boundary for Sprint 5A

This audit does not authorize changing `index.html`, `styles/design-system.css`, `sw.js`, `manifest.webmanifest`, localStorage data, Calendar code, or production behavior. All implementation findings are inputs to Sprint 5B1/5B2.
