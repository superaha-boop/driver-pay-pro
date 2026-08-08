const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

const html = fs.readFileSync(new URL("../index.html", `file://${__filename}`), "utf8");
const serviceWorker = fs.readFileSync(new URL("../sw.js", `file://${__filename}`), "utf8");
const fixture = JSON.parse(
  fs.readFileSync(new URL("./fixtures/reports-final-regression.json", `file://${__filename}`), "utf8")
);
const reportsSection = html.match(
  /<section id="view-reports"[\s\S]*?<\/section>\s*<section id="view-ai"/
)?.[0] || "";

function extractFunction(name) {
  const signature = `function ${name}(`;
  const start = html.indexOf(signature);
  assert.notEqual(start, -1, `找不到 ${name}()`);
  const bodyStart = html.indexOf("{", start);
  let depth = 0;
  let quote = "";
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let index = bodyStart; index < html.length; index += 1) {
    const char = html[index];
    const next = html[index + 1];
    if (lineComment) {
      if (char === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        index += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = "";
      continue;
    }
    if (char === "/" && next === "/") {
      lineComment = true;
      index += 1;
      continue;
    }
    if (char === "/" && next === "*") {
      blockComment = true;
      index += 1;
      continue;
    }
    if (char === "'" || char === '"' || char === "`") {
      quote = char;
      continue;
    }
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return html.slice(start, index + 1);
    }
  }
  throw new Error(`${name}() 結尾不完整`);
}

const functionNames = [
  "taipeiDateString",
  "todayString",
  "dateOnlyParts",
  "addLocalDays",
  "normalizeDateKey",
  "monthKeyFromDate",
  "daysInCalendarMonth",
  "addCalendarMonths",
  "compactWeekRange",
  "finiteNumber",
  "nonNegativeNumber",
  "minutes",
  "timeValueMs",
  "decimalHoursToMinutes",
  "minutesToHourMinuteParts",
  "validateWorkTimeRange",
  "calculateWorkMinutes",
  "clockWorkDurationMs",
  "sessionWorkDurationMs",
  "workMetrics",
  "hourlyRateQuality",
  "hourlyRate",
  "platformRate",
  "platformNetAmount",
  "entryIncome",
  "entryExpenses",
  "normalizeExpenseAllocation",
  "expenseAllocationFor",
  "expenseAllocationMonth",
  "expenseAllocationAmount",
  "reportExpenseSummary",
  "entryTotal",
  "entryNet",
  "recordDataQuality",
  "summarize",
  "isWorkDayRecord",
  "weekStart",
  "weekEnd",
  "getLocalWeekRange",
  "getPreviousWeekRange",
  "getLocalMonthRange",
  "getPreviousMonthRange",
  "getWeekLabel",
  "getMonthLabel",
  "isDateKeyInRange",
  "getRecordsInRange",
  "getWeeksForMonth",
  "aggregateReport",
  "normalizePlatformKey",
  "platformDisplayName",
  "platformCanonicalOrder",
  "aggregatePlatformIncome",
  "compareReportMetric",
  "compareReportPeriods",
  "summarizeRecordsByDate",
  "reportWeekdayLabel",
  "buildWeeklyNetTrend",
  "buildMonthlyWeeklyNetTrend",
  "findImportantReportDates"
];

const state = {
  platforms: fixture.platforms,
  settings: { platformRates: fixture.platformRates }
};
const context = vm.createContext({
  Date,
  Intl,
  Map,
  Math,
  Number,
  Object,
  Set,
  String,
  Array,
  state,
  defaultPlatformRates: fixture.platformRates,
  workTimeUnits: Object.freeze({
    minuteMs: 60 * 1000,
    hourMs: 60 * 60 * 1000
  }),
  MIN_VALID_WORK_MINUTES: 10,
  MAX_REASONABLE_HOURLY_RATE: 2000
});
vm.runInContext(
  `${functionNames.map(extractFunction).join("\n")}\n`
  + `globalThis.reports = { ${functionNames.join(", ")} };`,
  context
);
const reports = context.reports;

test("固定 Reports Final Regression fixture 覆蓋 28 個核准情境", () => {
  assert.equal(fixture.requiredScenarios.length, 28);
  assert.equal(new Set(fixture.requiredScenarios).size, 28);
  for (const required of [
    "no-records",
    "previous-no-records",
    "previous-zero",
    "positive-net",
    "zero-net",
    "negative-net",
    "positive-to-negative",
    "negative-to-positive",
    "income-without-work-time",
    "work-time-without-income",
    "multiple-platforms",
    "tips",
    "unattributed-income",
    "unknown-platform",
    "historical-platform-alias",
    "platform-total-above-total",
    "extreme-high-value",
    "very-large-amount",
    "cross-midnight",
    "incomplete-legacy-record",
    "cross-month-week",
    "cross-year-week",
    "leap-year-february",
    "calendar-create",
    "calendar-edit",
    "calendar-delete",
    "mutation-rollback",
    "storage-corruption"
  ]) {
    assert.equal(fixture.requiredScenarios.includes(required), true, `缺少 ${required}`);
  }
});

