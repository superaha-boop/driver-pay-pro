const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

test("PWA 首次觸控診斷在 App 主程式前安裝", () => {
  const traceIndex = html.indexOf('version: "pwa-first-input-v1"');
  const appIndex = html.indexOf('const brandAttribution = Object.freeze');
  assert.ok(traceIndex > 0);
  assert.ok(appIndex > traceIndex);
  assert.match(html, /record\("trace-installed"\)/);
  assert.match(html, /record\("app-listeners-ready"\)/);
  assert.match(html, /record\("app-interactive-ready"\)/);
});

test("診斷記錄低階觸控、生命週期與 Service Worker 狀態", () => {
  for (const eventType of ["pointerdown", "pointerup", "touchstart", "touchend", "click"]) {
    assert.match(html, new RegExp(`\\["pointerdown", "pointerup", "touchstart", "touchend", "click"\\]`));
    assert.ok(html.includes(eventType));
  }
  assert.match(html, /window\.addEventListener\("pageshow"/);
  assert.match(html, /window\.addEventListener\("focus"/);
  assert.match(html, /document\.addEventListener\("visibilitychange"/);
  assert.match(html, /serviceWorker\?\.getRegistration\?\.\(\)/);
  assert.match(html, /record\("cache-keys"/);
  assert.match(html, /trusted: event\.isTrusted/);
  assert.match(html, /serviceWorkerControlled: Boolean\(navigator\.serviceWorker\?\.controller\)/);
});

test("診斷追蹤日期與三個 Daily Record disclosure 的實際 handler", () => {
  assert.match(html, /record\("daily-date-change-handler", event\)/);
  assert.match(html, /record\("work-time-toggle-handler", event, \{ open: event\.currentTarget\.open \}\)/);
  assert.match(html, /record\("expense-toggle-handler", event, \{ open: event\.currentTarget\.open \}\)/);
  assert.match(html, /record\("other-data-toggle-handler", event, \{ open: event\.currentTarget\.open \}\)/);
  assert.match(html, /record\("manual-entry-handler-start"\)/);
  assert.match(html, /record\("manual-entry-handler-end"/);
});

test("診斷不讀取輸入值且不寫入 Driver Pay Pro 儲存資料", () => {
  const diagnosticStart = html.indexOf("const events = [];");
  const diagnosticEnd = html.indexOf("</script>", diagnosticStart);
  const diagnosticSource = html.slice(diagnosticStart, diagnosticEnd);
  assert.doesNotMatch(diagnosticSource, /\.value\b|driverPayApp\.v2|localStorage|sessionStorage/);
  assert.match(diagnosticSource, /targetDescriptor\(event\.target\)/);
  assert.doesNotMatch(diagnosticSource, /textContent|innerText|innerHTML/);
});

test("診斷複製入口只在 standalone 或明確診斷參數下顯示", () => {
  assert.match(html, /id="pwaInputDiagnostic"[\s\S]*?hidden/);
  assert.match(html, /window\.__driverPayInputTrace\?\.isStandalone \|\| queryEnabled/);
  assert.match(html, /has\("pwa-diagnostic"\)/);
  assert.match(html, /已複製 \$\{snapshot\.events\.length\} 筆，請貼到 Codex 對話。/);
});
