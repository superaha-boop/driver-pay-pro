# Driver Pay Pro — Calendar Interaction and Implementation Specification

Version: 1.2

Status: Approved implementation specification

Updated: 2026-08-04

Implementation status: Calendar V1 implemented and UX frozen；V1.1 display-size
typography candidate awaiting Progressive Disclosure and Display Size Human QA

> This document is the primary implementation source for the Calendar redesign. It defines target behavior and records current repository constraints. It does not authorize changes outside an approved Calendar Implementation Sprint.

## 1. Purpose

Calendar helps a driver quickly locate a date, understand whether work was recorded, view that date's complete result, and safely backfill or correct a past work record.

Calendar answers:

1. Which days have work records?
2. Approximately how much net income did each recorded day produce?
3. What is the complete record for the selected date?
4. How can the driver backfill or correct that date?

## 2. User Goals

- Find a date in under three seconds.
- Distinguish recorded, empty, today, selected, and future dates.
- Read a useful daily summary without leaving Calendar.
- Backfill a past day without selecting the date again.
- Correct an existing record through the same Record Editor contract used elsewhere.
- Trust that Calendar, Today, Reports, and AI show the same calculations.

## 3. Scope

The first Calendar implementation includes:

- Monday-first month grid.
- Previous month, next month, and Today controls.
- Session-only selected date and displayed month.
- Adjacent-month date cells.
- Net-income abbreviations and four-level relative heat.
- Distinct Today and Selected states.
- Standard Work Record Card.
- Today, past, future, empty, loading, error, and offline states.
- Past-record creation, editing, and confirmed deletion through one reusable Record Editor.
- Month and day swipe enhancements with visible alternatives.
- Accessibility, responsive, local-first, and regression coverage.
- Compact monthly net-income and work-day summary.

## 4. Out of Scope

- Live start, pause, resume, or end-work controls.
- Weekly, monthly, platform, or AI analysis.
- Platform logos or brand colors.
- Work Record Card Compact, Full, or Custom modes.
- Year/month picker in the first version.
- Third-party Calendar libraries or new dependencies.
- New record schema, localStorage key, Supabase, account, or synchronization.
- Detailed multi-session timeline.
- Reports, Today, AI, Driver, or Bottom Navigation redesign.
- Production code changes in this specification Sprint.

## 5. Page Information Architecture

Fixed vertical order:

1. Page Header: `月曆`.
2. Month Navigation: previous, `YYYY 年 M 月`, next, Today.
3. Weekday Header: 一、二、三、四、五、六、日.
4. Month Grid.
5. Selected Day Work Record Card.
6. Compact Monthly Summary.
7. Bottom Navigation safe-area spacing.

Rules:

- Month Grid and Work Record Card are adjacent.
- Monthly Summary never separates the grid from the selected date.
- Do not add a large KPI area above the calendar.
- Use one Calendar surface; do not make seven columns of independent cards.
- Do not place nested cards inside the Work Record Card.

### Display-size typography contract

- Month title: 18／20／22px.
- Weekday: 12／14／16px.
- Date: 14／16／20px.
- Today button: 16／17／20px.
- Work Record Card body: 14／17／22px；secondary: 12／15／19px.
- Today circle: 34／36／40px.
- Values correspond to standard／comfort／large and must be verified by computed
  style. Mobile media queries must not make a larger mode smaller.
- All seven dates in a row share the same marker slot and center; touch cells remain
  at least 44px and the seven-column grid must not horizontally overflow.

## 6. Calendar State Model

Calendar state is session UI state, not stored record data.

```text
CalendarState {
  displayedMonth: "YYYY-MM",
  selectedDate: "YYYY-MM-DD",
  today: "YYYY-MM-DD",
  recordsForDisplayedMonth: WorkRecord[],
  selectedDateRecord: WorkRecord | null,
  loadStatus: "idle" | "loading" | "ready" | "error",
  saveStatus: "idle" | "saving" | "saved" | "offline" | "error",
  error: CalendarError | null,
  offline: boolean,
  gesture: "idle" | "tracking-month" | "tracking-day" | "cancelled",
  monthTransition: "idle" | "previous" | "next",
  editor: "closed" | "creating" | "editing"
}
```

### 6.1 Initial and session behavior

- Normal fresh launch: `today = Taipei local today`, `selectedDate = today`, `displayedMonth = month(today)`.
- Returning to Calendar in the same document/app session retains `selectedDate` and `displayedMonth`.
- Browser reload, PWA termination, or a new document session resets normal entry to today.
- Do not persist `selectedDate` in `driverPayApp.v2`, sessionStorage, IndexedDB, URL history restoration, or another durable store.
- Do not select the closest recorded day when today is empty.
- A valid explicit deep link such as `#calendar/2026-07-24` is an intentional exception to the normal today default; it selects that exact date without creating data.

### 6.2 displayedMonth

- Represents only the month currently shown by the grid.
- It may temporarily differ from `month(selectedDate)` after an arrow or month swipe.
- It changes when the user uses month navigation or selects/swipes to a date in another month.
- Current persisted `settings.calendarMonth` is legacy UI state and must not control fresh Calendar selection in the new implementation. Preserve the stored field for backward compatibility unless a separately approved migration removes it.

### 6.3 selectedDate

- Represents the date shown by the Work Record Card.
- Month-only navigation does not silently change it.
- If it is outside `displayedMonth`, the grid has no selected cell.
- The card remains on that date and adds a quiet secondary label: `所選日期不在目前月份`.
- Selecting a grid date or swiping the card updates it.

### 6.4 today refresh

Recompute Taipei-local today:

- Every time Calendar becomes active.
- On `pageshow`.
- When `visibilitychange` becomes visible.
- On window focus.
- At the next Taipei-local midnight while the app remains open.

If today changes:

- Refresh Today indicators and future-date eligibility.
- Update the Today button destination.
- Do not silently replace `selectedDate` or `displayedMonth`.
- Re-evaluate the selected card's empty/future state.

