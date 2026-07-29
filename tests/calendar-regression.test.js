const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

const html = fs.readFileSync(new URL("../index.html", `file://${__filename}`), "utf8");
const fixture = JSON.parse(
  fs.readFileSync(new URL("./fixtures/calendar-regression.json", `file://${__filename}`), "utf8")
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
  "dateOnlyParts",
  "normalizeDateKey",
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
  "entryGrossIncome",
  "entryExpenses",
  "entryTotal",
  "entryNet",
  "recordDataQuality",
  "summarize",
  "isWorkDayRecord",
  "summarizeCalendarMonth",
  "buildCalendarIncomeLevels"
];

const context = vm.createContext({
  Array,
  Date,
  Intl,
  Map,
  Math,
  Number,
  Object,
  Set,
  String,
  state: {
    platforms: fixture.platforms,
    settings: { platformRates: fixture.platformRates }
  },
  defaultPlatformRates: fixture.platformRates,
  workTimeUnits: {
    minuteMs: 60_000,
    hourMs: 3_600_000,
    dayMs: 86_400_000
  },
  MIN_VALID_WORK_MINUTES: 10,
  MAX_REASONABLE_HOURLY_RATE: 2000,
  todayString() {
    return "2026-07-25";
  },
  taipeiDateString(date) {
    return date.toISOString().slice(0, 10);
  }
});
vm.runInContext(
  `${functionNames.map(extractFunction).join("\n")}\n`
  + `globalThis.regression = { ${functionNames.join(", ")} };`,
  context
);
const regression = context.regression;

function derived(entry) {
  const metrics = regression.workMetrics(entry, Date.UTC(2026, 6, 25), "2026-07-25");
  const total = regression.entryTotal(entry);
  const expenses = regression.entryExpenses(entry);
  const net = regression.entryNet(entry);
  return {
    total,
    expenses,
    net,
    durationMinutes: metrics.durationMs / 60_000,
    hourly: regression.hourlyRate(net, metrics.durationMs)
  };
}

test("固定 Calendar regression fixture 覆蓋 12 個必要情境", () => {
  const scenarios = new Set(fixture.records.map(item => item.scenario));
  assert.equal(fixture.emptyDate, "2026-06-12");
  assert.equal(fixture.records.length, 11);
  for (const required of [
    "positive-net",
    "zero-net",
    "negative-net",
    "income-without-work-time",
    "work-time-without-income",
    "multiple-platforms",
    "expenses",
    "weather-and-note",
    "cross-midnight",
    "very-large-amount",
    "incomplete-legacy-record"
  ]) {
    assert.equal(scenarios.has(required), true, `缺少 ${required}`);
  }
});

test("Today、Calendar 與 Reports 的 canonical 計算符合固定預期", () => {
  fixture.records.forEach(({ scenario, entry, expected }) => {
    assert.deepEqual(derived(entry), expected, scenario);
  });

  const sourceContracts = {
    renderStats: ["summarize"],
    renderCalendarRecordCard: ["entryTotal", "entryExpenses", "entryNet", "workMetrics", "hourlyRate"],
    renderWeeks: ["aggregateReport"],
    renderMonthReport: ["aggregateReport"]
  };
  Object.entries(sourceContracts).forEach(([renderer, selectors]) => {
    const source = extractFunction(renderer);
    selectors.forEach(selector => assert.match(source, new RegExp(`${selector}\\(`)));
  });
});

test("月份摘要與工作天判斷使用相同衍生值", () => {
  const entries = fixture.records.map(item => item.entry);
  const expected = entries.reduce((summary, entry) => {
    const values = derived(entry);
    summary.total += values.total;
    summary.expenses += values.expenses;
    summary.net += values.net;
    summary.durationMinutes += values.durationMinutes;
    if (values.total !== 0 || values.expenses !== 0 || values.durationMinutes > 0) summary.workDays += 1;
    return summary;
  }, { total: 0, expenses: 0, net: 0, durationMinutes: 0, workDays: 0 });

  const actual = regression.summarizeCalendarMonth(entries);
  assert.equal(actual.total, expected.total);
  assert.equal(actual.expenses, expected.expenses);
  assert.equal(actual.net, expected.net);
  assert.equal(actual.durationMs / 60_000, expected.durationMinutes);
  assert.equal(actual.workDays, expected.workDays);
});

test("Calendar heatmap 只接受有效日期的正淨收入", () => {
  const records = fixture.records.map(({ entry }) => ({ date: entry.date, net: regression.entryNet(entry) }));
  const levels = regression.buildCalendarIncomeLevels(records, "2026-06-30");
  assert.equal(levels.has("2026-06-02"), false, "零淨收入不可有熱度");
  assert.equal(levels.has("2026-06-03"), false, "負淨收入不可有熱度");
  assert.equal(levels.has("2026-06-05"), false, "只有工時不可有熱度");
  assert.equal(levels.has("2026-06-11"), false, "不完整舊資料不可有熱度");
  assert.equal(levels.get("2026-06-10"), 4, "最高正淨收入應為最高熱度");
});

test("儲存序列化失敗時保留主資料與最後有效快照", () => {
  const persistenceSource = extractFunction("persistStatePayload");
  const original = JSON.stringify({ entries: [{ id: "original" }] });
  const backup = JSON.stringify({ entries: [{ id: "backup" }] });
  const values = new Map([
    ["driverPayApp.v2", original],
    ["driverPayApp.v2.lastValid", backup]
  ]);
  const sandbox = {
    JSON,
    stateLoadError: null,
    stateRecoveryNotice: "",
    storageKey: "driverPayApp.v2",
    lastValidStorageKey: "driverPayApp.v2.lastValid",
    console: { error() {} },
    cloneStatePayload() {
      throw new Error("serialization");
    },
    normalizeStatePayload(value) {
      return value;
    },
    replaceStateContents() {
      throw new Error("不應更新記憶體");
    },
    localStorage: {
      getItem(key) {
        return values.has(key) ? values.get(key) : null;
      },
      setItem(key, value) {
        values.set(key, value);
      },
      removeItem(key) {
        values.delete(key);
      }
    }
  };
  vm.runInNewContext(
    `${persistenceSource}; globalThis.result = persistStatePayload({ entries: [] }, { updateMemory: true });`,
    sandbox
  );
  assert.equal(sandbox.result, false);
  assert.equal(values.get("driverPayApp.v2"), original);
  assert.equal(values.get("driverPayApp.v2.lastValid"), backup);
});

test("Record Editor 錯誤訊息與關閉後焦點具備可驗證契約", () => {
  const statusSource = extractFunction("setRecordEditorStatus");
  const closeSource = extractFunction("finishRecordEditorClose");
  assert.match(statusSource, /isError \? "alert" : "status"/);
  assert.match(statusSource, /isError \? "assertive" : "polite"/);
  assert.match(statusSource, /aria-describedby/);
  assert.match(statusSource, /aria-invalid/);
  assert.match(closeSource, /returnFocus\?\.isConnected/);
  assert.match(closeSource, /returnFocusSelector/);
  assert.match(closeSource, /data-calendar-date/);
});

test("Regression 不改資料 key，Calendar session state 仍不持久化", () => {
  assert.match(html, /const storageKey = "driverPayApp\.v2"/);
  const sessionState = [
    extractFunction("createCalendarState"),
    extractFunction("calendarStateWithDisplayedMonth"),
    extractFunction("calendarStateWithSelectedDate")
  ].join("\n");
  assert.doesNotMatch(sessionState, /localStorage|sessionStorage|saveState/);
});
