const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

const html = fs.readFileSync(new URL("../index.html", `file://${__filename}`), "utf8");

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
  "timeValueMs",
  "decimalHoursToMinutes",
  "minutesToHourMinuteParts",
  "deriveWorkTimeInputMode",
  "continuedWorkBreakMinutes",
  "validateWorkTimeRange",
  "calculateWorkMinutes",
  "formatWorkDuration",
  "clockWorkDurationMs",
  "sessionWorkDurationMs",
  "workMetrics",
  "hourlyRateQuality",
  "hourlyRate",
  "minutes",
  "finiteNumber",
  "nonNegativeNumber"
];

const context = vm.createContext({
  Date,
  Number,
  Object,
  String,
  workTimeUnits: Object.freeze({
    minuteMs: 60 * 1000,
    hourMs: 60 * 60 * 1000
  }),
  MIN_VALID_WORK_MINUTES: 10,
  MAX_REASONABLE_HOURLY_RATE: 2000,
  todayString: () => "2026-07-29",
  taipeiDateString: () => "2026-07-29"
});

vm.runInContext(
  `${functionNames.map(extractFunction).join("\n")}\n`
  + `globalThis.workTime = { ${functionNames.join(", ")} };`,
  context
);

test("手動修正開始與結束時間後，以欄位值取代舊計時 session", () => {
  const entry = {
    date: "2026-07-29",
    startTime: "10:00",
    endTime: "18:08",
    breakMinutes: 0,
    manualHours: 0,
    workSession: {
      status: "stopped",
      startedAt: "2026-07-29T03:00:00.000Z",
      endedAt: "2026-07-29T05:44:00.000Z",
      accumulatedBreakMs: 0
    }
  };

  const result = context.workTime.workMetrics(entry);

  assert.equal(result.durationMs, 488 * 60 * 1000);
  assert.equal(result.hours, 488 / 60);
});

test("08:00 到 17:00 休息 60 分鐘為 480 分鐘", () => {
  assert.equal(context.workTime.calculateWorkMinutes({
    startTime: "08:00",
    endTime: "17:00",
    breakMinutes: 60
  }), 480);
});

test("10:00 到 15:30 無休息為 330 分鐘", () => {
  assert.equal(context.workTime.calculateWorkMinutes({
    startTime: "10:00",
    endTime: "15:30",
    breakMinutes: 0
  }), 330);
});

test("跨午夜 22:00 到 02:00 休息 30 分鐘為 210 分鐘", () => {
  assert.equal(context.workTime.calculateWorkMinutes({
    startTime: "22:00",
    endTime: "02:00",
    breakMinutes: 30
  }), 210);
});

test("休息時間超過總經過時間會被拒絕", () => {
  const result = context.workTime.validateWorkTimeRange({
    startTime: "08:00",
    endTime: "09:00",
    breakMinutes: 61
  });
  assert.equal(result.valid, false);
  assert.equal(result.code, "break-exceeds-elapsed");
});

test("只有開始時間會標記為不完整", () => {
  const result = context.workTime.validateWorkTimeRange({ startTime: "08:00" });
  assert.equal(result.valid, false);
  assert.equal(result.code, "incomplete");
});

test("只有結束時間會標記為不完整", () => {
  const result = context.workTime.validateWorkTimeRange({ endTime: "17:00" });
  assert.equal(result.valid, false);
  assert.equal(result.code, "incomplete");
});

test("負數休息時間會被拒絕", () => {
  const result = context.workTime.validateWorkTimeRange({
    startTime: "08:00",
    endTime: "17:00",
    breakMinutes: -1
  });
  assert.equal(result.valid, false);
  assert.equal(result.code, "invalid-break");
});

test("相同開始與結束時間為 0 分鐘", () => {
  assert.equal(context.workTime.calculateWorkMinutes({
    startTime: "08:00",
    endTime: "08:00",
    breakMinutes: 0
  }), 0);
});

test("舊資料 7.5 小時轉為 450 分鐘", () => {
  assert.equal(context.workTime.decimalHoursToMinutes(7.5), 450);
});

