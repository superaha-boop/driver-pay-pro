const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

const html = fs.readFileSync(new URL("../index.html", `file://${__filename}`), "utf8");
const designSystem = fs.readFileSync(new URL("../styles/design-system.css", `file://${__filename}`), "utf8");
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

test("Calendar shell 使用 Design System、Monday-first 與必要導覽", () => {
  const calendarSection = html.match(/<section id="view-calendar"[\s\S]*?<\/section>\s*<section id="view-reports"/)?.[0] || "";
  assert.match(calendarSection, /class="calendar-page ds-page-container"/);
  assert.match(calendarSection, /id="calendarPreviousMonth"[\s\S]*?aria-label="上一個月"/);
  assert.match(calendarSection, /id="calendarNextMonth"[\s\S]*?aria-label="下一個月"/);
  assert.match(calendarSection, /id="calendarTodayButton"[\s\S]*?>今天<\/button>/);
  assert.match(calendarSection, /<span role="columnheader">一<\/span>[\s\S]*<span role="columnheader">日<\/span>/);
  assert.match(calendarSection, /id="calendarGrid" role="grid"/);
  assert.match(calendarSection, /class="ds-card calendar-record-card"/);
});

test("熱度只使用 Design System semantic tokens", () => {
  for (const level of [1, 2, 3, 4]) {
    assert.match(designSystem, new RegExp(`--color-calendar-heat-${level}:`));
    assert.match(html, new RegExp(`data-heat="${level}"\\] \\{ background: var\\(--color-calendar-heat-${level}\\)`));
  }
  const renderer = extractFunction("renderCalendarGrid");
  assert.doesNotMatch(renderer, /#[0-9a-f]{3,8}/i);
});

test("Calendar render、月份導覽與日期選取本身保持唯讀", () => {
  const readOnlyFunctions = [
    "renderCalendarGrid",
    "renderCalendarMonthSummary",
    "changeCalendarDisplayedMonth",
    "selectCalendarDate",
    "goToCalendarToday",
    "openCalendar"
  ].map(extractFunction).join("\n");
  assert.doesNotMatch(readOnlyFunctions, /saveState|ensureEntryForDate|blankEntry|localStorage\.setItem/);
  assert.match(html, /selectedDate > calendarState\.today/);
  assert.doesNotMatch(extractFunction("renderCalendarRecordCard"), /data-calendar-add|data-calendar-section|recordEditor/);
});

test("Calendar 工作紀錄卡只提供唯讀摘要", () => {
  const renderer = extractFunction("renderCalendarRecordCard");
  assert.match(renderer, /calendar-readonly-summary/);
  assert.match(renderer, /calendarIncomeSummaryTitle/);
  assert.match(renderer, /calendarWorkSummaryTitle/);
  assert.match(renderer, /calendarExpenseSummaryTitle/);
  assert.doesNotMatch(renderer, /data-calendar-add|data-calendar-section|recordEditorSave|recordEditorDelete/);
});

test("Calendar 不提供新增、編輯或刪除資料入口", () => {
  const calendarSection = html.match(/<section id="view-calendar"[\s\S]*?<section id="view-reports"/)?.[0] || "";
  assert.doesNotMatch(calendarSection, /data-calendar-add|data-calendar-section|data-calendar-edit-expense|data-calendar-remove-expense/);
  assert.match(calendarSection, /data-readonly="true"/);
});

test("本機儲存具備讀回驗證、最後有效快照與失敗回復", () => {
  assert.match(html, /const storageKey = "driverPayApp\.v2"/);
  assert.match(html, /const lastValidStorageKey = `\$\{storageKey\}\.lastValid`/);
  assert.match(html, /localStorage\.setItem\(storageKey, serialized\)/);
  assert.match(html, /readBack !== serialized/);
  assert.match(html, /localStorage\.setItem\(lastValidStorageKey, serialized\)/);
  assert.match(html, /previousSerialized === null\) localStorage\.removeItem\(storageKey\)/);
  assert.match(html, /localStorage\.setItem\(storageKey, previousSerialized\)/);
  assert.match(extractFunction("loadState"), /stateRecoveryNotice/);
});

