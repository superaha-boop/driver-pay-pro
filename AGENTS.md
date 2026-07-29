# Driver Pay Pro — Codex Instructions

Version: 1.8

## Project Documentation

開始任何工作前，必須先依需求讀取：

- `docs/PRODUCT_GUIDE.md`
- `docs/PRODUCT_SPEC.md`
- `docs/CALENDAR_SPEC.md`（涉及 Calendar 時）
- `docs/REPORTS_SPEC.md`（涉及 Reports 時）
- `docs/DESIGN_KIT.md`
- `docs/DEVELOPMENT_HANDBOOK.md`
- `docs/DECISION_LOG.md`
- `docs/TECH_DEBT.md`
- `DECISIONS.md`
- 本次核准的 PRD

涉及目前產品狀態或接手工作時，也必須核對 `PROJECT_CONTEXT.md`、`HANDOFF.md`、實際 Git 狀態與現有程式碼；技術狀態以即時檢查結果為準。

文件用途：

- `PRODUCT_GUIDE.md`：產品方向與範圍
- `PRODUCT_SPEC.md`：正式產品邊界、頁面責任、功能歸屬與跨頁資料契約
- `CALENDAR_SPEC.md`：Calendar 正式互動、狀態、資料契約、實作架構與驗收規格
- `REPORTS_SPEC.md`：Reports 正式期間、KPI、比較、趨勢、平台、狀態與驗收規格
- `DESIGN_KIT.md`：UI、UX 與品牌規則
- `DESIGN_SYSTEM.md`：可實作的視覺 tokens 與共用 UI primitives
- `DEVELOPMENT_HANDBOOK.md`：開發、測試與發布流程
- `DECISION_LOG.md`：重要產品決策與原因
- `TECH_DEBT.md`：已知技術債、影響、優先級與建議處理時機

## Instruction Priority

規則衝突時，依照以下優先順序：

1. 使用者本次明確指令
2. 本次核准的 PRD
3. `AGENTS.md`
4. `PRODUCT_SPEC.md`
5. `CALENDAR_SPEC.md`（涉及 Calendar 時）
6. `REPORTS_SPEC.md`（涉及 Reports 時）
7. `PRODUCT_GUIDE.md`
8. `DESIGN_KIT.md`
9. `DEVELOPMENT_HANDBOOK.md`
10. Codex 自行判斷

若指令可能造成資料遺失、覆蓋正式版本、刪除分支或改寫 Git 歷史，必須先停止並說明風險。

## Before Starting Work

開始修改前必須：

1. 讀取本次 PRD。
2. 執行 `git status`。
3. 檢查相關現有程式與資料結構。
4. 說明預計修改哪些檔案。
5. 確認 Acceptance Criteria。
6. 確認 Out of Scope。
7. 發現規格矛盾時先回報，不可自行猜測。

## Core Engineering Rules

- 一次只處理目前指定的 Task。
- 使用最小修改原則。
- 不自行新增功能。
- 不自行改變已核准的 UX。
- 不因「順便優化」擴大任務。
- 不任意重寫整個架構。
- 不任意增加套件或更換技術。
- 不修改與任務無關的檔案。
- 不大範圍格式化無關程式。
- 額外發現的問題只列入 Known Issues 或 Backlog Suggestions。

## Design System Execution Rules

- 新 UI 必須優先使用 `styles/design-system.css` 的 Design Tokens。
- 新 UI 必須優先使用現有 `.ds-*` 共用基礎元件；禁止建立第二套 Button、Card、EmptyState、Skeleton 或 SaveStatus。
- 不任意加入孤立顏色、圓角、陰影或間距；如需突破 Design System，必須先將理由記錄於 `DECISIONS.md` 與正式決策紀錄。
- 正式 UI 只使用 Lucide icons，不使用 emoji 或混用其他 icon library。
- 互動區域至少 44×44px，採 mobile-first 並支援 iPhone safe area。
- 動畫必須尊重 `prefers-reduced-motion`。
- 金額、時數、百分比與 KPI 必須維持 `tabular-nums`。
- 每頁原則上只有一個主要操作，不建立 Card inside Card 或 KPI card wall。
- 避免厚重 gradient、border 與 shadow，不為視覺效果犧牲可讀性或速度。
- 現有頁面採漸進式遷移；不得因 Design System 存在就一次性重寫凍結頁面。
- 完整 token、primitive、表單與 showcase 規格請讀取 `docs/DESIGN_SYSTEM.md`。