### 6.5 Derived state

- `recordsForDisplayedMonth` comes from valid entries whose date key starts with `displayedMonth`.
- `selectedDateRecord` is the one valid entry matching `selectedDate`, otherwise `null`.
- These values are recomputed after record mutation; they are not persisted separately.

## 7. Month Navigation

Required controls:

- Previous-month IconButton, minimum 44×44px, `aria-label="上一個月"`.
- Next-month IconButton, minimum 44×44px, `aria-label="下一個月"`.
- Visible month label, not interactive in v1.
- Ghost/Text button `今天`, minimum 44px height.
- Horizontal month swipe enhancement.

Behavior:

- Previous/next changes `displayedMonth` by exactly one calendar month.
- It does not modify `selectedDate`.
- If the selected date is outside the new month, no cell shows Selected.
- The Work Record Card remains unchanged and exposes the out-of-month label.
- Today sets `today`, `selectedDate`, and `displayedMonth` to current Taipei today/month and refreshes the card.
- No month change selects a nearest work day.
- Rapid repeated requests are serialized; only the final valid month state renders.
- Month label does not open a picker in v1.

## 8. Date Selection

Selecting a date:

1. Validate the date-only key.
2. Set `selectedDate`.
3. If it belongs to another month, set `displayedMonth` to that month.
4. Update Selected and Today states.
5. Resolve `selectedDateRecord`.
6. Update the Work Record Card and monthly summary if needed.
7. Do not navigate away, open a modal, enter edit mode, or create data.

Auto-scroll:

- Only when the entire Work Record Card header is outside the usable viewport.
- Use the minimum `block: "nearest"` movement needed to reveal the header.
- Do not auto-scroll when any part of the card header is visible.
- Use instant movement under reduced motion.

Keyboard:

- One roving `tabindex="0"` date at a time.
- Arrow Left/Right moves focus by one day.
- Arrow Up/Down moves focus by seven days.
- Crossing a month changes the displayed month for focus visibility but does not select until Enter or Space.
- Enter/Space selects the focused date.
- Focus and Selected remain independent.

## 9. Date Cell Presentation

Month generation:

- Monday-first, seven equal columns.
- Render a minimum of five and maximum of six rows.
- Fill leading and trailing positions with adjacent-month dates.
- Use flat cells without individual shadows or permanent heavy borders.

Cell content:

- Line 1: day number.
- Line 2: abbreviated net income, `—`, or nothing.
- No `NT$` in cells.
- Use tabular numerals and one line per value.
- Full values remain in the Work Record Card and accessibility label.

Net-income abbreviation:

```text
no record        → ""
record net = 0   → "—"
abs 0–999        → integer with sign, e.g. 580 or -580
abs 1,000–9,999  → one decimal k, removing trailing .0, e.g. 1.6k or -1.2k
abs >= 10,000    → nearest integer k, e.g. 12k or -12k
invalid value    → "—" and data-quality error metadata
```

Formatting is display-only and is never written to storage.

## 10. Date Cell State Matrix

Selected has visual priority over Today, which has priority over Heat.

| State | Date text | Amount text | Background | Border | Today indicator | Selected indicator | Contrast | Clickable | Can create | Accessible label | `aria-selected` | Disabled semantics |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| General current-month | Primary | None | Transparent | None | None | None | Normal | Yes | Only if past and empty | Full date, no record | `false` | Not disabled |
| Today | Brand/contrast | Record rule | Heat/transparent | None | 32–34px outlined circle in shared day slot | None | Strong | Yes | No; Today empty links to Today | Full date, today, record/net state | `false` unless selected | `aria-current=date` |
| Selected | Primary | Record rule | Brand-soft | Thin selected | If also today | Border + surface | Strong | Yes | Permission by date | Full date, selected, record/net state | `true` | Not disabled |
| Today + Selected | Inverse in day circle | Record rule | Transparent or extremely quiet surface | None | 32–34px solid brand circle in shared day slot | Solid day circle | Strong | Yes | No; Today rule | Full date, today, selected, record/net | `true` | `aria-current=date` |
| Recorded + positive net | Primary | Compact positive | Heat 1–4 | None | If today | If selected | Normal | Yes | No; edit existing | Full date, record exists, full net | By selection | Not disabled |
| Recorded + zero net | Primary | `—` | Transparent | None | If today | If selected | Normal | Yes | No; edit existing | Full date, record exists, net zero | By selection | Not disabled |
| Recorded + negative net | Primary | Signed compact | Transparent | None | If today | If selected | Normal | Yes | No; edit existing | Full date, record exists, negative full net | By selection | Not disabled |
| No record | Primary | None | Transparent | None | If today | If selected | Normal | Yes | Yes only if past | Full date, no work record | By selection | Not disabled |
| Future | Tertiary readable | None | Transparent/muted | None | If it becomes today | If selected | AA-readable | Yes | Never | Full date, future date, no record | By selection | Not disabled; action permission is read-only |
| Selected + Future | Primary readable | None | Muted selected | Thin selected | No | Border + surface | AA-readable | Yes | Never | Full date, selected, future date | `true` | Not disabled; create omitted |
| Adjacent month | Secondary | Record rule if nonfuture | Heat/transparent | None | If today | If selected after switch | AA-readable | Yes | By actual date | Full date including month and record state | By selection | Not disabled |
| Loading | Placeholder | Placeholder | Muted stable | None | None | None | Non-text skeleton | No | No | Month data loading | `false` | `aria-busy=true`, `aria-disabled=true` |
| Disabled/invalid | Disabled | None | Muted | None | None | None | Disabled token | No | No | Invalid date unavailable | `false` | `aria-disabled=true`; handler blocked |
| Selected + Heat | Primary | Compact positive | Selected wins | Thin selected | If today | Border + surface | Strong | Yes | No; edit existing | Full date, selected, record, full net | `true` | Not disabled |
| Today + Heat | Brand/contrast | Compact positive | Heat retained | None | 32–34px outlined circle in shared day slot | None unless selected | Strong | Yes | No; Today rule | Full date, today, record, full net | By selection | `aria-current=date` |

