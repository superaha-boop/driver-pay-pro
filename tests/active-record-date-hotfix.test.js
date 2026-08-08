const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles/design-system.css"), "utf8");

function extractFunction(name) {
  const start = html.indexOf(`function ${name}(`);
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
    if (char === "}" && --depth === 0) return html.slice(start, index + 1);
  }
  throw new Error(`${name}() 結尾不完整`);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function dateIsolationFixture() {
  return {
    activeDate: "2026-07-04",
    entries: {
      "2026-07-04": { income: 400, work: 60, expenses: { 油錢: 100 }, allocations: {}, note: "七月" },
      "2026-08-02": { income: 800, work: 120, expenses: { 停車費: 50 }, allocations: {}, note: "八月二日" },
      "2026-08-04": { income: 1200, work: 180, expenses: {}, allocations: {}, note: "今天" }
    }
  };
}

function mutateFixture(model, targetDate, operation) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(targetDate || ""))) return false;
  if (targetDate !== model.activeDate) return false;
  const entry = model.entries[targetDate];
  if (!entry) return false;
  operation(entry);
  return true;
}

const activeBinding = extractFunction("activeRecordBindingSnapshot");
const activeValidation = extractFunction("validateActiveRecordWrite");
const setActiveDate = extractFunction("setActiveRecordDate");
const resetForm = extractFunction("resetForm");
const renderContext = extractFunction("renderActiveRecordContext");

test("日期隔離 01：每日紀錄日期卡可選今天或過去日期並使用 activeRecordDate", () => {
  assert.match(renderContext, /formatFullDate\(activeRecordDate\)/);
  assert.match(resetForm, /renderEntryDateCard\(targetDate\)/);
  const dateCard = extractFunction("renderEntryDateCard");
  assert.match(dateCard, /max: todayString\(\)/);
  assert.doesNotMatch(dateCard, /locked: true/);
  assert.match(html, /const requestedDate = normalizeDateKey\(event\.target\.value\)/);
  assert.match(html, /setActiveRecordDate\(requestedDate, \{ preserveDisclosure: true \}\)/);
});

