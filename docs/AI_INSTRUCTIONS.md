# Driver Pay Pro — AI Development Instructions

本文件供 ChatGPT、Codex、Claude Code、Gemini 與其他 AI 開發工具共同閱讀。目的是在不同工具之間維持相同的資料安全、功能規則與 UI 決策。

更新日期：2026-07-19

## 目錄

- [任務開始前](#任務開始前)
- [資訊可信度順序](#資訊可信度順序)
- [專案技術現況](#專案技術現況)
- [Git 與檔案安全](#git-與檔案安全)
- [資料契約](#資料契約)
- [計算不可變條件](#計算不可變條件)
- [Home 與收入 UI 規則](#home-與收入-ui-規則)
- [Calendar 與月份明細規則](#calendar-與月份明細規則)
- [產品內 AI 功能規則](#產品內-ai-功能規則)
- [UI 與響應式規則](#ui-與響應式規則)
- [實作方式](#實作方式)
- [驗證要求](#驗證要求)
- [文件維護](#文件維護)
- [禁止事項](#禁止事項)
- [目前 TODO](#目前-todo)

## 任務開始前

每個 AI 在修改前必須：

1. 確認專案根目錄。
2. 閱讀使用者當次指令。
3. 閱讀 `PROJECT_CONTEXT.md`、`HANDOFF.md` 與 `docs/` 相關文件。
4. 執行 `git status --short --branch`、`git log -1 --oneline`，必要時檢查遠端。
5. 閱讀實際相關程式，不只依賴文件或 commit 訊息。
6. 確認工作目錄是否已有使用者或其他代理的未提交修改。
7. 只修改需求指定區塊；若文件與程式不一致，先以程式現況為準並回報。

## 資訊可信度順序

遇到衝突時採以下順序：

1. 使用者當次明確指令。
2. 目前工作目錄中的實際程式與即時 Git 狀態。
3. 已提交且位於目前分支 ancestry 的 Git diff。
4. `docs/`、`PROJECT_CONTEXT.md`、`HANDOFF.md`。
5. `.backups/` 與其他分支，只作歷史參考。

`HANDOFF.md` 與 `PROJECT_CONTEXT.md` 可能落後。例如舊文件曾記載 AI 分頁仍是預留畫面，但目前工作目錄已實作規則式 AI 營運助理。

## 專案技術現況

- 單頁靜態 App，HTML、CSS、JavaScript 集中在 `index.html`。
- PWA 設定在 `manifest.webmanifest` 與 `sw.js`。
- 沒有 `package.json`、TypeScript、ESLint 或 npm build。
- 沒有 React、Vue、後端服務或資料庫 SDK。
- 所有資料保存在瀏覽器 localStorage。
- 最低支援版面寬度為 320px。

不要假設存在 npm script、component framework、lucide-react、API route 或 server database。

## Git 與檔案安全

- 保留所有既有未提交變更；不覆蓋整個 `index.html`。
- 不使用 `git reset --hard`、rebase、force push 或破壞性 checkout。
- 不刪除 `.backups/`，也不把它部署成網站內容。
- 不切換分支、commit、push、merge、開 PR 或 deploy，除非使用者明確要求。
- 使用者要求 commit 時，只 stage 當次授權範圍；不要順便提交其他 dirty files。
- 修改前優先以 Git diff 或備份定位目標區塊，不回退整個專案。
- 遠端與部署資訊具有時效性，操作前重新查證；不要沿用舊 handoff 的 hash。

## 資料契約

核心 key：

```text
driverPayApp.v2
```

禁止更名、清除或未經 migration 改變結構。現有頂層為：

```text
state
├── platforms[]
├── expenses[]
├── entries[]
└── settings
    ├── dailyGoal
    ├── monthlyGoal
    ├── platformRates{}
    └── timeDetailsOpen
```

`entries[]` 需相容：日期、班別、時間、休息、手動工時、小費、訂單、公里、天氣、備註、平台收入、支出、workSession、Yoxi incomeRecords 與舊資料缺欄位情況。

資料規則：

- 只新增向後相容欄位。
- 所有數字輸入需處理空字串、負數、NaN、Infinity。
- 動態平台／支出名稱可能成為 object key，渲染時必須 escape。
- 天氣值維持文字；icon 只存在顯示層。
- localStorage parse 失敗時不可自動清除原始資料。

## 計算不可變條件

- 平台實拿＝原始收入 × 實拿比例／100。
- 當日總收入＝平台實拿合計＋小費。
- 當日淨收入＝總收入－支出。
- 時薪＝淨收入／工時；無工時不得除以 0。
- 手動工時優先於 workSession；workSession 優先於開始／結束時間。
- 一般平台輸入新值必須覆蓋當日總額。
- Yoxi 加號必須新增單筆並累加；點總額仍可修正累計值。
- Enter 與 blur 不得造成重複提交。
- 平台比例限制 0–100%。
- 每日目標進度視覺最多 100%，超標文字可大於 100%。

任何 UI 任務若不要求改公式，就不得調整以上行為。

## Home 與收入 UI 規則

- 深綠核心卡保持首頁第一個主要區塊。
- 保留今日收入、今日實際工時、目前時薪與每日目標進度。
- 今日目標狀態文字在進度條右上方，不恢復左下「今日目標 $X」。
- 工作狀態直接顯示總經過、休息、實際工時，不收合。
- 天氣不阻擋開始工作。
- 所有平台同時顯示，一平台一行。
- 不增加平台切換卡、第二行 editor、鉛筆或逐列完成按鈕。
- 不使用各平台品牌色或亮藍收入字。
- 班別／天氣使用直接選項並自動保存。
- 更新今日紀錄日期維持精簡橫向 row 與原生 date input。

## Calendar 與月份明細規則

- 週報、月報與平台報表共用現有資料與計算。
- 週期同年不重複年份；跨年才顯示雙方年份。
- 700px 以下月份明細為緊湊 row 清單。
- 700px 以上保留桌面表格；兩套不可同時顯示。
- 手機 row 第一行：日期／星期、班別、天氣 SVG、總收入。
- 第二行：只顯示收入大於 0 的平台與編輯／刪除。
- 無平台收入顯示「尚無收入紀錄」，總額 `$0` 保留。
- 不加入每日獨立卡片、展開、查看更多或水平捲動。
- 月份明細天氣 icon 不得使用 Emoji；無資料不顯示占位 icon。
- 其他頁面的天氣文字除非明確要求，不要更改。

## 產品內 AI 功能規則

注意：本節的「AI」指 Driver Pay Pro 產品功能，不是正在修改程式的 AI 代理。

- 現況是本機規則式分析，不是真正模型。
- 禁止未經明確需求加入付費 AI API、外部模型、API Key、聊天或「詢問 AI」。
- 不得宣稱已連線、學習、預測或理解使用者。
- 所有輸出都必須可從現有 entry、平台比例與目標重算。
- 分析函式應與 UI 渲染分離並可重用。
- 缺資料顯示「資料不足」或明確空狀態，不自行猜測。
- 建議最多 2–4 個最重要項目；提醒去重並限制數量。
- 變更門檻時同步更新 `PROJECT_SPEC.md`、`FEATURES.md` 與測試案例。
- 使用現有 `finiteNumber`、`nonNegativeNumber` 與分析函式處理異常值。
- 動態平台名稱與文字必須 escape，避免 HTML injection。

目前規則與門檻以 `buildTodayAdvice()`、`buildSmartAlerts()`、`recentRisingPlatform()` 與相關分析函式為準。

## UI 與響應式規則

- 現行主色為深綠、灰綠、白；有效 token 以後段 v0.4 CSS 為準。
- 一般卡片 18px 圓角；首頁核心卡 20px。
- 主要內容最大寬度 760px。
- 固定底部五欄導覽需處理 iPhone safe-area。
- 320px 不得水平 overflow。
- 平台名稱與金額不拆開；平台清單可自然換行。
- 表單字級至少 16px。
- icon-only control 需要 aria-label。
- 支援 `prefers-reduced-motion`。
- 不在需求之外統一或重做舊 CSS；單檔內仍有 legacy 規則。

## 實作方式

- 使用搜尋定位函式、id 與 class，再讀完整相關區塊。
- 只對指定區塊做最小 patch。
- 新分析邏輯拆成純計算或近似純計算函式，渲染函式只組 UI。
- 共用既有 `money()`、`number()`、`calcHours()` 與 escape helpers。
- 不為小需求引入框架、套件、CDN 或外部服務。
- 不修改資產與 Service Worker，除非需求涉及 PWA 或圖示。
- 新增 cache 資源時同步更新 `APP_SHELL` 與 cache name，並驗證離線。

## 驗證要求

專案沒有 lint／type／build 指令時，不得虛構「全部通過」。應如實回報未配置，並執行：

1. Inline JavaScript 語法檢查。
2. `git diff --check`。
3. 實際瀏覽器操作。
4. Console error／warning 檢查。
5. 320px、390px、1024px 響應式檢查。
6. 收入、Yoxi、計時、目標與 localStorage 回歸。
7. AI 空資料、單日、缺工時、缺平台、目標 0 與異常數字。
8. 月份清單／桌面表格互斥與無水平 overflow。

測試建立的 localStorage 資料必須使用隔離 origin，或在結束前只移除代理自己建立的資料。

## 文件維護

功能變更後更新：

- `PROJECT_SPEC.md`：產品與資料規格。
- `UI_GUIDELINES.md`：視覺與響應式規則。
- `FEATURES.md`：功能現況與狀態。
- `ROADMAP.md`：已確認的後續項目。
- `CHANGELOG.md`：Unreleased 或對應 commit。
- `AI_INSTRUCTIONS.md`：所有 AI 必須遵守的規則。
- `README.md`：文件索引。

文件不得把未提交內容寫成已發布，也不得把候選 Roadmap 寫成承諾。

## 禁止事項

- 禁止清除或更名 `driverPayApp.v2`。
- 禁止 reset、rebase、force push 或覆蓋整個本機版本。
- 禁止刪除 `.backups/`。
- 禁止將 `.backups/` 部署到正式站。
- 禁止把一般平台改成累加，或把 Yoxi 加號改成覆蓋。
- 禁止讓天氣成為開始工作的前置條件。
- 禁止把手機月份明細改回超寬表格或每日大型卡片。
- 禁止未授權的外部 AI、追蹤、分析 SDK 或 API Key。
- 禁止聲稱不存在的 lint、type check、build、後端、資料庫或部署已完成。
- 禁止修改需求外的已凍結頁面。

## 目前 TODO

- TODO：iPhone Safari 與 standalone PWA 實機驗收。
- TODO：確認目前正式部署平台、遠端版本與發布流程。
- TODO：Driver Space 詳細功能。
- TODO：是否建立測試、lint、type check 與 build 工具鏈。
- TODO：資料匯入、雲端同步與真正 AI 的產品決策。