## Product Architecture Execution Rules

- 底部主要資訊架構固定為「今天｜月曆｜報表｜AI｜Driver」，不得自行增加第六個主要分頁。
- 新功能或修改既有功能前，必須先核對 `docs/PRODUCT_SPEC.md` 的 Feature Ownership Matrix。
- 每個可寫入功能只能有一個 Primary owner；其他頁面只能 View、Link 或 None。
- 今天只負責今日即時工作與今日紀錄；月曆負責過去日期定位、補登、編輯與刪除。
- 報表與 AI 保持唯讀；需要修正紀錄時只能連到月曆的確切日期。
- Driver 只管理跨日持久設定，不得放入某一天的收入、班別、天氣或備註。
- 未來日期不得建立工作紀錄。
- 收入、支出、淨收入、實際工時、平均時薪及週／月彙總必須使用同一套 canonical calculation；禁止為單一頁面複製另一套公式。
- 同一個產品概念在多頁出現時，必須優先重用同一資料 selector、validation 與共用元件。
- Calendar 新實作必須先完成獨立的「Calendar Interaction and Implementation Specification」，不得直接由目前產品規格推定所有互動細節。
- 發現現況不符合正式產品規格時，先記錄於 `docs/TECH_DEBT.md` 或 Current State Audit；除非本次 PRD 明確授權，不得順便修正。

## Calendar Execution Rules

- Calendar 視覺打磨不得改變已定案的 state、日期、手勢、鍵盤、ARIA、read-only 或資料互動規則。
- Calendar 需要提升空間效率時，優先移除多餘 spacing；不得以縮小 44×44px touch target 換取空間。
- 工作紀錄卡片優先使用 typography、spacing 與低對比分隔線建立資訊層級，不新增多餘標題或卡片巢狀。
- Calendar heatmap 可在 Design System semantic tokens 內微調視覺差異，但視覺 Sprint 不得修改分級演算法、fallback 或資料語意。
- Navigation Never Loses Context：外部指定 Calendar 日期必須保留精確日期；有效日期覆蓋 session selection，無效日期安全回到台北今天，且不得建立資料。
- One Motion = One Meaning：水平位移只代表日期或月份改變，短淡入只代表內容更新；Calendar 動畫不得混用為裝飾。
- Calendar Read and Navigate 階段完全唯讀；render、日期點擊、月份切換、手勢、空狀態與格式化都不得建立、修改或刪除工作紀錄。
- Calendar 的 `selectedDate` 與 `displayedMonth` 是分離的 session UI state；都不得寫入 `driverPayApp.v2` 或其他 durable storage。
- 日期格式化只產生顯示值，不得回寫原始紀錄；日期運算必須使用驗證後的本地 date-only 語意，不得用 UTC ISO 序列化台灣日曆日期。
- Calendar 不得為空白日期自動建立 WorkRecord，也不得選取最近工作日代替精確日期。
- Calendar 以星期一為每週第一天，欄位固定為一、二、三、四、五、六、日。
- 一般新啟動預設選取台北當地今天；不得自動選最近工作日。
- 同一次 App session 返回 Calendar 時保留 `selectedDate` 與 `displayedMonth`；新 session 重設今天，不把選取日期永久寫入 localStorage。
- 單純切換月份只改 `displayedMonth`，不得偷偷改變 `selectedDate`。
- 月份箭頭、今天按鈕與日期點擊必須存在；滑動只能是增強，不能是唯一操作。
- Today 與 Selected 是不同狀態；Selected 視覺優先，但 Today indicator 仍可辨識。
- 未來日期可以查看，但不得新增工作紀錄。
- 日期格只顯示淨收入簡寫；完整金額與資料顯示於下方工作紀錄卡片。
- 收入熱度依當月有效正淨收入的相對分布計算，使用 Design System 語意 token，不在 renderer 硬編碼色票。
- 工作紀錄卡片第一版固定使用標準模式，位於月曆正下方，不使用平台 Logo。
- 編輯入口必須直接可見；刪除是次級操作，必須包含日期與影響範圍的確認。
- 今天空狀態連到 Today；過去空日期可補登；未來空日期沒有新增入口。
- Calendar 不取代 Reports，不加入即時工作控制、趨勢、平台排行或 AI 洞察。
- Calendar 必須使用 canonical calculations、`styles/design-system.css` primitives 與同一套 Record Editor；不得建立第二套表單、資料模型或公式。
- 完整狀態、手勢、Accessibility、資料與驗收規格以 `docs/CALENDAR_SPEC.md` 為準。