test("Weekly Final Regression 使用完整七天、canonical KPI 與期間平均時薪", () => {
  const range = reports.getLocalWeekRange("2026-07-19");
  const summary = reports.aggregateReport(fixture.weeklyCurrent, range);
  assert.deepEqual(
    JSON.parse(JSON.stringify(range)),
    { start: "2026-07-13", end: "2026-07-19", endExclusive: "2026-07-20" }
  );
  assert.equal(reports.getWeekLabel(range), "7/13－7/19");
  assert.equal(summary.recordCount, 7);
  assert.equal(summary.totalIncome, 12340);
  assert.equal(summary.totalExpenses, 2300);
  assert.equal(summary.netIncome, 10040);
  assert.equal(summary.workDays, 7);
  assert.equal(summary.totalWorkDuration, 23 * 60 * 60 * 1000);
  assert.equal(summary.averageHourlyIncome, null);
  assert.equal(summary.hourlyRateStatus, "missing-work-time");
  assert.equal(summary.validHourlyRate, false);

  const trend = reports.buildWeeklyNetTrend(fixture.weeklyCurrent, range);
  assert.equal(trend.length, 7);
  assert.deepEqual(
    JSON.parse(JSON.stringify(trend.map(point => point.status))),
    ["positive", "positive", "zero", "negative", "positive", "zero", "positive"]
  );
  const important = reports.findImportantReportDates(fixture.weeklyCurrent, "week");
  assert.equal(important.highestNet.date, "2026-07-13");
  assert.equal(important.lowestNet.date, "2026-07-16");
});

test("Weekly comparison 區分無前期、前期零與正負跨越", () => {
  const current = reports.aggregateReport(
    fixture.weeklyCurrent,
    reports.getLocalWeekRange("2026-07-13")
  );
  const noPrevious = reports.aggregateReport([], reports.getLocalWeekRange("2026-07-06"));
  const zeroPrevious = reports.aggregateReport(
    fixture.weeklyPreviousZero,
    reports.getLocalWeekRange("2026-07-06")
  );
  assert.equal(reports.compareReportPeriods(current, noPrevious).totalIncome.status, "no-previous-data");
  assert.equal(reports.compareReportPeriods(current, zeroPrevious).totalIncome.status, "previous-zero");
  assert.equal(reports.compareReportPeriods(current, zeroPrevious).totalIncome.percentage, null);
  assert.equal(reports.compareReportMetric(-300, 500).status, "amount-only");
  assert.equal(reports.compareReportMetric(500, -300).status, "amount-only");
});

test("Monthly Final Regression 保留曆月、跨月週、跨年週與閏年", () => {
  const july = reports.getLocalMonthRange("2026-07");
  const julyWeeks = reports.getWeeksForMonth(july);
  assert.equal(julyWeeks.length, 5);
  assert.equal(julyWeeks[0].start, "2026-06-29");
  assert.equal(julyWeeks[0].clipStart, "2026-07-01");
  assert.equal(julyWeeks.at(-1).end, "2026-08-02");
  assert.equal(julyWeeks.at(-1).clipEndExclusive, "2026-08-01");

  const leapFebruary = reports.getLocalMonthRange("2028-02");
  assert.equal(leapFebruary.end, "2028-02-29");
  assert.equal(reports.getWeeksForMonth(leapFebruary).length, 5);
  assert.equal(reports.getWeekLabel(reports.getLocalWeekRange("2026-06-29")), "6/29－7/5");
  assert.equal(
    reports.getWeekLabel(reports.getLocalWeekRange("2026-12-31")),
    "2026/12/28－2027/1/3"
  );

  const trend = reports.buildMonthlyWeeklyNetTrend([
    { date: "2026-06-30", incomes: { Uber: 9000 }, expenses: {} },
    ...fixture.weeklyCurrent,
    { date: "2026-08-01", incomes: { Uber: 8000 }, expenses: {} }
  ], july);
  assert.equal(trend.length, 5);
  assert.equal(trend.reduce((sum, point) => sum + point.value, 0), 10040);

  const important = reports.findImportantReportDates(fixture.weeklyCurrent, "month");
  assert.equal(important.longestWork.date, "2026-07-13");
  assert.equal(important.highestHourly.date, "2026-07-13");
});