test("persistence adapter 成功才更新記憶體，備份失敗會回復原值", () => {
  const persistenceSource = extractFunction("persistStatePayload");
  const runPersistence = ({ initial = null, failBackup = false }) => {
    const values = new Map();
    if (initial !== null) values.set("driverPayApp.v2", initial);
    const sandbox = {
      JSON,
      stateLoadError: new Error("old"),
      stateRecoveryNotice: "old",
      storageKey: "driverPayApp.v2",
      lastValidStorageKey: "driverPayApp.v2.lastValid",
      memory: null,
      console: { error() {} },
      cloneStatePayload(value) {
        return JSON.parse(JSON.stringify(value));
      },
      normalizeStatePayload(value) {
        if (!value || !Array.isArray(value.entries)) throw new Error("invalid");
        return value;
      },
      replaceStateContents(value) {
        sandbox.memory = value;
      },
      localStorage: {
        getItem(key) {
          return values.has(key) ? values.get(key) : null;
        },
        setItem(key, value) {
          if (failBackup && key === "driverPayApp.v2.lastValid") throw new Error("quota");
          values.set(key, value);
        },
        removeItem(key) {
          values.delete(key);
        }
      }
    };
    vm.runInNewContext(`${persistenceSource}; globalThis.result = persistStatePayload({ entries: [{ id: "new" }] }, { updateMemory: true });`, sandbox);
    return { result: sandbox.result, memory: sandbox.memory, values };
  };

  const success = runPersistence({});
  assert.equal(success.result, true);
  assert.deepEqual(success.memory, { entries: [{ id: "new" }] });
  assert.equal(success.values.get("driverPayApp.v2"), success.values.get("driverPayApp.v2.lastValid"));

  const original = JSON.stringify({ entries: [{ id: "original" }] });
  const failure = runPersistence({ initial: original, failBackup: true });
  assert.equal(failure.result, false);
  assert.equal(failure.memory, null);
  assert.equal(failure.values.get("driverPayApp.v2"), original);
});

test("Work Record Card 重用 canonical calculations 且不顯示平台 Logo", () => {
  const renderer = extractFunction("renderCalendarRecordCard");
  for (const name of ["entryTotal", "entryExpenses", "workMetrics", "hourlyRateDisplay"]) {
    assert.match(renderer, new RegExp(`${name}\\(`));
  }
  assert.doesNotMatch(renderer, /<img|platform-logo|brand-color/i);
  assert.match(renderer, /formatHours\(duration\.hours\)/);
  assert.match(renderer, /calendar-readonly-summary/);
  assert.doesNotMatch(renderer, /data-calendar-section|data-calendar-add|data-calendar-edit/);
});

test("Calendar Visual Polish 保留操作結構並建立清楚視覺層級", () => {
  assert.match(html, /\.calendar-page\.ds-page-container[\s\S]*?gap: var\(--spacing-2\)/);
  assert.match(html, /\.calendar-today-button[\s\S]*?min-width: 56px[\s\S]*?padding-inline: var\(--spacing-3\)/);
  assert.match(html, /\.calendar-weekdays[\s\S]*?font-weight: var\(--font-weight-bold\)/);
  assert.match(html, /\.calendar-date[\s\S]*?min-height: var\(--display-calendar-row-height\)[\s\S]*?grid-template-rows: var\(--calendar-day-marker-size\) auto 1fr/);
  assert.match(html, /\.calendar-date__amount[\s\S]*?white-space: nowrap/);
  assert.match(html, /calendar-record-date[\s\S]*?calendar-record-weekday/);
  assert.match(html, /calendar-readonly-summary/);
  assert.match(html, /aria-label="月曆編輯功能未啟用"/);
});

