# Driver Pay Pro Decision Log

本文件記錄已確認且會影響後續產品或工程工作的決策、理由與影響。它不是 commit 歷史；程式變更時間線請見 `docs/CHANGELOG.md`。

## D-001

- Date: 2026-07
- Decision: 主要族群設定為 20～50 歲職業與兼職司機。
- Reason: 符合主要實際使用者範圍。
- Impact: 介面強調快速閱讀與操作，不以高齡模式作為唯一設計基準。

## D-002

- Date: 2026-07
- Decision: 首頁核心操作為平台收入直接輸入。
- Reason: 司機最常在完成行程後快速更新平台收入。
- Impact: 不需先按新增收入或進入新頁面。

## D-003

- Date: 2026-07
- Decision: 採用 Mobile First 與 Apple-inspired UI。
- Reason: 主要使用設備為 iPhone，並降低學習成本。
- Impact: 優先使用熟悉的 iOS 互動與單手操作，但不複製 Apple 品牌素材。

## D-004

- Date: 2026-07
- Decision: 工作計時支援開始、暫停、繼續及收工。
- Reason: 午休或中途休息不應計入實際工時。
- Impact: 時薪以扣除休息後的實際工時計算。

## D-005

- Date: 2026-07
- Decision: 採用 Official Master Icon v1.0。
- Reason: 統一品牌素材，避免 Codex 自行生成或錯誤裁切。
- Impact: Header、PWA、Apple Touch Icon 與 Favicon 應使用正式圖檔。現況是 Header 已使用 Master Icon，但其他 PWA icon 路徑尚未全部統一；必須另立 PRD 並完成 PWA 驗證，不可在無關任務順便替換。

## D-006

- Date: 2026-07
- Decision: 開發完成後必須經過 iPhone Beta Test 才能標示 Done。
- Reason: Driver Pay Pro 的核心使用環境為 iPhone 與真實司機工作流程。
- Impact: Codex 完成後僅能標示 Ready for Human QA。

## D-007

- Date: 2026-07
- Decision: MVP 現階段採方案 A，以瀏覽器 `localStorage` 保存資料。
- Reason: 可維持零後端成本，並讓不同裝置／瀏覽器在同一網址進行彼此獨立的小規模測試。
- Impact: 核心 key 固定為 `driverPayApp.v2`；目前沒有登入、雲端備份或跨裝置同步，清除網站資料可能造成資料遺失。

## D-008

- Date: 2026-07
- Decision: 一般平台收入輸入新當日總額並覆蓋舊值；只有 Yoxi 加號新增單筆並累加。
- Reason: 一般平台適合直接修正日總額，Yoxi 則需要逐筆車資紀錄。
- Impact: 不得把所有平台改成自動累加；Yoxi 累計總額仍可直接修正。

## D-009

- Date: 2026-07
- Decision: 首頁主要 UI、平台收入設計與週報第一輪手機響應式成果進入凍結狀態。
- Reason: 已完成驗收方向，持續順手美化會增加回歸風險。
- Impact: 後續只允許依明確 PRD 修改指定小範圍，不得重做整頁。

## D-010

- Date: 2026-07
- Decision: 手機月份明細採單一外層面板中的精簡每日 row，桌面保留表格。
- Reason: 大幅減少手機捲動距離，同時保留桌面資料密度。
- Impact: 700px 以下不使用每日獨立卡片、展開功能或水平捲動；每日以細線分隔。

## D-011

- Date: 2026-07
- Decision: AI 分頁第一版採本機規則與統計，不接外部模型。
- Reason: 以現有資料提供可重現、零 API 成本的營運分析。
- Impact: 不加入聊天框、付費 AI API、API Key 或虛假 AI 連線宣稱；缺資料時顯示資料不足或空狀態。

## D-012

- Date: 2026-07
- Decision: 文件按「產品方向、設計規範、開發流程、決策、實作規格、功能狀態、變更歷史」分工。
- Reason: 避免同一規則散落於多份名稱相近文件，並保留產品與技術狀態的不同生命週期。
- Impact: 不另建同義文件；重複內容應整合並以交叉連結取代多份平行版本。
