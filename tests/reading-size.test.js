const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const html = fs.readFileSync(new URL("../index.html", `file://${__filename}`), "utf8");
const designSystem = fs.readFileSync(new URL("../styles/design-system.css", `file://${__filename}`), "utf8");
const serviceWorker = fs.readFileSync(new URL("../sw.js", `file://${__filename}`), "utf8");
const driverSection = html.match(
  /<section id="view-settings"[\s\S]*?<\/section>\s*<\/main>/
)?.[0] || "";

function extractFunction(name) {
  const signature = `function ${name}(`;
  const start = html.indexOf(signature);
  assert.notEqual(start, -1, `找不到 ${name}()`);
  const bodyStart = html.indexOf(") {", start) + 2;
  assert.notEqual(bodyStart, 1, `${name}() 缺少函式本文`);
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

test("Driver 只提供標準、舒適、大字三個全域顯示選項", () => {
  const inputs = [...driverSection.matchAll(
    /<input type="radio" name="displaySize" value="([^"]+)" data-display-size-option/g
  )].map(match => match[1]);
  assert.deepEqual(inputs, ["standard", "comfort", "large"]);
  assert.match(driverSection, /<legend>字體大小設定<\/legend>/);
  assert.match(driverSection, /id="displaySizeStatus"[\s\S]*?role="status" aria-live="polite" hidden/);
  assert.doesNotMatch(driverSection, /<h3>顯示設定<\/h3>|<legend>顯示大小<\/legend>/);
  assert.doesNotMatch(driverSection, /AI／報表文字大小/);
});

