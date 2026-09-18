const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const test = require("node:test");

const html = fs.readFileSync(new URL("../index.html", `file://${__filename}`), "utf8");
function source(name) {
  const start = html.indexOf(`    function ${name}(`);
  assert.ok(start >= 0, name);
  const end = html.indexOf("\n    }", start) + 6;
  return html.slice(start, end);
}
const functions = ["cloneStatePayload", "replaceStateContents", "normalizeStatePayload", "normalizeSettings",
  "expenseCategoryIdentity", "driverSettingsCandidate", "persistStatePayload", "commitDriverSettings", "saveDriverDailyGoal"];

function harness() {
  const state = {
    platforms: ["Uber", "Yoxi"], expenses: ["油錢/電費", "洗車"],
    settings: { dailyGoal: 3000, monthlyGoal: 80000, platformRates: { Uber: 80, Yoxi: 100 },
      platformProfiles: [{ id: "uber", name: "Uber", inputMode: "total" }, { id: "yoxi", name: "Yoxi", inputMode: "incremental" }],
      expenseShortcuts: ["油錢/電費", "停車費", "洗車"] },
    entries: [{ date: "2026-09-17", incomes: { Uber: 4000 }, expenses: { 洗車: 100 }, hours: 8 }]
  };
  const store = new Map([["driverPayApp.v2", JSON.stringify(state)], ["lastValid", JSON.stringify(state)]]);
  const messages = [];
  const context = vm.createContext({
    state, stateLoadError: null, stateRecoveryNotice: "", lastPersistenceError: null,
    storageKey: "driverPayApp.v2", lastValidStorageKey: "lastValid", fail: false, badRead: false,
    defaultPlatforms: ["Uber", "Yoxi"], defaultExpenses: ["洗車"], defaultPlatformRates: { Uber: 100, Yoxi: 100 },
    maxPlatformIncome: 99999999, driverGoalSaveTimer: null,
    navigator: { onLine: true }, window: { clearTimeout() {} }, console: { error() {} },
    normalizePlatformInputMode: mode => ["total", "incremental"].includes(mode) ? mode : "total",
    normalizeMonthKey: value => value || "", normalizeReportView: value => value || "week",
    normalizeDisplaySize: value => value || "standard", normalizeAppearance: value => value || "system",
    normalizeExpenseShortcuts: value => value, normalizePlatformProfiles: settings => settings.platformProfiles,
    nonNegativeNumber: value => Math.max(0, Number(value) || 0),
    renderDriverStatus() {}, updateDailyGoal() {}, renderStats() {},
    setDriverSettingsStatus: (...args) => messages.push(args),
    setDriverGoalStatus: (...args) => messages.push(["goal", ...args])
  });
  context.localStorage = {
    getItem(key) { return context.badRead && context.didWrite && key === context.storageKey ? "bad-read" : store.get(key) ?? null; },
    setItem(key, value) {
      if (context.fail) throw new Error("QuotaExceededError");
      store.set(key, value); context.didWrite = true;
    },
    removeItem(key) { store.delete(key); }
  };
  vm.runInContext(functions.map(source).join("\n"), context);
  return { context, store, messages, commit: (action, value) => context.commitDriverSettings(action, value, "status") };
}

test("設定成功寫入、讀回後才更新記憶體，紀錄不變且可重新載入", () => {
  const h = harness();
  const records = JSON.stringify(h.context.state.entries);
  assert.equal(h.commit("monthlyGoal", "120000"), true);
  assert.equal(JSON.parse(h.store.get("driverPayApp.v2")).settings.monthlyGoal, 120000);
  assert.equal(h.context.state.settings.monthlyGoal, 120000);
  assert.equal(JSON.stringify(h.context.state.entries), records);
  assert.equal(h.messages.at(-1)[2], "saved");
});

const actions = [
  ["addPlatform", { id: "custom", name: "新車隊", inputMode: "incremental" }],
  ["removePlatform", "Uber"], ["addExpense", "輪胎"], ["removeExpense", "洗車"],
  ["rates", { Uber: "85.5", Yoxi: "0" }], ["monthlyGoal", "90000"],
  ["shortcuts", ["停車費", "油錢/電費", "洗車"]], ["inputMode", { id: "uber", mode: "incremental" }]
];
for (const [action, value] of actions) {
  test(`${action}：儲存失敗不改記憶體或原始資料，可直接重試`, () => {
    const h = harness();
    const before = JSON.stringify(h.context.state);
    h.context.fail = true;
    assert.equal(h.commit(action, value), false);
    assert.equal(JSON.stringify(h.context.state), before);
    assert.equal(h.store.get("driverPayApp.v2"), before);
    assert.equal(h.messages.at(-1)[2], "error");
    assert.equal(h.messages.some(message => message[2] === "saved"), false);
    h.context.fail = false;
    assert.equal(h.commit(action, value), true);
    assert.deepEqual(JSON.parse(h.store.get("driverPayApp.v2")).entries, JSON.parse(before).entries);
  });
}