## Reports Execution Rules

- Reports 是唯讀的比較與分析頁；不得新增、編輯或刪除工作紀錄，也不得建立第二套 Record Editor。
- Reports 固定包含「週報｜月報｜平台」；新 App session 預設週報，同 session 可保留分頁與期間，但不得將 transient Reports state 新增到 `driverPayApp.v2`。
- 週報以台北本地星期一至星期日為完整七天，月報以台北本地曆月為完整期間；日期運算必須重用 Calendar 的 date-only utilities。
- 週／月 KPI、比較、趨勢、平台總額與重要日期必須建立在 canonical calculations 與純 selector 上；renderer 不得自行複製公式。
- 平均時薪固定為期間淨收入除以期間有效工作時數；零工時不得出現 `Infinity` 或 `NaN`。
- 週趨勢使用七個每日淨收入點；月趨勢使用四至六個 Monday-first 週彙總，且月份邊界只計入選定月份日期。
- 平台頁只描述收入貢獻、排行與占比，不得推論平台效率、最佳平台或平台時薪；小費不得誤歸入平台收入。
- 平台名稱相容只可在讀取層使用核准 alias 正規化；不得為了排行改寫歷史
  WorkRecord。未知自訂平台必須安全顯示，不得靜默合併為錯誤平台。
- 比較前一期為緊鄰的同等期間；前期零值、無紀錄、負值或正負跨越時不得顯示誤導百分比。
- 重要日期只能連到 Calendar 的確切日期；Reports 本身維持唯讀，同 session 返回時保留 Reports context。
- 重要日期下鑽不得自動開啟 Editor 或建立資料；返回 context 只存在 session
  記憶體，包含 tab、期間、捲動位置與來源焦點。
- 成功的紀錄 mutation 必須透過單一 committed-record notification 使可見報表
  更新；單純瀏覽、選期或開啟 Calendar 不得發出 mutation 通知。
- Empty、Loading、Error、Offline、stored zero 與 no record 必須是不同狀態；讀取錯誤不得覆寫或清除原始 localStorage。
- Reports UI 必須使用 Design System、Lucide、44×44px touch targets、正確 tab semantics 與可讀的圖表文字替代。
- 完整 state、period、KPI、comparison、trend、platform、deep-link、edge-case 與驗收規格以 `docs/REPORTS_SPEC.md` 為準。

## Local-first V1 AI and Driver Rules

- AI 固定為唯讀的「營運建議／本月洞察／智慧提醒」，不得建立 Record Editor、
  外部 AI API、聊天輸入或第二套 aggregation。
- AI 必須重用 `sharedAnalytics` 與 Reports canonical period、calculation、
  comparison、trend、Important Dates、platform、persistence、formatting 及
  drill-down 基礎；完整契約以 `docs/AI_SPEC.md` 為準。
- 全 App 顯示偏好固定使用可選 `settings.displaySize` 與 root
  `data-display-size`；合法新欄位優先，缺少時才相容讀取舊
  `aiReportsReadingSize`。不得新增頁面專用字級設定、zoom 或 scale。
- Driver 只管理既有跨日設定與衍生的本機／App 狀態；每日目標必須與 Today
  共用 `state.settings.dailyGoal`，不得新增另一份來源。
- Driver 不得新增每日紀錄、雲端狀態或不可靠的最後更新時間；完整契約以
  `docs/DRIVER_SPEC.md` 為準。
- 成功 WorkRecord 寫入只發出一次 committed-record notification；Reports 與
  AI 可見時各更新一次。失敗、rollback 與單純導覽不得發出成功通知。
- Local-first V1 固定使用 `driverPayApp.v2`，沒有 Supabase、authentication、
  cloud sync、migration 或外部 AI；完整跨頁契約以
  `docs/INTEGRATION_SPEC.md` 為準。

## Driver Pay Pro Local-first V1 UX Freeze