test("舊資料 7.333333 小時明確四捨五入為 440 分鐘", () => {
  assert.equal(context.workTime.decimalHoursToMinutes(7.333333), 440);
});

test("無效與負數 decimal hours 安全回到 0 分鐘", () => {
  assert.equal(context.workTime.decimalHoursToMinutes("invalid"), 0);
  assert.equal(context.workTime.decimalHoursToMinutes(-2), 0);
});

test("488 分鐘拆成 8 小時 8 分鐘", () => {
  assert.deepEqual(
    JSON.parse(JSON.stringify(context.workTime.minutesToHourMinuteParts(488))),
    { hours: 8, minutes: 8 }
  );
});

test("0 分鐘顯示自然語言", () => {
  assert.equal(context.workTime.formatWorkDuration(0), "0 分鐘");
});

test("20 分鐘顯示自然語言", () => {
  assert.equal(context.workTime.formatWorkDuration(20), "20 分鐘");
});

test("60 分鐘顯示自然語言", () => {
  assert.equal(context.workTime.formatWorkDuration(60), "1 小時");
});

test("80 分鐘顯示自然語言", () => {
  assert.equal(context.workTime.formatWorkDuration(80), "1 小時 20 分");
});

test("488 分鐘顯示自然語言", () => {
  assert.equal(context.workTime.formatWorkDuration(488), "8 小時 8 分");
});

test("有效開始與結束時間優先於舊手動工時", () => {
  const result = context.workTime.workMetrics({
    date: "2026-07-29",
    startTime: "08:00",
    endTime: "09:00",
    breakMinutes: 0,
    manualHours: 8
  });
  assert.equal(result.workMinutes, 60);
});

test("工時輸入方式由既有欄位推導且舊雙值優先顯示時鐘模式", () => {
  assert.equal(context.workTime.deriveWorkTimeInputMode({}), "clock");
  assert.equal(context.workTime.deriveWorkTimeInputMode({ manualHours: 9 + 10 / 60 }), "manual");
  assert.equal(context.workTime.deriveWorkTimeInputMode({
    startTime: "08:00",
    endTime: "17:00",
    manualHours: 9 + 10 / 60
  }), "clock");
});

test("手動 9 小時 10 分維持 550 分鐘", () => {
  assert.equal(context.workTime.decimalHoursToMinutes(9 + 10 / 60), 550);
});

test("再跑一段把收工空檔累加到既有休息分鐘", () => {
  const endMs = Date.parse("2026-07-29T10:00:00+08:00");
  const firstContinueMs = Date.parse("2026-07-29T11:00:00+08:00");
  const secondEndMs = Date.parse("2026-07-29T12:00:00+08:00");
  const secondContinueMs = Date.parse("2026-07-29T12:30:00+08:00");
  const firstBreak = context.workTime.continuedWorkBreakMinutes(20, endMs, firstContinueMs);
  const secondBreak = context.workTime.continuedWorkBreakMinutes(firstBreak, secondEndMs, secondContinueMs);
  assert.equal(firstBreak, 80);
  assert.equal(secondBreak, 110);
});

test("系統時間早於最後收工時間時拒絕再跑一段", () => {
  const endMs = Date.parse("2026-07-29T11:00:00+08:00");
  const nowMs = Date.parse("2026-07-29T10:59:00+08:00");
  assert.equal(context.workTime.continuedWorkBreakMinutes(0, endMs, nowMs), null);
});

test("缺少開始與結束時間時沿用舊手動工時", () => {
  const result = context.workTime.workMetrics({
    date: "2026-07-28",
    manualHours: 7.333333
  });
  assert.equal(result.workMinutes, 440);
});

test("canonical durationMs 一律由整數分鐘產生", () => {
  const result = context.workTime.workMetrics({
    date: "2026-07-28",
    manualHours: 1.111111
  });
  assert.equal(result.workMinutes, 67);
  assert.equal(result.durationMs, 67 * 60 * 1000);
});

test("零工時平均時薪為 0", () => {
  assert.equal(context.workTime.hourlyRate(2340, 0), 0);
});