Date cells must not use red for future, zero, negative, or missing records. Negative net is factual data, not a validation error.

## 11. Income Heatmap

Heat represents relative positive net income among valid recorded days in the displayed month.

Eligible distribution:

- Valid work record.
- Valid finite `entryNet(record) > 0`.
- Date is not in the future.

Excluded from heat:

- Missing records.
- Zero or negative net.
- Invalid or missing net.
- Future dates.

### 11.1 Four-level calculation

For four or more eligible days:

1. Sort positive net amounts ascending.
2. Give equal values the same average ordinal percentile: `(first one-based rank + last one-based rank) / (2 × count)`.
3. Map percentile rank to Level 1 (`<=25%`), Level 2 (`<=50%`), Level 3 (`<=75%`), or Level 4 (`>75%`).

For one to three eligible days, use ratio to the eligible monthly maximum:

- `0 < ratio <= .25`: Level 1.
- `.25 < ratio <= .50`: Level 2.
- `.50 < ratio <= .75`: Level 3.
- `.75 < ratio <= 1`: Level 4.

A single positive day is Level 4 because it is the month's relative maximum; the UI does not claim that it is objectively high income.

Before either branch, if two or more eligible days all have exactly the same positive net value, assign every one Level 2. This prevents equal values from receiving an arbitrary high level in both quantile and small-data modes.

### 11.2 API and tokens

Recommended pure functions:

```text
buildCalendarIncomeLevels(records, todayDate) -> Map<dateKey, 0|1|2|3|4>
getCalendarIncomeLevel(levelMap, dateKey) -> 0|1|2|3|4
formatCalendarNetAmount(net, hasRecord) -> string
```

Build the map once per displayed-month data change; do not sort the month again for every cell.

Levels use new semantic Calendar heat tokens derived from the Design System. Do not hardcode four green values in a renderer. Selected styling overrides the heat surface while the full amount remains available in text and ARIA.

No legend is required in v1 because heat is a locating hint, not an analytical scale.

## 12. Today State

- Today is a date identity, not the current selection.
- Every date uses the same fixed 32–34px day-number slot; the Today visual changes
  only the border/background of that shared slot.
- Use a circular outline directly around the date number when Today is not selected.
- When Today is selected, use a solid brand circle with inverse date text. The cell
  may keep only a quiet brand-subtle surface and must not add another strong border.
- Today may retain heat.
- The circle must remain legible on every heat level and must not add a second Today
  marker.
- Do not use date-specific `margin`, `top`, `position`, `translateY`, or other visual
  offsets to align Today. One- and two-digit dates, adjacent dates, Heat and no-Heat
  states must share the same vertical center.
- Do not use a dot, short line, three dots, text label, icon, shadow, or animation.
- Today remains visible when Selected; Selected styling is dominant.
- The accessible name explicitly says `今天`.
- `aria-current="date"` appears only on the actual Taipei-local Today cell. The full
  date cell remains the interactive target; the visual circle does not reduce its
  touch area.

## 13. Selected State

- Use `--border-selected` or its approved equivalent plus a brand-soft surface.
- Today + Selected is the approved exception: the solid date circle is the primary
  selected signal, with a quiet surface and no competing cell border.
- Do not use a heavy shadow or large solid brand fill.
- Do not rely on color alone.
- Only one date is selected globally, even when its cell is outside `displayedMonth`.
- If the selected date is out of month, no visible grid cell pretends to be selected.

## 14. Work Record Card

V1 uses Standard mode.

Header:

- Full localized date and weekday.
- Visible text action `編輯` when an existing past record is editable.
- Quiet `所選日期不在目前月份` context when applicable.
- Delete is not beside Edit.

Primary metrics, two columns:

- 總收入: canonical `entryTotal(record)`.
- 淨收入: canonical `entryNet(record)`.

Secondary metrics, two columns:

- 工作時間: canonical `workMetrics(record).durationMs`, display formatted.
- 時薪: canonical `hourlyRate(net, durationMs)`.

Platform income:

- Text platform names, no logos or platform colors.
- Hide zero/empty platforms.
- Display canonical recognized platform income using `platformNetAmount`; do not copy the formula.
- Hide the entire section when all platform values are empty.
- If tips are positive, show a separate supporting `小費` row so the total remains explainable.

Optional supporting data:

- Show total expenses only when nonzero.
- Show weather and note only when present.
- Keep them as simple rows, not nested cards.

Formatting:

- Full `NT$` currency with grouping.
- Tabular numerals.
- No independent recalculation in the card renderer.
- Invalid derived data shows `—` and a non-destructive data-quality state rather than `NaN` or `Infinity`.

Future display modes may extend a component contract such as:

```text
renderWorkRecordCard({
  mode: "standard",
  date,
  record,
  metrics,
  permissions,
  saveStatus
})
```

Do not implement other modes in v1.

## 15. Empty States

### 15.1 Today without a record

- Title: `今天尚無工作紀錄`.
- Primary action: `前往今天`.
- Navigate to Today.
- Do not create live-work controls or a second Today editor in Calendar.

### 15.2 Past date without a record

- Title: `此日期尚無工作紀錄`.
- Primary action: `新增紀錄`.
- Open the reusable Record Editor in create mode with `selectedDate` prefilled and locked.

### 15.3 Future date

- Title: `尚未到此日期`.
- No primary action.
- No warning color, error icon, or creation path.

### 15.4 Month without records

- Keep the complete month grid interactive.
- Selected date card follows today/past/future rules.
- Compact summary shows `本月尚無工作紀錄`, not a zero-filled KPI wall.

## 16. Future Dates