Product Owner 已於 2026-07-26 完成 Driver Pay Pro V1 L3 Human QA。Freeze
範圍包含 Today 核心流程、Calendar V1、Reports V1、AI V1、Driver V1、
Bottom Navigation、跨頁 drill-down、context restoration、record-change
refresh、Loading／Empty／Insufficient／Error／Offline、Accessibility、
Responsive、PWA 與 local-first data integrity。

Freeze 後只接受：

- 可重現的 Bug。
- Accessibility 修正。
- Data Integrity 修正。
- Security 修正。
- 重大使用障礙。
- Production blocker。

一般視覺改善與新增功能進入 V1.1 或 Cloud Sync Backlog。任何突破 V1 Freeze
的修改都必須說明使用者問題、影響範圍與資料風險，取得正式產品決策，補充
Regression，並同步更新 `DECISIONS.md`、`docs/DECISION_LOG.md` 與 Feature
Freeze evidence。

後續 AI 必須重用 `sharedAnalytics` 與 Reports canonical analytics；不得重新
建立頁面專用 aggregation。Local-first V1 仍固定使用 `driverPayApp.v2`，
沒有 Supabase、authentication、cloud sync、migration、external AI API 或
跨裝置同步。

# Driver Pay Pro Product Design Rules

以下規則永久適用於所有新頁面、UI／UX 修改、元件建立或重構、響應式設計、PWA 體驗、動畫、表單、導航、設定頁、報表、月曆與 AI 頁面。

Codex 執行任何視覺或互動任務前，必須先檢查本節與當次核准 PRD 是否一致。若規格衝突或需要改變以下原則，必須先取得明確產品決策，不得自行推定。

## 1. 三秒原則

使用者進入任何主要頁面後，應在三秒內理解：

- 這個頁面的用途。
- 最重要的資訊在哪裡。
- 下一步可以做什麼。

不得將核心資訊藏在多層選單、摺疊區域或長距離捲動之後。

各主要分頁的核心任務：

- 今天：快速掌握今日收入、工作狀態與目標進度。
- 月曆：快速找到日期、辨識工作紀錄與查看當日資訊。
- 報表：快速了解週、月及平台表現。
- AI：快速看到有價值的分析、異常或建議。
- Driver：快速找到個人設定與 App 設定。

## 2. 兩層原則

重要資訊與操作最多維持兩層：

第一層：

- 總覽。
- 核心資訊。
- 主要入口。

第二層：

- 詳細內容。
- 編輯。
- 設定。

避免建立：

- 多層選單。
- 多次跳頁。
- 不必要的「更多」。
- 詳細內容中的再次詳細內容。
- 為單一操作建立過深的導航結構。

## 3. 免思考原則

能安全自動完成的動作，不要求使用者額外決定。

優先採用：

- 自動儲存。
- 自動同步（僅限專案已具備且經核准的同步能力）。
- 即時更新。
- 合理預設值。
- 清楚的空狀態。
- 操作後立即回饋。

避免：

- 不必要的儲存按鈕。
- 不必要的確認視窗。
- 手動重新整理。
- 要求使用者理解技術概念。
- 含糊或意義不明的選項。

破壞性操作除外。刪除資料必須：

- 明確標示為破壞性操作。
- 使用確認流程。
- 避免誤觸。

## 4. 單手操作原則

Driver Pay Pro 是 mobile-first PWA，主要使用情境為 iPhone Safari 與已安裝的 PWA。

所有高頻操作應：

- 適合單手完成。
- 觸控區域足夠。
- 避免主要操作只放在難以碰觸的畫面頂端。
- 避免過小圖示。
- 避免依賴 hover。
- 保留 iPhone safe area。
- 不讓 Bottom Navigation 遮住內容。
- 不讓鍵盤遮住主要輸入或操作。

高頻操作原則上應在一至兩次點擊內完成。

## 5. Apple 美學原則

整體視覺方向：

- 安靜。
- 清楚。
- 精緻。
- 低彩度。
- 大量但合理的留白。
- 清楚的資訊層級。
- 柔和的深度感。
- 一致的間距與圓角。
- 接近 Apple 原生 App 的使用體驗。

Apple-like 不等於單純增加圓角。不得將畫面設計為：

- 傳統企業 Dashboard。
- Excel 資料表。
- 彩色 KPI 卡片牆。
- 大量漸層。
- 大量厚重陰影。
- 過多邊框。
- 過多顏色。
- 過度裝飾。
- 每個區塊都做成獨立卡片。
- Android Material Dashboard 風格。

