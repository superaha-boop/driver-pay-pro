const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

const html = fs.readFileSync(new URL("../index.html", `file://${__filename}`), "utf8");
const fixture = JSON.parse(
  fs.readFileSync(new URL("./fixtures/reports-final-regression.json", `file://${__filename}`), "utf8")
);

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
  "currentMonth",
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
  "clockWorkDurationMs",
  "sessionWorkDurationMs",
  "workMetrics",
  "hourlyRate",
  "platformRate",
  "platformNetAmount",
  "entryIncome",
  "entryExpenses",
  "entryTotal",
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
  "findImportantReportDates",
  "validAnalysisEntries",
  "aiAggregateProjection",
  "aiDayAggregate",
  "buildAiAnalysisContext"
];
const sharedAnalyticsSource = html.match(
  /const sharedAnalytics = Object\.freeze\(\{[\s\S]*?\n    \}\);/
)?.[0];
assert.ok(sharedAnalyticsSource, "找不到 sharedAnalytics facade");

const state = {
  entries: fixture.weeklyCurrent,
  platforms: fixture.platforms,
  settings: {
    platformRates: fixture.platformRates,
    dailyGoal: 3000,
    monthlyGoal: 80000
  }
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
  })
});
vm.runInContext(
  `${functionNames.map(extractFunction).join("\n")}\n`
  + `${sharedAnalyticsSource}\n`
  + "globalThis.ai = { sharedAnalytics, buildAiAnalysisContext };",
  context
);

test("AI 只透過 sharedAnalytics 重用 Reports canonical analytics", () => {
  for (const name of [
    "getLocalWeekRange",
    "getPreviousWeekRange",
    "getLocalMonthRange",
    "getPreviousMonthRange",
    "aggregateReport",
    "compareReportPeriods",
    "buildWeeklyNetTrend",
    "buildMonthlyWeeklyNetTrend",
    "findImportantReportDates",
    "normalizePlatformKey",
    "aggregatePlatformIncome"
  ]) {
    assert.equal(typeof context.ai.sharedAnalytics[name], "function", `缺少 ${name}`);
  }
  for (const duplicate of [
    "analysisPlatformRate",
    "analysisPlatformIncome",
    "analysisEntryTotal",
    "analysisEntryExpenses",
    "analysisSummary",
    "analysisPlatformRows"
  ]) {
    assert.equal(html.includes(`function ${duplicate}(`), false, `${duplicate} 不應繼續存在`);
  }
});

test("同一份 fixture 的 AI 與 Reports 月彙總完全一致", () => {
  const aiContext = context.ai.buildAiAnalysisContext();
  const reportsRange = context.ai.sharedAnalytics.getLocalMonthRange(fixture.today.slice(0, 7));
  const reportsAggregate = context.ai.sharedAnalytics.aggregateReport(fixture.weeklyCurrent, reportsRange);
  assert.equal(aiContext.monthAggregate.totalIncome, reportsAggregate.totalIncome);
  assert.equal(aiContext.monthAggregate.netIncome, reportsAggregate.netIncome);
  assert.equal(aiContext.monthAggregate.totalWorkDuration, reportsAggregate.totalWorkDuration);
  assert.equal(aiContext.monthAggregate.averageHourlyIncome, reportsAggregate.averageHourlyIncome);
  assert.deepEqual(
    JSON.parse(JSON.stringify(aiContext.monthAggregate.range)),
    JSON.parse(JSON.stringify(reportsRange))
  );
});

test("同一份 fixture 的 AI 與 Reports 平台彙總完全一致", () => {
  const aiContext = context.ai.buildAiAnalysisContext();
  const reportsPlatform = context.ai.sharedAnalytics.aggregatePlatformIncome(
    fixture.weeklyCurrent,
    context.ai.sharedAnalytics.getLocalMonthRange(fixture.today.slice(0, 7)),
    fixture.platforms
  );
  assert.equal(aiContext.monthPlatformAggregate.totalPlatformIncome, reportsPlatform.totalPlatformIncome);
  assert.deepEqual(
    JSON.parse(JSON.stringify(aiContext.monthPlatformAggregate.rows)),
    JSON.parse(JSON.stringify(reportsPlatform.rows))
  );
});

