const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const test = require("node:test");

const read = file => fs.readFileSync(new URL(`../${file}`, `file://${__filename}`), "utf8");
const html = read("index.html");
const sw = read("sw.js");
const privacySource = html.match(/<script id="webAnalyticsPrivacy">([\s\S]*?)<\/script>/)[1];

test("static HTML loads one deferred Vercel script after its privacy hook", () => {
  const scripts = [...html.matchAll(/<script\b[^>]*src="\/_vercel\/insights\/script\.js"[^>]*>/g)];
  assert.equal(scripts.length, 1);
  assert.match(scripts[0][0], /\bdefer\b/);
  assert.ok(html.indexOf('id="webAnalyticsPrivacy"') < scripts[0].index);
  assert.doesNotMatch(privacySource, /localStorage|sessionStorage|driverPayApp|querySelector|FormData|fetch\(|sendBeacon|\.value/);
});

test("pageviews redact private URLs and extra fields; custom events are discarded", () => {
  const window = { location: { origin: "https://driver-pay-app.vercel.app" } };
  vm.runInNewContext(privacySource, { window });
  assert.equal(window.vaq.length, 1);
  assert.equal(window.vaq[0][0], "beforeSend");
  const beforeSend = window.vaq[0][1];
  const privateEvent = {
    type: "pageview",
    url: "https://driver-pay-app.vercel.app/private/123?income=3781&note=secret#calendar/2026-08-08",
    route: "/private/123",
    data: { income: 3781, hours: 8, expenses: 1200, note: "secret" }
  };
  assert.deepEqual(JSON.parse(JSON.stringify(beforeSend(privateEvent))), {
    type: "pageview", url: "https://driver-pay-app.vercel.app/"
  });
  assert.equal(beforeSend({ type: "event", name: "save", data: privateEvent.data }), null);
  assert.equal(beforeSend({ type: "unknown", url: privateEvent.url }), null);
  assert.equal(privateEvent.data.note, "secret");
});

function fetchHandler() {
  const handlers = {};
  const calls = [];
  vm.runInNewContext(sw, {
    URL, Request,
    self: { addEventListener: (type, handler) => { handlers[type] = handler; } },
    fetch: request => { calls.push(["fetch", request.url]); return Promise.resolve({ ok: false }); },
    caches: {
      match: key => { calls.push(["fallback", key]); return Promise.resolve({}); },
      open: () => { calls.push(["cache"]); return Promise.resolve({ put() {} }); }
    }
  });
  return { handler: handlers.fetch, calls };
}

test("all Vercel system requests bypass SW interception, including failed navigation and POST", () => {
  const { handler, calls } = fetchHandler();
  for (const pathname of ["/_vercel/insights/script.js", "/_vercel/insights/view", "/_vercel/insights/event", "/_vercel/other"]) {
    for (const method of ["GET", "POST"]) {
      handler({ request: { url: `https://driver-pay-app.vercel.app${pathname}?test=1`, method, mode: "navigate" },
        respondWith() { assert.fail("Vercel system request was intercepted"); } });
    }
  }
  assert.deepEqual(calls, []);
  const shell = JSON.parse(sw.match(/const APP_SHELL = (\[[\s\S]*?\]);/)[1]);
  assert.equal(shell.some(path => path.includes("/_vercel/")), false);
});

test("normal PWA navigation keeps its network and offline HTML fallback", async () => {
  const { handler, calls } = fetchHandler();
  let response;
  handler({ request: new Request("https://driver-pay-app.vercel.app/"),
    respondWith(value) { response = value; } });
  await response;
  assert.equal(calls[0][0], "fetch");
  const navigationRequest = new Request("https://driver-pay-app.vercel.app/");
  Object.defineProperty(navigationRequest, "mode", { value: "navigate" });
  handler({ request: navigationRequest,
    respondWith(value) { response = value; } });
  await response;
  assert.deepEqual(calls, [["fetch", "https://driver-pay-app.vercel.app/"],
    ["fetch", "https://driver-pay-app.vercel.app/"], ["fallback", "./index.html"]]);
});

test("production validator excludes only the exact official Vercel script", async () => {
  const { parse } = await import("parse5");
  const helpers = await import("../scripts/lib/project-validation.mjs");
  const source = read("scripts/validate-production.mjs").replace(/^import[\s\S]*?;\n/gm, "");
  const validate = candidate => vm.runInNewContext(source, {
    fs, parse, ...helpers,
    readProjectFile: file => file === "index.html" ? candidate : read(file),
    console: { log() {} }
  });
  assert.doesNotThrow(() => validate(html));
  for (const resource of ["/_vercel/unknown.js", "/_vercel/insights/missing.js", "/missing-local.js"]) {
    assert.throws(() => validate(html.replace("</head>", `<script src="${resource}"></script></head>`)), /resource is missing/);
  }
  assert.throws(() => validate(html.replace("</head>", '<link href="/_vercel/insights/script.js"></head>')), /resource is missing/);
  assert.throws(() => validate(html.replace("</head>", '<script>const access_token = "private-secret-123";</script></head>')), /embedded secret/);
});
