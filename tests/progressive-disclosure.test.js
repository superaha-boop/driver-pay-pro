const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const html = fs.readFileSync(new URL("../index.html", `file://${__filename}`), "utf8");
const designSystem = fs.readFileSync(new URL("../styles/design-system.css", `file://${__filename}`), "utf8");

const between = (start, end) => html.slice(html.indexOf(start), html.indexOf(end, html.indexOf(start)));
const ai = between('<section id="view-ai"', '<section id="view-settings"');
const driver = between('<section id="view-settings"', '</main>');

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

contract(1, "今日收入 Header 整排可點擊", () => {
  assert.match(functionSource("renderStats"), /<button class="today-income-toggle" id="todayIncomeToggle"/);
  assert.match(html, /\.today-income-toggle\s*\{[\s\S]*?width: 100%/);
});
contract(2, "收合時收入與金額仍在 disclosure 外", () => {
  const source = functionSource("renderStats");
  assert.match(source, /<strong class="today-income">\$\{money\(todaySummary\.total\)\}<\/strong>/);
  assert.ok(source.indexOf('class="today-income"') < source.indexOf('id="todayGoalDetails"'));
});
contract(3, "收合時工時與動態時薪仍在 disclosure 外", () => {
  const source = functionSource("renderStats");
  assert.ok(source.indexOf('class="today-secondary"') < source.indexOf('id="todayGoalDetails"'));
  assert.match(source, /今日工時/);
  assert.match(source, /todayHourlyLabel/);
  assert.match(source, /目前時薪[\s\S]*?平均時薪/);
});
contract(4, "只隱藏今日目標進度內容", () => {
  assert.match(functionSource("renderStats"), /id="todayGoalDetails"\$\{todayGoalExpanded \? "" : " hidden"\}/);
  assert.match(functionSource("renderStats"), /id="dailyGoalCard"/);
});
contract(5, "目標百分比、尚差與進度條共用同一收合區", () => {
  const goal = functionSource("updateDailyGoal");
  assert.match(goal, /達成/);
  assert.match(goal, /尚差/);
  assert.match(goal, /today-goal-track/);
});
contract(6, "展開只切換目標進度 state", () => {
  assert.match(html, /todayGoalExpanded = !todayGoalExpanded;\s*renderStats\(\)/);
});
contract(7, "Today Chevron 跟隨目標進度展開狀態", () => {
  assert.match(functionSource("renderStats"), /app-chevron app-chevron--disclosure/);
  assert.match(html, /\[aria-expanded="true"\][\s\S]*?rotate\(180deg\)/);
});
contract(8, "Today aria-expanded 正確輸出", () => {
  assert.match(functionSource("renderStats"), /aria-expanded="\$\{String\(todayGoalExpanded\)\}"/);
  assert.match(functionSource("renderStats"), /aria-controls="todayGoalDetails"/);
  assert.match(functionSource("renderStats"), /aria-label="今日目標進度/);
});
contract(9, "Today 展開不修改收入資料", () => {
  const listener = between('els.summaryStats.addEventListener("click"', 'els.manualEntryToggle.addEventListener');
  assert.doesNotMatch(listener, /saveState|persistStatePayload|incomes|entries/);
});
contract(10, "Today 展開不清除表單草稿", () => {
  const listener = between('els.summaryStats.addEventListener("click"', 'els.manualEntryToggle.addEventListener');
  assert.doesNotMatch(listener, /resetForm|form\.reset|value\s*=/);
});
contract(11, "Today 跨日後預設收合", () => {
  assert.match(functionSource("renderStats"), /todayGoalDisclosureDate !== currentToday[\s\S]*?todayGoalExpanded = false/);
});
contract(12, "Today 內部區域不誤觸收合", () => {
  assert.match(html, /if \(!event\.target\.closest\("#todayIncomeToggle"\)\) return/);
});

contract(13, "AI 預設只完整顯示本週重點", () => {
  assert.match(ai, /<h3 id="aiTodayTitle">本週重點<\/h3>/);
  assert.equal((ai.match(/class="ai-insight-card primary"/g) || []).length, 1);
});
contract(14, "本月洞察預設收合", () => {
  assert.match(ai, /id="aiMonthDisclosureToggle"[\s\S]*?aria-expanded="false"[\s\S]*?id="aiMonthDisclosureContent" hidden/);
});
contract(15, "收入變化來源預設收合", () => {
  assert.match(ai, /id="aiSourcesDisclosureToggle"[\s\S]*?aria-expanded="false"[\s\S]*?id="aiSourcesDisclosureContent" hidden/);
});
contract(16, "資料與分析依據預設收合", () => {
  assert.match(ai, /id="aiMetadataDisclosureToggle"[\s\S]*?aria-expanded="false"[\s\S]*?id="aiMetadataDisclosureContent" hidden/);
});
contract(17, "AI 資料不足時只顯示單一主要說明", () => {
  const source = functionSource("renderAiPrimaryInsight");
  assert.match(source, /目前還不能形成可靠分析/);
  assert.equal((source.match(/class="ai-primary-summary/g) || []).length, 1);
  assert.doesNotMatch(source, /monthlyInsights|smartReminders/);
});
contract(18, "AI 詳細內容保留原始分析資料", () => {
  const source = functionSource("renderAiAnalysis");
  for (const id of ["aiMonthInsights", "aiAlerts", "aiAnalysisMetadata"]) assert.match(source, new RegExp(id));
});
contract(19, "AI 維持唯讀", () => {
  const source = `${functionSource("renderAiAnalysis")}\n${functionSource("renderAiPrimaryInsight")}`;
  assert.doesNotMatch(source, /saveState|persistStatePayload|localStorage\.setItem|entries\.(?:push|splice)/);
});
contract(20, "AI 展開只修改 session disclosure state", () => {
  const listener = between('document.getElementById("view-ai").addEventListener', 'els.entryForm.addEventListener');
  assert.match(listener, /aiDisclosureState\[key\] = !aiDisclosureState\[key\]/);
  assert.doesNotMatch(listener, /saveState|persistStatePayload/);
});

contract(21, "Driver 顯示四個主要分類", () => {
  assert.deepEqual([...driver.matchAll(/data-disclosure-scope="driver"\s+data-disclosure-key="([^"]+)"/g)].map(match => match[1]), ["common", "work", "data", "app"]);
});
contract(22, "常用設定預設展開", () => {
  assert.match(driver, /id="driverCommonToggle"[\s\S]*?aria-expanded="true"[\s\S]*?id="driverCommonContent">/);
});
contract(23, "Driver 其他三類預設收合", () => {
  for (const key of ["Work", "Data", "SystemStatus"]) assert.match(driver, new RegExp(`id="driver${key}Toggle"[\\s\\S]*?aria-expanded="false"`));
});
contract(24, "Driver 移除獨立 About 入口", () => {
  assert.doesNotMatch(html, /id="openAbout"|id="view-about"/);
});
contract(25, "Driver 移除獨立系統狀態卡", () => {
  assert.doesNotMatch(driver, /driver-overview-card driver-system-status/);
});
contract(26, "Version 顯示於 App 與系統內容", () => {
  const app = between('id="driverSystemStatusContent"', '</section>\n        </div>');
  assert.match(app, /id="aboutAppVersion"/);
});
contract(27, "系統狀態顯示於 App 與系統內容", () => {
  assert.match(driver, /id="driverSystemStatusContent"[\s\S]*?id="driverSystemStatusDetails"/);
});
contract(28, "正常狀態不使用警示色", () => {
  assert.match(html, /\.driver-system-status-badge\s*\{[\s\S]*?color: var\(--color-success\)[\s\S]*?background: var\(--color-success-soft\)/);
  assert.match(html, /driver-system-status-badge\[data-status="warning"\]/);
});
contract(29, "異常狀態顯示需要注意", () => {
  assert.match(functionSource("renderDriverStatus"), /needsAttention \? "需要注意" : "正常"/);
});
contract(30, "Driver 每個分類整排可點", () => {
  assert.equal((driver.match(/class="app-disclosure__trigger"/g) || []).length, 4);
  assert.match(html, /\.app-disclosure__trigger\s*\{[\s\S]*?width: 100%/);
});
contract(31, "Driver 內部按鈕不誤觸分類收合", () => {
  assert.match(html, /event\.target\.closest\('\[data-disclosure-scope="driver"\]'\)/);
  assert.match(driver, /<button class="button secondary" id="exportCsv" type="button">匯出 CSV<\/button>/);
  assert.doesNotMatch(driver, /<button class="app-disclosure__trigger"[^>]*id="exportCsv"/);
});
contract(32, "Driver 分類 aria-expanded 完整", () => {
  assert.equal((driver.match(/data-disclosure-scope="driver"[\s\S]*?aria-expanded="(?:true|false)"/g) || []).length, 4);
});

contract(33, "顯示大小只有標準舒適大字", () => {
  assert.deepEqual([...driver.matchAll(/name="displaySize" value="([^"]+)"/g)].map(match => match[1]), ["standard", "comfort", "large"]);
});
contract(34, "Standard data token 為 24px", () => assert.match(designSystem, /--font-data: 24px/));
contract(35, "Comfort data token 為 27px", () => assert.match(designSystem, /data-display-size="comfort"[\s\S]*?--font-data: 27px/));
contract(36, "Large data token 為 30px", () => assert.match(designSystem, /data-display-size="large"[\s\S]*?--font-data: 30px/));
contract(37, "Comfort structural title 維持 18px", () => assert.match(designSystem, /data-display-size="comfort"[\s\S]*?--font-section-title: 18px/));
contract(38, "Large navigation 維持 14px", () => assert.match(designSystem, /data-display-size="large"[\s\S]*?--font-navigation: 14px/));
contract(39, "主要數據的模式級差大於結構文字", () => {
  const [standardData, comfortData, largeData] = [24, 27, 30];
  const [standardTitle, comfortTitle, largeTitle] = [18, 18, 19];
  assert.ok(comfortData > standardData && largeData > comfortData);
  assert.equal(comfortTitle, standardTitle);
  assert.ok(largeTitle - standardTitle < largeData - standardData);
});
contract(40, "五個主要頁面共用 root 顯示模式", () => {
  assert.match(functionSource("applyDisplaySize"), /document\.documentElement\.dataset\.displaySize = normalized/);
  for (const view of ["today", "calendar", "reports", "ai", "settings"]) assert.match(html, new RegExp(`id="view-${view}"`));
});
contract(41, "顯示設定重新載入後保留", () => {
  assert.match(html, /localStorage\.getItem\("driverPayApp\.v2"\)/);
  assert.match(functionSource("saveDisplaySize"), /persistStatePayload\(nextState, \{ updateMemory: true \}\)/);
});
contract(42, "相容舊 aiReportsReadingSize", () => {
  assert.match(html, /const \{ aiReportsReadingSize: legacyReadingSize, \.\.\.retainedSettings \} = settings/);
  assert.match(html, /\? settings\.displaySize\s*:\s*legacyReadingSize/);
});
contract(43, "新保存只寫入 displaySize", () => {
  const source = functionSource("saveDisplaySize");
  assert.match(source, /settings\.displaySize = next/);
  assert.match(source, /delete nextState\.settings\.aiReportsReadingSize/);
});
contract(44, "顯示大小不影響計算", () => {
  for (const name of ["aggregateReport", "workMetrics", "entryNet"]) assert.doesNotMatch(functionSource(name), /displaySize|readingSize/);
});

contract(45, "Calendar Standard 日期為 14px", () => assert.match(designSystem, /--display-calendar-date-size: 14px/));
contract(46, "Calendar Comfort 日期為 16px", () => assert.match(designSystem, /data-display-size="comfort"[\s\S]*?--display-calendar-date-size: 16px/));
contract(47, "Calendar Large 日期為 20px", () => assert.match(designSystem, /data-display-size="large"[\s\S]*?--display-calendar-date-size: 20px/));
contract(48, "Calendar 日期字級單調遞增", () => {
  const sizes = [14, 16, 20];
  assert.ok(sizes[0] < sizes[1]);
  assert.ok(sizes[1] < sizes[2]);
});
contract(49, "Mobile media query 不縮小 Large 日期", () => {
  const mobile = html.match(/@media \(max-width: 350px\)\s*\{[\s\S]*?\n    \}/g)?.join("\n") || "";
  assert.doesNotMatch(mobile, /--display-calendar-date-size\s*:/);
});
contract(50, "今天圓圈尺寸跟隨模式", () => {
  for (const size of ["34px", "36px", "40px"]) assert.match(designSystem, new RegExp(`--display-calendar-today-circle-size: ${size}`));
});
contract(51, "圓圈尺寸安全擴充而不裁切日期列", () => {
  assert.match(html, /min-height: var\(--display-calendar-row-height\)/);
  for (const height of ["70px", "76px", "84px"]) {
    assert.match(designSystem, new RegExp(`--display-calendar-row-height: ${height}`));
  }
});
contract(52, "所有日期共用相同中心槽位", () => {
  assert.match(html, /grid-template-rows: var\(--calendar-day-marker-size\) auto 1fr/);
  assert.match(html, /\.calendar-date__day\s*\{[\s\S]*?place-items: center/);
});
contract(53, "320px 不建立另一套日期尺寸", () => {
  assert.doesNotMatch(html, /@media \(max-width: 350px\)[\s\S]*?--calendar-day-marker-size:\s*\d/);
});
contract(54, "今天標記與 Calendar 既有功能保留", () => {
  assert.match(functionSource("renderCalendarGrid"), /aria-current="date"/);
  assert.match(html, /id="calendarTodayButton"/);
});

contract(55, "Disclosure 收合使用向下 Chevron", () => {
  assert.match(html, /app-chevron--disclosure[\s\S]*?<path d="m6 9 6 6 6-6"/);
});
contract(56, "Disclosure 展開旋轉為向上 Chevron", () => {
  assert.match(html, /\[aria-expanded="true"\][\s\S]*?app-chevron--disclosure[\s\S]*?rotate\(180deg\)/);
});
contract(57, "Navigation 使用左右 Chevron", () => {
  assert.match(html, /app-chevron--left/);
  assert.match(html, /app-chevron--right/);
});
contract(58, "一般動作按鈕不強制顯示 Chevron", () => {
  const exportButton = driver.match(/<button[^>]*id="exportCsv"[^>]*>[\s\S]*?<\/button>/)?.[0] || "";
  assert.doesNotMatch(exportButton, /app-chevron|<svg/);
});
contract(59, "SVG Chevron 重用 app-chevron 共用元件", () => {
  for (const match of html.matchAll(/<svg([^>]*)>\s*<path d="m(?:6 9|15 18|9 18)[^"]*"/g)) assert.match(match[1], /class="[^"]*app-chevron/);
});
contract(60, "Chevron 尺寸與線條粗細一致", () => {
  assert.match(html, /\.app-chevron,[\s\S]*?width: 20px[\s\S]*?height: 20px[\s\S]*?stroke-width: 2/);
});