## 6. 單一焦點原則

每個畫面應有一個清楚的主要焦點，原則上最多只有一個主要 CTA。

其他操作應依重要性降級為：

- 次要按鈕。
- 文字操作。
- 圖示操作。
- Action Sheet。
- Context Menu。

不得讓多個大型按鈕競爭注意力。

## 7. 總覽優先原則

主要資訊架構應遵循：

`Overview → Locate → Open → Edit`

不得優先採用：

`Open → Scroll → Scroll → Search → Open Detail`

畫面應先提供整體狀況，再讓使用者查看單筆詳細資料。

## 8. 直接操作原則

資料可在原位置安全修改時，優先採用直接操作。

例如：

- 點日期後在同頁更新當日紀錄。
- 切換選項後自動儲存。
- 平台收入直接輸入。
- 天氣一鍵選取。
- 月份可使用箭頭或滑動切換。

避免不必要的新頁面、Modal、Dialog、額外確認與多步驟精靈。

## 9. 視覺一致性

全 App 必須共享一致的：

- 頁面水平邊距。
- 區塊垂直間距。
- 字級階層。
- 字重。
- 圓角。
- 邊框。
- 陰影。
- 品牌綠。
- 系統灰階。
- 圖示尺寸。
- 動畫速度。
- 空狀態。
- Loading 狀態。
- 錯誤狀態。

不得在不同頁面自行建立互不相容的視覺系統。

## 10. 字體與資訊層級

應建立明確層級：

1. 頁面標題。
2. 區塊標題。
3. 核心數字。
4. 主要內文。
5. 輔助資訊。
6. 註解或狀態文字。

不得讓所有文字使用相同大小、粗細、深色或視覺權重。

繁體中文介面應自然易讀，不使用生硬的技術名稱。例如使用「當日紀錄」、「工作紀錄」與「報表」，不直接顯示 `Detail` 或不必要的英文介面文字。

## 11. 卡片使用規則

卡片只在需要建立明確資訊群組時使用。

卡片設計應：

- 使用柔和圓角。
- 邊框低對比。
- 陰影極輕或不使用。
- 保持足夠內距。
- 不過度巢狀。

禁止：

- 卡片裡再放多層卡片。
- 每個小數字各自一張卡片。
- 使用厚重陰影製造浮誇層次。
- 使用大量不同背景色區分內容。

## 12. 顏色規則

品牌綠僅用於：

- 選取狀態。
- 主要操作。
- 正向進度。
- 收入熱度。
- 重要焦點。

不得讓品牌綠充滿整個畫面。

其他內容優先使用：

- 白色。
- 系統灰白。
- 中性色文字。
- 極淡灰綠。
- 低彩度狀態色。

紅色僅用於刪除、錯誤與明確警告。

## 13. 圖示規則

全 App 使用同一套 Lucide icons。

Bottom Navigation 固定使用：

- 今天：`CircleDollarSign`。
- 月曆：`CalendarDays`。
- 報表：`ChartNoAxesColumnIncreasing`。
- AI：`Sparkles`。
- Driver：`UserRound`。

規格：

- 24px。
- 相同 stroke。
- 相同視覺重量。
- 不混用其他圖示系統。
- 不使用 emoji 代替正式 UI 圖示。
- 不加入無功能的裝飾圖示。

## 14. 動畫規則

動畫用途是幫助理解狀態改變，不是裝飾。

建議：

- 150–200ms。
- 淡入。
- 輕微位移。
- 柔和切換。
- 尊重 `prefers-reduced-motion`。

避免：

- 彈跳。
- 大幅縮放。
- 翻轉。
- 長時間動畫。
- 卡片飛入。
- 花俏 Loader。
- 影響快速操作的轉場。

## 15. 響應式與 PWA 規則

優先設計順序：

1. iPhone Safari。
2. iPhone installed PWA。
3. 其他手機。
4. 平板。
5. Desktop。

不得先做 Desktop，再縮小成手機版。

必須檢查：

- `safe-area-inset-top`。
- `safe-area-inset-bottom`。
- Bottom Navigation。
- 鍵盤彈出。
- 輸入框聚焦。
- 約 375px 的窄螢幕。
- 長文字。
- 大字體。
- 深色模式（若專案支援）。
- PWA standalone mode。

## 16. 無障礙規則

必須確保：

