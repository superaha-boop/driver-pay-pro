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

test("今日工作狀態整條標題列是唯一工作明細控制", () => {
  const section = html.slice(html.indexOf('id="homeWorkCard"'), html.indexOf('id="sharedIncomePanelAnchor"'));
  assert.doesNotMatch(section, /id="workPrimaryTime"/);
  assert.match(section, /<button class="work-status-row" id="workDetailsToggle"[^>]*aria-expanded="false"[^>]*aria-controls="workMetrics"/);
  assert.match(section, /aria-label="今日工作狀態，尚未開始，工作明細已收合，按兩下展開"/);
  assert.match(section, /class="home-heading" id="workStatusTitle"/);
  assert.match(section, /class="work-status-meta"[\s\S]*?id="workStatusText"[\s\S]*?class="work-details-chevron app-chevron app-chevron--disclosure"/);
  assert.doesNotMatch(section, /class="work-time-overview"|class="work-details-toggle"|>工作明細</);
  assert.match(html, /\.work-status-row\s*\{[\s\S]*?width:\s*100%[\s\S]*?min-height:\s*44px/);
  assert.match(html, /\.work-status-row:focus-visible\s*\{/);
  assert.match(extractFunction("renderStats"), /今日工時<\/span><strong>\$\{formatHours\(todaySummary\.hours\)\}/);
});

test("工作狀態標題列同步 expanded、狀態朗讀與 chevron", () => {
  const source = extractFunction("setWorkDetailsExpanded");
  const a11y = extractFunction("syncWorkDetailsToggleA11y");
  const controls = extractFunction("updateWorkControls");
  assert.match(source, /aria-expanded/);
  assert.match(source, /syncWorkDetailsToggleA11y\(\)/);
  assert.match(a11y, /今日工作狀態，\$\{statusLabel\}，工作明細\$\{isExpanded \? "已展開，按兩下收合" : "已收合，按兩下展開"\}/);
  assert.match(controls, /els\.workStatusText\.dataset\.status = status;[\s\S]*?syncWorkDetailsToggleA11y\(\)/);
  assert.match(html, /\.work-status-row\[aria-expanded="true"\] \.work-details-chevron/);
  assert.doesNotMatch(html, /work-details-symbol|工作明細<\/span>/);
  assert.doesNotMatch(source, /workMinutes|durationMs|saveState|persistStatePayload/);
});

test("工作操作與明細內容不會冒泡觸發標題列切換", () => {
  const section = html.slice(html.indexOf('id="homeWorkCard"'), html.indexOf('id="sharedIncomePanelAnchor"'));
  const listeners = html.slice(
    html.indexOf('els.workDetailsToggle.addEventListener'),
    html.indexOf('els.manualEntryToggle.addEventListener')
  );
  assert.match(section, /<\/button>\s*<div class="work-metrics hidden" id="workMetrics"/);
  assert.match(section, /<\/div>\s*<div class="work-actions">/);
  assert.match(listeners, /els\.workDetailsToggle\.addEventListener\("click"/);
  assert.doesNotMatch(listeners, /homeWorkCard|workMetrics|startRun|pauseRun|resumeRun|endRun|continueRun|modifyWorkTime/);
  assert.doesNotMatch(html, /els\.homeWorkCard\.addEventListener\("click"/);
});

test("原生標題列按鈕提供 Enter、Space 與單一展開 state", () => {
  const section = html.slice(html.indexOf('id="homeWorkCard"'), html.indexOf('id="sharedIncomePanelAnchor"'));
  assert.match(section, /<button class="work-status-row" id="workDetailsToggle" type="button"/);
  assert.equal((html.match(/id="workDetailsToggle"/g) || []).length, 1);
  assert.equal((html.match(/aria-controls="workMetrics"/g) || []).length, 1);
  assert.doesNotMatch(html, /let workDetailsExpanded|const workDetailsExpanded|workDetailsState/);
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

test("手動模式隱藏重複即時摘要，時間模式保留單一計算結果", () => {
  const detail = html.slice(html.indexOf('id="workTimeSection"'), html.indexOf('id="expenseSection"'));
  const setMode = extractFunction("setWorkTimeInputMode");
  const liveUi = extractFunction("updateWorkTimeUi");
  assert.match(detail, /id="workLiveSummary"[\s\S]*?<span>計算工時<\/span>/);
  assert.match(setMode, /els\.workLiveSummary\.classList\.toggle\("hidden", isManual\)/);
  assert.match(liveUi, /formatWorkDuration\(work\.workMinutes\)/);
  assert.doesNotMatch(detail, /<span>今日工時<\/span>/);
});

test("支出快捷與類別方式控制採精簡同列按鈕且保留完整選項", () => {
  const source = extractFunction("renderExpenseForm");
  assert.match(source, /class="expense-choice-row"/);
  assert.match(source, /<select class="expense-choice-button" id="smartExpenseCategory" aria-label="支出類別">/);
  assert.match(source, /data-expense-toggle-mode[\s\S]*?aria-label="支出方式，/);
  assert.match(source, /expenseCategoryOptionsMarkup\(\)/);
  assert.doesNotMatch(source, /expense-choice-panel|data-expense-toggle-category/);
  assert.match(source, /data-expense-mode/);
  assert.match(source, /aria-label="\$\{escapeAttr\(expenseShortcutLabel\(category\)\)\}"/);
  assert.doesNotMatch(source, /expense-compact-row-label|expense-compact-row-action|>更改<|>修改</);
  assert.match(html, /\.expense-quick-button\s*\{[\s\S]*?min-height:\s*46px/);
  assert.match(html, /\.expense-choice-button\s*\{[\s\S]*?min-height:\s*48px/);
  assert.match(html, /select\.expense-choice-button\s*\{[\s\S]*?-webkit-appearance:\s*menulist/);
  assert.match(html, /\.expense-choice-row\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(html, /\.expense-quick-button\.active::after\s*\{[\s\S]*?content:\s*"✓"/);
  assert.match(extractFunction("selectExpenseCategory"), /if \(!preserveDraft\)/);
  assert.match(html, /selectExpenseCategory\(quick\.dataset\.expenseQuick, true, true\)/);
});

test("付款日期與備註同列且備註輸入只在展開後出現", () => {
  const source = extractFunction("renderExpenseForm");
  assert.match(source, /class="expense-date-note-row"[\s\S]*?smartExpenseDate[\s\S]*?data-expense-toggle-note/);
  assert.match(source, /expenseDraft\.noteOpen \? `[\s\S]*?id="smartExpenseNote"/);
  assert.match(html, /\.expense-date-note-row\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 13fr\) minmax\(0, 7fr\)/);
  assert.match(html, /\.expense-note-toggle\s*\{[\s\S]*?min-height:\s*44px/);
});

test("分月卡片移除預覽警語並保留精簡摘要", () => {
  const source = extractFunction("allocatedExpenseMarkup");
  assert.match(source, /expenseSuggestionCategory/);
  assert.match(source, /expenseDurationText/);
  assert.match(source, /expenseMonthRange/);
  assert.match(source, /expenseMonthlyCost/);
  assert.match(source, /expenseDraft\.advancedOpen \? "收合" : "修改"/);
  assert.doesNotMatch(source, /系統建議|目前先提供分月預覽|月報尚不會分月計入/);
  assert.match(source, /輸入金額後即可計算/);
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