- Future dates are selectable for orientation.
- They are not disabled solely because they are future.
- They never show heat or a create/edit action.
- Swiping can move into future dates one day at a time.
- V1 has no arbitrary product date ceiling; date utilities must reject invalid/overflowing date keys safely.
- A date that becomes today after a midnight refresh immediately gains Today behavior without automatic record creation.

## 17. Record Creation

Only past empty dates support Calendar backfill.

Flow:

1. User selects a past empty date.
2. User chooses `新增紀錄`.
3. Open the one reusable Record Editor in create mode.
4. Prefill and lock the date to `selectedDate`.
5. Reuse existing platform modes, expense shortcuts, validation, and canonical calculations.
6. Persist to the existing `state.entries` model and `driverPayApp.v2`.
7. On successful completion, return to Calendar with the same `selectedDate`.
8. Recompute the cell, heat map, card, and monthly summary.

Do not ask for the date again and do not add a second record schema or duplicate form.

## 18. Record Editing

- `編輯` is visible in the Work Record Card header.
- It opens the same Record Editor used by backfill.
- Date is prefilled and locked for Calendar editing.
- Successful completion returns to the same Calendar date.
- Cell, heat, card, and summary update from canonical functions.
- The existing Today-bound form is reusable at the field and event level but is not currently a reusable component.

Safest implementation:

- Extract a single Record Editor controller without duplicating IDs or handlers.
- Reuse the existing form DOM/field logic in a mobile full-screen editing layer.
- Keep Today's frozen visual composition unchanged.
- Avoid a Bottom Sheet because the existing record form is long and keyboard-heavy.
- Provide `openRecordEditor({ date, mode, origin })` and one close/return contract.

## 19. Record Deletion

- Delete is secondary, inside the editor or a secondary actions menu.
- Confirmation includes the exact date and affected data:

```text
刪除 7 月 24 日的工作紀錄？

此操作會移除當日收入、支出與工作時間。

取消 / 刪除紀錄
```

- On success, keep `selectedDate`.
- Change the card to the correct empty state.
- Remove cell amount and heat.
- Recompute the monthly summary.
- V1 requires confirmation; Undo remains a later enhancement because full-record recovery is not currently implemented.
- If persistence fails, restore the in-memory record and show a persistent error.

## 20. Auto-save

Current repository behavior is mixed:

- Platform totals save on blur/Enter.
- Shift and weather save immediately.
- Expense entry has its own explicit save action.
- Grouped work-time, order, distance, and note fields use the existing single `儲存詳細紀錄` submit.

V1 Calendar rules:

- Do not add another Calendar-level Save button.
- Preserve the Record Editor's one explicit grouped-detail submit because current integrity depends on it.
- Preserve existing immediate-save semantics for platform income, shift, and weather.
- Preserve the expense flow's existing explicit action.
- Do not introduce per-keystroke localStorage writes in the implementation Sprint.
- A dirty grouped form requires a discard confirmation before closing; successful submit clears dirty state.

SaveStatus:

- `儲存中…`: during a persistence attempt.
- `已儲存`: successful local save; may fade after about two seconds.
- `已離線儲存`: successful localStorage save while offline.
- `儲存失敗`: local persistence failed; remains visible with retry.
- `同步失敗` is reserved for a future real sync layer and is not shown by the current local-only app.

Do not show success Toasts for routine saves. A localStorage failure must roll back the in-memory mutation or retain a recoverable draft; never silently discard or falsely display saved data.

## 21. Gestures

Enhancements:

- Grid swipe left: next month.
- Grid swipe right: previous month.
- Card swipe left: next day.
- Card swipe right: previous day.

Alternatives always remain:

- Month arrows.
- Today button.
- Date-cell selection.

Gesture recognition:

- Begin only outside the first/last 24px viewport edge to avoid iOS browser navigation.
- Require at least 48px horizontal movement.
- Require horizontal movement to exceed vertical movement by at least 1.25×.
- Before intent is confirmed, allow normal vertical scrolling.
- After horizontal intent is confirmed, cancel on pointer cancellation or multi-touch.
- `touch-action: pan-y`; do not block general page scrolling.
- One gesture changes exactly one month or day.
- Ignore a new gesture while a committed transition is active.
- Under reduced motion, state changes still occur without animated travel.

Card swipe updates `selectedDate`; crossing a month also updates `displayedMonth`. Future dates remain view-only.

## 22. Motion

Use Design System tokens:

- Tap/focus response: `--motion-fast` (120ms).
- Selection and card-content transition: `--motion-normal` (180ms).
- Month transition: `--motion-normal` or `--motion-slow` (maximum 260ms).
- SaveStatus: fast/normal opacity transition.

Rules:

- Never exceed 300ms.
- No bounce, rotation, large scaling, card flying, or full-card flashing.
- Month transition uses subtle horizontal movement and opacity.
- Selection changes border/background only.
- Card content uses a small content-level crossfade; card shell remains stable.
- Empty/record state transition keeps a stable minimum layout and uses a subtle fade.
- Five-row to six-row height changes use normal layout flow; no fixed clipping.
- Reduced motion removes transforms and smooth scrolling and minimizes fades.

## 23. Accessibility

Recommended semantics:

- Month container: `role="grid"` with an accessible month name.
- Weekday labels: `role="columnheader"`.
- Week rows: `role="row"`.
- Focusable date controls: native buttons participating in the grid pattern, with `role="gridcell"`, roving tabindex, and `aria-selected`.
- Today: `aria-current="date"`.
- Loading/invalid: `aria-disabled="true"` and blocked handlers.

Accessible date label includes:

- Full date and weekday.
- Today status.
- Selected status.
- Work-record status.
- Full net income, including zero or negative.
- Future status.

Example:

`2026年7月24日，星期五，已選取，有工作紀錄，淨收入 NT$1,580`

Requirements:

- Tab enters and leaves the grid predictably.
- Arrow keys move focus; Enter/Space selects.
- Focus ring and Selected border remain visually different.
- Month changes are announced through a polite live region.
- Card updates announce the selected full date, not every metric separately.
- IconButtons have names.
- States never rely on color alone.

Touch targets:

- At 375px and wider, page padding leaves approximately 49px per column; the full cell is at least 44px high and effectively meets the target.
- At the 320px stress width, seven columns are approximately 41px wide. Keep cells at least 52px high and make the entire column area clickable; do not force 44px width or horizontal overflow.

## 24. Responsive Behavior

Required widths: 375, 390, 393, 430, 768, and 1024px. Stress test: 320px.

- Seven columns remain equal and aligned.
- Cell content never wraps.
- PageContainer uses approved side padding and max width.
- Desktop does not stretch Calendar across the viewport; use the Design System content maximum.
- Work Record Card may gain whitespace at wider sizes but keeps the same information order.
- Bottom spacing includes `safe-area-inset-bottom` and fixed navigation.
- No horizontal overflow at any required width.
- Long platform names wrap within card rows without separating a name from its amount when space allows.

## 25. Data Contract

Calendar reads the existing entry model. No formatted value is stored.

### 25.1 Stored WorkRecord fields

| Product field | Existing field | Type | Nullable | Source | Calendar use / risk |
| --- | --- | --- | --- | --- | --- |
| Record ID | `id` | string | No for valid record | `makeId()` | Stable mutation target; old invalid records need guarding |
| Record date | `date` | `YYYY-MM-DD` string | No | Entry form / record creation | Lookup and grid key; validate before use |
| Shift | `shift` | string | Yes | Direct choice/form | Optional supporting data |
| Start time | `startTime` | `HH:mm` string | Yes | Work controls/form | Work derivation input |
| End time | `endTime` | `HH:mm` string | Yes | Work controls/form | May be earlier after midnight |
| Break | `breakMinutes` | number | Yes/default 0 | Work controls/form | Minutes; normalization required |
| Manual work time | `manualHours` | number | Yes/default 0 | Form | Legacy hours; only used when complete valid start/end fields are unavailable, rounded to integer minutes |
| Tips | `tips` | number | Yes/default 0 | Form | Included in total income |
| Orders | `orders` | number | Yes/default 0 | Form | Optional detail/work-day signal |
| Distance | `km` | number | Yes/default 0 | Form | Optional detail/work-day signal |
| Weather | `weather` | string | Yes | Direct choice/form | Optional supporting row |
| Weather history | `weatherHistory` | array | Yes | Weather direct save | Not rendered in Standard card |
| Note | `note` | string | Yes | Form | Optional supporting row |
| Platform amounts | `incomes` | object of number | Yes/default `{}` | Inline inputs | Stored input amounts keyed by display name |
| Expenses | `expenses` | object of number | Yes/default `{}` | Expense flow | Canonical expense input |
| Expense notes | `expenseNotes` | object | Yes | Expense flow | Not part of Standard card |
| Work session | `workSession` | object | Yes | Live work controls | Aggregated status/timestamps/durations; no session array |
| Income records | `incomeRecords` | array | Yes | Incremental income mode | Optional audit detail, not required by Calendar cell |
| Created time | Not present on WorkRecord | — | — | — | Calendar must not assume it; schema addition requires separate approval |
| Updated time | Not present on WorkRecord | — | — | — | Calendar must not assume it; use UI save status, not fabricated timestamps |

### 25.2 Derived data

| Display value | Canonical source | Status |
| --- | --- | --- |
| Recognized platform income | `platformNetAmount(name, rawAmount)` | Single implementation |
| Total income | `entryTotal(record)` | Single implementation |
| Total expenses | `entryExpenses(record)` | Single implementation |
| Net income | `entryNet(record)` | Single implementation |
| Actual duration | `workMetrics(record).durationMs` / `.workMinutes` | Single implementation; complete clock fields take precedence |
| Hourly income | `hourlyRate(net, durationMs)` | Single implementation |
| Monthly net | `summarize(entriesForMonth(month)).net` | Reusable existing implementation |
| Monthly work days | Unique valid dates where duration, total income, expenses, orders, or distance is positive | Missing shared selector; add one pure shared function before Calendar summary |
| Platform month totals | `platformNetAmount` aggregation | Existing Reports implementation, not a Calendar responsibility |

### 25.3 Display-only values

- Full currency string.
- Compact `k` cell amount.
- Localized date and weekday.
- Work duration text.
- Heat level.
- Empty-state copy.

### 25.4 UI-only values

All fields in `CalendarState`, focus position, gesture coordinates, dirty state, and transition direction. None belong in the WorkRecord or durable settings.

## 26. Calculation Dependencies

| Calculation | Current status | Calendar rule |
| --- | --- | --- |
| Total income | Single implementation: `entryTotal` | Reuse directly |
| Total expenses | Single implementation: `entryExpenses` | Reuse directly |
| Net income | Single implementation: `entryNet` | Reuse directly |
| Work duration | Single implementation: `workMetrics` | Reuse directly |
| Hourly income | Single implementation: `hourlyRate` | Reuse directly |
| Month summary | Single reusable `summarize` | Reuse for net and duration |
| Work-day count | Missing shared function | Add one tested pure selector, then reuse |
| Platform recognized amount | Single implementation: `platformNetAmount` | Reuse; never duplicate the rate formula |
| AI entry totals/expenses/summary | Duplicated implementation | Do not import or copy; resolve separately before future AI calculation changes |
| Cell heat | Not present | Add a pure Calendar-only presentation calculation from canonical net |
| Compact net formatting | Not present | Add a pure display-only formatter |

Calendar must not create a third income, expense, work-time, or summary formula.

## 27. Performance