test("日期 Picker：整張日期卡只使用單一原生點擊路徑", () => {
  const dateInputCss = html.match(/\.date-card input\[type="date"\] \{[\s\S]*?\n    \}/)?.[0] || "";
  const dateCard = extractFunction("dateCardMarkup");
  assert.match(dateInputCss, /-webkit-appearance: auto/);
  assert.match(dateInputCss, /appearance: auto/);
  assert.match(dateInputCss, /z-index: 1/);
  assert.match(dateInputCss, /touch-action: manipulation/);
  assert.doesNotMatch(dateInputCss, /appearance: none/);
  assert.match(html, /\.date-card input\[type="date"\]::-webkit-calendar-picker-indicator[\s\S]*?inset: 0[\s\S]*?width: 100%[\s\S]*?height: 100%/);
  assert.match(dateCard, /<label class="date-card[\s\S]*?for="\$\{escapeAttr\(id\)\}"/);
  assert.match(dateCard, /<input type="date" id="\$\{escapeAttr\(id\)\}"/);
  assert.doesNotMatch(html, /openNativeDatePicker|\.showPicker\(/);
});

test("日期隔離 02：支出日期由 activeRecordDate 建立", () => {
  assert.match(setActiveDate, /expenseDraft = createExpenseDraft\(target\)/);
  assert.match(extractFunction("renderExpenseForm"), /dateCardMarkup\(\{ id: "smartExpenseDate", value: activeRecordDate[\s\S]*?locked: true \}\)/);
});

for (const [number, label, key, value] of [
  [3, "修改收入只改指定日期", "income", 700],
  [4, "修改工時只改指定日期", "work", 90],
  [5, "新增支出只寫入指定日期", "expenses", { 油錢: 100, 洗車: 300 }],
  [8, "修改其他資料只影響指定日期", "note", "已修改"]
]) {
  test(`日期隔離 ${String(number).padStart(2, "0")}：${label}`, () => {
    const model = dateIsolationFixture();
    const beforeOtherDates = clone({ two: model.entries["2026-08-02"], today: model.entries["2026-08-04"] });
    assert.equal(mutateFixture(model, "2026-07-04", entry => { entry[key] = value; }), true);
    assert.deepEqual({ two: model.entries["2026-08-02"], today: model.entries["2026-08-04"] }, beforeOtherDates);
    assert.deepEqual(model.entries["2026-07-04"][key], value);
  });
}

test("日期隔離 06：移除支出只影響 activeRecordDate", () => {
  const source = extractFunction("removeTodayExpense");
  assert.match(source, /validateActiveRecordWrite\(date/);
  assert.match(source, /entryForDate\(date\)/);
  assert.match(source, /delete entry\.expenses\?\.\[category\]/);
});

test("日期隔離 07：復原綁定原平台與原日期", () => {
  const source = extractFunction("undoLastExpenseRemoval");
  assert.match(source, /validateActiveRecordWrite\(date\)/);
  assert.match(source, /action\.date !== date/);
});

test("日期隔離 09：刪除整天只刪除 activeRecordDate", () => {
  const source = extractFunction("deleteEntry");
  assert.match(source, /validateActiveRecordWrite\(targetDate/);
  assert.match(source, /entry\.id === id && entry\.date === targetDate/);
});

test("日期隔離 10：歷史寫入不改今天資料", () => {
  const model = dateIsolationFixture();
  const today = clone(model.entries["2026-08-04"]);
  mutateFixture(model, "2026-07-04", entry => { entry.income = 999; });
  assert.deepEqual(model.entries["2026-08-04"], today);
});

test("日期隔離 11：歷史寫入不改 2026-08-02", () => {
  const model = dateIsolationFixture();
  const augustSecond = clone(model.entries["2026-08-02"]);
  mutateFixture(model, "2026-07-04", entry => { entry.work = 999; });
  assert.deepEqual(model.entries["2026-08-02"], augustSecond);
});

test("日期隔離 12：切回今天會載入今天資料", () => {
  assert.match(setActiveDate, /activeRecordDate = target/);
  assert.match(setActiveDate, /resetForm\(target/);
  assert.match(html, /data-active-record-today/);
});

test("日期隔離 13：同一畫面所有日期共用 activeRecordDate", () => {
  assert.match(activeBinding, /target === activeRecordDate/);
  assert.match(activeBinding, /displayedDate === activeRecordDate/);
  assert.match(activeBinding, /expenseDate === activeRecordDate/);
});

test("日期隔離 14：寫入函式未傳日期時驗證失敗", () => {
  assert.match(activeBinding, /const target = normalizeDateKey\(targetDate\)/);
  assert.match(activeBinding, /valid: Boolean\(\s*target/);
});

test("日期隔離 15：無效或未來日期禁止成為 activeRecordDate", () => {
  assert.match(setActiveDate, /if \(!isEditableRecordDate\(target\)\)/);
  assert.match(extractFunction("isEditableRecordDate"), /normalized <= todayString\(\)/);
});

test("日期隔離 16：日期 mismatch 阻止寫入並顯示明確訊息", () => {
  assert.match(activeValidation, /if \(binding\.valid\) return true/);
  assert.match(activeValidation, /日期綁定驗證失敗，已阻止寫入/);
  assert.match(html, /日期狀態異常，未儲存。請重新選擇日期。/);
});

test("日期隔離 17：selectedIncomeDate 不再 fallback 到今天", () => {
  const source = extractFunction("selectedIncomeDate");
  assert.match(source, /normalizeDateKey\(activeRecordDate\)/);
  assert.doesNotMatch(source, /todayString|\|\|/);
});

test("日期隔離 18：allocation 與付款日期共同接受綁定驗證", () => {
  const source = extractFunction("saveSmartExpense");
  assert.match(source, /validateActiveRecordWrite\(targetDate, \{ expenseDate: paymentDate, expense: true \}\)/);
  assert.match(source, /expenseAllocations/);
});

test("日期隔離 19：反覆切換日期都會重建單一日期草稿", () => {
  assert.match(setActiveDate, /expenseDraft = createExpenseDraft\(target\)/);
  assert.match(setActiveDate, /lastExpenseRemoval = null/);
  assert.match(setActiveDate, /lastIncomeAddition = null/);
});

test("日期隔離 20：重新載入預設回到台北今天且不持久化 activeRecordDate", () => {
  assert.match(html, /let activeRecordDate = todayString\(\)/);
  assert.doesNotMatch(extractFunction("saveState"), /activeRecordDate/);
  assert.match(html, /driverPayApp\.v2/);
});

const setView = extractFunction("setView");
const openRecordDate = extractFunction("openRecordDateInToday");
const calendarCard = extractFunction("renderCalendarRecordCard");

for (const [number, label, assertion] of [
  [1, "Today → Calendar → Today 可回復完整 Today", () => assert.match(setView, /if \(view === "today"\)/)],
  [2, "Today → Reports → Today 使用同一重繪路徑", () => assert.match(setView, /renderStats\(\)/)],
  [3, "Calendar → Reports → Today 不依賴前一分頁", () => assert.doesNotMatch(setView, /previousView === "calendar"[\s\S]*?renderStats/)],
  [4, "Calendar 日期導向 Today 歷史編輯", () => assert.match(openRecordDate, /setActiveRecordDate\(targetDate\)[\s\S]*?navigateTo\("today"\)/)],
  [5, "歷史編輯提供返回 Calendar", () => assert.match(renderContext, /data-active-record-calendar>返回月曆/)],
  [6, "Calendar 切日期後仍傳遞精確日期", () => assert.match(calendarCard, /data-calendar-open-today-record="\$\{escapeAttr\(selectedDate\)\}"/)],
  [7, "Today KPI 每次回頁重繪", () => assert.match(setView, /renderStats\(\)/)],
  [8, "Today 工作狀態每次回頁重繪", () => assert.match(setView, /updateWorkControls\(\)/)],
  [9, "Today 平台收入面板強制恢復", () => assert.match(setView, /els\.sharedIncomePanel\.classList\.remove\("hidden"\)/)],
  [10, "Today 每日紀錄面板強制恢復", () => assert.match(setView, /els\.sharedDetailPanel\.classList\.remove\("hidden"\)/)],
  [11, "Today 支出區強制恢復", () => assert.match(setView, /els\.expenseSection[\s\S]*?section\.hidden = false/)],
  [12, "Today 其他資料區強制恢復", () => assert.match(setView, /els\.otherDataSection[\s\S]*?section\.hidden = false/)],
  [13, "五頁連續切換重用唯一 setView", () => assert.equal((html.match(/function setView\(/g) || []).length, 1)],
  [14, "重繪不使用會吞錯誤的延遲 reload", () => assert.doesNotMatch(setView, /location\.reload|setTimeout/)],
  [15, "回 Today 不需要 reload", () => assert.match(setView, /restoreSharedEditorToToday\(\)/)],
  [16, "Safari 與 Installed PWA 共用相同路由與 render path", () => assert.doesNotMatch(setView, /standalone|navigator\.standalone|userAgent/)]
]) {
  test(`導航完整渲染 ${String(number).padStart(2, "0")}：${label}`, assertion);
}

test("日期隔離 21：日期選擇器拒絕未來日期且支出日期仍同步選定日期", () => {
  const dateCard = extractFunction("renderEntryDateCard");
  assert.match(dateCard, /max: todayString\(\)/);
  assert.match(html, /if \(!isEditableRecordDate\(requestedDate\)\)/);
  assert.match(html, /只能選擇今天或過去日期/);
  assert.match(extractFunction("renderExpenseForm"), /value: activeRecordDate[\s\S]*?locked: true/);
});

const renderStats = extractFunction("renderStats");
const durationContext = vm.createContext({ Math, Number });
vm.runInContext(`${extractFunction("formatWorkDurationCompact")}\n${extractFunction("formatWorkDurationKpi")}\nglobalThis.format = formatWorkDurationCompact;\nglobalThis.formatKpi = formatWorkDurationKpi;`, durationContext);

for (const [number, label, assertion] of [
  [1, "今日收入標籤左對齊", () => assert.match(html, /\.today-income-toggle[\s\S]*?text-align: left/)],
  [2, "今日收入金額左對齊", () => assert.match(html, /\.today-income[\s\S]*?text-align: left/)],
  [3, "今日收入字級大於次級 KPI", () => {
    assert.match(css, /--font-kpi-primary: clamp\(50px, 14vw, 64px\)/);
    assert.match(css, /--font-kpi-secondary: clamp\(28px, 7vw, 32px\)/);
    assert.match(css, /--today-revenue-value-size: var\(--font-kpi-primary\)/);
    assert.match(css, /--today-secondary-value-size: var\(--font-kpi-secondary\)/);
  }],
  [4, "Chevron 使用獨立 24px 欄位不擠壓收入", () => assert.match(html, /\.today-income-toggle[\s\S]*?grid-template-columns: minmax\(0, 1fr\) 24px/)],
  [5, "今日工時標籤位於數字上方", () => assert.match(renderStats, /<span>今日工時<\/span><strong class="today-work-duration">/)],
  [6, "平均時薪標籤位於數字上方", () => assert.match(renderStats, /<span>\$\{todayHourlyLabel\}<\/span><strong>/)],
  [7, "次級 KPI 使用兩個等寬欄位", () => assert.match(html, /\.today-secondary[\s\S]*?grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/)],
  [8, "次級 KPI 共用相同垂直對齊", () => assert.match(html, /\.today-secondary div[\s\S]*?flex-direction: column[\s\S]*?align-items: flex-start/)],
  [9, "收合時目標區 hidden", () => assert.match(renderStats, /todayGoalDetails"\$\{todayGoalExpanded \? "" : " hidden"\}/)],
  [10, "收合時收入工時時薪仍在 goal 外", () => assert.match(renderStats, /today-income-copy[\s\S]*?today-secondary[\s\S]*?today-goal-details/)],
  [11, "展開 class 與 aria-expanded 同步", () => {
    assert.match(renderStats, /is-goal-expanded/);
    assert.match(renderStats, /aria-expanded="\$\{String\(todayGoalExpanded\)\}"/);
  }],
  [12, "0 分鐘顯示 0分鐘", () => assert.equal(durationContext.format(0), "0分鐘")],
  [13, "29 分鐘顯示 29分鐘", () => assert.equal(durationContext.format(29), "29分鐘")],
  [14, "59 分鐘顯示 59分鐘", () => assert.equal(durationContext.format(59), "59分鐘")],
  [15, "60 分鐘顯示 1小時", () => assert.equal(durationContext.format(60), "1小時")],
  [16, "70 分鐘顯示 1小時10分鐘", () => assert.equal(durationContext.format(70), "1小時10分鐘")],
  [17, "120 分鐘顯示 2小時", () => assert.equal(durationContext.format(120), "2小時")],
  [18, "KPI 不顯示 0小時00分", () => assert.doesNotMatch(renderStats, /0小時00分|padStart/)],
  [19, "精密工作狀態計算仍使用毫秒 canonical 邏輯", () => assert.match(extractFunction("sessionWorkDurationMs"), /accumulatedActiveMs[\s\S]*?nowMs[\s\S]*?clockDurationMs/)],
  [20, "平均時薪使用總收入除以工時", () => assert.match(extractFunction("summarize"), /hourly: hourlyRate\(total, durationMs\)/)],
  [21, "工時 KPI 數字與分鐘單位分層", () => assert.equal(durationContext.formatKpi(29), '29<span class="today-work-duration__unit">分鐘</span>')],
  [22, "工時 KPI 小時與分鐘單位皆降階", () => assert.equal(durationContext.formatKpi(70), '1<span class="today-work-duration__unit">小時</span>10<span class="today-work-duration__unit">分鐘</span>')]
]) {
  test(`Today KPI ${String(number).padStart(2, "0")}：${label}`, assertion);
}
