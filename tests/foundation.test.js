const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const read = relativePath => fs.readFileSync(new URL(`../${relativePath}`, `file://${__filename}`), "utf8");
const packageJson = JSON.parse(read("package.json"));
const eslintConfig = read("eslint.config.mjs");
const productionValidator = read("scripts/validate-production.mjs");
const releaseCheck = read("scripts/release-check.mjs");
const showcase = read("design-system.html");
const indexHtml = read("index.html");
const serviceWorker = read("sw.js");

test("Foundation scripts provide one-command lint, build and release gates", () => {
  assert.equal(packageJson.private, true);
  assert.equal(packageJson.scripts.lint, "node scripts/lint.mjs");
  assert.equal(packageJson.scripts.build, "npm run validate:production");
  assert.equal(packageJson.scripts["release:check"], "node scripts/release-check.mjs");
  assert.match(packageJson.scripts.test, /tests\/\*\.test\.js/);
  assert.match(packageJson.scripts["test:today"], /work-time\.test\.js/);
  assert.match(packageJson.scripts["test:calendar"], /calendar-regression\.test\.js/);
  assert.match(packageJson.scripts["test:reports"], /reports-final-regression\.test\.js/);
});

test("Lint blocks correctness errors while allowing reviewable warnings", () => {
  [
    '"no-undef": "error"',
    '"no-redeclare": "error"',
    '"no-unreachable": "error"',
    '"no-async-promise-executor": "error"',
    '"no-promise-executor-return": "error"',
    '"no-global-assign": "error"',
    '"no-unused-vars": ["warn"'
  ].forEach(rule => assert.match(eslintConfig, new RegExp(rule.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));
  assert.match(eslintConfig, /node_modules\/\*\*/);
  assert.match(eslintConfig, /coverage\/\*\*/);
  assert.match(eslintConfig, /\.backups\/\*\*/);
});

test("Production validation protects static PWA release requirements", () => {
  [
    "parse(indexHtml",
    "driverPayApp\\.v\\d+",
    "trycloudflare\\.com",
    "_vercel_share",
    "Service Worker navigation fallback is missing",
    "Missing primary navigation target",
    "Manifest icon is missing",
    "Design System showcase must remain outside the App Shell"
  ].forEach(contract => assert.ok(productionValidator.includes(contract), `Missing validator contract: ${contract}`));
});

test("Release check runs every required gate and stops on failure", () => {
  [
    "lint",
    "test",
    "test:today",
    "test:reports",
    "test:calendar",
    "check:inline",
    "check:sw",
    "check:manifest",
    "validate:production",
    "diff",
    "--check"
  ].forEach(step => assert.ok(releaseCheck.includes(step), `Missing release step: ${step}`));
  assert.match(releaseCheck, /process\.exit\(result\.status \|\| 1\)/);
});

test("Design System showcase covers the approved internal states", () => {
  [
    "Typography",
    "Buttons and states",
    "Segmented control",
    "KPI",
    "Empty state",
    "Loading state",
    "Error state",
    "List row",
    "Touch target",
    "focus-visible",
    "prefers-reduced-motion"
  ].forEach(label => assert.ok(showcase.includes(label), `Missing showcase section: ${label}`));
});

test("Showcase remains isolated and V1.1 App Shell uses v15", () => {
  const nav = indexHtml.match(/<nav class="nav"[\s\S]*?<\/nav>/)?.[0] || "";
  assert.doesNotMatch(nav, /design-system/i);
  assert.doesNotMatch(serviceWorker, /design-system\.html/);
  assert.match(serviceWorker, /driver-pay-pro-v15/);
  assert.doesNotMatch(serviceWorker, /driver-pay-pro-v16/);
});