- Current localStorage dataset is loaded into memory and is expected to be small; no virtualization is needed.
- Render the displayed month, adjacent cells needed for the grid, and the selected record.
- Build a `Map<dateKey, record>` once per state/data revision.
- Build heat levels once per displayed-month data revision.
- Use event delegation rather than one closure per date cell where practical.
- Batch DOM replacement for the grid and update stable regions separately to avoid full-page rerender.
- Do not add a Calendar framework, caching library, or dependency.
- Synchronous local reads normally skip Skeleton; show a stable loading state only when loading is observable or future persistence becomes asynchronous.

Date utilities:

- Keep date keys as validated `YYYY-MM-DD` strings.
- Use numeric date parts and date-only arithmetic.
- Existing `dateOnlyParts()` and `addLocalDays()` safely use UTC methods as a timezone-neutral arithmetic container; do not convert local midnight timestamps to ISO date strings.
- Avoid `new Date("YYYY-MM-DD")`.
- Add pure month helpers for month length, Monday index, adjacent month, grid generation, and leap-year coverage.

## 28. Error Handling

Read errors:

- Do not render an apparently empty Calendar when stored JSON cannot be parsed.
- Preserve the raw localStorage value.
- Show a neutral error state: `無法讀取工作紀錄`.
- Offer `重試`.
- Keep any last successfully parsed in-memory state visible where available.
- Do not overwrite the damaged raw value with defaults.

Write errors:

- Check `saveState()` results.
- Use a before-change snapshot for create/edit/delete.
- Roll back in-memory mutation if persistence fails.
- Keep editor draft recoverable when an edit fails.
- Show persistent `儲存失敗` with retry.

Invalid records:

- Exclude invalid date keys from the grid and summary.
- Do not delete or rewrite them.
- Surface a non-blocking data-quality notice.
- Never format `NaN` or `Infinity`.

## 29. Offline Behavior

Current behavior:

- Records are localStorage-only.
- Existing months can be viewed offline after the App Shell is available.
- Create, edit, and delete can persist locally offline.
- There is no server queue, cross-device sync, conflict resolution, Supabase, or pending upload.

UI:

- Successful offline local save shows `已離線儲存`.
- Do not claim `同步完成`.
- A future sync implementation must define versioning, conflicts, tombstones for deletion, retry, privacy, and migration separately.
- Service Worker cache version is not changed by this specification Sprint.

## 30. Edge Cases

| # | Scenario | Expected behavior | UI presentation | Data handling and error prevention | Test requirement |
| ---: | --- | --- | --- | --- | --- |
| 1 | Today has no record | Keep today selected; route only on action | `今天尚無工作紀錄`; `前往今天` | Do not create from Calendar | Route and no-mutation test |
| 2 | Past date has no record | Allow backfill for exact date | `此日期尚無工作紀錄`; `新增紀錄` | Prefill/lock date; reject date drift | Creation/return test |
| 3 | Future date | Permit viewing only | Muted readable; `尚未到此日期` | Never expose create mutation | Permission test |
| 4 | Net is zero | Preserve existing record | Cell `—`; card NT$0 | Do not treat as missing | Zero-vs-empty fixture |
| 5 | Net is negative | Preserve signed result | Signed compact, no heat | Use canonical `entryNet`; no clamp | Negative fixture |
| 6 | Income without work time | Show income and zero hourly | Work 0; hourly NT$0 | Prevent Infinity/NaN | Canonical calculation test |
| 7 | Work time without income | Show time and zero income/hourly | Normal card metrics | Reuse canonical functions | Zero-income fixture |
| 8 | Work crosses midnight | Keep record on its date key | Aggregate duration | Use `workMetrics`; no date reassignment | Cross-midnight test |
| 9 | Multiple work segments | Show aggregate only | No fabricated timeline | Existing `workSession` lacks segment list | Aggregate and absence test |
| 10 | Platform sum differs from total | Explain tips/rates through rows | Recognized platforms plus tips | Reuse `platformNetAmount` and `entryTotal` | Reconciliation fixture |
| 11 | Expenses exceed income | Show negative net | Neutral signed value, no heat | Do not clamp or use danger state | Expense-heavy fixture |
| 12 | One record in month | Apply small-data fallback | One Level 4 heat cell | Ratio to max, not quantile | Single-record heat test |
| 13 | All positive incomes equal | Give equal heat | All Level 2 | Tie detection before rank | Equal-values test |
| 14 | One extreme high day | Preserve lower-day differences | Quantile heat remains useful | Rank positive values | Outlier heat test |
| 15 | February | Generate correct month | 28 days plus adjacent cells | Date-only month length | Non-leap month test |
| 16 | Leap-year February | Generate 29 days | Correct grid placement | Gregorian leap rule | 2024/2028 test |
| 17 | Month starts Monday | Place day 1 first column | Monday alignment | Monday index 0 | Alignment test |
| 18 | Six-row month | Render all dates | Six rows, no clipping | Generator returns 42 cells | Six-row test |
| 19 | Adjacent-month selection | Select and switch month | New month + selected cell/card | Update both states atomically | Selection test |
| 20 | App crosses midnight | Refresh today/future only | Indicator and empty state update | Do not replace selected date | Fake-clock lifecycle test |
| 21 | Other page changes data | Refresh on Calendar activation | Updated cell/card/summary | Rebuild record/heat maps | Same-session mutation test |
| 22 | Corrupt localStorage | Preserve raw data and block false empty | Read-error state + retry | Never overwrite with defaults | Parse-failure test |
| 23 | Invalid date key | Exclude bad record | Non-blocking data notice | Do not rewrite/delete source | Validation test |
| 24 | Long/new platform name | Keep readable and aligned | Safe wrap, no logo | Escape text; preserve amount | 375/320 stress test |
| 25 | Very large amount | Keep all values readable | Compact cell; grouped full card | Reject nonfinite formatting | Overflow/formatter test |
| 26 | Negative/incomplete time | Return canonical safe value | `0` or `—`, never invalid text | Clamp through existing normalizer | Invalid-time fixture |
| 27 | Delete then return | Keep date selected and empty | Empty card, heat removed | Transactional delete/rollback | Delete transaction test |
| 28 | Rapid month changes | Final request wins | No stale flash/selection | Serialize controller transitions | Sequencing test |
| 29 | Horizontal/vertical conflict | Preserve vertical scroll | No accidental month change | Intent threshold and cancellation | Pointer-intent test |
| 30 | Installed PWA safe area | Keep all content reachable | Summary/card above nav | Use safe-area tokens | Standalone device QA |

