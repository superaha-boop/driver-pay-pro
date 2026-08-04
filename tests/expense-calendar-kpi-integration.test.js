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

test("Calendar 五個區段全部為整排原地 disclosure", () => {
  const source = extractFunction("renderCalendarRecordCard");
  for (const section of ["income", "work", "expenses", "other", "more"]) {
    assert.match(source, new RegExp(`sectionButton\\("${section}"`));
  }
  assert.match(source, /aria-expanded/);
  assert.match(source, /aria-controls="recordEditorInline"/);
});

test("Calendar 原地編輯重用 Today 的同一組表單 DOM", () => {
  const move = extractFunction("moveSharedEditorToCalendar");
  assert.match(move, /sharedIncomePanel/);
  assert.match(move, /sharedDetailPanel/);
  assert.equal((html.match(/id="entryForm"/g) || []).length, 1);
  assert.equal((html.match(/id="detailForm"/g) || []).length, 1);
});

test("Calendar 只有支出區會顯示已記錄支出清單", () => {
  assert.match(html, /\.calendar-expense-list\[hidden\][\s\S]*?display: none/);
  const source = extractFunction("applyCalendarEditorSection");
  assert.match(source, /calendarExpenseList\.hidden = section !== "expenses"/);
});

test("Calendar 切換主要編輯區不清除同一份草稿", () => {
  const open = extractFunction("openCalendarRecordEditor");
  assert.match(open, /recordEditorState\.activeSection = section/);
  assert.match(open, /applyCalendarEditorSection\(\)/);
  const sameDateBranch = open.slice(open.indexOf("recordEditorState.open &&"), open.indexOf("const existing"));
  assert.doesNotMatch(sameDateBranch, /blankEntry|fillEntryFields/);
});

test("Calendar 支出移除立即持久化並可復原", () => {
  const source = extractFunction("removeCalendarExpense");
  assert.match(source, /persistStatePayload\(nextState, \{ updateMemory: true \}\)/);
  assert.match(source, /delete record\.expenseAllocations\?\.\[category\]/);
  assert.match(source, /actionLabel: "復原"/);
  assert.match(source, /duration: 5000/);
});

test("Calendar 整天刪除只在更多操作並保留確認", () => {
  assert.match(html, /data-section="more"[\s\S]*?record-editor-delete/);
  const source = extractFunction("deleteCalendarRecord");
  assert.match(source, /showRecordEditorConfirm/);
  assert.match(source, /全部收入、工時、支出與其他資料/);
  assert.match(source, /entries\.filter/);
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

test("Calendar 時薪顯示沿用 canonical 品質門檻", () => {
  const source = extractFunction("hourlyRateDisplay");
  assert.match(source, /hourlyRateQuality\(totalIncome, workMinutes\)/);
  assert.match(source, /insufficient-work-time/);
  assert.match(source, /資料不足/);
  assert.match(source, /資料異常/);
});

test("Today KPI 主收入置中且次要 KPI 值在標籤上方", () => {
  const source = extractFunction("renderStats");
  assert.match(source, /today-income-copy/);
  assert.match(source, /<div><strong>\$\{formatHours\(todaySummary\.hours\)\}<\/strong><span>今日工時<\/span><\/div>/);
  assert.match(source, /<div><strong>\$\{money\(todaySummary\.hourly\)\}<\/strong><span>\$\{todayHourlyLabel\}<\/span><\/div>/);
  assert.match(html, /\.today-income-copy[\s\S]*?justify-items: center/);
});

test("Today KPI 依工作狀態切換目前與平均時薪標籤", () => {
  const source = extractFunction("renderStats");
  assert.match(source, /\["running", "paused"\]\.includes\(todayWorkStatus\)/);
  assert.match(source, /\? "目前時薪" : "平均時薪"/);
});

test("資料 key、schema 與 App Shell 只做核准範圍變更", () => {
  assert.match(html, /const storageKey = "driverPayApp\.v2"/);
  assert.match(html, /expenseAllocations/);
  assert.match(serviceWorker, /const CACHE_NAME = "driver-pay-pro-v25"/);
  assert.doesNotMatch(html, /supabase|migration/i);
});
