const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const html = fs.readFileSync(new URL("../index.html", `file://${__filename}`), "utf8");
const serviceWorker = fs.readFileSync(new URL("../sw.js", `file://${__filename}`), "utf8");
const reportsSection = html.match(
  /<section id="view-reports"[\s\S]*?<\/section>\s*<section id="view-ai"/
)?.[0] || "";

function functionSource(name) {
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

test("平台頁使用本週／本月 session control 並移除 legacy 月份下拉與日均", () => {
  assert.match(reportsSection, /aria-label="平台報表期間"/);
  assert.match(reportsSection, /data-platform-period="week">本週/);
  assert.match(reportsSection, /data-platform-period="month">本月/);
  assert.match(reportsSection, /id="platformReportContent"/);
  assert.doesNotMatch(reportsSection, /platformMonthFilter|日均|每日平均/);
  assert.match(functionSource("createReportsState"), /selectedPlatformPeriod: "week"/);
  assert.doesNotMatch(functionSource("createReportsState"), /localStorage|sessionStorage/);
});

test("平台排行只描述收入貢獻並提供文字收入、占比與安全 bar", () => {
  const renderer = functionSource("renderPlatformReport");
  assert.match(renderer, /aggregatePlatformIncome/);
  assert.match(renderer, /平台收入排行/);
  assert.match(renderer, /row\.displayName/);
  assert.match(renderer, /row\.income/);
  assert.match(renderer, /row\.share/);
  assert.match(renderer, /aria-label="第 \$\{row\.rank\} 名/);
  assert.match(renderer, /reports-platform-track" aria-hidden="true"/);
  assert.doesNotMatch(renderer, /<img|platform-logo|品牌色|效率|最佳平台|平台時薪/);
});

test("平台頁區分無紀錄、無平台收入、未歸因與資料不一致", () => {
  const renderer = functionSource("renderPlatformReport");
  assert.match(renderer, /此期間尚無工作紀錄/);
  assert.match(renderer, /此期間尚無平台收入資料/);
  assert.match(renderer, /未歸入平台收入/);
  assert.match(renderer, /平台收入合計高於可確認的總收入/);
  assert.match(renderer, /部分平台資料無法計算/);
});

test("重要日期是整列可聚焦按鈕並導向 Calendar exact date", () => {
  const important = functionSource("renderImportantDates");
  const open = functionSource("openReportDateInCalendar");
  assert.match(important, /reports-important-action/);
  assert.match(important, /data-report-date/);
  assert.match(important, /aria-label="查看/);
  assert.match(open, /normalizeDateKey/);
  assert.match(open, /#calendar\/\$\{date\}/);
  assert.match(open, /calendarDate: date/);
  assert.doesNotMatch(open, /openRecordEditor|data-calendar-edit|saveState/);
});

test("Reports 返回上下文保留 tab、週、月與平台期間且不持久化", () => {
  const capture = functionSource("captureReportsContext");
  const restore = functionSource("restoreReportsContext");
  assert.match(capture, /activeReportTab/);
  assert.match(capture, /selectedWeekAnchor/);
  assert.match(capture, /selectedMonth/);
  assert.match(capture, /selectedPlatformPeriod/);
  assert.match(capture, /scrollPosition/);
  assert.match(restore, /setReportView/);
  assert.match(restore, /window\.scrollTo/);
  assert.doesNotMatch(`${capture}\n${restore}`, /localStorage|saveState|persistStatePayload/);
});

test("成功 record mutation 才發出單一 Reports refresh notification", () => {
  const notify = functionSource("notifyRecordChanged");
  const refresh = functionSource("handleRecordChanged");
  const calendarCommit = functionSource("commitCalendarRecord");
  const calendarDelete = functionSource("deleteCalendarRecord");
  assert.match(notify, /driverpay:recordchange/);
  assert.match(notify, /dateKey/);
  assert.match(refresh, /reportsRefreshFrame/);
  assert.match(refresh, /requestAnimationFrame/);
  assert.match(calendarCommit, /persistStatePayload[\s\S]*?notifyRecordChanged/);
  assert.match(calendarDelete, /persistStatePayload[\s\S]*?notifyRecordChanged/);
  assert.doesNotMatch(functionSource("openCalendar"), /notifyRecordChanged/);
});

test("Reports error、offline、retry 與 read-only 保護保持分離", () => {
  assert.match(functionSource("reportsErrorMarkup"), /role="alert"/);
  assert.match(functionSource("reportsErrorMarkup"), /data-reports-retry/);
  assert.match(functionSource("reportsStatusMarkup"), /離線中/);
  assert.match(functionSource("retryReportsRead"), /loadState/);
  assert.doesNotMatch(reportsSection, /data-calendar-(?:add|edit|delete)|recordEditorDialog/);
  assert.doesNotMatch(
    `${functionSource("renderPlatformReport")}\n${functionSource("openReportDateInCalendar")}`,
    /saveState|persistStatePayload|localStorage\.setItem/
  );
});

test("平台 Accessibility、responsive 與 PWA v18 契約存在", () => {
  assert.match(reportsSection, /role="tablist" aria-label="平台報表期間"/);
  assert.match(reportsSection, /role="tab" aria-selected="true"/);
  assert.match(html, /\.reports-platform-period button[\s\S]*?min-height: var\(--touch-target-min\)/);
  assert.match(html, /\.reports-platform-row[\s\S]*?grid-template-columns: minmax\(0, 1fr\) auto/);
  assert.match(html, /\.reports-platform-name[\s\S]*?text-overflow: ellipsis/);
  assert.match(html, /\.reports-important-action[\s\S]*?min-height: var\(--touch-target-min\)/);
  assert.match(serviceWorker, /driver-pay-pro-v18/);
});