## 31. Implementation Architecture

The repository is native HTML/CSS/JavaScript in `index.html`; implementation must follow that architecture.

### 31.1 Reuse

- Storage: `loadState()`, `saveState()` with added error-status integration.
- Date foundations: `todayString()`, `dateOnlyParts()`, `addLocalDays()`.
- Record lookup: `entryForDate()`, `entriesForMonth()`.
- Calculations: `platformNetAmount()`, `entryTotal()`, `entryExpenses()`, `entryNet()`, `workMetrics()`, `hourlyRate()`, `summarize()`.
- Formatting foundations: `money()`, escaping helpers.
- Navigation: `setView()`, `parseAppRoute()`, `navigateTo()`, extended for an optional date.
- Design System: PageContainer, Surface, IconButton, Button, Card, EmptyState, SaveStatus, Divider, typography, motion, focus, safe-area tokens.

### 31.2 Add pure functions

- `normalizeDateKey`.
- `monthKeyFromDate`.
- `addCalendarMonths`.
- `daysInCalendarMonth`.
- `mondayFirstWeekdayIndex`.
- `generateCalendarMonthGrid`.
- `formatCalendarNetAmount`.
- `buildCalendarIncomeLevels`.
- `isWorkDayRecord`.
- `summarizeCalendarMonth` as a thin composition over canonical functions.
- `calendarDateAriaLabel`.

### 31.3 Add controllers/renderers

- Session-only Calendar state controller.
- Month-grid renderer.
- Work Record Card renderer.
- Calendar lifecycle/today refresh controller.
- Gesture controller.
- Roving-focus accessibility controller.
- Reusable Record Editor controller.
- Transactional persistence adapter around existing `saveState()`.

### 31.4 DOM replacement

Replace only the contents of `#view-calendar`:

- Remove legacy `月份明細` month select and desktop/mobile entries list from Calendar after equivalent record access is available.
- Keep `#view-reports` and its three panels untouched.
- Do not reuse Reports charts, week groups, or platform ranking inside Calendar.
- Preserve the five-item Bottom Navigation and Calendar active-state wiring.

### 31.5 Legacy handling

- `renderEntries()` is replaced for Calendar presentation; do not reuse its table/card markup as the new grid.
- Canonical calculations called by `renderEntries()` remain.
- Current `editEntry()` navigation to Today must be replaced by the reusable editor origin/return contract.
- Current `deleteEntry()` confirmation copy and non-transactional mutation must not be reused unchanged.
- Current `settings.calendarMonth` remains readable for backward compatibility but does not persist new session selection.

## 32. Implementation Plan

Recommendation: **two implementation Sprints**.

Rationale:

- Calendar currently has no month grid or selected-date state.
- Existing tests cover separation and reporting dates, not Calendar interactions.
- The existing editor is tightly coupled to Today and uses mixed save semantics.
- Read/write failure paths need transactional behavior before Calendar mutation is safe.
- A single Sprint would combine a major visual replacement with record lifecycle risk.

### Implementation Sprint A — Calendar Read and Navigate

1. Date utilities, month generator, date/heat formatters, and unit tests.
2. Session state controller and optional date route.
3. Calendar shell, month navigation, Today button, and selection.
4. Date cells, heat, Today/Selected states.
5. Read-only Standard Work Record Card, empty/future states, and monthly summary.
6. Month/day gestures, keyboard grid, motion, responsive and offline-read states.
7. Regression validation without enabling Calendar mutation.

### Implementation Sprint B — Record Mutation and Hardening

1. Extract one reusable Record Editor controller from the existing Today-bound form.
2. Lock Today to today and Calendar editor to selected past date.
3. Integrate backfill and edit return behavior.
4. Add confirmed, transactional delete.
5. Integrate SaveStatus, dirty-state exit, offline saves, rollback, retry, and read-error presentation.
6. Add create/edit/delete/data-consistency/accessibility/PWA tests.
7. Full iPhone Safari and installed-PWA regression QA.

Do not subdivide further unless implementation discovers a new data-loss or architecture blocker.

## 33. Testing and Acceptance Criteria

### 33.1 Functional

- [ ] Fresh normal Calendar entry selects Taipei today and its month.
- [ ] Same app session preserves selected date and displayed month.
- [ ] New session resets normal entry to today.
- [ ] Valid date deep link selects the exact date without creating data.
- [ ] Calendar is Monday-first.
- [ ] Previous/next arrows change only displayed month.
- [ ] Month-only navigation does not silently change selected date.
- [ ] Today button selects and displays current today.
- [ ] Date selection updates the Work Record Card without page navigation.
- [ ] Adjacent-month date selection switches displayed month.
- [ ] Future dates cannot create records.
- [ ] Past empty dates can open backfill with a locked date.
- [ ] Edit is directly visible for an existing record.
- [ ] Delete is secondary, date-specific, confirmed, and transactional.
- [ ] Card swipe changes selected day and cross-month swipe changes month.
- [ ] Monthly net and work-day summary updates after mutations.

### 33.2 Visual

- [ ] Today and Selected remain distinguishable together and separately.
- [ ] Heat is soft and uses semantic Design System tokens.
- [ ] Date cells remain flat rather than a card wall.
- [ ] 375, 390, 393, and 430px have no horizontal overflow.
- [ ] 320px stress layout remains usable without forced 44px column width.
- [ ] Compact amounts never wrap.
- [ ] Full amounts appear in the Work Record Card.
- [ ] No platform logos or platform colors.
- [ ] Five/six-row month transitions do not clip content.
- [ ] Bottom Navigation does not cover summary/card content.

