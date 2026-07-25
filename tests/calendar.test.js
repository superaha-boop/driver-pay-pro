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
  "dateOnlyParts",
  "addLocalDays",
  "normalizeDateKey",
  "monthKeyFromDate",
  "daysInCalendarMonth",
  "addCalendarMonths",
  "mondayFirstWeekdayIndex",
  "generateCalendarMonthGrid",
  "formatCalendarNetAmount",
  "buildCalendarIncomeLevels",
  "getCalendarIncomeLevel",
  "createCalendarState",
  "calendarStateWithDisplayedMonth",
  "calendarStateWithSelectedDate",
  "calendarStateForToday",
  "calendarStateWithRefreshedToday",
  "calendarWeekdayLabel",
  "formatCalendarFullDate",
  "formatCalendarMonthTitle",
  "calendarDateAriaLabel",
  "finiteNumber",
  "nonNegativeNumber",
  "isWorkDayRecord"
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
  money(value) {
    return `NT$${Number(value).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  }
});
vm.runInContext(
  `${functionNames.map(extractFunction).join("\n")}\n`
  + `globalThis.calendar = { ${functionNames.join(", ")} };`,
  context
);
const calendar = context.calendar;

test("日期 key 驗證與加減日期不受本地時區偏移", () => {
  assert.equal(calendar.normalizeDateKey("2026-07-25"), "2026-07-25");
  assert.equal(calendar.normalizeDateKey("2026-02-29"), "");
  assert.equal(calendar.normalizeDateKey("2024-02-29"), "2024-02-29");
  assert.equal(calendar.addLocalDays("2026-07-31", 1), "2026-08-01");
  assert.equal(calendar.addLocalDays("2026-01-01", -1), "2025-12-31");
  assert.equal(calendar.monthKeyFromDate("2026-07-25"), "2026-07");
});

test("月份工具涵蓋前後月份、二月與閏年", () => {
  assert.equal(calendar.daysInCalendarMonth("2026-02"), 28);
  assert.equal(calendar.daysInCalendarMonth("2028-02"), 29);
  assert.equal(calendar.addCalendarMonths("2026-01", -1), "2025-12");
  assert.equal(calendar.addCalendarMonths("2026-12", 1), "2027-01");
  assert.equal(calendar.formatCalendarMonthTitle("2026-07"), "2026 年 7 月");
});

test("月份格固定星期一為第一欄並支援五列與六列", () => {
  const mondayMonth = calendar.generateCalendarMonthGrid("2026-06");
  assert.equal(mondayMonth[0].date, "2026-06-01");
  assert.equal(calendar.mondayFirstWeekdayIndex("2026-06-01"), 0);
  assert.equal(mondayMonth.length, 35);

  const sixRows = calendar.generateCalendarMonthGrid("2026-08");
  assert.equal(sixRows.length, 42);
  assert.equal(sixRows[0].date, "2026-07-27");
  assert.equal(sixRows.at(-1).date, "2026-09-06");
  assert.equal(sixRows.filter(cell => cell.isCurrentMonth).length, 31);
});

test("日期格金額格式區分無紀錄、零、負數與大額", () => {
  assert.equal(calendar.formatCalendarNetAmount(0, false), "");
  assert.equal(calendar.formatCalendarNetAmount(0, true), "—");
  assert.equal(calendar.formatCalendarNetAmount(999, true), "999");
  assert.equal(calendar.formatCalendarNetAmount(1000, true), "1k");
  assert.equal(calendar.formatCalendarNetAmount(1580, true), "1.6k");
  assert.equal(calendar.formatCalendarNetAmount(9999, true), "10k");
  assert.equal(calendar.formatCalendarNetAmount(10000, true), "10k");
  assert.equal(calendar.formatCalendarNetAmount(-1250, true), "-1.3k");
  assert.equal(calendar.formatCalendarNetAmount(9876543, true), "9877k");
  assert.equal(calendar.formatCalendarNetAmount(Number.NaN, true), "—");
});

test("少量收入使用最大值比例，單筆為 Level 4", () => {
  const single = calendar.buildCalendarIncomeLevels([{ date: "2026-07-01", net: 1000 }], "2026-07-31");
  assert.equal(calendar.getCalendarIncomeLevel(single, "2026-07-01"), 4);

  const levels = calendar.buildCalendarIncomeLevels([
    { date: "2026-07-01", net: 250 },
    { date: "2026-07-02", net: 500 },
    { date: "2026-07-03", net: 1000 }
  ], "2026-07-31");
  assert.deepEqual(
    [...levels.entries()],
    [["2026-07-01", 1], ["2026-07-02", 2], ["2026-07-03", 4]]
  );
});

test("四筆以上採分位數，相同收入統一 Level 2", () => {
  const quantiles = calendar.buildCalendarIncomeLevels([
    { date: "2026-07-01", net: 100 },
    { date: "2026-07-02", net: 200 },
    { date: "2026-07-03", net: 300 },
    { date: "2026-07-04", net: 5000 }
  ], "2026-07-31");
  assert.deepEqual([...quantiles.values()], [1, 2, 3, 4]);

  const equal = calendar.buildCalendarIncomeLevels([
    { date: "2026-07-01", net: 1000 },
    { date: "2026-07-02", net: 1000 },
    { date: "2026-07-03", net: 1000 },
    { date: "2026-07-04", net: 1000 }
  ], "2026-07-31");
  assert.deepEqual([...equal.values()], [2, 2, 2, 2]);
});

test("熱度排除零、負數、無效與未來日期", () => {
  const levels = calendar.buildCalendarIncomeLevels([
    { date: "2026-07-01", net: 0 },
    { date: "2026-07-02", net: -50 },
    { date: "2026-07-03", net: "bad" },
    { date: "2026-08-01", net: 1000 }
  ], "2026-07-25");
  assert.equal(levels.size, 0);
});

test("Calendar state 分離 selectedDate 與 displayedMonth", () => {
  const initial = calendar.createCalendarState("2026-07-25");
  assert.equal(initial.selectedDate, "2026-07-25");
  assert.equal(initial.displayedMonth, "2026-07");

  const browsed = calendar.calendarStateWithDisplayedMonth(initial, "2026-08");
  assert.equal(browsed.displayedMonth, "2026-08");
  assert.equal(browsed.selectedDate, "2026-07-25");

  const selected = calendar.calendarStateWithSelectedDate(browsed, "2026-08-03");
  assert.equal(selected.selectedDate, "2026-08-03");
  assert.equal(selected.displayedMonth, "2026-08");

  const externalFallback = calendar.createCalendarState("2026-07-25", "invalid");
  assert.equal(externalFallback.selectedDate, "2026-07-25");
});

test("跨午夜更新 Today 不會偷偷改變選取日期", () => {
  const state = calendar.createCalendarState("2026-07-25", "2026-07-20");
  const refreshed = calendar.calendarStateWithRefreshedToday(state, "2026-07-26");
  assert.equal(refreshed.today, "2026-07-26");
  assert.equal(refreshed.selectedDate, "2026-07-20");
  assert.equal(refreshed.displayedMonth, "2026-07");

  const today = calendar.calendarStateForToday(refreshed, "2026-07-26");
  assert.equal(today.selectedDate, "2026-07-26");
});

test("日期朗讀包含完整日期、星期、狀態與完整淨收入", () => {
  const label = calendar.calendarDateAriaLabel({
    date: "2026-07-24",
    today: "2026-07-24",
    selected: true,
    hasRecord: true,
    net: 1580
  });
  assert.match(label, /2026年7月24日/);
  assert.match(label, /星期五/);
  assert.match(label, /今天/);
  assert.match(label, /已選取/);
  assert.match(label, /NT\$1,580/);
});

test("工作天 selector 使用 canonical 衍生值且不修改紀錄", () => {
  const entry = Object.freeze({ date: "2026-07-24", orders: 0, km: 0 });
  assert.equal(calendar.isWorkDayRecord(entry, { durationMs: 0, total: 0, expenses: 0 }), false);
  assert.equal(calendar.isWorkDayRecord(entry, { durationMs: 60_000, total: 0, expenses: 0 }), true);
  assert.equal(calendar.isWorkDayRecord(entry, { durationMs: 0, total: 0, expenses: 100 }), true);
  assert.deepEqual(entry, { date: "2026-07-24", orders: 0, km: 0 });
});
