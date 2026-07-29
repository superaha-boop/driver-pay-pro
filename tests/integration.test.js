const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const html = fs.readFileSync(new URL("../index.html", `file://${__filename}`), "utf8");
const serviceWorker = fs.readFileSync(new URL("../sw.js", `file://${__filename}`), "utf8");
const manifest = JSON.parse(
  fs.readFileSync(new URL("../manifest.webmanifest", `file://${__filename}`), "utf8")
);

test("Today 與 Calendar 只有成功 persistence 才發出 committed record notification", () => {
  assert.match(
    html,
    /if \(!persistStatePayload\(nextState, \{ updateMemory: true \}\)\) \{[\s\S]*?return;[\s\S]*?\}\s*notifyRecordChanged\(recordEditorState\.date/
  );
  assert.match(
    html,
    /if \(!persistStatePayload\(nextState, \{ updateMemory: true \}\)\) \{[\s\S]*?showToast\("儲存失敗，請稍後再試"\);[\s\S]*?return false;[\s\S]*?\}\s*notifyRecordChanged\(entry\.date, "today-update"\)/
  );
  assert.equal((html.match(/window\.addEventListener\("driverpay:recordchange", handleRecordChanged\)/g) || []).length, 1);
});

test("單一 record-change flow 同步刷新 Reports 與可見的 AI", () => {
  assert.match(html, /function handleRecordChanged\(\) \{[\s\S]*?activeView === "reports"[\s\S]*?refreshActiveReport\(\)/);
  assert.match(html, /function handleRecordChanged\(\) \{[\s\S]*?activeView === "ai"[\s\S]*?renderAiAnalysis\(\)/);
  assert.match(html, /let reportsRefreshFrame = 0;\s*let aiRefreshFrame = 0/);
  assert.doesNotMatch(html, /function analysisEntryTotal|function analysisSummary|function analysisPlatformRows/);
});

test("AI deep link 保留精確日期且不開啟 Calendar Editor", () => {
  assert.match(html, /data-ai-calendar-date/);
  assert.match(
    html,
    /const date = normalizeDateKey\(calendarTarget\.dataset\.aiCalendarDate\);[\s\S]*?const hash = `#calendar\/\$\{date\}`;[\s\S]*?history\.pushState[\s\S]*?applyRoute\(\{ view: "calendar", reportView: activeReportView, calendarDate: date \}\)/
  );
  const aiClickHandler = html.match(
    /document\.getElementById\("view-ai"\)\.addEventListener\("click",[\s\S]*?\n    \}\);/
  )?.[0] || "";
  assert.doesNotMatch(aiClickHandler, /openCalendarRecordEditor|ensureEntryForDate|saveState/);
  assert.match(html, /data-ai-report-view/);
  assert.match(html, /navigateTo\("reports", reportTarget\.dataset\.aiReportView\)/);
});

test("Driver 目標變更沿用既有 persistence 並立即更新 Today", () => {
  assert.match(
    html,
    /state\.settings\.dailyGoal = next;[\s\S]*?if \(!saveState\(\)\) \{[\s\S]*?state\.settings\.dailyGoal = previous/
  );
  assert.match(html, /updateDailyGoal\(\);\s*renderStats\(\)/);
  assert.equal((html.match(/id="dailyGoal"/g) || []).length, 1);
  assert.doesNotMatch(html, /localStorage\.setItem\([^)]*(?:driverGoal|dailyGoal)/);
});

test("每次進入 Driver 都重算本機資料與 App 狀態", () => {
  assert.match(
    html,
    /function setView\(view\) \{[\s\S]*?activeView = view;[\s\S]*?if \(view === "settings"\) renderDriverStatus\(\)/
  );
});

test("五個主分頁與 session context 保持既有契約", () => {
  for (const view of ["today", "calendar", "reports", "ai", "settings"]) {
    assert.match(html, new RegExp(`data-view="${view}"`));
  }
  assert.match(html, /Calendar state 分離|calendarState/);
  assert.match(html, /reportsState = createReportsState/);
  assert.doesNotMatch(html, /state\.settings\.(?:aiState|driverState|reportsState|calendarState)/);
});

test("Local-first V1 App Shell、Manifest 與 release source 保持安全", () => {
  assert.match(serviceWorker, /const CACHE_NAME = "driver-pay-pro-v15"/);
  assert.match(serviceWorker, /"\.\/index\.html"/);
  assert.match(serviceWorker, /"\.\/styles\/design-system\.css"/);
  assert.equal(manifest.start_url, "./");
  assert.equal(manifest.scope, "./");
  assert.equal(html.includes("driverPayApp.v2"), true);
  assert.doesNotMatch(`${html}\n${serviceWorker}`, /trycloudflare\.com|_vercel_share|localhost:\d+/);
});

test("Offline 狀態允許 AI 與 Driver 繼續使用本機資料", () => {
  assert.match(html, /離線・使用本機資料/);
  assert.match(html, /目前離線，分析仍使用此裝置已儲存的資料/);
  assert.match(html, /已離線儲存在此裝置/);
  assert.match(html, /if \(activeView === "ai"\) renderAiAnalysis\(\)/);
  assert.match(html, /if \(activeView === "settings"\) renderDriverStatus\(\)/);
});
