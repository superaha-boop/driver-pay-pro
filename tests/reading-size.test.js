const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const html = fs.readFileSync(new URL("../index.html", `file://${__filename}`), "utf8");
const serviceWorker = fs.readFileSync(new URL("../sw.js", `file://${__filename}`), "utf8");
const driverSection = html.match(
  /<section id="view-settings"[\s\S]*?<\/section>\s*<section id="view-about"/
)?.[0] || "";
const aiSection = html.match(
  /<section id="view-ai"[\s\S]*?<\/section>\s*<section id="view-settings"/
)?.[0] || "";
const reportsSection = html.match(
  /<section id="view-reports"[\s\S]*?<\/section>\s*<section id="view-ai"/
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

test("Driver 只提供標準、舒適、大字三個 AI／報表閱讀選項", () => {
  const inputs = [...driverSection.matchAll(
    /<input type="radio" name="aiReportsReadingSize" value="([^"]+)" data-ai-reports-reading-size/g
  )].map(match => match[1]);
  assert.deepEqual(inputs, ["standard", "comfort", "large"]);
  assert.match(driverSection, />顯示設定</);
  assert.match(driverSection, /<legend>AI／報表文字大小<\/legend>/);
  assert.match(driverSection, />標準</);
  assert.match(driverSection, />舒適</);
  assert.match(driverSection, />大字</);
  assert.match(driverSection, /id="aiReportsReadingSizeStatus" role="status" aria-live="polite"/);
  assert.doesNotMatch(driverSection, /儲存文字大小|套用文字大小|確認文字大小/);
});