- 觸控目標合理。
- 文字與背景對比足夠。
- 不只依賴顏色傳達狀態。
- 圖示按鈕具備 `aria-label`。
- 表單欄位具備正確 label。
- 鍵盤可操作。
- focus 狀態可辨識。
- 動畫可降低。
- 重要內容可由螢幕閱讀器理解。

## 17. 自動儲存與回饋

自動儲存時應提供低干擾回饋，例如：

- 已儲存。
- 儲存中。
- 離線儲存。
- 同步失敗。

不得頻繁彈出 Toast 干擾使用者。優先使用小型狀態文字、非阻斷式提示，必要時提供重試。

## 18. 空狀態規則

空狀態必須：

- 說明目前沒有什麼。
- 提供一個清楚的下一步。
- 保持畫面簡潔。
- 不使用大量插圖佔據畫面。

例如：

- 說明：「這一天尚無工作紀錄」。
- 主要操作：「新增紀錄」。

## 19. 禁止自行擴充範圍

Codex 不得在沒有明確規格時自行：

- 新增功能。
- 新增統計指標。
- 新增圖表。
- 新增頁面。
- 改變導航。
- 更改資料模型。
- 加入第三方 UI framework。
- 重做已凍結頁面。
- 將簡潔畫面改為 Dashboard。
- 引入新的視覺風格。

發現潛在改進時，記錄於 `HANDOFF.md` 或回報，不直接實作。

## 20. 已凍結內容

除非任務明確授權，以下內容不得自行修改：

- Bottom Navigation 架構。
- Bottom Navigation 圖示。
- 品牌資訊。
- 已確認的首頁資訊順序。
- 已完成且標記為 frozen 的頁面。
- 週報星期定義：星期一至星期日。
- 報表主標題固定為「報表」。
- Calendar 月份與 Reports 月份狀態彼此獨立。

# Work Record Card Rules

本節是已核准、供未來 Calendar Sprint 使用的產品規格；目前尚未實作，不得因本文件存在就自行開始開發。

月曆點選日期後顯示的區域，正式名稱為「工作紀錄卡片」。使用者介面不得顯示 `Detail`。

## 混合式版面

核心資訊：

- 使用兩欄數據布局。
- 適合快速比較。
- 保持一致高度與對齊。

延伸資訊：

- 使用單欄布局。
- 平台收入、支出、班別、天氣、備註等依序排列。
- 不將延伸內容壓縮進過小的格子。

## 顯示模式

預設為標準模式。

### 精簡模式

- 總收入。
- 工作時間。
- 時薪。

### 標準模式

- 總收入。
- 淨收入。
- 工作時間。
- 時薪。
- 平台收入。

### 完整模式

- 總收入。
- 淨收入。
- 工作時間。
- 時薪。
- 平台收入。
- 支出。
- 班別。
- 天氣。
- 備註。

### 自訂模式

固定核心資訊：

- 總收入。
- 工作時間。
- 時薪。

可選資訊：

- 淨收入。
- 平台收入。
- 支出。
- 班別。
- 天氣。
- 備註。
- 今日目標。

第一版規則：

- 核心資訊不可拖曳。
- 延伸資訊可以開關。
- 延伸資訊可以拖曳排序。
- 設定變更即時預覽。
- 自動儲存。
- 不增加額外儲存按鈕。

## 空資料

- 數值型核心欄位無資料時顯示 `—`。
- 可選區塊完全沒有內容時，隱藏整個區塊。
- 不顯示大量空白欄位。

## 設定位置

Driver 的設定入口順序：

- 快速支出設定。
- 平台設定。
- 工作紀錄卡片。
- 關於。

「工作紀錄卡片」使用獨立設定頁，不在 Driver 主頁堆放所有開關。

## Data Safety

- 不得任意刪除或重設使用者資料。
- 不得任意修改 localStorage key。
- 目前主要 key 為 `driverPayApp.v2`。
- 資料模型變更前必須提出 Migration 方案。
- UI 修改不得改變收入、支出、工時或設定邏輯。
- 若有資料遺失風險，立即停止並回報。

## Existing Feature Protection

除非 PRD 明確要求，不得刪除或破壞：

- 收入紀錄
- 支出資料
- 工時計算
- 平台管理
- 週報與月報
- 平台分析
- CSV 匯出
- 設定資料
- PWA
- Official App Icon

## PWA Protection

