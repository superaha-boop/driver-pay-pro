const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const html = fs.readFileSync(new URL("../index.html", `file://${__filename}`), "utf8");
const serviceWorker = fs.readFileSync(new URL("../sw.js", `file://${__filename}`), "utf8");
const fixture = JSON.parse(
  fs.readFileSync(new URL("./fixtures/v1-regression.json", `file://${__filename}`), "utf8")
);

function functionSource(name) {
  const start = html.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `找不到 ${name}()`);
  const nextFunction = html.indexOf("\n    function ", start + 10);
  return html.slice(start, nextFunction < 0 ? html.length : nextFunction);
}

test("V1 fixture 完整列出 45 個核准回歸情境", () => {
  assert.equal(fixture.requiredScenarios.length, 45);
  assert.equal(new Set(fixture.requiredScenarios).size, 45);
  for (const scenario of [
    "no-data",
    "single-valid-record",
    "current-week-data",
    "previous-month-data",
    "positive-net",
    "zero-net",
    "negative-net",
    "income-without-work-time",
    "multiple-platforms",
    "tips",
    "unknown-platform",
    "historical-platform-alias",
    "cross-midnight",
    "cross-month",
    "cross-year",
    "leap-year",
    "corrupt-json",
    "calendar-create",
    "mutation-rollback",
    "driver-goal-save-success",
    "driver-goal-save-failure",
    "ai-insufficient-data",
    "ai-weekday-pattern-sufficient",
    "ai-positive-to-negative",
    "ai-offline",
    "pwa-reload",
    "service-worker-upgrade",
    "navigation-context",
    "return-focus"
  ]) {
    assert.equal(fixture.requiredScenarios.includes(scenario), true, `缺少 ${scenario}`);
  }
  assert.equal(fixture.weekdayPattern.length, 12);
  assert.equal(fixture.corruptJson.endsWith("["), true);
});

test("Fixture 只存在測試目錄且不會進入 Production 或 App Shell", () => {
  assert.doesNotMatch(html, /v1-regression\.json|__TEST_DATA__/);
  assert.doesNotMatch(serviceWorker, /tests\/|fixtures\//);
  assert.equal(fixture.expected.storageKey, "driverPayApp.v2");
  assert.equal(fixture.expected.serviceWorkerCache, "driver-pay-pro-v38");
});

test("AI 與 Driver 唯讀 renderer 不寫回 WorkRecord", () => {
  for (const name of [
    "buildAiAnalysisContext",
    "buildAIInsights",
    "renderAiAnalysis",
    "renderDriverStatus"
  ]) {
    const source = functionSource(name);
    assert.doesNotMatch(source, /saveState|persistStatePayload|ensureEntryForDate|localStorage\.setItem|entries\.push|entries\.splice/);
  }
  assert.doesNotMatch(html, /state\.(?:insights|recommendations|reminders|analysisMetadata)\s*=/);
});

test("只有核准 mutation 與既有 Driver 目標設定可進入 persistence", () => {
  assert.match(html, /notifyRecordChanged\(entry\.date, "today-update"\)/);
  assert.match(html, /notifyRecordChanged\(recordEditorState\.date, sameDateIndex >= 0 \? "edit" : "create"\)/);
  assert.match(html, /notifyRecordChanged\(recordEditorState\.date, "delete"\)/);
  assert.match(html, /function saveDriverDailyGoal\(input\)[\s\S]*?state\.settings\.dailyGoal = next[\s\S]*?saveState\(\)/);
  assert.doesNotMatch(html, /state\.settings\.(?:aiHidden|aiExpanded|insightState|driverStatus)\s*=/);
});

test("AI 與 Driver Accessibility 契約完整", () => {
  assert.match(html, /<h3 id="aiTodayTitle">本週重點<\/h3>/);
  assert.match(html, /id="aiMonthDisclosureToggle"[\s\S]*?aria-expanded="false"[\s\S]*?aria-controls="aiMonthDisclosureContent"/);
  assert.match(html, /id="aiSourcesDisclosureToggle"[\s\S]*?aria-expanded="false"[\s\S]*?aria-controls="aiSourcesDisclosureContent"/);
  assert.match(html, /id="aiMetadataDisclosureToggle"[\s\S]*?aria-expanded="false"[\s\S]*?aria-controls="aiMetadataDisclosureContent"/);
  assert.match(html, /ai-reminder-severity/);
  assert.match(html, /aria-label="\$\{escapeAttr\(accessibleName \|\| label\)\}"/);
  assert.match(html, /label class="driver-goal-input" for="dailyGoal"/);
  assert.match(html, /id="driverGoalStatus"[\s\S]*?role="status" aria-live="polite"/);
  assert.match(html, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(html, /:focus-visible/);
});

test("320 至 1024px responsive 基礎不以裁字換取空間", () => {
  assert.match(html, /@media \(max-width: 699px\)/);
  assert.match(html, /@media \(max-width: 980px\)/);
  assert.match(html, /@media \(min-width: 700px\)/);
  assert.match(html, /\.ai-dashboard\s*\{[\s\S]*?min-width: 0/);
  assert.match(html, /\.driver-overview-card\s*\{[\s\S]*?min-width: 0/);
  assert.match(html, /\.ai-insight-item p\s*\{[\s\S]*?line-height: 1\.55/);
  assert.match(html, /\.driver-goal-control input\s*\{[\s\S]*?min-width: 0/);
  assert.doesNotMatch(html, /\.ai-[^{]+\{[^}]*white-space:\s*nowrap[^}]*overflow:\s*hidden/);
});

test("事件與 autosave 不會重複註冊或建立無限制 timer", () => {
  assert.equal((html.match(/window\.addEventListener\("driverpay:recordchange"/g) || []).length, 1);
  assert.equal((html.match(/document\.getElementById\("view-ai"\)\.addEventListener\("click"/g) || []).length, 1);
  assert.equal((html.match(/driverDailyGoalInput\.addEventListener\("input"/g) || []).length, 1);
  assert.match(html, /window\.clearTimeout\(driverGoalSaveTimer\)/);
  assert.match(html, /window\.setTimeout\(\(\) => saveDriverDailyGoal\(input\), 450\)/);
  assert.equal((html.match(/window\.addEventListener\("storage"/g) || []).length, 0);
});

test("Service Worker v38 更新、清舊 cache 並保留 navigation fallback", () => {
  assert.match(serviceWorker, /const CACHE_NAME = "driver-pay-pro-v38"/);
  assert.match(serviceWorker, /keys\.filter\(key => key !== CACHE_NAME\)\.map\(key => caches\.delete\(key\)\)/);
  assert.match(serviceWorker, /event\.request\.mode === "navigate"/);
  assert.match(serviceWorker, /isNavigation && !response\.ok/);
  assert.match(serviceWorker, /cached \|\| response/);
  assert.match(serviceWorker, /caches\.match\("\.\/index\.html"\)/);
  assert.doesNotMatch(serviceWorker, /driver-pay-pro-v16|driver-pay-pro-v12|trycloudflare|_vercel_share/);
});