test("閱讀選項具備原生 radio 語意、鍵盤操作、可見焦點與 44px 觸控目標", () => {
  assert.match(html, /\.reading-size-choice\s*\{[\s\S]*?min-height: 44px/);
  assert.match(html, /\.reading-size-choice:has\(input:focus-visible\)/);
  assert.match(html, /\.reading-size-choice:has\(input:checked\)/);
  assert.match(html, /\.reading-size-choice input\s*\{[\s\S]*?accent-color: var\(--brand\)/);
  assert.equal((driverSection.match(/name="aiReportsReadingSize"/g) || []).length, 3);
});

test("舊資料與未知值安全回退標準，三個合法值保持不變", () => {
  const source = extractFunction("normalizeAIReportsReadingSize");
  const normalize = Function(
    "aiReportsReadingSizeLabels",
    `${source}; return normalizeAIReportsReadingSize;`
  )({ standard: "標準", comfort: "舒適", large: "大字" });
  assert.equal(normalize(undefined), "standard");
  assert.equal(normalize(null), "standard");
  assert.equal(normalize("unknown"), "standard");
  assert.equal(normalize("standard"), "standard");
  assert.equal(normalize("comfort"), "comfort");
  assert.equal(normalize("large"), "large");
  assert.match(extractFunction("normalizeSettings"), /aiReportsReadingSize: normalizeAIReportsReadingSize\(settings\.aiReportsReadingSize\)/);
});

test("設定沿用 driverPayApp.v2 並以單一 settings 欄位交易式自動儲存", () => {
  const save = extractFunction("saveAIReportsReadingSize");
  assert.match(html, /const storageKey = "driverPayApp\.v2"/);
  assert.match(save, /nextState\.settings\.aiReportsReadingSize = next/);
  assert.match(save, /persistStatePayload\(nextState, \{ updateMemory: true \}\)/);
  assert.match(save, /applyAIReportsReadingSize\(next\)/);
  assert.match(save, /applyAIReportsReadingSize\(previous\)/);
  assert.match(save, /儲存失敗，已保留原本設定/);
  assert.doesNotMatch(save, /WorkRecord|expenseAllocations|migration|Supabase/);
});

test("重新載入會在首次 render 前套用保存設定且不產生字級閃動", () => {
  assert.match(html, /<html lang="zh-Hant" data-ai-reports-reading-size="standard">/);
  assert.match(html, /applyAIReportsReadingSize\(state\.settings\.aiReportsReadingSize\);\s*renderBrandAttribution\(\);\s*renderEntryDateCard/);
  assert.match(extractFunction("applyAIReportsReadingSize"), /document\.documentElement\.dataset\.aiReportsReadingSize = normalized/);
});

test("AI 與 Reports 共用同一組閱讀 token，不使用 zoom、scale 或複製元件", () => {
  for (const mode of ["comfort", "large"]) {
    assert.match(html, new RegExp(`html\\[data-ai-reports-reading-size="${mode}"\\]`));
  }
  assert.match(html, /\.ai-insight-card\s*\{[\s\S]*?padding: var\(--reading-card-padding\)/);
  assert.match(html, /\.ai-insight-item p\s*\{[\s\S]*?font-size: var\(--reading-ai-detail-size\)/);
  assert.match(html, /\.reports-section\s*\{[\s\S]*?padding: var\(--reading-card-padding\)/);
  assert.match(html, /\.reports-trend-label,[\s\S]*?font-size: var\(--reading-report-caption-size\)/);
  const readingRules = [...html.matchAll(
    /html\[data-ai-reports-reading-size="(?:comfort|large)"\]\s*\{([\s\S]*?)\}/g
  )].map(match => match[1]).join("\n");
  assert.doesNotMatch(readingRules, /\bzoom\s*:|transform\s*:\s*scale/);
});

test("AI 閱讀內容分層放大，主頁標題不會跟著大幅放大", () => {
  assert.match(aiSection, /class="ai-dashboard"/);
  assert.match(html, /\.ai-page-intro h2\s*\{[\s\S]*?font-size: 26px/);
  assert.match(html, /\.ai-section-head h3\s*\{[\s\S]*?font-size: var\(--reading-ai-section-title-size\)/);
  assert.match(html, /\.ai-advice-list li,[\s\S]*?font-size: var\(--reading-ai-body-size\)/);
  assert.match(html, /\.ai-analysis-meta\s*\{[\s\S]*?font-size: var\(--reading-ai-small-size\)/);
  assert.match(html, /\.ai-platform-summary\s*\{[\s\S]*?font-size: var\(--reading-ai-detail-size\)/);
});

test("Reports 標籤、圖表與空狀態共用設定，主要 KPI 數字維持原尺寸", () => {
  assert.match(reportsSection, /class="reports-page ds-page-container"/);
  assert.match(html, /\.reports-primary-kpi strong\s*\{[\s\S]*?clamp\(21px, 6vw, 28px\)/);
  assert.match(html, /\.reports-platform-total strong\s*\{[\s\S]*?clamp\(24px, 7vw, 32px\)/);
  assert.match(html, /\.reports-kpi-label,[\s\S]*?var\(--reading-report-caption-size\)/);
  assert.match(html, /\.reports-page \.ds-empty-state \.ds-secondary\s*\{[\s\S]*?var\(--reading-report-body-size\)/);
  assert.match(html, /\.reports-trend-value[\s\S]*?var\(--reading-report-caption-size\)/);
});

test("大字模式在 320px 對趨勢與平台列提供安全重排且不截斷長名稱", () => {
  assert.match(html, /@media \(max-width: 350px\)[\s\S]*?data-ai-reports-reading-size="large"[\s\S]*?reports-trend-row/);
  assert.match(html, /data-ai-reports-reading-size="large"[\s\S]*?ai-platform-row strong\s*\{[\s\S]*?grid-column: 1 \/ -1/);
  assert.match(html, /data-ai-reports-reading-size="large"\] \.reports-platform-name[\s\S]*?white-space: normal/);
  assert.match(html, /\.reports-comparison-list strong[\s\S]*?overflow-wrap: anywhere/);
});

test("閱讀設定不進入 Today、Calendar、Bottom Navigation 或資料計算", () => {
  const todaySection = html.match(
    /<section id="view-today"[\s\S]*?<\/section>\s*<section id="view-calendar"/
  )?.[0] || "";
  const calendarSection = html.match(
    /<section id="view-calendar"[\s\S]*?<\/section>\s*<section id="view-reports"/
  )?.[0] || "";
  assert.doesNotMatch(todaySection, /reading-size|aiReportsReadingSize/);
  assert.doesNotMatch(calendarSection, /reading-size|aiReportsReadingSize/);
  assert.doesNotMatch(html.match(/<nav class="nav"[\s\S]*?<\/nav>/)?.[0] || "", /reading-size|aiReportsReadingSize/);
  assert.doesNotMatch(extractFunction("aggregateReport"), /aiReportsReadingSize|reading-size/);
  assert.doesNotMatch(extractFunction("reportExpenseSummary"), /aiReportsReadingSize|reading-size/);
});

test("HTML／CSS／JavaScript 變更同步更新 App Shell cache", () => {
  assert.match(serviceWorker, /const CACHE_NAME = "driver-pay-pro-v20"/);
  assert.match(html, /const appShellCacheName = "driver-pay-pro-v20"/);
});