### 33.3 Data and calculations

- [ ] Today, Calendar, Reports, and AI fixtures produce identical canonical values.
- [ ] Net income uses `entryNet`.
- [ ] Work time uses `workMetrics`.
- [ ] Hourly income uses `hourlyRate`.
- [ ] No-record and zero-net states differ.
- [ ] Positive, zero, negative, tie, single-day, and outlier heat fixtures pass.
- [ ] Create/edit/delete refresh grid, card, heat, and summary.
- [ ] Old records remain readable.
- [ ] Invalid records are not deleted or rewritten.
- [ ] `driverPayApp.v2` remains unchanged.

### 33.4 Accessibility

- [ ] Full date/state/net is read rather than only day/abbreviation.
- [ ] Selected uses `aria-selected`.
- [ ] Today uses `aria-current="date"`.
- [ ] Focus and Selected have separate visual states.
- [ ] Arrow, Enter, and Space keyboard behavior passes.
- [ ] IconButtons have accessible names.
- [ ] Month/card updates use restrained live announcements.
- [ ] Reduced motion removes transforms and smooth scrolling.
- [ ] Required touch targets are met without horizontal overflow.

### 33.5 Stability

- [ ] Today UI and live controls do not regress.
- [ ] Reports UI, month state, and calculations do not regress.
- [ ] AI remains read-only.
- [ ] Bottom Navigation remains five items.
- [ ] Console has no new error or warning.
- [ ] Existing and new Node tests pass.
- [ ] Inline JavaScript, Service Worker, and manifest checks pass.
- [ ] PWA offline shell and safe area pass.
- [ ] No schema, dependency, Supabase, or unauthorized cache change.

## 34. Current Calendar Audit

Audit base: `cc6b678` on `codex/product-specification-20260725`.

Implementation status (2026-07-25): Sprint 4A Read and Navigate, Sprint 4A.5 Visual
Polish, Sprint 4B Record Mutation and Hardening, Final Regression and the Product
Owner Human QA Gate are complete. Calendar UX Freeze — Version 1 is active. The
table below remains the pre-implementation audit evidence used to scope the
implementation Sprints; it is historical evidence rather than current status.

| Question | Status | Repository evidence |
| --- | --- | --- |
| Where is Calendar? | Confirmed | DOM, CSS, state, rendering, and events are in `index.html`; navigation assertions are in `tests/navigation.test.js`. |
| Is it a real month grid? | Not present | `#view-calendar` contains `#monthFilter` and `#entriesTable`, not weekday headers or date cells. |
| Is Calendar mixed with Reports? | Confirmed separated | `#view-calendar` and `#view-reports` are separate; Reports owns week/month/platform panels. |
| Week start | Confirmed Monday | `weekStart()` uses Monday offset; reporting tests cover Monday/Sunday. Calendar grid itself is not present. |
| How is date selection saved? | Not present | No Calendar selected date exists. `settings.calendarMonth` is persisted in localStorage. |
| Nearest-work-day selection | Not present | No selected-date logic or heuristic exists. |
| UTC/date risk | Confirmed controlled with remaining risk | `dateOnlyParts`/`addLocalDays` use UTC only as date arithmetic and avoid local-midnight serialization. New month helpers still need leap/month tests; some display/session functions use local `Date`. |
| Reusable Work Record Card | Not present | Current desktop table/mobile row are legacy Calendar presentations, not the approved card. |
| Reusable Record Editor | Suspected partial reuse | One existing `#detailForm` has useful fields/handlers, but it is DOM-global, Today-bound, and `editEntry()` navigates to Today. Extraction risk needs implementation proof. |
| Income heat | Not present | No heat tokens, levels, or formatter exist. |
| Monthly summary | Confirmed reusable foundation | `summarize(entriesForMonth(month))` exists; a shared work-day selector is missing. |
| Design System adoption | Confirmed foundation only | `styles/design-system.css` is loaded, but Calendar uses legacy `.panel`, `.table-wrap`, `.empty`, and page-specific classes. |
| Hardcoded Calendar style | Confirmed | Legacy Calendar presentation uses page-local sizes, borders, backgrounds, breakpoints, and colors in `index.html`. |
| Duplicate calculation | Confirmed outside Calendar | AI duplicates entry totals/expenses/summary; current Calendar list itself uses canonical entry functions. |
| Calendar test coverage | Confirmed limited | Tests verify Calendar/Reports separation, independent month settings, 44px legacy actions, and reporting date utilities; no grid, selection, heat, card, gesture, editor, future-date, or accessibility tests exist. |
| Record timestamps | Not present | WorkRecord has no record-level `createdAt` or `updatedAt`; only some nested income/weather records have timestamps. |
| Read failure behavior | Confirmed risk | `loadState()` preserves damaged raw localStorage but returns defaults, which can make Calendar appear empty. |
| Write rollback | Confirmed risk | Detail save and delete mutate memory without checking/rolling back when `saveState()` fails. |
| Real iPhone/PWA behavior | Needs further inspection | Repository automation cannot confirm physical Safari gestures, keyboard, safe area, or standalone lifecycle. |

## 35. Implementation Entry Gate

Calendar implementation may start only when:

- This specification is approved.
- The implementation Sprint explicitly selects Sprint A or both A/B scope.
- Product code is based on the Sprint 2/3 ancestry.
- Required pure-function tests are added before renderer behavior depends on them.
- No data migration is assumed.
- The implementation preserves Today, Reports, AI, Driver, Bottom Navigation, `driverPayApp.v2`, and PWA protections.

Next step:

**Reports Product and Implementation Sprint**. Reports may reuse the stable Calendar
date utilities, Monday-first week logic, canonical calculations, aggregation,
persistence read API and Design System primitives without redesigning Calendar.
