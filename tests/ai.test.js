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
  "money",
  "number",
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
  "findImportantReportDates",
  "formatCalendarFullDate",
  "reportDateLabel",
  "formatReportDuration",
  "validAnalysisEntries",
  "aiDayAggregate",
  "aiRecordHasInvalidAmount",
  "buildAIDataQuality",
  "buildAiAnalysisContext",
  "aiInsightTarget",
  "hourlyRateStatusMessage",
  "buildAIInsights"
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
const fixtureNow = new Date(`${fixture.today}T12:00:00+08:00`);
class FixtureDate extends Date {
  constructor(...args) {
    super(...(args.length ? args : [fixtureNow.getTime()]));
  }

  static now() {
    return fixtureNow.getTime();
  }
}
const context = vm.createContext({
  Date: FixtureDate,
  Intl,
  Map,
  Math,
  Number,
  Object,
  Set,
  String,
  Array,
  state,
  stateLoadError: null,
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
  + `${sharedAnalyticsSource}\n`
  + "globalThis.ai = { sharedAnalytics, buildAiAnalysisContext, buildAIInsights };",
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

test("AI 與 Reports 共用分月後的每月成本", () => {
  const originalEntries = state.entries;
  state.entries = [{
    id: "insurance",
    date: "2026-07-29",
    incomes: {},
    expenses: { 汽車保險: 12000 },
    expenseAllocations: {
      汽車保險: { months: 12, startMonth: "2026-07" }
    }
  }];
  const source = context.ai.buildAiAnalysisContext();
  const reportsAggregate = context.ai.sharedAnalytics.aggregateReport(
    state.entries,
    context.ai.sharedAnalytics.getLocalMonthRange("2026-07")
  );
  state.entries = originalEntries;
  assert.equal(source.monthAggregate.totalExpenses, 1000);
  assert.equal(source.monthAggregate.netIncome, -1000);
  assert.equal(source.monthAggregate.totalExpenses, reportsAggregate.totalExpenses);
  assert.equal(source.monthAggregate.netIncome, reportsAggregate.netIncome);
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

test("Insight Engine 輸出三個 V1 區塊、證據與分析依據", () => {
  const source = context.ai.buildAiAnalysisContext();
  const insights = context.ai.buildAIInsights({
    currentWeek: source.currentWeek,
    previousWeek: source.previousWeek,
    weekComparison: source.weekComparison,
    currentMonth: source.monthAggregate,
    previousMonth: source.previousMonthAggregate,
    monthComparison: source.monthComparison,
    platformMonth: source.monthPlatformAggregate,
    importantDates: source.importantDates,
    monthlyTrend: source.monthlyTrend,
    dataQuality: source.dataQuality,
    goalState: source.goalState,
    ranges: source.ranges
  });
  assert.equal(Array.isArray(insights.operatingRecommendations), true);
  assert.equal(insights.operatingRecommendations.length >= 1, true);
  assert.equal(insights.operatingRecommendations.length <= 3, true);
  assert.equal(Array.isArray(insights.monthlyInsights), true);
  assert.equal(Array.isArray(insights.smartReminders), true);
  assert.equal(insights.analysisMetadata.recordCount, source.monthAggregate.recordCount);
  assert.equal(insights.analysisMetadata.workDays, source.monthAggregate.workDays);
  assert.equal(insights.analysisMetadata.period.start, "2026-07-01");
  for (const item of insights.operatingRecommendations) {
    assert.equal(typeof item.title, "string");
    assert.equal(typeof item.action, "string");
    assert.equal(typeof item.evidence, "string");
    assert.equal(typeof item.period, "string");
    assert.equal(typeof item.sufficiency, "string");
    assert.equal(typeof item.accessibleName, "string");
  }
});

test("AI UI 預設只完整顯示本週重點，詳細分析保留精確導覽", () => {
  const aiSection = html.match(/<section id="view-ai"[\s\S]*?<\/section>\s*<section id="view-settings"/)?.[0] || "";
  assert.match(aiSection, />本週重點</);
  assert.match(aiSection, />本月洞察</);
  assert.match(aiSection, />收入變化來源</);
  assert.match(aiSection, />資料與分析依據</);
  assert.equal((aiSection.match(/class="app-disclosure__content"[^>]* hidden/g) || []).length, 3);
  assert.doesNotMatch(aiSection, />平台表現</);
  assert.match(html, /data-ai-calendar-date/);
  assert.match(html, /data-ai-report-view/);
  assert.match(html, /driverpay:recordchange/);
  assert.match(html, /離線・使用本機資料/);
});

test("AI 與 Reports 共用最低 10 分鐘及 2000 元時薪上限", () => {
  const monthRange = context.ai.sharedAnalytics.getLocalMonthRange("2026-07");
  for (const [minutes, expected] of [[0, "missing-work-time"], [2, "insufficient-work-time"], [9, "insufficient-work-time"]]) {
    const aggregate = context.ai.sharedAnalytics.aggregateReport([{
      date: "2026-07-26",
      incomes: { Uber: 1000 },
      manualHours: minutes / 60
    }], monthRange);
    assert.equal(aggregate.hourlyRateStatus, expected);
    assert.equal(aggregate.averageHourlyIncome, null);
  }

  const valid = context.ai.sharedAnalytics.aggregateReport([{
    date: "2026-07-26",
    incomes: { Uber: 1000 },
    manualHours: 0.5
  }], monthRange);
  assert.equal(valid.hourlyRateStatus, "complete");
  assert.equal(valid.averageHourlyIncome, 2000);

  const abnormal = context.ai.sharedAnalytics.aggregateReport([{
    date: "2026-07-26",
    incomes: { Uber: 1100 },
    manualHours: 0.5
  }], monthRange);
  assert.equal(abnormal.hourlyRateStatus, "abnormal-hourly-rate");
  assert.equal(abnormal.averageHourlyIncome, null);
});

test("AI 對異常時薪顯示檢查提示且不產生正常表現結論", () => {
  const originalEntries = state.entries;
  state.entries = [{
    date: "2026-07-26",
    incomes: { Uber: 1100 },
    expenses: {},
    manualHours: 0.5
  }];
  const source = context.ai.buildAiAnalysisContext();
  const insights = context.ai.buildAIInsights({
    currentWeek: source.currentWeek,
    previousWeek: source.previousWeek,
    weekComparison: source.weekComparison,
    currentMonth: source.monthAggregate,
    previousMonth: source.previousMonthAggregate,
    monthComparison: source.monthComparison,
    platformMonth: source.monthPlatformAggregate,
    importantDates: source.importantDates,
    monthlyTrend: source.monthlyTrend,
    dataQuality: source.dataQuality,
    goalState: source.goalState,
    ranges: source.ranges
  });
  state.entries = originalEntries;
  const output = JSON.stringify(insights);
  assert.match(output, /時薪資料可能異常/);
  assert.doesNotMatch(output, /表現非常好|本月平均時薪.*2,200/);
});