不得破壞：

- `manifest.webmanifest`
- `sw.js`
- Service Worker 註冊
- Apple Touch Icon
- PWA Icons
- standalone 模式
- 離線基本功能

修改 Service Worker 時，必須檢查快取版本與所有資源路徑。

## Calendar UX Freeze — Version 1

Calendar V1 的 Header、Month Navigation、Weekday Header、Month Grid、
Today／Selected、Heatmap、Work Record Card、Empty States、新增／編輯／刪除流程、
手勢、Accessibility、Responsive 與 SaveStatus 已正式凍結。

凍結後原則上只接受：

- 可重現的 Bug 修正。
- Accessibility 修正。
- Data Integrity 修正。
- 會阻礙主要任務完成的重大使用障礙修正。

一般視覺偏好與新功能想法必須放入 Backlog，不得直接修改凍結介面。任何突破
Freeze 的修改都必須先說明使用者問題與影響範圍、取得正式產品決策、補充
Regression，並同步更新 `DECISIONS.md` 與正式決策紀錄。

所有主要模組（Calendar、Reports、AI、Driver）完成前，都必須依
`docs/FEATURE_FREEZE_CHECKLIST.md` 執行同一套 Feature Freeze Gate。

## Reports UX Freeze — Version 1

Product Owner 已於 2026-07-26 完成 Reports L3 Human QA。Reports V1 的
Header、週報／月報／平台 Tabs、Period controls、KPI hierarchy、Comparison
layout、Weekly Trend、Monthly Trend、Important Dates、Platform Ranking、
Unattributed Income、Empty／Loading／Error、Reports → Calendar drill-down、
Reports context restoration、Record-change refresh、Accessibility 與 Responsive
已正式凍結。

Freeze 後只接受：

- 可重現的 Bug 修正。
- Accessibility 修正。
- Data Integrity 修正。
- Security 修正。
- 重大使用障礙。
- Production blocker。

一般視覺改善與新增功能必須放入 Backlog。任何突破 Freeze 的修改都必須說明
使用者問題、影響範圍與資料風險，取得正式產品決策，補充 Regression，並同步
更新 `DECISIONS.md`、`docs/DECISION_LOG.md` 與 Feature Freeze evidence。

後續 AI 或其他分析功能必須重用 Reports 已驗證的 period utilities、
`aggregateReport()`、`compareReportPeriods()`、trend data builder、Important
Dates selector、platform normalization、platform aggregator、persistence read
API、record-change refresh、amount／duration formatting、Empty／Loading／Error
patterns 與 Reports drill-down adapter；不得建立另一套 aggregation。

## Foundation Tooling

Foundation Cleanup Version 1 自 2026-07-26 起提供最小靜態 PWA 工具鏈：

- `npm run lint`：ESLint correctness rules、Node scripts／tests、Service Worker
  與 HTML inline JavaScript。
- `npm test`：全部 Node tests。
- `npm run test:calendar`：Calendar targeted regression。
- `npm run test:reports`：Reports targeted regression。
- `npm run test:ai`：AI canonical／read-only regression。
- `npm run test:driver`：Driver settings／local-state regression。
- `npm run test:integration`：V1 integration 與 45-scenario regression。
- `npm run build` 或 `npm run validate:production`：靜態 Production validation，
  不產生 `dist`，也不引入 bundler。
- `npm run release:check`：依序執行 lint、全部／專項測試、inline JavaScript、
  Service Worker、Manifest、Production validation 與 `git diff --check`。

任何 Release Sprint 在 Commit 前必須先通過 `npm run release:check`。Lint 的
correctness errors 會阻擋 release；既有未使用程式只列 warning，不得為了清零
warning 而順便改動 frozen 產品邏輯。

`design-system.html` 是不進入 Bottom Navigation、不加入 Service Worker App
Shell、帶有 `noindex` 的內部展示頁。它可用於 Preview／本機 QA，但不是產品
功能入口。

## Git and Deployment Safety

完成一個 Sprint 並通過適用驗證後，Codex 可以直接：