test("今天日期使用單一圓圈標記並保留完整日期格操作範圍", () => {
  const renderer = extractFunction("renderCalendarGrid");
  assert.doesNotMatch(html, /calendar-date__today-dot/);
  assert.doesNotMatch(renderer, /today-dot|today-line/);
  assert.match(html, /\.calendar-date\s*\{[\s\S]*?--calendar-day-marker-size: var\(--display-calendar-today-circle-size\)/);
  assert.match(html, /\.calendar-date__day\s*\{[\s\S]*?width: var\(--calendar-day-marker-size\)[\s\S]*?height: var\(--calendar-day-marker-size\)[\s\S]*?border: 2px solid transparent[\s\S]*?border-radius: var\(--radius-pill\)/);
  assert.match(html, /\.calendar-date\[aria-current="date"\] \.calendar-date__day[\s\S]*?border: 2px solid var\(--color-brand-pressed\)/);
  assert.match(html, /\.calendar-date\[aria-current="date"\]\[aria-selected="true"\] \.calendar-date__day[\s\S]*?color: var\(--color-text-inverse\)[\s\S]*?background: var\(--color-brand-pressed\)/);
  assert.match(html, /\.calendar-date\[aria-current="date"\]\[aria-selected="true"\][\s\S]*?background: transparent[\s\S]*?border-color: transparent/);
  assert.match(renderer, /\$\{isToday \? `aria-current="date"` : ""\}/);
  assert.match(renderer, /<span class="calendar-date__day">\$\{cell\.day\}<\/span>/);
  assert.match(html, /\.calendar-date[\s\S]*?min-height: var\(--display-calendar-row-height\)/);
});

test("所有日期共用固定 day slot，今天不使用位移補丁", () => {
  const dayRule = html.match(/\.calendar-date__day\s*\{([\s\S]*?)\n    \}/)?.[1] || "";
  const todayRule = html.match(/\.calendar-date\[aria-current="date"\] \.calendar-date__day\s*\{([\s\S]*?)\n    \}/)?.[1] || "";
  assert.match(dayRule, /display: grid/);
  assert.match(dayRule, /place-items: center/);
  assert.match(dayRule, /box-sizing: border-box/);
  assert.doesNotMatch(todayRule, /margin|top:|translate|position:/);
  assert.doesNotMatch(html, /\.calendar-date\[aria-current="date"\][\s\S]*?translateY/);
});

test("320px 仍使用相同模式槽位且不覆寫大字圓圈", () => {
  assert.match(html, /\.calendar-date\s*\{[\s\S]*?min-height: var\(--display-calendar-row-height\)/);
  assert.doesNotMatch(html, /@media \(max-width: 350px\)[\s\S]*?--calendar-day-marker-size:\s*32px/);
  assert.match(html, /\.calendar-date__amount\s*\{[\s\S]*?white-space: nowrap/);
});

test("鍵盤、ARIA、手勢與 reduced motion 契約存在", () => {
  assert.match(html, /role="gridcell"/);
  assert.match(html, /aria-selected="\$\{String\(isSelected\)\}"/);
  assert.match(html, /aria-current="date"/);
  assert.match(html, /tabindex="\$\{cell\.date === calendarState\.focusedDate \? "0" : "-1"\}"/);
  assert.match(html, /ArrowLeft:[\s\S]*?ArrowRight:[\s\S]*?ArrowUp:[\s\S]*?ArrowDown:/);
  assert.match(html, /Math\.abs\(deltaX\) < 48/);
  assert.match(html, /Math\.abs\(deltaX\) < Math\.abs\(deltaY\) \* 1\.25/);
  assert.match(html, /event\.clientX < 24 \|\| event\.clientX > window\.innerWidth - 24/);
  assert.match(html, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.calendar-grid/);
});

test("Calendar session state 不寫入 durable storage 並支援 lifecycle refresh", () => {
  const stateSource = [
    extractFunction("createCalendarState"),
    extractFunction("calendarStateWithDisplayedMonth"),
    extractFunction("calendarStateWithSelectedDate"),
    extractFunction("calendarStateWithRefreshedToday")
  ].join("\n");
  assert.doesNotMatch(stateSource, /localStorage|sessionStorage|saveState/);
  assert.match(html, /window\.addEventListener\("pageshow", refreshCalendarToday\)/);
  assert.match(html, /window\.addEventListener\("focus", refreshCalendarToday\)/);
  assert.match(html, /visibilitychange/);
  assert.match(html, /scheduleCalendarMidnightRefresh/);
});

test("PWA App Shell 更新為簡短 v36 cache 且保留必要資源", () => {
  assert.match(serviceWorker, /const CACHE_NAME = "driver-pay-pro-v36"/);
  assert.match(serviceWorker, /"\.\/index\.html"/);
  assert.match(serviceWorker, /"\.\/styles\/design-system\.css"/);
  assert.match(serviceWorker, /keys\.filter\(key => key !== CACHE_NAME\)/);
  assert.match(html, /const storageKey = "driverPayApp\.v2"/);
});
