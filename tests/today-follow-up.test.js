const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

function extractFunction(name) {
  const start = html.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `找不到 ${name}()`);
  const brace = html.indexOf(") {", start) + 2;
  let depth = 0;
  let quote = "";
  let escaped = false;
  for (let index = brace; index < html.length; index += 1) {
    const char = html[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (quote) {
      if (char === quote) quote = "";
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

test("工作工時與工作明細使用同一水平容器及完整按鈕語意", () => {
  const section = html.slice(html.indexOf('id="homeWorkCard"'), html.indexOf('id="sharedIncomePanelAnchor"'));
  assert.match(section, /class="work-time-overview"/);
  assert.match(section, /id="workPrimaryTime"/);
  assert.match(section, /id="workDetailsToggle"[^>]*aria-expanded="false"[^>]*aria-controls="workMetrics"/);
  assert.match(section, /aria-label="工作明細，已收合"/);
  assert.match(html, /\.work-details-toggle\s*\{[\s\S]*?min-height:\s*44px/);
});

test("工作明細控制同步 expanded、可讀標籤與加減號", () => {
  const source = extractFunction("setWorkDetailsExpanded");
  assert.match(source, /aria-expanded/);
  assert.match(source, /工作明細，\$\{isExpanded \? "已展開" : "已收合"\}/);
  assert.match(source, /isExpanded \? "－" : "＋"/);
  assert.doesNotMatch(source, /workMinutes|durationMs|saveState|persistStatePayload/);
});

test("修改工作時間在展開後才定位且不自動聚焦", () => {
  const source = extractFunction("setManualEntryExpanded");
  assert.match(source, /els\.workTimeSection\.open = true/);
  assert.match(source, /requestAnimationFrame/);
  assert.match(source, /getBoundingClientRect/);
  assert.match(source, /fullyVisible/);
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(source, /behavior: reduceMotion \? "auto" : "smooth"/);
  assert.doesNotMatch(source, /\.focus\(/);
});

test("有收入無工時只在主動儲存時顯示友善提醒", () => {
  const source = extractFunction("saveTodayDetailRecord");
  assert.match(source, /entryTotal\(draft\) <= 0/);
  assert.match(source, /quality\.status === "missing-work-time"/);
  assert.match(source, /showMissingWorkTimePrompt/);
  assert.match(source, /allowMissingWorkTime/);
  assert.match(html, /要不要順便記一下工時？/);
  assert.match(html, /id="missingWorkAdd"[^>]*>補上工時</);
  assert.match(html, /id="missingWorkLater"[^>]*>稍後再補</);
  assert.doesNotMatch(source, /alert\(|confirm\(/);
});

test("補上工時保留表單並定位，稍後再補只提交一次", () => {
  const listeners = html.slice(html.indexOf('els.missingWorkTimeDialog.addEventListener'), html.indexOf('els.toggleOverview.addEventListener'));
  assert.match(listeners, /setManualEntryExpanded\(true, \{ revealWorkTime: true \}\)/);
  assert.match(listeners, /saveTodayDetailRecord\(\{ allowMissingWorkTime: true \}\)/);
  assert.match(listeners, /pendingTodayRecordSave = null/);
  assert.doesNotMatch(listeners, /resetForm\(\)/);
});

test("每日紀錄第一層保留收入與工時，選填資料集中於預設收合的其他資料", () => {
  const detail = html.slice(html.indexOf('id="sharedDetailPanel"'), html.indexOf('id="recentIncomePanel"'));
  assert.match(detail, /id="workTimeSection"/);
  assert.match(detail, /id="otherDataSection"/);
  assert.match(detail, /id="otherDataToggle"[^>]*aria-expanded="false"/);
  const other = detail.slice(detail.indexOf('id="otherDataSection"'));
  for (const id of ["expenseInputs", "tips", "shift", "orders", "km", "weather", "note"]) {
    assert.match(other, new RegExp(`id="${id}"`));
  }
});

test("Open-Meteo 天氣代碼集中映射到有限分類", () => {
  const context = vm.createContext({ Number });
  vm.runInContext(`${extractFunction("mapWeatherCode")}\nglobalThis.mapWeatherCode = mapWeatherCode;`, context);
  assert.equal(context.mapWeatherCode(0), "晴天");
  assert.equal(context.mapWeatherCode(2), "多雲");
  assert.equal(context.mapWeatherCode(3), "陰天");
  assert.equal(context.mapWeatherCode(61), "雨天");
  assert.equal(context.mapWeatherCode(65), "大雨");
  assert.equal(context.mapWeatherCode(95), "雷雨");
  assert.equal(context.mapWeatherCode(999), "其他");
});

test("定位只在同意後一次性取得且不保存精確座標或 API key", () => {
  assert.match(html, /const WEATHER_SERVICE_URL = "https:\/\/api\.open-meteo\.com\/v1\/forecast"/);
  assert.match(extractFunction("requestCurrentPositionOnce"), /navigator\.geolocation\.getCurrentPosition/);
  const allowListener = html.slice(html.indexOf('els.weatherPermissionAllow.addEventListener'), html.indexOf('els.detectWeather.addEventListener'));
  assert.match(allowListener, /saveWeatherAutoConsent\("granted"\)/);
  assert.match(allowListener, /detectCurrentWeather\(\{ manual: true \}\)/);
  const formDataSource = extractFunction("formData");
  const blankEntrySource = extractFunction("blankEntry");
  assert.doesNotMatch(formDataSource, /latitude|longitude|coords/);
  assert.doesNotMatch(blankEntrySource, /latitude|longitude|coords/);
  assert.doesNotMatch(html, /(?:api[_-]?key|appid)=/i);
});

test("天氣拒絕、離線、歷史日期與手動覆蓋都保留核心紀錄流程", () => {
  const detection = extractFunction("detectCurrentWeather");
  assert.match(detection, /date !== todayString\(\)/);
  assert.match(detection, /目前離線/);
  assert.match(detection, /weatherDetectionPromise/);
  assert.match(detection, /weatherDetectionAttemptedDates/);
  assert.match(detection, /weatherManualOverride/);
  assert.match(extractFunction("updateCurrentWeather"), /source === "manual"/);
  assert.match(html, /無法取得定位，可手動選擇天氣/);
  assert.match(html, /歷史紀錄不會套用目前天氣/);
});
