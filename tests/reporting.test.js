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
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = "";
      }
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
  "localDateString",
  "dateOnlyParts",
  "addLocalDays",
  "compactWeekRange",
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
  "minutes",
  "finiteNumber",
  "nonNegativeNumber",
  "weekStart",
  "weekEnd"
];

const context = vm.createContext({
  Date,
  Intl,
  Number,
  Object,
  String,
  workTimeUnits: Object.freeze({
    minuteMs: 60 * 1000,
    hourMs: 60 * 60 * 1000
  }),
  MIN_VALID_WORK_MINUTES: 10,
  MAX_REASONABLE_HOURLY_RATE: 2000
});
vm.runInContext(
  `${functionNames.map(extractFunction).join("\n")}\n`
  + `globalThis.reporting = { ${functionNames.join(", ")} };`,
  context
);
const reporting = context.reporting;

test("週期固定為星期一至星期日", () => {
  assert.equal(reporting.weekStart("2026-07-13"), "2026-07-13");
  assert.equal(reporting.weekEnd("2026-07-13"), "2026-07-19");
  assert.equal(reporting.compactWeekRange("2026-07-13", "2026-07-19"), "7/13－7/19");
});

test("星期日仍歸屬同一個星期一開始的週", () => {
  assert.equal(reporting.weekStart("2026-07-19"), "2026-07-13");
  assert.equal(reporting.weekEnd("2026-07-19"), "2026-07-19");
});

test("下一個星期一開啟新週", () => {
  assert.equal(reporting.weekStart("2026-07-20"), "2026-07-20");
  assert.equal(reporting.weekEnd("2026-07-20"), "2026-07-26");
  assert.equal(reporting.compactWeekRange("2026-07-20", "2026-07-26"), "7/20－7/26");
});

test("跨月與跨年週期格式正確", () => {
  assert.equal(reporting.weekEnd("2026-06-29"), "2026-07-05");
  assert.equal(reporting.compactWeekRange("2026-06-29", "2026-07-05"), "6/29－7/5");
  assert.equal(reporting.weekEnd("2026-12-28"), "2027-01-03");
  assert.equal(
    reporting.compactWeekRange("2026-12-28", "2027-01-03"),
    "2026/12/28－2027/1/3"
  );
});

test("正常、無休息與跨午夜工時使用毫秒標準化", () => {
  const currentDate = "2026-07-25";
  const now = Date.parse("2026-07-25T15:00:00+08:00");
  const duration = entry => reporting.workMetrics(entry, now, currentDate).durationMs;
  assert.equal(duration({
    date: "2026-07-13",
    startTime: "08:00",
    endTime: "17:00",
    breakMinutes: 60
  }), 8 * 60 * 60 * 1000);
  assert.equal(duration({
    date: "2026-07-14",
    startTime: "10:00",
    endTime: "15:30",
    breakMinutes: 0
  }), 5.5 * 60 * 60 * 1000);
  assert.equal(duration({
    date: "2026-07-15",
    startTime: "22:00",
    endTime: "02:00",
    breakMinutes: 30
  }), 3.5 * 60 * 60 * 1000);
});

test("歷史未收工紀錄不會隨目前時間持續增加", () => {
  const entry = {
    date: "2026-07-13",
    startTime: "",
    endTime: "",
    breakMinutes: 0,
    workSession: {
      status: "running",
      startedAt: "2026-06-29T20:00:00+08:00",
      segmentStartedAt: "2026-06-29T20:00:00+08:00",
      accumulatedActiveMs: 0,
      accumulatedBreakMs: 0
    }
  };
  const firstNow = Date.parse("2026-07-25T15:00:00+08:00");
  const laterNow = firstNow + 2 * 60 * 60 * 1000;
  const oldAlgorithmHours =
    (firstNow - Date.parse(entry.workSession.segmentStartedAt)) / (60 * 60 * 1000);
  assert.equal(oldAlgorithmHours, 619);
  assert.equal(reporting.workMetrics(entry, firstNow, "2026-07-25").durationMs, 0);
  assert.equal(reporting.workMetrics(entry, laterNow, "2026-07-25").durationMs, 0);
});

test("七天工時加總為 33 小時 30 分，平均時薪一致", () => {
  const hours = [8, 6.5, 0, 7, 8, 4, 0];
  const durationMs = hours.reduce((total, manualHours, index) => {
    const day = String(13 + index).padStart(2, "0");
    return total + reporting.workMetrics({
      date: `2026-07-${day}`,
      manualHours
    }, Date.parse("2026-07-25T15:00:00+08:00"), "2026-07-25").durationMs;
  }, 0);
  assert.equal(durationMs, 33.5 * 60 * 60 * 1000);
  assert.equal(reporting.hourlyRate(16750, durationMs), 500);
  assert.equal(reporting.hourlyRate(2340, 0), 0);
});

test("PWA 發布會更新 Service Worker 並淘汰舊 App Shell", () => {
  assert.match(serviceWorker, /driver-pay-pro-v20/);
  assert.doesNotMatch(serviceWorker, /driver-pay-pro-v11/);
  assert.doesNotMatch(serviceWorker, /driver-pay-pro-v07-design-system-foundation/);
  assert.doesNotMatch(serviceWorker, /driver-pay-pro-v06-calendar-report-navigation/);
  assert.doesNotMatch(serviceWorker, /driver-pay-pro-v05-monday-week-worktime-fix/);
  assert.doesNotMatch(serviceWorker, /driver-pay-pro-v04-official-master-icon-v1/);
  assert.match(serviceWorker, /new Request\(event\.request, \{ cache: "no-store" \}\)/);
  assert.match(html, /register\("\.\/sw\.js", \{ updateViaCache: "none" \}\)/);
  assert.match(html, /addEventListener\("controllerchange"/);
});