test("8 小時收入 4000 元平均時薪為 500", () => {
  assert.equal(context.workTime.hourlyRate(4000, 480 * 60 * 1000), 500);
});

test("少於 10 分鐘不計算時薪", () => {
  assert.equal(context.workTime.hourlyRateQuality(1000, 9).status, "insufficient-work-time");
  assert.equal(context.workTime.hourlyRate(1000, 9 * 60 * 1000), 0);
});

test("10 分鐘且時薪合理可以計算", () => {
  assert.equal(context.workTime.hourlyRateQuality(300, 10).hourlyRate, 1800);
});

test("時薪超過 2000 元標記異常", () => {
  const result = context.workTime.hourlyRateQuality(400, 10);
  assert.equal(result.status, "abnormal-hourly-rate");
  assert.equal(result.hourlyRate, null);
});

test("手動工時介面使用小時與分鐘欄位，不再使用小數鍵盤", () => {
  assert.match(html, /<input[^>]*inputmode="numeric"[^>]*id="manualHoursPart"[^>]*>/);
  assert.match(html, /<input[^>]*inputmode="numeric"[^>]*id="manualMinutesPart"[^>]*>/);
  assert.doesNotMatch(html, /id="manualHours"[^>]*inputmode="decimal"/);
});

test("每日紀錄核心表單預設展開且其他資料預設收合", () => {
  assert.match(html, /id="manualEntryToggle"[^>]*aria-expanded="true"/);
  assert.match(html, /class="panel-body"[^>]*id="manualEntryContent"/);
  assert.match(html, /id="otherDataToggle"[^>]*aria-expanded="false"/);
});

test("Today 工作狀態卡以整條標題列控制同一份工作明細", () => {
  assert.doesNotMatch(html, /id="workPrimaryTime"/);
  assert.match(html, /<button class="work-status-row" id="workDetailsToggle"[^>]*aria-expanded="false"[^>]*aria-controls="workMetrics"/);
  assert.doesNotMatch(html, /class="work-time-overview"|class="work-details-toggle"|>工作明細</);
  const controls = html.slice(html.indexOf("function updateWorkControls("), html.indexOf("function updateCurrentWeather("));
  assert.doesNotMatch(controls, /workPrimaryTime/);
  assert.match(controls, /els\.workActual\.textContent = formatWorkDuration\(actualMinutes\)/);
  assert.doesNotMatch(controls, /今日工時|已工作/);
  assert.doesNotMatch(html, /els\.workActual\.textContent = clockDuration/);
});

test("Today 工時變更使用安全 persistence 後才發出單一更新通知", () => {
  const start = html.indexOf("function saveTodayWorkTimeFromForm(");
  const end = html.indexOf("function scheduleTodayWorkTimeSave(", start);
  const source = html.slice(start, end);
  assert.ok(source.indexOf("persistStatePayload(nextState, { updateMemory: true })") < source.indexOf("notifyRecordChanged("));
});

test("CSV 工時欄使用同一個自然語言分鐘格式", () => {
  const start = html.indexOf("function exportCsv(");
  const end = html.indexOf("function handlePrimaryWorkAction(", start);
  assert.match(html.slice(start, end), /formatWorkDuration\(work\.workMinutes\)/);
});

test("開始暫停繼續收工都先安全儲存再更新畫面", () => {
  const start = html.indexOf("function commitTodayWorkSession(");
  const end = html.indexOf("function startRunNow(", start);
  const source = html.slice(start, end);
  assert.ok(source.indexOf("persistStatePayload(nextState, { updateMemory: true })") < source.indexOf("notifyRecordChanged("));
  assert.match(html.slice(end), /commitTodayWorkSession\(targetDate, entry\)/);
});

test("手動小時與分鐘各自限制合法整數範圍", () => {
  const start = html.indexOf("function validateManualWorkTimeParts(");
  const end = html.indexOf("function syncManualWorkTimeParts(", start);
  const source = html.slice(start, end);
  assert.match(source, /hourPart < 0 \|\| hourPart > 24/);
  assert.match(source, /minutePart < 0 \|\| minutePart > 59/);
});