- 只 stage 本 Sprint 核准的檔案。
- 依 `feat:`、`fix:`、`refactor:`、`docs:`、`style:`、`test:` 或 `chore:` 規範建立 Commit。
- Push 到目前工作 Branch。
- 使用一般 Git 合併將目前工作 Branch 整合至最新 `main`。
- Push `main`，觸發既有 Vercel Git Integration 的 Production Deployment。
- 核對 Production Deployment 對應的 commit，並完成正式站與 PWA 的適用驗證。
- 更新 `HANDOFF.md` 與必要的開發文件。
- 回報工作 Branch、Commit Hash、`main` Merge Commit、Production 狀態、修改檔案與驗證結果。

以上為 Product Owner 自 2026-07-25 起授予的持續發布授權，目的是讓每次已驗證修改可直接出現在手機正式版，不需逐次再次詢問 Merge、Push `main` 或 Production Deploy。若當次使用者明確要求「不要部署」、驗證未通過、遠端出現無法安全判定的衝突，或發布可能造成資料遺失，必須停止發布並回報。

若工作目錄包含其他未提交變更，不得使用會混入不相關內容的 staging；必須先辨識來源並採明確檔案範圍。

以下操作仍必須先說明並等待使用者明確確認：

- Git Reset。
- Git Rebase。
- Force Push。
- 刪除本機或遠端分支。
- 修改既有 Commit 歷史。
- 修改 Supabase Schema。
- 建立或執行 Migration。
- 刪除正式資料。
- 修改主要架構。
- 大規模 UI 重構。
- 任何可能造成資料遺失的操作。

永遠：

- 不刪除 `backup-old-version` 或 `.backups/`。
- 不繞過 Git 歷史直接修改正式 Production；正式版只由已驗證的 `main` 觸發部署。

## Required Validation

完成修改後必須：

1. 執行 `npm run release:check`；若工具鏈本身不可用，必須說明原因並停止發布。
2. 執行適用的額外瀏覽器與 responsive 測試。
3. 檢查 Console Error。
4. 檢查 `git diff`。
5. 再次執行 `git status`。
6. 確認 localStorage key 是否更動。
7. 確認 PWA 是否受影響。
8. 列出需要人工完成的 iPhone QA。

Codex 內建預覽不能取代 Chrome、Safari、iPhone 與 PWA 實機測試。

### QA Level

- L1 自動驗證：語法、測試、Console、responsive、資料安全與適用回歸。
- L2 Preview Smoke QA：使用可由未登入 iPhone Safari 直接開啟的 Preview，
  快速確認主要流程、導覽、更新、overflow、白畫面與阻擋性錯誤。
- L3 Module Human QA：主要模組完成 Final Regression 後，一次驗收完整流程、
  installed PWA、Offline、VoiceOver、safe area 與 iOS 特有行為。
- L4 Production Release QA：Production 發布後核對正式 commit、核心流程、
  Service Worker 更新與 rollback readiness。

小型 Sprint 原則上完成 L1 與核准 PRD 指定的 L2，不重複要求完整 L3。
完整 L3 應集中在大模組的 Final Regression／UX Freeze Gate。高風險資料、
同步、Service Worker 或 iOS 特有變更仍須依風險立即提高 QA 層級。

提供 iPhone Human QA 網址前，必須先以未登入的新連線實際確認：

- 網址直接顯示 Driver Pay Pro，不會導向 Vercel、GitHub 或其他服務的登入／警告頁。
- iPhone Safari 可透過公開 HTTPS 載入，不要求測試者建立第三方帳號。
- Manifest 與 Service Worker 可從相同來源正常取得。
- 指定手機 viewport 沒有水平 overflow，Console 沒有目前頁面的 error／warning。

部署平台僅回傳「分享網址已建立」不算驗證通過。若受保護的 Preview 分享連結
實測仍要求登入，必須改提供已實測可直接開啟的臨時公開 QA 網址，並清楚說明
有效期間及是否需要開發用電腦保持連線。

## Completion Status

Codex 完成程式後只能標示：

`Status: Ready for Human QA`

只有經過以下程序才能標示 Done：

- Acceptance Criteria 通過
- 本機 QA 通過
- iPhone Beta Test 通過
- 沒有 High Priority 問題
- Product Owner 確認

## Required Final Response

完成每個 Task 後必須回報：

1. 完成摘要
2. 修改檔案
3. 實際修改內容
4. 執行過的測試
5. 測試結果
6. 資料結構是否更動
7. localStorage key 是否更動
8. PWA 是否受影響
9. 已知問題
10. 人工 QA 步驟
11. `Status: Ready for Human QA`

不得只回答「已完成」。
