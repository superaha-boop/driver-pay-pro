const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

const html = fs.readFileSync(new URL("../index.html", `file://${__filename}`), "utf8");
const serviceWorker = fs.readFileSync(new URL("../sw.js", `file://${__filename}`), "utf8");

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
  platforms: ["Uber", "LINE GO", "Yoxi", "55688"],
  settings: {
    platformRates: { Uber: 100, "LINE GO": 100, Yoxi: 100, "55688": 85 }
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
  defaultPlatformRates: state.settings.platformRates,
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

function record(date, income, expenses = 0, manualHours = 0) {
  return {
    id: date,
    date,
    incomes: { Uber: income },
    expenses: expenses ? { 油錢: expenses } : {},
    tips: 0,
    orders: income ? 1 : 0,
    km: 0,
    manualHours
  };
}

test("週期間固定為台北 date-only 的星期一到星期日", () => {
  assert.deepEqual(
    JSON.parse(JSON.stringify(reports.getLocalWeekRange("2026-07-19"))),
    { start: "2026-07-13", end: "2026-07-19", endExclusive: "2026-07-20" }
  );
  assert.equal(reports.getWeekLabel(reports.getLocalWeekRange("2026-07-19")), "7/13－7/19");
  assert.equal(reports.getPreviousWeekRange({ start: "2026-07-13" }).start, "2026-07-06");
});

test("月期間與跨月 Monday-first 週桶正確且只計入選定月份", () => {
  const range = reports.getLocalMonthRange("2026-07");
  assert.deepEqual(
    JSON.parse(JSON.stringify(range)),
    { start: "2026-07-01", end: "2026-07-31", endExclusive: "2026-08-01" }
  );
  const weeks = reports.getWeeksForMonth(range);
  assert.equal(weeks.length, 5);
  assert.equal(weeks[0].start, "2026-06-29");
  assert.equal(weeks[0].clipStart, "2026-07-01");
  assert.equal(weeks.at(-1).end, "2026-08-02");
  assert.equal(weeks.at(-1).clipEndExclusive, "2026-08-01");
});

test("共用 aggregator 正確計算收入、支出、淨收入、工時與工作天", () => {
  const range = reports.getLocalWeekRange("2026-07-13");
  const aggregate = reports.aggregateReport([
    record("2026-07-13", 4000, 500, 8),
    record("2026-07-14", 2750, 0, 5.5),
    record("2026-07-20", 9999, 0, 9)
  ], range);
  assert.equal(aggregate.recordCount, 2);
  assert.equal(aggregate.totalIncome, 6750);
  assert.equal(aggregate.totalExpenses, 500);
  assert.equal(aggregate.netIncome, 6250);
  assert.equal(aggregate.workDays, 2);
  assert.equal(aggregate.totalWorkDuration, 13.5 * 60 * 60 * 1000);
  assert.equal(aggregate.averageHourlyIncome, 6750 / 13.5);
});

test("月報以分月成本計算且 Calendar 原始付款值維持不變", () => {
  const allocated = {
    ...record("2026-07-29", 0, 0, 0),
    expenses: { 汽車保險: 12000 },
    expenseAllocations: {
      汽車保險: { months: 12, startMonth: "2026-07" }
    }
  };
  const july = reports.aggregateReport([allocated], reports.getLocalMonthRange("2026-07"));
  const august = reports.aggregateReport([allocated], reports.getLocalMonthRange("2026-08"));
  assert.equal(reports.entryExpenses(allocated), 12000);
  assert.equal(july.totalExpenses, 1000);
  assert.equal(july.netIncome, -1000);
  assert.equal(august.totalExpenses, 1000);
  assert.equal(august.netIncome, -1000);
  assert.equal(august.recordCount, 0);
  assert.equal(august.hasRecords, true);
});

test("零工時平均時薪使用不可用狀態，不產生 Infinity 或 NaN", () => {
  const aggregate = reports.aggregateReport(
    [record("2026-07-13", 2340, 0, 0)],
    reports.getLocalWeekRange("2026-07-13")
  );
  assert.equal(aggregate.averageHourlyIncome, null);
  assert.equal(aggregate.validWorkDuration, false);
  assert.equal(Number.isFinite(aggregate.netIncome), true);
});

test("平台名稱正規化集中處理內建別名並安全保留未知平台", () => {
  assert.equal(reports.normalizePlatformKey(" Uber "), "uber");
  assert.equal(reports.normalizePlatformKey("UBER"), "uber");
  assert.equal(reports.normalizePlatformKey("Line Go"), "lineGo");
  assert.equal(reports.normalizePlatformKey("linego"), "lineGo");
  assert.equal(reports.normalizePlatformKey("yoxi"), "yoxi");
  assert.equal(reports.normalizePlatformKey("台灣大車隊"), "taiwanTaxi");
  assert.equal(reports.normalizePlatformKey("Taiwan Taxi"), "taiwanTaxi");
  assert.equal(reports.normalizePlatformKey("大都會車隊"), "custom:大都會車隊");
  assert.equal(reports.platformDisplayName("taiwanTaxi"), "55688");
  assert.equal(reports.platformDisplayName("custom:大都會車隊", "  大都會車隊  "), "大都會車隊");
});

test("平台彙總合併已核准別名、排除小費並維持來源資料不變", () => {
  const source = [
    {
      ...record("2026-07-13", 1000, 0, 2),
      incomes: { Uber: 1000, uber: 500, "LINE GO": 500 },
      tips: 200
    },
    {
      ...record("2026-07-14", 0, 0, 1),
      incomes: { Yoxi: 600, "台灣大車隊": 1000, "大都會車隊": 400 },
      tips: 100
    }
  ];
  const before = JSON.stringify(source);
  const result = reports.aggregatePlatformIncome(
    source,
    reports.getLocalWeekRange("2026-07-13"),
    state.platforms
  );
  assert.equal(JSON.stringify(source), before);
  assert.equal(result.recordCount, 2);
  assert.equal(result.rows.find(row => row.platformKey === "uber").income, 1500);
  assert.equal(result.rows.find(row => row.platformKey === "lineGo").income, 500);
  assert.equal(result.rows.find(row => row.platformKey === "yoxi").income, 600);
  assert.equal(result.rows.find(row => row.platformKey === "taiwanTaxi").income, 1000);
  assert.equal(result.rows.find(row => row.platformKey === "custom:大都會車隊").income, 400);
  assert.equal(result.totalPlatformIncome, 4000);
  assert.equal(result.rows.reduce((sum, row) => sum + (row.share || 0), 0), 1);
});

test("平台彙總處理空資料、同額排序、未知平台、負數與無效值", () => {
  const range = reports.getLocalWeekRange("2026-07-13");
  const empty = reports.aggregatePlatformIncome([], range, state.platforms);
  assert.equal(empty.hasRecords, false);
  assert.equal(empty.hasData, false);
  assert.equal(empty.totalPlatformIncome, 0);

  const result = reports.aggregatePlatformIncome([
    { ...record("2026-07-13", 0), incomes: { Yoxi: 500, Uber: 500, Mystery: 250, "LINE GO": -50, Broken: "NaN" } }
  ], range, state.platforms);
  assert.deepEqual(
    JSON.parse(JSON.stringify(result.rows.slice(0, 2).map(row => row.platformKey))),
    ["uber", "yoxi"]
  );
  assert.equal(result.rows.find(row => row.platformKey === "lineGo").share, null);
  assert.equal(result.rows.find(row => row.platformKey === "custom:mystery").displayName, "Mystery");
  assert.equal(result.invalidPlatforms.length, 1);
  assert.equal(Number.isFinite(result.totalPlatformIncome), true);
});

test("上期空白、上期為零、負值跨越與支出方向皆不產生誤導百分比", () => {
  assert.equal(reports.compareReportMetric(100, 0).status, "previous-zero");
  assert.equal(reports.compareReportMetric(100, 0).percentage, null);
  assert.equal(reports.compareReportMetric(100, 50, { previousHasData: false }).status, "no-previous-data");
  assert.equal(reports.compareReportMetric(100, -50).status, "amount-only");
  assert.equal(reports.compareReportMetric(100, -50).percentage, null);
  assert.equal(reports.compareReportMetric(150, 100, { lowerIsBetter: true }).direction, "negative");
});

test("週趨勢固定七點並區分無紀錄與已儲存零值", () => {
  const points = reports.buildWeeklyNetTrend([
    record("2026-07-13", 1000, 0, 2),
    record("2026-07-15", 0, 0, 0),
    record("2026-07-17", 200, 500, 1)
  ], reports.getLocalWeekRange("2026-07-13"));
  assert.equal(points.length, 7);
  assert.equal(points[0].status, "positive");
  assert.equal(points[1].status, "no-record");
  assert.equal(points[2].status, "zero");
  assert.equal(points[4].status, "negative");
});

test("月趨勢使用 4–6 個週桶且月份邊界不混入外月資料", () => {
  const points = reports.buildMonthlyWeeklyNetTrend([
    record("2026-06-30", 9000, 0, 8),
    record("2026-07-01", 1000, 0, 2),
    record("2026-07-31", 2000, 0, 4),
    record("2026-08-01", 8000, 0, 8)
  ], reports.getLocalMonthRange("2026-07"));
  assert.equal(points.length, 5);
  assert.equal(points[0].value, 1000);
  assert.equal(points.at(-1).value, 2000);
});

test("重要日期以最早日期穩定解決同值，並排除零工時的最高時薪日", () => {
  const records = [
    record("2026-07-01", 1000, 0, 2),
    record("2026-07-02", 1000, 0, 2),
    record("2026-07-03", 500, 800, 1),
    record("2026-07-04", 9999, 0, 0)
  ];
  const important = reports.findImportantReportDates(records, "month");
  assert.equal(important.highestNet.date, "2026-07-04");
  assert.equal(important.lowestNet.date, "2026-07-03");
  assert.equal(important.longestWork.date, "2026-07-01");
  assert.equal(important.highestHourly.date, "2026-07-01");
});

test("Reports 狀態不再讀寫 legacy localStorage 設定並保留唯讀介面", () => {
  const setReportView = extractFunction("setReportView");
  const changeReportPeriod = extractFunction("changeReportPeriod");
  const appRouteHash = extractFunction("appRouteHash");
  assert.doesNotMatch(setReportView, /saveState|lastReportView/);
  assert.doesNotMatch(changeReportPeriod, /saveState|localStorage/);
  assert.match(appRouteHash, /return "#reports"/);
  assert.match(html, /role="tablist"/);
  assert.match(html, /role="tabpanel"/);
  assert.doesNotMatch(html.match(/<section id="view-reports"[\s\S]*?<\/section>\s*<section id="view-ai"/)?.[0] || "", /data-calendar-(?:add|edit|delete)/);
});

test("Local-first V1.1 Hotfix App Shell 使用 Service Worker cache v29", () => {
  assert.match(serviceWorker, /driver-pay-pro-v29/);
  assert.doesNotMatch(serviceWorker, /driver-pay-pro-v11/);
});
