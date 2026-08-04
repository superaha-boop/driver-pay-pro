const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const html = fs.readFileSync(new URL("../index.html", `file://${__filename}`), "utf8");
const driverSection = html.match(
  /<section id="view-settings"[\s\S]*?<\/section>\s*<\/main>/
)?.[0] || "";

test("Driver 提供收入目標、顯示設定與單一系統狀態", () => {
  assert.match(driverSection, />每日收入目標</);
  assert.match(driverSection, /<legend>顯示大小<\/legend>/);
  assert.match(driverSection, /id="driverSystemStatusDetails"/);
  assert.doesNotMatch(driverSection, /id="driverDataStatus"|id="driverAppStatus"/);
  assert.match(driverSection, />資料保存在這台裝置</);
  assert.match(driverSection, /目前沒有跨裝置同步或雲端備份/);
  assert.match(driverSection, /清除 Safari 網站資料可能會刪除工作紀錄/);
});

test("每日目標只有一個直接編輯欄位並沿用既有設定來源", () => {
  assert.equal((html.match(/id="dailyGoal"/g) || []).length, 1);
  assert.match(html, /function saveDriverDailyGoal\(input\)/);
  assert.match(html, /state\.settings\.dailyGoal = next/);
  assert.match(html, /if \(!saveState\(\)\) \{\s*state\.settings\.dailyGoal = previous/);
  assert.match(html, /updateDailyGoal\(\);\s*renderStats\(\)/);
  assert.match(html, /scheduleDriverDailyGoalSave\(event\.currentTarget\)/);
  assert.match(driverSection, /輸入後自動儲存/);
});

test("Driver 狀態只顯示衍生資訊，不建立第二個 durable store", () => {
  assert.match(html, /本機紀錄總數/);
  assert.match(html, /最早紀錄/);
  assert.match(html, /最新紀錄/);
  assert.match(html, /未提供可靠時間/);
  assert.match(html, /Local-first V1/);
  assert.match(html, /appShellCacheName/);
  assert.match(html, /display-mode: standalone/);
  const storageKeys = [...html.matchAll(/driverPayApp\.v\d+/g)].map(match => match[0]);
  assert.equal(storageKeys.length > 0, true);
  assert.equal(storageKeys.every(key => key === "driverPayApp.v2"), true);
});

test("App 與系統位於 Driver 最後且正常時預設收合", () => {
  const dataIndex = driverSection.indexOf('id="driverDataToggle"');
  const systemIndex = driverSection.indexOf('id="driverSystemStatusToggle"');
  assert.ok(systemIndex > dataIndex);
  assert.match(driverSection, /id="driverSystemStatusToggle"[\s\S]*?aria-expanded="false"[\s\S]*?aria-controls="driverSystemStatusContent"/);
  assert.match(driverSection, /id="driverSystemStatusContent" hidden/);
  assert.match(driverSection, /id="aboutAppVersion"/);
  assert.match(driverSection, /id="driverSystemStatusDetails"/);
});

test("整條系統狀態標題可操作並具備狀態徽章與鍵盤語意", () => {
  assert.match(driverSection, /<button class="app-disclosure__trigger" id="driverSystemStatusToggle"/);
  assert.match(driverSection, /id="driverSystemStatusBadge">正常<\/span>/);
  assert.match(html, /\.app-disclosure__trigger\s*\{[\s\S]*?min-height: 52px/);
  assert.match(html, /\.app-disclosure__trigger:focus-visible/);
  assert.match(html, /function toggleDriverSystemStatus\(\)[\s\S]*?systemStatusExpanded = !systemStatusExpanded/);
});

test("讀取異常顯示需要注意並只自動展開一次", () => {
  assert.match(html, /const needsAttention = Boolean\(stateLoadError \|\| lastPersistenceError \|\| pwaSetupError\)/);
  assert.match(html, /needsAttention \? "需要注意" : "正常"/);
  assert.match(html, /needsAttention && !systemStatusAutoOpened/);
  assert.match(html, /systemStatusAutoOpened = true/);
});

test("Driver 不新增全域刪除、重設、同步或登入操作", () => {
  assert.doesNotMatch(driverSection, /刪除全部資料|清除所有資料|一鍵重設|雲端同步|登入 Supabase|啟用備份/);
  assert.match(driverSection, /id="exportCsv"/);
  assert.doesNotMatch(driverSection, /id="openAbout"|id="view-about"/);
  assert.match(driverSection, /id="aboutProductName"/);
});

test("Driver 目標與狀態元件符合手機觸控及窄寬度契約", () => {
  assert.match(html, /\.driver-goal-control\s*\{[\s\S]*?height: 50px/);
  assert.match(html, /\.driver-status-list > div\s*\{[\s\S]*?min-height: 44px/);
  assert.match(html, /\.driver-goal-control input\s*\{[\s\S]*?min-width: 0/);
  assert.match(driverSection, /inputmode="numeric"/);
  assert.match(driverSection, /aria-live="polite"/);
});
