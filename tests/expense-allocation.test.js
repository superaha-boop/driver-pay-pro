const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

const html = fs.readFileSync(new URL("../index.html", `file://${__filename}`), "utf8");

function extractFunction(name) {
  const signature = `function ${name}(`;
  const start = html.indexOf(signature);
  assert.notEqual(start, -1, `找不到 ${name}()`);
  const bodyStart = html.indexOf(") {", start) + 2;
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
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return html.slice(start, index + 1);
    }
  }
  throw new Error(`${name}() 結尾不完整`);
}

const helperNames = [
  "dateOnlyParts",
  "normalizeDateKey",
  "entryExpenses",
  "normalizeExpenseAllocation",
  "expenseAllocationFor",
  "expenseAllocationMonth",
  "expenseAllocationAmount",
  "reportExpenseSummary"
];
const context = vm.createContext({ Array, Date, Map, Math, Number, Object, String });
vm.runInContext(
  `${helperNames.map(extractFunction).join("\n")}\n`
  + `globalThis.expenses = { ${helperNames.join(", ")} };`,
  context
);
const expenses = context.expenses;

test("舊 WorkRecord 沒有 expenseAllocations 時仍以原始付款計算", () => {
  const entry = { date: "2026-07-29", expenses: { 汽車保險: 12000 } };
  assert.equal(expenses.expenseAllocationFor(entry, "汽車保險"), null);
  assert.equal(expenses.entryExpenses(entry), 12000);
  assert.equal(
    expenses.reportExpenseSummary([entry], {
      start: "2026-07-01",
      endExclusive: "2026-08-01"
    }).total,
    12000
  );
});

test("分月成本逐月計入且尾差精確回收", () => {
  const entry = {
    date: "2026-07-29",
    expenses: { 汽車保險: 10001 },
    expenseAllocations: { 汽車保險: { months: 3, startMonth: "2026-07" } }
  };
  const values = ["2026-07", "2026-08", "2026-09"].map(month =>
    expenses.reportExpenseSummary([entry], {
      start: `${month}-01`,
      endExclusive: expenses.expenseAllocationMonth(month, 1) + "-01"
    }).total
  );
  assert.deepEqual(JSON.parse(JSON.stringify(values)), [3333, 3333, 3335]);
  assert.equal(values.reduce((sum, value) => sum + value, 0), 10001);
});

test("修改金額、months 與 startMonth 會由原始付款即時計算", () => {
  const entry = {
    date: "2026-07-29",
    expenses: { 汽車保險: 24000 },
    expenseAllocations: { 汽車保險: { months: 6, startMonth: "2026-08" } }
  };
  assert.equal(
    expenses.reportExpenseSummary([entry], {
      start: "2026-07-01",
      endExclusive: "2026-08-01"
    }).total,
    0
  );
  assert.equal(
    expenses.reportExpenseSummary([entry], {
      start: "2026-08-01",
      endExclusive: "2026-09-01"
    }).total,
    4000
  );
});

test("儲存流程在分月與一次支出間切換並同步清理", () => {
  const source = extractFunction("saveSmartExpense");
  assert.match(source, /entry\.expenseAllocations\[request\.category\] = \{[\s\S]*?months: request\.months,[\s\S]*?startMonth: request\.startMonth/);
  assert.match(source, /delete entry\.expenseAllocations\[request\.category\]/);
  assert.match(source, /delete draft\.expenseAllocations\[category\]/);
  assert.match(extractFunction("removeCalendarExpense"), /delete record\.expenseAllocations\?\.\[category\]/);
});

test("重新載入時可選 allocation metadata 由既有 payload 原樣保留", () => {
  const payload = {
    platforms: ["Uber"],
    expenses: ["汽車保險"],
    settings: {},
    entries: [{
      id: "expense-1",
      date: "2026-07-29",
      expenses: { 汽車保險: 12000 },
      expenseAllocations: { 汽車保險: { months: 12, startMonth: "2026-07" } }
    }]
  };
  const sandbox = {
    payload,
    defaultPlatforms: ["Uber"],
    defaultExpenses: ["其他"],
    normalizeSettings: value => value,
    Array,
    TypeError
  };
  vm.runInNewContext(
    `${extractFunction("normalizeStatePayload")}; globalThis.result = normalizeStatePayload(payload);`,
    sandbox
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(sandbox.result.entries[0].expenseAllocations)),
    { 汽車保險: { months: 12, startMonth: "2026-07" } }
  );
});

test("Calendar 與 CSV 保留原始付款，Reports 與 AI 共用分月 selector", () => {
  assert.match(extractFunction("renderCalendarRecordCard"), /entryExpenses\(entry\)/);
  assert.match(extractFunction("exportCsv"), /原始付款支出/);
  assert.match(extractFunction("exportCsv"), /expenseAllocationFor\(entry, category\)/);
  assert.match(extractFunction("aggregateReport"), /reportExpenseSummary\(records, range\)/);
  assert.match(html, /const sharedAnalytics = Object\.freeze\(\{[\s\S]*?reportExpenseSummary/);
  assert.match(extractFunction("buildAiAnalysisContext"), /sharedAnalytics\.aggregateReport\(entries, monthRange\)/);
});
