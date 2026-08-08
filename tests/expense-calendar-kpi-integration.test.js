const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

const html = fs.readFileSync(new URL("../index.html", `file://${__filename}`), "utf8");
const designSystem = fs.readFileSync(new URL("../styles/design-system.css", `file://${__filename}`), "utf8");
const serviceWorker = fs.readFileSync(new URL("../sw.js", `file://${__filename}`), "utf8");

function extractFunction(name) {
  const start = html.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `找不到 ${name}()`);
  const bodyStart = html.indexOf("{", start);
  let depth = 0;
  let quote = "";
  let escaped = false;
  for (let index = bodyStart; index < html.length; index += 1) {
    const char = html[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = "";
      continue;
    }
    if (char === "'" || char === '"' || char === "`") {
      quote = char;
      continue;
    }
    if (char === "{") depth += 1;
    if (char === "}" && --depth === 0) return html.slice(start, index + 1);
  }
  throw new Error(`${name}() 結尾不完整`);
}

const expenseHelpers = [
  "dateOnlyParts",
  "normalizeDateKey",
  "normalizeExpenseAllocation",
  "expenseAllocationFor",
  "expenseAllocationMonth",
  "expenseAllocationAmount",
  "reportExpenseSummary"
];
const expenseContext = vm.createContext({ Array, Date, Map, Math, Number, Object, String });
vm.runInContext(
  `${expenseHelpers.map(extractFunction).join("\n")}\n`
  + `globalThis.api = { ${expenseHelpers.join(", ")} };`,
  expenseContext
);

test("月報支出 selector 同時提供日期與分類單一來源", () => {
  const records = [
    { date: "2026-08-01", expenses: { "油錢／電費": 1350 } },
    { date: "2026-08-04", expenses: { "油錢／電費": 800, 停車費: 200 } }
  ];
  const summary = expenseContext.api.reportExpenseSummary(records, {
    start: "2026-08-01",
    endExclusive: "2026-09-01"
  });
  assert.equal(summary.total, 2350);
  assert.equal(summary.byCategory.get("油錢／電費").total, 2150);
  assert.equal(summary.byCategory.get("油錢／電費").occurrenceCount, 2);
  assert.equal(summary.byCategory.get("油錢／電費").actualPaymentTotal, 2150);
  assert.equal(summary.byDate.get("2026-08-04").total, 1000);
});

test("分月成本與本月實際付款保持不同口徑", () => {
  const summary = expenseContext.api.reportExpenseSummary([{
    date: "2026-08-20",
    expenses: { 汽車保險: 12000 },
    expenseAllocations: { 汽車保險: { months: 12, startMonth: "2026-08" } }
  }], { start: "2026-08-01", endExclusive: "2026-09-01" });
  const insurance = summary.byCategory.get("汽車保險");
  assert.equal(insurance.total, 1000);
  assert.equal(insurance.actualPaymentTotal, 12000);
  assert.equal(insurance.items[0].allocated, true);
});

test("月報分類只顯示有金額類別並固定油錢優先", () => {
  const source = extractFunction("renderMonthReport");
  assert.match(source, /expenseSummary\.byCategory/);
  assert.match(source, /fuelNames/);
  assert.match(source, /b\.total - a\.total/);
  assert.match(source, /filter|expenseCategories\.length/);
});

test("月報分類整排原地 disclosure 並保留明細備註", () => {
  const source = extractFunction("renderMonthReport");
  assert.match(source, /<details class="reports-expense-category">/);
  assert.match(source, /category\.occurrenceCount/);
  assert.match(source, /expenseNotes/);
  assert.doesNotMatch(source, /showModal|navigateTo/);
});

test("Today 今日支出預設收合並顯示筆數與總額", () => {
  assert.match(html, /id="todayExpenseToggle"[^>]*aria-expanded="false"[^>]*aria-controls="todayExpenseList"/);
  const source = extractFunction("renderTodayExpenseList");
  assert.match(source, /expenses\.length} 筆・\$\{money\(total\)}/);
  assert.match(source, /todayExpenseList\.hidden = !todayExpenseListOpen/);
});

