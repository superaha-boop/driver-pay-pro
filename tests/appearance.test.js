const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const html = fs.readFileSync(new URL("../index.html", `file://${__filename}`), "utf8");
const styles = fs.readFileSync(new URL("../styles/design-system.css", `file://${__filename}`), "utf8");
const manifest = JSON.parse(fs.readFileSync(new URL("../manifest.webmanifest", `file://${__filename}`), "utf8"));
const serviceWorker = fs.readFileSync(new URL("../sw.js", `file://${__filename}`), "utf8");
const driverSection = html.match(/<section id="view-settings"[\s\S]*?<\/section>\s*<\/main>/)?.[0] || "";

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
    if (char === "}" && --depth === 0) return html.slice(start, index + 1);
  }
  throw new Error(`${name}() 結尾不完整`);
}

test("Driver 外觀只提供跟隨系統、淺色、深色", () => {
  const values = [...driverSection.matchAll(/name="appearance" value="([^"]+)" data-appearance-option/g)]
    .map(match => match[1]);
  assert.deepEqual(values, ["system", "light", "dark"]);
  assert.match(driverSection, /<legend>外觀<\/legend>/);
  assert.match(driverSection, /id="appearanceStatus"[^>]*role="status"[^>]*aria-live="polite"[^>]*hidden/);
});

test("外觀控制重用 44px segmented control 與可見焦點", () => {
  assert.equal((driverSection.match(/data-appearance-option/g) || []).length, 3);
  assert.match(html, /\.reading-size-choice\s*\{[\s\S]*?min-height: 44px/);
  assert.match(html, /\.reading-size-choice:has\(input:focus-visible\)/);
});

test("normalizeAppearance 缺少或非法值時一律回到 system", () => {
  const source = extractFunction("normalizeAppearance");
  const normalize = Function("appearanceLabels", `${source}; return normalizeAppearance;`)({
    system: "跟隨系統", light: "淺色", dark: "深色"
  });
  assert.equal(normalize(undefined), "system");
  assert.equal(normalize("unknown"), "system");
  assert.equal(normalize("system"), "system");
  assert.equal(normalize("light"), "light");
  assert.equal(normalize("dark"), "dark");
});

test("舊 settings 沒有 appearance 時 normalize 為 system", () => {
  assert.match(extractFunction("normalizeSettings"), /appearance: normalizeAppearance\(settings\.appearance\)/);
});

test("主畫面 render 前會讀取 appearance 並套用 root theme", () => {
  const head = html.slice(0, html.indexOf("<link rel=\"manifest\""));
  assert.match(head, /localStorage\.getItem\("driverPayApp\.v2"\)/);
  assert.match(head, /applyTheme\(settings\.appearance\)/);
  assert.match(head, /document\.documentElement\.dataset\.theme = resolved/);
  assert.match(head, /prefers-color-scheme: dark/);
});

test("system 只保存偏好，resolved theme 不寫入 settings", () => {
  const save = extractFunction("saveAppearance");
  assert.match(save, /nextState\.settings\.appearance = next/);
  assert.doesNotMatch(save, /settings\.(?:resolvedTheme|darkMode|isDark|themeMode|nightMode)/);
  assert.doesNotMatch(html, /settings\.(?:resolvedTheme|darkMode|isDark|themeMode|nightMode)\s*=/);
});

test("system media query listener 只註冊一次並可即時更新", () => {
  const setup = extractFunction("setupAppearance");
  assert.match(setup, /if \(appearanceMediaListenerBound\) return/);
  assert.match(setup, /addEventListener\("change", handleSystemAppearanceChange\)/);
  assert.match(setup, /appearanceMediaListenerBound = true/);
  assert.match(extractFunction("handleSystemAppearanceChange"), /!== "system"\) return[\s\S]*?applyAppearance\("system"\)/);
});