test("Platform Final Regression 正規化別名、穩定排序並隔離無效值", () => {
  const source = structuredClone(fixture.platformRecords);
  const before = JSON.stringify(source);
  const result = reports.aggregatePlatformIncome(
    source,
    reports.getLocalWeekRange("2026-07-13"),
    fixture.platforms
  );
  assert.equal(JSON.stringify(source), before);
  assert.equal(result.totalPlatformIncome, 5250);
  assert.equal(result.inconsistent, true);
  assert.equal(result.invalidPlatforms.length, 1);
  assert.equal(Number.isFinite(result.totalPlatformIncome), true);
  assert.deepEqual(
    JSON.parse(JSON.stringify(result.rows.slice(0, 3).map(row => row.platformKey))),
    ["uber", "lineGo", "taiwanTaxi"]
  );
  assert.equal(result.rows.find(row => row.platformKey === "custom:mysteryfleet").displayName, "Mystery Fleet");
  assert.equal(result.rows.reduce((sum, row) => sum + (row.share || 0), 0), 1);

  const unattributed = reports.aggregatePlatformIncome(
    fixture.unattributedRecords,
    reports.getLocalWeekRange("2026-07-13"),
    fixture.platforms
  );
  assert.equal(unattributed.totalIncome, 1250);
  assert.equal(unattributed.totalPlatformIncome, 1000);
  assert.equal(unattributed.unattributedIncome, 250);

  const large = reports.aggregatePlatformIncome(
    fixture.largeValueRecords,
    reports.getLocalWeekRange("2026-07-13"),
    fixture.platforms
  );
  assert.equal(large.totalPlatformIncome, 99999999);
  assert.equal(Number.isFinite(large.rows[0].share), true);
});

test("不完整舊資料與無效日期被安全隔離且不改寫來源", () => {
  const source = structuredClone(fixture.legacyRecords);
  const before = JSON.stringify(source);
  const result = reports.aggregateReport(source, reports.getLocalWeekRange("2026-07-06"));
  assert.equal(result.recordCount, 1);
  assert.equal(result.totalIncome, 0);
  assert.equal(result.totalExpenses, 0);
  assert.equal(result.totalWorkDuration, 0);
  assert.equal(result.averageHourlyIncome, null);
  assert.equal(JSON.stringify(source), before);
});

test("Drill-down、return context 與 committed refresh 保持唯一安全路徑", () => {
  const open = extractFunction("openReportDateInCalendar");
  const capture = extractFunction("captureReportsContext");
  const restore = extractFunction("restoreReportsContext");
  const notify = extractFunction("notifyRecordChanged");
  const refresh = extractFunction("handleRecordChanged");
  const calendarCommit = extractFunction("commitCalendarRecord");
  const calendarDelete = extractFunction("deleteCalendarRecord");
  const todayCommit = extractFunction("commitInlineIncome");

  assert.match(open, /normalizeDateKey/);
  assert.match(open, /#calendar\/\$\{date\}/);
  assert.doesNotMatch(open, /openRecordEditor|persistStatePayload|saveState/);
  assert.match(capture, /activeReportTab[\s\S]*selectedWeekAnchor[\s\S]*selectedMonth[\s\S]*selectedPlatformPeriod/);
  assert.match(restore, /setReportView[\s\S]*window\.scrollTo/);
  assert.doesNotMatch(`${capture}\n${restore}`, /localStorage|sessionStorage|saveState/);
  assert.match(notify, /driverpay:recordchange/);
  assert.match(refresh, /reportsRefreshFrame[\s\S]*requestAnimationFrame/);
  assert.match(calendarCommit, /persistStatePayload[\s\S]*notifyRecordChanged/);
  assert.match(calendarDelete, /persistStatePayload[\s\S]*notifyRecordChanged/);
  assert.match(todayCommit, /saveState[\s\S]*notifyRecordChanged/);
});

test("Error、Offline、Retry 與 read-only integrity 保持不同狀態", () => {
  const load = extractFunction("loadState");
  const error = extractFunction("reportsErrorMarkup");
  const status = extractFunction("reportsStatusMarkup");
  const retry = extractFunction("retryReportsRead");
  const reportsRenderers = [
    extractFunction("renderWeeks"),
    extractFunction("renderMonthReport"),
    extractFunction("renderPlatformReport")
  ].join("\n");

  assert.match(load, /lastValidStorageKey/);
  assert.match(load, /stateRecoveryNotice/);
  assert.match(error, /role="alert"/);
  assert.match(error, /data-reports-retry/);
  assert.match(status, /離線中/);
  assert.match(retry, /loadState/);
  assert.doesNotMatch(
    `${reportsRenderers}\n${extractFunction("changeReportPeriod")}`,
    /localStorage\.setItem|persistStatePayload|saveState/
  );
  assert.match(html, /const storageKey = "driverPayApp\.v2"/);
});

test("Reports Accessibility、responsive 與 PWA Freeze Candidate 契約完整", () => {
  assert.match(reportsSection, /role="tablist" aria-label="報表切換"/);
  assert.match(reportsSection, /role="tabpanel"/);
  assert.match(reportsSection, /aria-live="polite"/);
  assert.match(reportsSection, /aria-label="平台報表期間"/);
  assert.match(html, /\.report-switcher button[\s\S]*?min-height: var\(--touch-target-min\)/);
  assert.match(html, /\.reports-important-action[\s\S]*?min-height: var\(--touch-target-min\)/);
  assert.match(html, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(html, /\.reports-platform-row[\s\S]*?grid-template-columns: minmax\(0, 1fr\) auto/);
  assert.doesNotMatch(reportsSection, /平台效率|最佳平台|平台時薪|<img[^>]+platform/);
  assert.match(serviceWorker, /driver-pay-pro-v30/);
  assert.doesNotMatch(serviceWorker, /driver-pay-pro-v16/);
});