test("Today 單筆支出移除不刪除整天紀錄", () => {
  const source = extractFunction("removeTodayExpense");
  assert.match(source, /delete entry\.expenses\?\.\[category\]/);
  assert.match(source, /delete entry\.expenseNotes\?\.\[category\]/);
  assert.match(source, /delete entry\.expenseAllocations\?\.\[category\]/);
  assert.doesNotMatch(source, /entries\.filter/);
});

test("Today 支出移除只有成功持久化後才更新畫面", () => {
  const source = extractFunction("removeTodayExpense");
  assert.match(source, /persistStatePayload\(nextState, \{ updateMemory: true \}\)/);
  assert.match(source, /notifyRecordChanged\(date, "expense-remove"\)/);
  assert.match(source, /renderAll\(\)/);
});

test("最近一次支出移除保留備註與 allocation 並提供五秒復原", () => {
  const remove = extractFunction("removeTodayExpense");
  const undo = extractFunction("undoLastExpenseRemoval");
  assert.match(remove, /note: current\.expenseNotes/);
  assert.match(remove, /allocation: current\.expenseAllocations/);
  assert.match(remove, /5000/);
  assert.match(undo, /entry\.expenseNotes\[action\.category\] = action\.note/);
  assert.match(undo, /entry\.expenseAllocations\[action\.category\]/);
});

test("Calendar 不再存在全頁 Record Editor dialog", () => {
  assert.doesNotMatch(html, /id="recordEditorDialog"|record-editor-dialog|record-editor-open/);
  assert.match(html, /id="recordEditorInline"/);
});

test("Calendar 顯示精簡唯讀摘要，不提供分區編輯", () => {
  const source = extractFunction("renderCalendarRecordCard");
  assert.match(source, /calendar-readonly-summary/);
  assert.match(source, /calendarIncomeSummaryTitle/);
  assert.doesNotMatch(source, /data-calendar-section|data-calendar-add|recordEditorSave|recordEditorDelete/);
});

test("Calendar 歷史修改導向 Today 且不搬動表單 DOM", () => {
  const open = extractFunction("openRecordDateInToday");
  assert.match(open, /setActiveRecordDate\(targetDate\)/);
  assert.match(open, /navigateTo\("today"\)/);
  assert.doesNotMatch(html, /function moveSharedEditorToCalendar/);
  assert.equal((html.match(/id="entryForm"/g) || []).length, 1);
  assert.equal((html.match(/id="detailForm"/g) || []).length, 1);
});

test("Calendar 歷史日期只提供前往 Today 的入口", () => {
  const source = extractFunction("renderCalendarRecordCard");
  assert.match(source, /data-calendar-open-today-record/);
  assert.doesNotMatch(source, /data-calendar-section|data-calendar-add/);
});

test("Legacy Calendar editor adapter 只轉交 Today", () => {
  const open = extractFunction("openCalendarRecordEditor");
  assert.match(open, /openRecordDateInToday\(normalizedDate\)/);
  assert.doesNotMatch(open, /recordEditorState|blankEntry|fillEntryFields|append/);
});

test("Calendar 支出移除立即持久化並可復原", () => {
  const source = extractFunction("removeCalendarExpense");
  assert.match(source, /persistStatePayload\(nextState, \{ updateMemory: true \}\)/);
  assert.match(source, /delete record\.expenseAllocations\?\.\[category\]/);
  assert.match(source, /actionLabel: "復原"/);
  assert.match(source, /duration: 5000/);
});

test("Calendar 不提供整天刪除操作", () => {
  const renderer = extractFunction("renderCalendarRecordCard");
  assert.doesNotMatch(renderer, /data-calendar-section|recordEditorDelete|更多操作/);
});

test("Calendar 與 Reports 移除重複 topbar 高度", () => {
  assert.match(html, /body\[data-active-view="calendar"\] \.topbar/);
  assert.match(html, /body\[data-active-view="reports"\] \.topbar[\s\S]*?display: none/);
});

test("Calendar 列高依三種顯示模式使用獨立 token", () => {
  assert.match(html, /min-height: var\(--display-calendar-row-height\)/);
  for (const value of ["70px", "76px", "84px"]) {
    assert.match(designSystem, new RegExp(`--display-calendar-row-height: ${value}`));
  }
});

