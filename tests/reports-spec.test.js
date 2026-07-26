const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const reportsSpec = fs.readFileSync(new URL("../docs/REPORTS_SPEC.md", `file://${__filename}`), "utf8");
const agents = fs.readFileSync(new URL("../AGENTS.md", `file://${__filename}`), "utf8");
const productSpec = fs.readFileSync(new URL("../docs/PRODUCT_SPEC.md", `file://${__filename}`), "utf8");
const freezeChecklist = fs.readFileSync(
  new URL("../docs/FEATURE_FREEZE_CHECKLIST.md", `file://${__filename}`),
  "utf8"
);

test("Reports Spec 包含正式實作所需的 30 個章節", () => {
  const headings = [...reportsSpec.matchAll(/^## (\d+)\. /gm)].map(match => Number(match[1]));
  assert.deepEqual(headings, Array.from({ length: 30 }, (_, index) => index + 1));
  assert.match(reportsSpec, /Status: Approved implementation specification/);
  assert.match(reportsSpec, /sole primary implementation source/);
});

test("Reports 導覽、期間與狀態契約完整", () => {
  assert.match(reportsSpec, /`週報`, `月報`, and `平台`/);
  assert.match(reportsSpec, /Fresh App sessions always enter `週報`/);
  assert.match(reportsSpec, /Starts Monday at 00:00:00 Taipei time/);
  assert.match(reportsSpec, /Ends at the next Monday at 00:00:00 as a half-open boundary/);
  assert.match(reportsSpec, /`activeReportTab`/);
  assert.match(reportsSpec, /`selectedWeek`/);
  assert.match(reportsSpec, /`selectedMonth`/);
  assert.match(reportsSpec, /`selectedPlatformPeriod`/);
  assert.match(reportsSpec, /`loadingState`/);
  assert.match(reportsSpec, /`errorState`/);
  assert.match(reportsSpec, /`offlineState`/);
  assert.match(reportsSpec, /not added to `driverPayApp\.v2`/);
});

test("Reports KPI、比較、趨勢與平台定義共用 canonical contract", () => {
  assert.match(reportsSpec, /Period net income ÷ period valid work hours/);
  assert.match(reportsSpec, /never the arithmetic average of daily hourly rates/);
  assert.match(reportsSpec, /Previous value is zero[\s\S]*no percentage/i);
  assert.match(reportsSpec, /Weekly: exactly seven daily net-income points/);
  assert.match(reportsSpec, /Monthly: four to six Monday-first weekly buckets/);
  assert.match(reportsSpec, /It measures income contribution only/);
  assert.match(reportsSpec, /Tips are not assigned to a platform/);
  assert.match(reportsSpec, /must not depend on AI aggregation helpers/);
});

test("Reports drill-down、資料安全與錯誤狀態契約存在", () => {
  assert.match(reportsSpec, /window\.openCalendar/);
  assert.match(reportsSpec, /#reports\/week\/YYYY-MM-DD/);
  assert.match(reportsSpec, /ReportReturnContext/);
  assert.match(reportsSpec, /No return context is written to localStorage/);
  assert.match(reportsSpec, /verified last-valid snapshot/);
  assert.match(reportsSpec, /must not clear, overwrite/);
  assert.match(reportsSpec, /No Reports summary, comparison, trend, tab, selected period, or return context is stored/);
});

test("Reports 規格涵蓋 30 項以上邊界案例與 20 題現況稽核", () => {
  const edgeSection = reportsSpec.match(/## 26\. Edge Cases[\s\S]*?(?=\n## 27\.)/)?.[0] || "";
  const auditSection = reportsSpec.match(/## 30\. Current Reports Audit[\s\S]*/)?.[0] || "";
  assert.ok((edgeSection.match(/^\| \d+ \|/gm) || []).length >= 30);
  assert.equal((auditSection.match(/^\| \d+ \|/gm) || []).length, 20);
  assert.match(auditSection, /Confirmed/);
  assert.match(auditSection, /Suspected/);
  assert.match(auditSection, /Not present/);
});

test("Reports 永久規則維持產品責任與 Feature Freeze", () => {
  assert.match(agents, /docs\/REPORTS_SPEC\.md/);
  assert.match(agents, /## Reports Execution Rules/);
  assert.match(productSpec, /REPORTS_SPEC\.md/);
  assert.match(productSpec, /Reports and AI are read-only/);
  assert.match(freezeChecklist, /Reports/);
  assert.match(reportsSpec, /Reports contains no record mutation UI/);
});
