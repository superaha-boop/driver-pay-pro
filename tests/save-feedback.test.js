const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

const html = fs.readFileSync(new URL("../index.html", `file://${__filename}`), "utf8");

function extractFunction(name) {
  const start = html.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `找不到 ${name}()`);
  const bodyStart = html.indexOf(") {", start) + 2;
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
    if (char === "}" && --depth === 0) return html.slice(start, index + 1);
  }
  throw new Error(`${name}() 結尾不完整`);
}

test("activeRecordDate 同時驗證顯示日期、支出日期、小費日期與 record key", () => {
  const binding = extractFunction("activeRecordBindingSnapshot");
  assert.match(binding, /target === activeRecordDate/);
  assert.match(binding, /displayedDate === activeRecordDate/);
  assert.match(binding, /expenseDate === activeRecordDate/);
  assert.match(binding, /tipDate === activeRecordDate/);
  assert.match(binding, /boundRecord\.date === activeRecordDate/);
  assert.match(extractFunction("saveTip"), /validateActiveRecordWrite\(targetDate, \{ tipDate \}\)/);
  assert.match(html, /日期狀態異常，未儲存。請重新選擇日期。/);
});

test("支出只有 activeRecordDate 且金額會吃滿 96–112px 備註按鈕之外的空間", () => {
  const render = extractFunction("renderExpenseForm");
  assert.doesNotMatch(render, /smartExpenseDate|type="date"/);
  assert.match(render, /expense-amount-note-row[\s\S]*?smartExpenseAmount[\s\S]*?data-expense-toggle-note/);
  assert.match(html, /\.expense-amount-note-row\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\) minmax\(96px, 112px\)/);
  assert.match(render, /expenseDraft\.noteOpen \? `[\s\S]*?smartExpenseNote/);
  assert.match(extractFunction("saveSmartExpense"), /expenseDate: paymentDate/);
});

test("共用明確儲存回饋只在 persistent write 成功後進入 saved", () => {
  const shared = extractFunction("setManualSaveFeedback");
  const expense = extractFunction("saveSmartExpense");
  const tip = extractFunction("saveTip");
  assert.match(shared, /status === "error" \? "alert" : "status"|renderManualSaveFeedback/);
  for (const source of [expense, tip]) {
    const persistence = source.indexOf("persistStatePayload(nextState, { updateMemory: true })");
    const success = source.indexOf('"saved", "✓ 已儲存"');
    assert.ok(persistence >= 0 && success > persistence, "成功狀態必須晚於 persistence");
    assert.match(source, /runPersistentSaveAfterFeedbackPaint/);
    assert.match(source, /儲存失敗・再試一次/);
  }
  assert.match(extractFunction("runPersistentSaveAfterFeedbackPaint"), /requestAnimationFrame[\s\S]*?requestAnimationFrame/);
});

test("既有儲存詳細紀錄也重用 Saving → Saved 回饋且防止重複提交", () => {
  const source = extractFunction("saveTodayDetailRecord");
  assert.match(source, /detailSaveInProgress/);
  assert.match(source, /setManualSaveFeedback\("detail", "saving", "儲存中…"\)/);
  assert.match(source, /persistStatePayload\(nextState, \{ updateMemory: true \}\)/);
  assert.match(source, /setManualSaveFeedback\("detail", "saved", "✓ 已儲存", \{ resetAfter: 1300 \}\)/);
  assert.match(source, /儲存失敗・再試一次/);
  assert.match(extractFunction("renderDetailSaveFeedback"), /manualSaveButtonText\("detail", "儲存詳細紀錄"\)/);
});

test("支出成功會清空草稿、收合備註、刷新摘要並提供五秒復原", () => {
  const save = extractFunction("saveSmartExpense");
  const register = extractFunction("registerExpenseAdditionUndo");
  assert.match(save, /expenseDraft = createExpenseDraft\(request\.paymentDate\)/);
  assert.match(save, /renderAll\(\)/);
  assert.match(save, /resetAfter: 1300/);
  assert.match(save, /registerExpenseAdditionUndo/);
  assert.match(register, /duration: 5000/);
  assert.match(register, /actionLabel: "復原"/);
  assert.match(register, /✓ 已新增/);
  assert.match(extractFunction("renderTodayExpenseList"), /expenses\.length[\s\S]*?money\(total\)/);
});

test("支出復原精確回復金額、備註與 allocation，不影響其他類別", () => {
  const snapshot = extractFunction("expenseCategorySnapshot");
  const restore = extractFunction("restoreExpenseCategorySnapshot");
  const context = vm.createContext({ Boolean, Number, Object, String });
  vm.runInContext(`${snapshot}\n${restore}\nglobalThis.snapshot = expenseCategorySnapshot; globalThis.restore = restoreExpenseCategorySnapshot;`, context);
  const entry = {
    expenses: { 油錢: 500, 停車費: 80 },
    expenseNotes: { 油錢: "中油" },
    expenseAllocations: { 油錢: { months: 3, startMonth: "2026-07" } }
  };
  const before = context.snapshot(entry, "油錢");
  entry.expenses.油錢 = 900;
  entry.expenseNotes.油錢 = "修改";
  delete entry.expenseAllocations.油錢;
  context.restore(entry, "油錢", before);
  assert.deepEqual(JSON.parse(JSON.stringify(entry)), {
    expenses: { 油錢: 500, 停車費: 80 },
    expenseNotes: { 油錢: "中油" },
    expenseAllocations: { 油錢: { months: 3, startMonth: "2026-07" } }
  });
  const undo = extractFunction("undoLastExpenseAddition");
  assert.match(undo, /action\.date !== targetDate/);
  assert.match(undo, /expenseCategorySnapshotMatches/);
  assert.match(undo, /persistStatePayload[\s\S]*?notifyRecordChanged/);
});

test("小費使用專用輸入與儲存按鈕，但仍寫回既有 tips 欄位", () => {
  assert.match(html, /id="tipAmount"[\s\S]*?id="saveTip"[\s\S]*?id="tips"/);
  assert.match(html, /id="tipSavedTotal"/);
  assert.match(html, /id="editTipTotal"[\s\S]*?>修改</);
  assert.equal((html.match(/id="tips"/g) || []).length, 1);
  assert.match(extractFunction("formData"), /tips: Number\(document\.getElementById\("tips"\)\.value \|\| 0\)/);
  assert.match(extractFunction("saveTip"), /entry\.tips = request\.beforeTips \+ request\.amount/);
});

test("已記錄小費可切換成總額校正，並重用同一個輸入與 tips 欄位", () => {
  const render = extractFunction("renderTipSaveFeedback");
  const edit = extractFunction("setTipEditMode");
  assert.match(render, /tipEditMode \? "小費總額" : "小費"/);
  assert.match(render, /tipEditMode \? "輸入新總額" : "輸入小費"/);
  assert.match(render, /tipEditMode \? "儲存修改" : "儲存小費"/);
  assert.match(render, /storedTips <= 0 && !tipEditMode/);
  assert.match(edit, /tipDraftAmount = tipEditMode \? String\(storedTips\) : ""/);
  assert.equal((html.match(/id="tipAmount"/g) || []).length, 1);
});

test("小費總額校正綁定 activeRecordDate，persistent 成功後才更新並允許歸零", () => {
  const correction = extractFunction("saveTipCorrection");
  assert.match(correction, /validateActiveRecordWrite\(targetDate, \{ tipDate \}\)/);
  assert.match(correction, /nextTips < 0/);
  assert.match(correction, /entry\.tips = request\.nextTips/);
  assert.match(correction, /if \(!recordHasMeaningfulContent\(entry\)\)/);
  const persistence = correction.indexOf("persistStatePayload(nextState, { updateMemory: true })");
  const clearDraft = correction.indexOf('tipDraftAmount = ""');
  const success = correction.indexOf('"saved", "✓ 已儲存"');
  assert.ok(persistence >= 0 && clearDraft > persistence && success > persistence);
  assert.match(correction, /儲存失敗・再試一次/);
  assert.match(correction, /notifyRecordChanged\(request\.targetDate, "tip-correction"\)/);
});

test("小費成功刷新收入 KPI、清空輸入並提供日期綁定復原", () => {
  const save = extractFunction("saveTip");
  const undo = extractFunction("undoLastTipAddition");
  assert.match(save, /tipSaveInProgress/);
  assert.match(save, /tipDraftAmount = ""/);
  assert.match(save, /notifyRecordChanged\(request\.targetDate, "tip-add"\)/);
  assert.match(save, /renderAll\(\)/);
  assert.match(save, /registerTipAdditionUndo/);
  assert.match(extractFunction("registerTipAdditionUndo"), /actionLabel: "復原"[\s\S]*?duration: 5000/);
  assert.match(undo, /validateActiveRecordWrite\(targetDate, \{ tipDate: action\.date \}\)/);
  assert.match(undo, /entry\.tips = action\.beforeTips/);
  assert.match(undo, /persistStatePayload[\s\S]*?renderAll\(\)/);
});

test("支出與小費失敗保留 draft 且快速連點不重複提交", () => {
  const expense = extractFunction("saveSmartExpense");
  const tip = extractFunction("saveTip");
  assert.match(expense, /if \(expenseSaveInProgress\) return false/);
  assert.match(tip, /if \(tipSaveInProgress\) return false/);
  assert.ok(expense.indexOf("expenseDraft = createExpenseDraft(request.paymentDate)") > expense.indexOf("if (!saved)"));
  assert.ok(tip.indexOf('tipDraftAmount = ""') > tip.indexOf("if (!saved)"));
  assert.match(expense, /if \(!saved\)[\s\S]*?return/);
  assert.match(tip, /if \(!saved\)[\s\S]*?return/);
});

test("日期切換會清除跨日期 Undo 與手動儲存狀態，不會 fallback 今天", () => {
  const setDate = extractFunction("setActiveRecordDate");
  assert.match(setDate, /lastExpenseAddition = null/);
  assert.match(setDate, /lastTipAddition = null/);
  assert.match(setDate, /tipDraftAmount = ""/);
  assert.match(setDate, /tipEditMode = false/);
  assert.match(setDate, /activeRecordDate = target/);
  assert.doesNotMatch(setDate, /activeRecordDate = todayString/);
});

test("Snackbar、按鈕與同排輸入保留 mobile touch 與 Bottom Navigation 空間", () => {
  assert.match(html, /\.app-toast\s*\{[\s\S]*?bottom:\s*calc\(/);
  assert.match(html, /\.app-toast-action\s*\{[\s\S]*?min-height:\s*44px/);
  assert.match(html, /\.expense-note-toggle\s*\{[\s\S]*?min-height:\s*52px/);
  assert.match(html, /\.tip-save-button\s*\{[\s\S]*?min-height:\s*44px/);
  assert.match(html, /\.tip-edit-button\s*\{[\s\S]*?min-height:\s*44px/);
  assert.match(html, /\.tip-save-row\s*\{[\s\S]*?minmax\(0, 1fr\)/);
});