test("讀回失敗會回復原始資料且不更新記憶體", () => {
  const h = harness();
  const before = h.store.get("driverPayApp.v2");
  h.context.badRead = true;
  assert.equal(h.commit("monthlyGoal", 1000), false);
  assert.equal(h.store.get("driverPayApp.v2"), before);
  assert.equal(JSON.stringify(h.context.state), before);
});

test("讀取異常時設定不能覆蓋原始資料", () => {
  const h = harness();
  h.store.set("driverPayApp.v2", "damaged raw data");
  h.context.stateLoadError = new Error("read failed");
  assert.equal(h.commit("monthlyGoal", 2000), false);
  assert.equal(h.store.get("driverPayApp.v2"), "damaged raw data");
});

test("0% 比例正確保存與標準化，不再變成 100%", () => {
  const h = harness();
  assert.equal(h.commit("rates", { Uber: "0", Yoxi: "92.5" }), true);
  const reloaded = h.context.normalizeStatePayload(JSON.parse(h.store.get("driverPayApp.v2")));
  assert.equal(reloaded.settings.platformRates.Uber, 0);
  assert.equal(reloaded.settings.platformRates.Yoxi, 92.5);
  for (const invalid of [null, "", " ", false, "bad"]) {
    reloaded.settings.platformRates.Uber = invalid;
    assert.equal(h.context.normalizeSettings(reloaded.settings, reloaded.platforms).platformRates.Uber, 100);
  }
});

test("移除平台不刪除歷史收入或改變歷史實拿比例", () => {
  const h = harness();
  assert.equal(h.commit("removePlatform", "Uber"), true);
  assert.equal(h.context.state.settings.platformRates.Uber, 80);
  assert.equal(h.context.state.entries[0].incomes.Uber, 4000);
  assert.equal(h.context.state.platforms.includes("Uber"), false);
  assert.equal(h.context.state.settings.platformProfiles.some(item => item.id === "uber"), false);
});

test("無效比例／金額、重複名稱／快捷與最後一項移除安全拒絕", () => {
  const h = harness();
  for (const value of ["", "-1", "101", "Infinity", "abc"]) {
    assert.equal(h.commit("rates", { Uber: value, Yoxi: 100 }), false);
  }
  for (const value of [-1, Infinity, 1.5, 100000000]) assert.equal(h.commit("monthlyGoal", value), false);
  assert.equal(h.commit("addExpense", "油錢／電費"), false);
  assert.equal(h.commit("addExpense", "__proto__"), false);
  assert.equal(h.commit("addPlatform", { name: "Uber", id: "new" }), false);
  assert.equal(h.commit("shortcuts", ["洗車", "洗車", "停車費"]), false);
  assert.equal(h.commit("removePlatform", "Uber"), true);
  assert.equal(h.commit("removePlatform", "Yoxi"), false);
});

test("每日目標失敗保留輸入、重試成功，並拒絕讀取異常寫入", () => {
  const h = harness();
  const input = { value: "4500", dataset: { driverDraft: "true" } };
  h.context.fail = true;
  assert.equal(h.context.saveDriverDailyGoal(input), false);
  assert.equal(input.value, "4500");
  assert.equal(h.context.state.settings.dailyGoal, 3000);
  h.context.fail = false;
  assert.equal(h.context.saveDriverDailyGoal(input), true);
  assert.equal(h.context.state.settings.dailyGoal, 4500);
  assert.equal(input.dataset.driverDraft, undefined);
  h.context.stateLoadError = new Error("unreadable");
  input.value = "7000";
  assert.equal(h.context.saveDriverDailyGoal(input), false);
  assert.equal(h.context.state.settings.dailyGoal, 4500);
});

test("離線設定仍可保存且回饋明確", () => {
  const h = harness();
  h.context.navigator.onLine = false;
  assert.equal(h.commit("monthlyGoal", 5000), true);
  assert.equal(h.messages.at(-1)[2], "offline");
});

test("設定事件不再重繪 App 或清掉 Today 草稿，移除必須確認", () => {
  const handlers = html.slice(html.indexOf('document.getElementById("addPlatform").addEventListener'), html.indexOf("    applyAppearance(state.settings.appearance);\n    setupAppearance();"));
  assert.doesNotMatch(handlers, /renderAll\(\)|saveState\(\)|renderExpenseForm\(\)/);
  assert.match(handlers, /showRecordEditorConfirm\(/);
  assert.match(source("renderSettings"), /rateDrafts.has/);
  assert.match(source("renderSettings"), /monthlyGoalInput.hasAttribute\("data-driver-draft"\)/);
  assert.match(source("chip"), /aria-label=/);
});

test("快捷選單不重複斜線別名且保留既有選取值", () => {
  const h = harness();
  h.context.smartExpenseCategories = ["油錢／電費", "停車費", "洗車"];
  h.context.escapeAttr = value => value;
  h.context.escapeHtml = value => value;
  vm.runInContext(source("expenseShortcutOptionsMarkup"), h.context);
  const markup = h.context.expenseShortcutOptionsMarkup("油錢/電費");
  assert.equal((markup.match(/油錢/g) || []).length, 2);
  assert.match(markup, /value="油錢\/電費" selected/);
  assert.doesNotMatch(markup, /value="油錢／電費"/);
});
