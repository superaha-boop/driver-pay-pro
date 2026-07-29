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

test("每日紀錄保留工時、支出與其他資料三個獨立收合區塊", () => {
  const detail = html.slice(html.indexOf('id="sharedDetailPanel"'), html.indexOf('id="recentIncomePanel"'));
  assert.match(detail, /id="workTimeSection"/);
  assert.match(detail, /id="expenseSection"/);
  assert.match(detail, /id="otherDataSection"/);
  assert.ok(detail.indexOf('id="workTimeSection"') < detail.indexOf('id="expenseSection"'));
  assert.ok(detail.indexOf('id="expenseSection"') < detail.indexOf('id="otherDataSection"'));
  assert.match(detail, /id="workTimeToggle"[^>]*aria-expanded="false"[^>]*aria-controls="workTimeContent"/);
  assert.match(detail, /id="expenseSectionToggle"[^>]*aria-expanded="false"[^>]*aria-controls="expenseInputs"/);
  assert.match(detail, /id="otherDataToggle"[^>]*aria-expanded="false"/);
  const expense = detail.slice(detail.indexOf('id="expenseSection"'), detail.indexOf('id="otherDataSection"'));
  assert.match(expense, /id="expenseInputs"/);
  const other = detail.slice(detail.indexOf('id="otherDataSection"'));
  assert.doesNotMatch(other, /id="expenseInputs"/);
  for (const id of ["tips", "shift", "orders", "km", "weather", "note"]) {
    assert.match(other, new RegExp(`id="${id}"`));
  }
});

test("工時只顯示一種輸入方式且切換前需要確認", () => {
  const detail = html.slice(html.indexOf('id="workTimeSection"'), html.indexOf('id="expenseSection"'));
  assert.match(detail, /id="clockWorkFields"/);
  assert.match(detail, /class="work-mode-fields hidden" id="manualWorkFields"/);
  assert.match(detail, /id="workModeToggle"/);
  assert.match(html, /id="workModeDialog"/);
  const request = extractFunction("requestWorkTimeModeSwitch");
  const apply = extractFunction("applyWorkTimeModeSwitch");
  assert.match(request, /切換後會清除開始時間、結束時間與休息時間/);
  assert.match(request, /切換後會清除手動工時/);
  assert.match(apply, /saveTodayWorkTimeFromForm\(\)/);
  assert.match(apply, /previousValues/);
  assert.doesNotMatch(apply, /saveState\(\)/);
});

test("新增支出使用獨立交易儲存且防止重複提交", () => {
  const source = extractFunction("saveSmartExpense");
  assert.match(source, /expenseSaveInProgress/);
  assert.match(source, /persistStatePayload\(nextState, \{ updateMemory: true \}\)/);
  assert.match(source, /notifyRecordChanged\(paymentDate, "expense"\)/);
  assert.match(source, /原有支出未變更/);
  assert.doesNotMatch(source, /ensureEntryForDate\(paymentDate\)/);
});

test("已收工提供同排再跑一段與修改時間操作", () => {
  const card = html.slice(html.indexOf('id="homeWorkCard"'), html.indexOf('id="sharedIncomePanelAnchor"'));
  assert.match(card, /id="continueRun"[^>]*>再跑一段</);
  assert.match(card, /id="modifyWorkTime"[^>]*>修改時間</);
  assert.match(html, /#continueRun,[\s\S]*?#modifyWorkTime\s*\{[\s\S]*?min-width:\s*0/);
  const controls = extractFunction("updateWorkControls");
  assert.match(controls, /continueRun\.classList\.toggle\("hidden", status !== "stopped"\)/);
  assert.match(controls, /modifyWorkTime\.classList\.toggle\("hidden", status !== "stopped"\)/);
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
