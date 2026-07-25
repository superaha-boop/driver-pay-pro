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

const context = vm.createContext({
  URLSearchParams,
  activeReportView: "week"
});
vm.runInContext(
  [
    extractFunction("normalizeMonthKey"),
    extractFunction("normalizeReportView"),
    extractFunction("parseAppRoute"),
    extractFunction("appRouteHash"),
    "globalThis.navigation = { normalizeMonthKey, normalizeReportView, parseAppRoute, appRouteHash };"
  ].join("\n"),
  context
);
const navigation = context.navigation;

test("底部導覽使用定案名稱與 Lucide 圖示", () => {
  const nav = html.match(/<nav class="nav"[\s\S]*?<\/nav>/)?.[0] || "";
  assert.deepEqual(
    [...nav.matchAll(/data-view="([^"]+)" data-icon="([^"]+)"/g)].map(match => match.slice(1)),
    [
      ["today", "CircleDollarSign"],
      ["calendar", "CalendarDays"],
      ["reports", "ChartNoAxesColumnIncreasing"],
      ["ai", "Sparkles"],
      ["settings", "UserRound"]
    ]
  );
  assert.deepEqual(
    [...nav.matchAll(/<span class="nav-label">([^<]+)<\/span>/g)].map(match => match[1]),
    ["今天", "月曆", "報表", "AI", "Driver"]
  );
  assert.doesNotMatch(nav, /●|▦|▥|✦|♙/);
});

test("底部導覽尺寸與 safe area 契約存在", () => {
  assert.match(html, /\.nav button,[\s\S]*?min-height: 56px;[\s\S]*?font-size: 14px;[\s\S]*?font-weight: 500;/);
  assert.match(html, /\.nav button\.active[\s\S]*?font-weight: 600;/);
  assert.match(html, /\.nav \.nav-icon svg[\s\S]*?width: 24px;[\s\S]*?height: 24px;[\s\S]*?stroke-width: 2;/);
  assert.match(html, /env\(safe-area-inset-bottom\)/);
});

test("月曆與報表使用獨立 view，月份明細只在月曆", () => {
  assert.match(html, /<section id="view-calendar"[\s\S]*?id="monthFilter"[\s\S]*?id="entriesTable"/);
  assert.match(html, /<section id="view-reports"[\s\S]*?data-report-panel="week"[\s\S]*?data-report-panel="month"[\s\S]*?data-report-panel="platform"/);
  assert.doesNotMatch(html, /id="view-(week|month|platform)"/);
  assert.equal((html.match(/id="entriesTable"/g) || []).length, 1);
});

test("舊報表網址與新網址會解析到正確分頁", () => {
  assert.deepEqual(
    JSON.parse(JSON.stringify(navigation.parseAppRoute("#week"))),
    { view: "reports", reportView: "week" }
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(navigation.parseAppRoute("#month"))),
    { view: "reports", reportView: "month" }
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(navigation.parseAppRoute("#analysis"))),
    { view: "reports", reportView: "platform" }
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(navigation.parseAppRoute("#reports/platform"))),
    { view: "reports", reportView: "platform" }
  );
  assert.equal(navigation.appRouteHash("reports", "month"), "#reports/month");
});

test("月曆與報表月份狀態互相獨立", () => {
  assert.equal(navigation.normalizeMonthKey("2026-06", "2026-07"), "2026-06");
  assert.equal(navigation.normalizeMonthKey("2026-13", "2026-07"), "2026-07");
  assert.match(html, /calendarMonth: normalizeMonthKey\(settings\.calendarMonth\)/);
  assert.match(html, /reportMonth: normalizeMonthKey\(settings\.reportMonth\)/);
  assert.match(html, /lastReportView: normalizeReportView\(settings\.lastReportView\)/);
});

test("歷史紀錄保留完整摘要、44px 操作與刪除確認", () => {
  assert.match(html, /總收入[\s\S]*支出[\s\S]*淨收入[\s\S]*實際工時/);
  assert.match(html, /\.entry-action-button[\s\S]*min-height: 44px;/);
  assert.match(html, />編輯<\/button>/);
  assert.match(html, />刪除<\/button>/);
  assert.match(html, /confirm\("確定要刪除這筆紀錄嗎？"\)/);
});

test("報表標題、空白狀態與平台排行符合定案文字", () => {
  assert.match(html, /reports: \["報表"/);
  assert.match(html, /這個月份尚無週報資料/);
  assert.match(html, /這個月份尚無收入紀錄/);
  assert.match(html, /這個月份尚無平台收入/);
  assert.match(html, /<h3>平台收入排行<\/h3>/);
  assert.doesNotMatch(html, /<h3>平台效率<\/h3>/);
});