test("Bottom Navigation 五頁共用 active 視覺與 aria-current", () => {
  assert.match(html, /\.nav button\.active[\s\S]*?background: var\(--brand-soft\)[\s\S]*?color: var\(--brand-strong\)[\s\S]*?font-weight: 600/);
  const source = extractFunction("setView");
  assert.match(source, /setAttribute\("aria-current", "page"\)/);
  assert.match(source, /removeAttribute\("aria-current"\)/);
});

test("canonical summarize 時薪使用總收入而非淨收入", () => {
  const source = extractFunction("summarize");
  assert.match(source, /hourly: hourlyRate\(total, durationMs\)/);
  assert.doesNotMatch(source, /hourlyRate\(net/);
});

test("Reports 期間平均時薪使用期間總收入除以總工時", () => {
  const source = extractFunction("aggregateReport");
  assert.match(source, /hourlyRate\(summary\.total, summary\.durationMs\)/);
  assert.match(source, /hourlyRateQuality\(summary\.total, workMinutes\)/);
  assert.doesNotMatch(source, /hourlyRate(?:Quality)?\(summary\.net/);
});

test("Calendar 與 CSV 使用相同總收入時薪口徑", () => {
  assert.match(extractFunction("renderCalendarRecordCard"), /hourlyRateDisplay\(total, duration\.durationMs\)/);
  assert.match(extractFunction("exportCsv"), /hourlyRate\(entryTotal\(entry\), work\.durationMs\)/);
});

test("週報支出分類重用 reportExpenseSummary 並顯示本週總和", () => {
  const source = extractFunction("renderWeeks");
  assert.match(source, /current\.totalExpenses/);
  assert.match(source, /renderReportExpenseCategories\(current, "week"\)/);
  const categoryRenderer = extractFunction("renderReportExpenseCategories");
  assert.match(categoryRenderer, /current\.expenseSummary\.byCategory/);
  assert.match(categoryRenderer, /本週.*支出分類/);
});

test("支出不會改變首頁與報表的總收入時薪口徑", () => {
  assert.match(extractFunction("summarize"), /hourlyRate\(total, durationMs\)/);
  assert.match(extractFunction("aggregateReport"), /hourlyRate\(summary\.total, summary\.durationMs\)/);
  assert.doesNotMatch(extractFunction("hourlyRate"), /entryNet|entryExpenses/);
});

test("Calendar 時薪顯示沿用 canonical 品質門檻", () => {
  const source = extractFunction("hourlyRateDisplay");
  assert.match(source, /hourlyRateQuality\(totalIncome, workMinutes\)/);
  assert.match(source, /insufficient-work-time/);
  assert.match(source, /資料不足/);
  assert.match(source, /資料異常/);
});

test("Today KPI 主收入左對齊且次要 KPI 標籤在數字上方", () => {
  const source = extractFunction("renderStats");
  assert.match(source, /today-income-copy/);
  assert.match(source, /<div><span>今日工時<\/span><strong>\$\{formatWorkDurationCompact\(todaySummary\.durationMs \/ workTimeUnits\.minuteMs\)\}<\/strong><\/div>/);
  assert.match(source, /<div><span>\$\{todayHourlyLabel\}<\/span><strong>\$\{money\(todaySummary\.hourly\)\}<\/strong><\/div>/);
  assert.match(html, /\.today-income-copy[\s\S]*?justify-items: start/);
});

test("Today KPI 依工作狀態切換目前與平均時薪標籤", () => {
  const source = extractFunction("renderStats");
  assert.match(source, /\["running", "paused"\]\.includes\(todayWorkStatus\)/);
  assert.match(source, /\? "目前時薪" : "平均時薪"/);
});

test("資料 key、schema 與 App Shell 只做核准範圍變更", () => {
  assert.match(html, /const storageKey = "driverPayApp\.v2"/);
  assert.match(html, /expenseAllocations/);
  assert.match(serviceWorker, /const CACHE_NAME = "driver-pay-pro-v27"/);
  assert.doesNotMatch(html, /supabase|migration/i);
});
