const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const html = fs.readFileSync(new URL("../index.html", `file://${__filename}`), "utf8");
const serviceWorker = fs.readFileSync(new URL("../sw.js", `file://${__filename}`), "utf8");
const designSystem = fs.readFileSync(new URL("../styles/design-system.css", `file://${__filename}`), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", `file://${__filename}`), "utf8"));
const driver = html.match(/<section id="view-settings"[\s\S]*?<\/section>\s*<\/main>/)?.[0] || "";

function functionSource(name) {
  const start = html.indexOf(`function ${name}(`);
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

const contract = (number, name, assertion) => test(`${number}. ${name}`, assertion);
const renderStats = () => functionSource("renderStats");

contract(1, "今日收入 Header 整排可點", () => {
  assert.match(renderStats(), /<button class="today-income-toggle" id="todayIncomeToggle"/);
  assert.match(html, /\.today-income-toggle\s*\{[\s\S]*?width: 100%[\s\S]*?min-height: 112px/);
});
contract(2, "收合時今日收入標題仍顯示", () => assert.match(renderStats(), /today-summary-label">今日收入/));
contract(3, "收合時今日收入金額仍顯示", () => assert.match(renderStats(), /today-income">\$\{money\(todaySummary\.total\)\}/));
contract(4, "收合時今日工時仍顯示", () => assert.match(renderStats(), /today-secondary[\s\S]*?今日工時/));
contract(5, "收合時目前或平均時薪仍顯示", () => {
  assert.match(renderStats(), /todayHourlyLabel/);
  assert.match(renderStats(), /目前時薪/);
  assert.match(renderStats(), /平均時薪/);
});
contract(6, "收合時未設定目標文字位於隱藏目標區", () => {
  assert.match(renderStats(), /id="todayGoalDetails"[\s\S]*?id="dailyGoalCard"/);
  assert.match(functionSource("updateDailyGoal"), /尚未設定今日目標/);
});
contract(7, "達成百分比位於單一目標進度 renderer", () => assert.match(functionSource("updateDailyGoal"), /達成/));
contract(8, "尚差金額位於單一目標進度 renderer", () => assert.match(functionSource("updateDailyGoal"), /尚差/));
contract(9, "進度條位於單一目標進度 renderer", () => assert.match(functionSource("updateDailyGoal"), /today-goal-track/));
contract(10, "展開時完整目標進度恢復", () => {
  assert.match(renderStats(), /id="todayGoalDetails"\$\{todayGoalExpanded \? "" : " hidden"\}/);
  assert.match(html, /todayGoalExpanded = !todayGoalExpanded;\s*renderStats\(\)/);
});
contract(11, "收合後不保留目標區高度", () => {
  assert.match(html, /\.today-goal-details\[hidden\]\s*\{\s*display: none/);
  assert.doesNotMatch(html, /\.today-goal-details\s*\{[^}]*?(?:min-height|height):/s);
});
contract(12, "Chevron 方向由 aria-expanded 控制", () => {
  assert.match(renderStats(), /app-chevron app-chevron--disclosure/);
  assert.match(html, /\[aria-expanded="true"\][\s\S]*?rotate\(180deg\)/);
});
contract(13, "Today 目標控制具備完整 ARIA", () => {
  assert.match(renderStats(), /aria-expanded="\$\{String\(todayGoalExpanded\)\}"/);
  assert.match(renderStats(), /aria-controls="todayGoalDetails"/);
  assert.match(renderStats(), /aria-label="今日目標進度/);
});
contract(14, "展開收合不修改資料", () => {
  const listener = html.match(/els\.summaryStats\.addEventListener\("click"[\s\S]*?\n    \}\);/)?.[0] || "";
  assert.doesNotMatch(listener, /saveState|persistStatePayload|localStorage|entries/);
});
contract(15, "展開收合不清除表單草稿", () => {
  const listener = html.match(/els\.summaryStats\.addEventListener\("click"[\s\S]*?\n    \}\);/)?.[0] || "";
  assert.doesNotMatch(listener, /reset|\.value\s*=|formData/);
});
contract(16, "跨日後目標進度預設收合", () => assert.match(renderStats(), /todayGoalDisclosureDate !== currentToday[\s\S]*?todayGoalExpanded = false/));
contract(17, "收入工時時薪計算不依賴 disclosure state", () => {
  for (const name of ["summarize", "workMetrics", "hourlyRate"]) assert.doesNotMatch(functionSource(name), /todayGoalExpanded|todayGoalDisclosureDate/);
});

contract(18, "常用只有一個可見每日目標標題", () => assert.equal((driver.match(/>每日目標<\/h3>/g) || []).length, 1));
contract(19, "不再顯示收入目標", () => assert.doesNotMatch(driver, />收入目標</));
contract(20, "不再顯示每日收入目標", () => assert.doesNotMatch(driver, />每日收入目標</));
contract(21, "不再顯示重複自動儲存說明", () => assert.doesNotMatch(driver, /與「今天」使用相同設定|輸入後自動儲存/));
contract(22, "字體區只使用字體大小設定標題", () => assert.equal((driver.match(/>字體大小設定<\/legend>/g) || []).length, 1));
contract(23, "不再顯示顯示設定標題", () => assert.doesNotMatch(driver, /<h3>顯示設定<\/h3>/));
contract(24, "不再顯示顯示大小第二標題", () => assert.doesNotMatch(driver, /<legend>顯示大小<\/legend>/));
contract(25, "不再顯示已套用模式文字", () => {
  assert.doesNotMatch(driver, /已套用「?(?:標準|舒適|大字)/);
  assert.doesNotMatch(functionSource("saveDisplaySize"), /已套用/);
});
contract(26, "標準舒適大字仍可選擇", () => {
  assert.deepEqual([...driver.matchAll(/name="displaySize" value="([^"]+)"/g)].map(match => match[1]), ["standard", "comfort", "large"]);
});
contract(27, "displaySize 仍使用既有交易式儲存", () => assert.match(functionSource("saveDisplaySize"), /nextState\.settings\.displaySize = next[\s\S]*?persistStatePayload/));
contract(28, "每日目標仍自動儲存", () => {
  assert.match(functionSource("scheduleDriverDailyGoalSave"), /setTimeout\(\(\) => saveDriverDailyGoal\(input\), 450\)/);
  assert.match(functionSource("saveDriverDailyGoal"), /saveState\(\)/);
});
contract(29, "每日目標資料結構保持不變", () => {
  assert.match(functionSource("saveDriverDailyGoal"), /state\.settings\.dailyGoal = next/);
  assert.doesNotMatch(functionSource("saveDriverDailyGoal"), /WorkRecord|migration|newStateField/);
});
contract(30, "Driver 四個主要分類仍存在", () => {
  assert.deepEqual([...driver.matchAll(/data-disclosure-scope="driver"\s+data-disclosure-key="([^"]+)"/g)].map(match => match[1]), ["common", "work", "data", "app"]);
});
contract(31, "常用 Header 沒有重複摘要", () => {
  const header = driver.match(/id="driverCommonToggle"[\s\S]*?<\/button>/)?.[0] || "";
  assert.doesNotMatch(header, /app-disclosure__summary|顯示與每日目標/);
});
contract(32, "收支摘要已精簡", () => assert.match(driver, /id="driverWorkTitle">收支<\/span><span class="app-disclosure__summary">平台、支出<\/span>/));
contract(33, "資料摘要已精簡", () => assert.match(driver, /id="driverDataTitle">資料<\/span><span class="app-disclosure__summary">備份、匯出<\/span>/));
contract(34, "系統正常狀態仍存在", () => {
  assert.match(driver, /id="driverSystemStatusBadge">正常<\/span>/);
  assert.match(functionSource("renderDriverStatus"), /needsAttention \? "需要注意" : "正常"/);
});
contract(35, "必要 Accessibility label 仍存在", () => {
  assert.match(driver, /aria-label="每日目標金額"/);
  assert.match(driver, /role="status" aria-live="polite"/);
  assert.equal((driver.match(/aria-controls="driver/g) || []).length, 4);
});

contract(36, "每日目標與字體設定使用緊湊 token 級間距", () => {
  assert.match(html, /\.driver-settings-group \.driver-goal-card\s*\{[\s\S]*?padding: 12px 0 16px/);
  assert.match(html, /\.driver-display-section\s*\{[\s\S]*?padding: 16px 0 2px/);
});
contract(37, "刪除文字後不保留隱藏狀態高度", () => {
  assert.match(html, /\.driver-goal-card \.ds-save-status:empty\s*\{\s*display: none/);
  assert.match(html, /\.reading-size-status\[hidden\]\s*\{\s*display: none/);
});
contract(38, "窄畫面維持無橫向捲動基礎", () => assert.match(html, /body\s*\{[^}]*overflow-x:\s*hidden/));
contract(39, "大字模式三個選項保持單列且不裁字", () => {
  assert.match(html, /\.reading-size-options\s*\{[\s\S]*?grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(html, /\.reading-size-choice span\s*\{[\s\S]*?white-space: nowrap/);
  assert.match(html, /@media \(max-width: 350px\)[\s\S]*?#driverWorkToggle[\s\S]*?#driverDataToggle[\s\S]*?\.app-disclosure__summary\s*\{\s*display: none/);
});
contract(40, "Bottom Navigation 保留 safe-area 與內容空間", () => {
  assert.match(html, /safe-area-inset-bottom/);
  assert.match(designSystem, /--bottom-navigation-space:/);
});

contract(41, "Today targeted tests 保留於 release gate", () => assert.match(packageJson.scripts["test:today"], /today-follow-up\.test\.js/));
contract(42, "Driver targeted tests 保留於 release gate", () => assert.match(packageJson.scripts["test:driver"], /driver\.test\.js/));
contract(43, "Calendar targeted tests 保留於 release gate", () => assert.match(packageJson.scripts["test:calendar"], /calendar/));
contract(44, "Reports targeted tests 保留於 release gate", () => assert.match(packageJson.scripts["test:reports"], /reports/));
contract(45, "AI targeted tests 保留於 release gate", () => assert.match(packageJson.scripts["test:ai"], /ai\.test\.js/));
contract(46, "Integration targeted tests 保留於 release gate", () => assert.match(packageJson.scripts["test:integration"], /integration\.test\.js/));
contract(47, "PWA App Shell 遞增至 v40 且 storage key 不變", () => {
  assert.match(serviceWorker, /const CACHE_NAME = "driver-pay-pro-v41"/);
  assert.match(html, /const storageKey = "driverPayApp\.v2"/);
});
