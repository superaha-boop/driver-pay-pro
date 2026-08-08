const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const html = fs.readFileSync(new URL("../index.html", `file://${__filename}`), "utf8");
const showcase = fs.readFileSync(new URL("../design-system.html", `file://${__filename}`), "utf8");
const styles = fs.readFileSync(new URL("../styles/design-system.css", `file://${__filename}`), "utf8");
const serviceWorker = fs.readFileSync(new URL("../sw.js", `file://${__filename}`), "utf8");

test("主程式與展示頁共用同一份 Design System 樣式", () => {
  assert.match(html, /<link rel="stylesheet" href="styles\/design-system\.css">/);
  assert.match(showcase, /<link rel="stylesheet" href="styles\/design-system\.css">/);
  assert.match(serviceWorker, /driver-pay-pro-v31/);
  assert.match(serviceWorker, /"\.\/styles\/design-system\.css"/);
});

test("Design Tokens 涵蓋規定的級距與語意系統", () => {
  [
    "--spacing-1: 4px",
    "--spacing-12: 48px",
    "--radius-sm:",
    "--radius-sheet:",
    "--radius-pill:",
    "--font-size-display:",
    "--font-size-page-title:",
    "--font-size-section-title:",
    "--color-brand:",
    "--color-brand-hover:",
    "--color-background:",
    "--color-text-primary:",
    "--color-border-default:",
    "--color-success:",
    "--color-warning:",
    "--color-danger:",
    "--color-info:",
    "--color-overlay:",
    "--color-focus-ring:",
    "--shadow-none:",
    "--shadow-soft:",
    "--shadow-card:",
    "--shadow-overlay:",
    "--border-selected:",
    "--border-danger:",
    "--motion-fast:",
    "--motion-normal:",
    "--motion-slow:",
    "--touch-target-min: 44px"
  ].forEach(token => assert.ok(styles.includes(token), `缺少 token：${token}`));
});

test("共用 primitives 與必要狀態已定義", () => {
  [
    ".ds-button",
    ".ds-button--primary",
    ".ds-button--secondary",
    ".ds-button--ghost",
    ".ds-button--text",
    ".ds-button--danger",
    ".ds-button--sm",
    ".ds-button--md",
    ".ds-button--lg",
    ".ds-button--icon",
    ".ds-icon-button",
    ".ds-card",
    ".ds-card--elevated",
    ".ds-card--muted",
    ".ds-card--selected",
    ".ds-card--interactive",
    ".ds-section-header",
    ".ds-empty-state",
    ".ds-skeleton",
    ".ds-save-status",
    ".ds-page-container",
    ".ds-divider",
    ".ds-surface"
  ].forEach(selector => assert.ok(styles.includes(selector), `缺少 primitive：${selector}`));
  assert.match(styles, /\.ds-button\[disabled\]/);
  assert.match(styles, /\.ds-button\[aria-busy="true"\]/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
});

test("IconButton、SaveStatus 與展示頁具備無障礙契約", () => {
  assert.match(styles, /\.ds-icon-button[\s\S]*?width: var\(--touch-target-min\)/);
  const iconButtons = [...showcase.matchAll(/<button class="ds-icon-button[^"]*"([^>]*)>/g)];
  assert.ok(iconButtons.length >= 4);
  iconButtons.forEach(match => assert.match(match[1], /aria-label="[^"]+"/));
  assert.match(showcase, /class="ds-save-status"[^>]*role="status"[^>]*aria-live="polite"/);
  assert.match(showcase, /class="ds-save-status"[^>]*role="alert"/);
  assert.doesNotMatch(showcase, /[\u{1F300}-\u{1FAFF}]/u);
});

test("原生時間欄位安全 wrapper 不允許超出父層", () => {
  assert.match(styles, /\.ds-time-control \{[\s\S]*?width: 100%;[\s\S]*?max-width: 100%;[\s\S]*?min-width: 0;[\s\S]*?overflow: hidden;/);
  assert.match(styles, /\.ds-time-control input\[type="time"\] \{[\s\S]*?width: 100%;[\s\S]*?max-width: 100%;[\s\S]*?min-width: 0;[\s\S]*?margin: 0;[\s\S]*?box-sizing: border-box;/);
  assert.match(html, /\.work-time-control \{[\s\S]*?width: 100%;[\s\S]*?max-width: 100%;[\s\S]*?min-width: 0;/);
  assert.match(html, /\.work-time-control input\[type="time"\] \{[\s\S]*?width: 100%;[\s\S]*?max-width: 100%;[\s\S]*?min-width: 0;[\s\S]*?margin: 0;/);
});

test("Showcase 不進入正式導覽或 PWA App Shell", () => {
  const nav = html.match(/<nav class="nav"[\s\S]*?<\/nav>/)?.[0] || "";
  assert.doesNotMatch(nav, /design-system/i);
  assert.doesNotMatch(serviceWorker, /design-system\.html/);
  assert.match(showcase, /<meta name="robots" content="noindex, nofollow">/);
  assert.doesNotMatch(showcase, /<nav class="nav"/);
});