test("固定淺色或深色不會被 OS change 覆蓋", () => {
  const handler = extractFunction("handleSystemAppearanceChange");
  assert.match(handler, /normalizeAppearance\(state\.settings\.appearance\) !== "system"/);
});

test("Appearance 保存失敗會回復原外觀且保留原資料", () => {
  const save = extractFunction("saveAppearance");
  assert.match(save, /persistStatePayload\(nextState, \{ updateMemory: true \}\)/);
  assert.match(save, /applyAppearance\(previous\)/);
  assert.doesNotMatch(save, /renderAll|activeRecordDate|calendarState|entries|WorkRecord/);
});

test("Appearance 與 displaySize 是互相獨立的 canonical settings", () => {
  const normalize = extractFunction("normalizeSettings");
  assert.match(normalize, /displaySize: normalizeDisplaySize\(displaySizeSource\)/);
  assert.match(normalize, /appearance: normalizeAppearance\(settings\.appearance\)/);
  assert.match(html, /data-display-size="standard" data-theme="light" data-appearance="system"/);
});

test("Theme 切換不重建頁面、不清日期與 disclosure state", () => {
  const apply = extractFunction("applyAppearance");
  assert.match(apply, /document|__driverPayTheme|driverpay:themechange/);
  assert.doesNotMatch(apply, /renderAll|navigateTo|activeView\s*=|activeRecordDate\s*=|calendarState\s*=|driverDisclosureState\s*=/);
});

test("Theme root 與主要 semantic tokens 同時提供 Light 與 Dark", () => {
  assert.match(styles, /html\[data-theme="dark"\]\s*\{/);
  for (const token of [
    "--app-bg", "--surface", "--surface-elevated", "--surface-secondary", "--surface-muted",
    "--text-primary", "--text-secondary", "--text-tertiary", "--text-disabled", "--text-on-primary",
    "--border", "--border-strong", "--divider", "--primary", "--primary-hover", "--primary-soft",
    "--input-bg", "--input-border", "--input-placeholder", "--nav-bg", "--nav-active-bg",
    "--chart-grid", "--chart-axis", "--chart-label", "--chart-tooltip-bg", "--overlay",
    "--snackbar-bg", "--snackbar-text"
  ]) assert.ok(styles.includes(`${token}:`), `缺少 Appearance token：${token}`);
});

test("Dark palette 不使用純黑頁面或全白硬切背景", () => {
  const dark = styles.match(/html\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/)?.[1] || "";
  assert.match(dark, /--color-background: #101411/);
  assert.doesNotMatch(dark, /--color-background:\s*#000(?:000)?\b/i);
  assert.doesNotMatch(dark, /--color-surface:\s*#fff(?:fff)?\b/i);
});

test("Reports 圖表使用 theme tokens 且不依賴固定 Canvas 顏色", () => {
  assert.doesNotMatch(html, /<canvas\b|getContext\(/);
  assert.match(html, /\.reports-trend-visual[\s\S]*?background: var\(--color-surface-secondary\)/);
  assert.match(html, /\.reports-trend-visual::after[\s\S]*?background: var\(--color-border-strong\)/);
  assert.match(html, /\.reports-trend-bar[\s\S]*?background: var\(--color-brand\)/);
});

test("theme-color 隨 resolved theme 更新且 manifest 維持非白色 standalone 啟動背景", () => {
  assert.match(html, /id="themeColorMeta"/);
  assert.match(html, /resolved === "dark" \? "#101411" : "#f3f5f4"/);
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.background_color, "#075b43");
});

test("Appearance 不改主 key、WorkRecord 或 App Shell 更新策略", () => {
  assert.match(html, /const storageKey = "driverPayApp\.v2"/);
  assert.doesNotMatch(extractFunction("saveAppearance"), /expenses|tips|incomes|workSession|expenseAllocations/);
  assert.match(serviceWorker, /const CACHE_NAME = "driver-pay-pro-v41"/);
  assert.doesNotMatch(serviceWorker, /skipWaiting|clients\.claim/);
});