test("顯示選項具備 radio 語意、可見焦點與 44px 觸控目標", () => {
  assert.equal((driverSection.match(/name="displaySize"/g) || []).length, 3);
  assert.match(html, /\.reading-size-choice\s*\{[\s\S]*?min-height: 44px/);
  assert.match(html, /\.reading-size-choice:has\(input:focus-visible\)/);
  assert.match(html, /\.reading-size-choice:has\(input:checked\)/);
});

test("normalizeDisplaySize 只接受三個合法值", () => {
  const source = extractFunction("normalizeDisplaySize");
  const normalize = Function(
    "displaySizeLabels",
    `${source}; return normalizeDisplaySize;`
  )({ standard: "標準", comfort: "舒適", large: "大字" });
  assert.equal(normalize(undefined), "standard");
  assert.equal(normalize("unknown"), "standard");
  assert.equal(normalize("standard"), "standard");
  assert.equal(normalize("comfort"), "comfort");
  assert.equal(normalize("large"), "large");
});

test("新 displaySize 存在時優先，缺少時才讀舊 aiReportsReadingSize", () => {
  const normalizeSettings = extractFunction("normalizeSettings");
  assert.match(normalizeSettings, /Object\.hasOwn\(settings, "displaySize"\)/);
  assert.match(normalizeSettings, /\? settings\.displaySize\s*:\s*legacyReadingSize/);
  assert.match(normalizeSettings, /displaySize: normalizeDisplaySize\(displaySizeSource\)/);
  assert.match(normalizeSettings, /const \{ aiReportsReadingSize: legacyReadingSize, \.\.\.retainedSettings \} = settings/);
});

test("執行期與新寫入只使用 canonical settings.displaySize", () => {
  const save = extractFunction("saveDisplaySize");
  assert.match(html, /const storageKey = "driverPayApp\.v2"/);
  assert.match(save, /nextState\.settings\.displaySize = next/);
  assert.match(save, /delete nextState\.settings\.aiReportsReadingSize/);
  assert.match(save, /persistStatePayload\(nextState, \{ updateMemory: true \}\)/);
  assert.match(save, /applyDisplaySize\(next\)/);
  assert.match(save, /applyDisplaySize\(previous\)/);
  assert.doesNotMatch(save, /WorkRecord|expenseAllocations|migration|Supabase/);
});

test("首次繪製前會讀取新欄位並相容舊欄位", () => {
  assert.match(html, /<html lang="zh-Hant" data-display-size="standard">/);
  assert.match(html, /const hasDisplaySize = Object\.prototype\.hasOwnProperty\.call\(settings, "displaySize"\)/);
  assert.match(html, /const candidate = hasDisplaySize \? settings\.displaySize : settings\.aiReportsReadingSize/);
  assert.match(html, /applyDisplaySize\(state\.settings\.displaySize\);\s*renderBrandAttribution\(\)/);
  assert.match(extractFunction("applyDisplaySize"), /document\.documentElement\.dataset\.displaySize = normalized/);
});

test("Design System 提供三模式語意 typography token 且不使用縮放", () => {
  for (const mode of ["comfort", "large"]) {
    assert.match(designSystem, new RegExp(`html\\[data-display-size="${mode}"\\]`));
  }
  for (const token of [
    "font-kpi-primary",
    "font-kpi-secondary",
    "font-data",
    "font-input-value",
    "font-button",
    "font-body",
    "font-section-title",
    "font-navigation",
    "display-calendar-date-size",
    "display-nav-label-size"
  ]) {
    assert.match(designSystem, new RegExp(`--${token}:`));
  }
  const displayRules = [...designSystem.matchAll(
    /html\[data-display-size="(?:comfort|large)"\]\s*\{([\s\S]*?)\}/g
  )].map(match => match[1]).join("\n");
  assert.doesNotMatch(displayRules, /\bzoom\s*:|transform\s*:\s*scale/);
});

test("主要數據有明確三級差且結構文字只小幅變化", () => {
  assert.match(designSystem, /--font-data: 24px/);
  assert.match(designSystem, /data-display-size="comfort"[\s\S]*?--font-data: 27px/);
  assert.match(designSystem, /data-display-size="large"[\s\S]*?--font-data: 30px/);
  assert.match(designSystem, /--font-input-value: 26px/);
  assert.match(designSystem, /data-display-size="comfort"[\s\S]*?--font-input-value: 29px/);
  assert.match(designSystem, /data-display-size="large"[\s\S]*?--font-input-value: 32px/);
  assert.match(designSystem, /data-display-size="large"[\s\S]*?--font-section-title: 19px/);
  assert.match(designSystem, /data-display-size="large"[\s\S]*?--font-navigation: 14px/);
});

test("Today 內容、欄位與操作共用全域顯示 token", () => {
  assert.match(html, /#view-today :is\([\s\S]*?\.income-unit[\s\S]*?font-size: var\(--display-body-size\)/);
  assert.match(html, /#view-today :is\([\s\S]*?input\[type="date"\][\s\S]*?font-size: var\(--display-control-size\)/);
  assert.doesNotMatch(extractFunction("workMetrics"), /displaySize|reading-size/);
});

test("Calendar 日期與工作紀錄文字共用全域顯示 token", () => {
  assert.match(html, /\.calendar-date__day\s*\{[\s\S]*?font-size: var\(--display-calendar-date-size\)/);
  assert.match(html, /\.calendar-date__amount\s*\{[\s\S]*?font-size: var\(--display-calendar-amount-size\)/);
  assert.match(html, /#view-calendar :is\([\s\S]*?\.calendar-record-weekday[\s\S]*?font-size: var\(--display-secondary-size\)/);
});

test("Reports 文字、圖表標籤與空狀態重用閱讀 token", () => {
  assert.match(html, /\.reports-page \.report-switcher button,[\s\S]*?font-size: var\(--reading-report-body-size\)/);
  assert.match(html, /\.reports-trend-label,[\s\S]*?font-size: var\(--reading-report-caption-size\)/);
  assert.match(html, /\.reports-page \.ds-empty-state \.ds-secondary[\s\S]*?var\(--reading-report-body-size\)/);
});

test("AI 依語意 token 維持數據、內文與標題層級", () => {
  assert.match(html, /--reading-ai-body-size: var\(--font-body\)/);
  assert.match(html, /--reading-ai-detail-size: var\(--font-secondary\)/);
  assert.match(html, /--reading-ai-section-title-size: var\(--font-section-title\)/);
  assert.match(html, /--reading-ai-value-size: var\(--font-data\)/);
  assert.match(html, /\.ai-advice-list li,[\s\S]*?font-size: var\(--reading-ai-body-size\)/);
});

test("Driver 重要數值縮放、切換控制與 Bottom Navigation 保持穩定", () => {
  assert.match(html, /#view-settings :is\([\s\S]*?\.driver-page-intro p[\s\S]*?font-size: var\(--display-secondary-size\)/);
  assert.match(html, /\.nav button,[\s\S]*?font-size: var\(--display-nav-label-size\)/);
  assert.match(html, /\.driver-goal-control input\s*\{[\s\S]*?font-size: var\(--font-input-value\)/);
  assert.match(html, /\.reading-size-choice\s*\{[\s\S]*?font-size: 14px[\s\S]*?line-height: 1\.25/);
  assert.doesNotMatch(html, /#view-settings :is\(\s*\.reading-size-choice,/);
  assert.match(html, /\.panel-body label:not\(\.reading-size-choice\)/);
  assert.match(html, /#view-settings :is\(\s*input:not\(#dailyGoal\),/);
});

test("大字模式保留 320px 趨勢與平台列安全重排", () => {
  assert.match(html, /@media \(max-width: 350px\)[\s\S]*?data-display-size="large"[\s\S]*?reports-trend-row/);
  assert.match(html, /data-display-size="large"[\s\S]*?ai-platform-row strong\s*\{[\s\S]*?grid-column: 1 \/ -1/);
  assert.match(html, /data-display-size="large"\] \.reports-platform-name[\s\S]*?white-space: normal/);
});

test("顯示大小不進入 canonical 計算或 WorkRecord", () => {
  for (const name of ["aggregateReport", "reportExpenseSummary", "workMetrics"]) {
    const source = extractFunction(name);
    assert.doesNotMatch(source, /displaySize|reading-size|aiReportsReadingSize/);
  }
});

test("Today KPI 共用數字字體規格且工時單位降階", () => {
  assert.match(html, /\.today-income\s*\{[\s\S]*?font-family: var\(--font-family-sans\)[\s\S]*?font-weight: var\(--font-weight-bold\)[\s\S]*?line-height: var\(--line-height-kpi\)[\s\S]*?font-feature-settings: "tnum" 1/);
  assert.match(html, /\.today-secondary strong\s*\{[\s\S]*?font-family: var\(--font-family-sans\)[\s\S]*?font-weight: var\(--font-weight-bold\)[\s\S]*?line-height: var\(--line-height-kpi\)[\s\S]*?font-feature-settings: "tnum" 1/);
  assert.match(html, /\.today-secondary \.today-work-duration__unit\s*\{[\s\S]*?display: inline[\s\S]*?font-size: var\(--font-kpi-unit\)/);
  assert.match(extractFunction("renderStats"), /formatWorkDurationKpi/);
});

test("HTML、CSS 與 JavaScript 變更同步更新 App Shell cache", () => {
  assert.match(serviceWorker, /const CACHE_NAME = "driver-pay-pro-v28"/);
});
