# Driver Pay Pro — Reports V1 Human QA

Version: 1.0

Updated: 2026-07-26

Status: Passed — Product Owner L3 Module Human QA

## Scope

本清單只執行一次，涵蓋週報、月報、平台、Calendar drill-down、返回 context、
record-change refresh、Offline、installed PWA、VoiceOver、responsive 與 safe
area。Product Owner 已依本清單完成驗收。

測試資料只使用 QA 網址所在瀏覽器的 localStorage；不要在正式站建立測試紀錄。

## L3 Human QA Steps

1. 用未登入的 iPhone Safari 開啟本次 QA 網址，確認直接看到 Driver Pay Pro，
   沒有 Vercel／GitHub 登入頁、白畫面或警告頁。
2. 開啟「報表」，確認預設是「週報」，週期為星期一至星期日完整七天。
3. 切換上一週、下一週與「本週」，確認期間與 KPI 同步，沒有日期少一天。
4. 檢查週報總收入、淨收入、支出、工作天數、工作時間與平均時薪；零工時
   不得出現 `Infinity`、`NaN` 或異常巨大工時。
5. 檢查「與上期比較」及七日淨收入趨勢；無紀錄與已儲存 `$0` 必須可區分。
6. 切換「月報」，測試上一月、下一月與「本月」，確認顯示完整曆月。
7. 檢查月報 KPI、上月比較、Monday-first 週趨勢及重要日期；跨月週不得混入
   選定月份以外的收入。
8. 切換「平台」，測試「本週／本月」，確認平台總額、排行、收入與占比完整。
9. 確認小費不被列為平台，未歸因收入使用中性說明，且沒有「效率」、
   「最佳平台」或「平台時薪」等誤導用語。
10. 點週報或月報的重要日期，確認 Calendar 開啟精確日期、工作紀錄卡片正確，
    且不自動開啟編輯器或建立空紀錄。
11. 返回「報表」，確認原本的週報／月報 Tab、期間與合理捲動位置仍保留。
12. 在 Calendar 建立或編輯一筆過去日期測試紀錄，返回 Reports，確認 KPI、
    趨勢、重要日期與平台排行不需重新載入就更新；完成後刪除測試紀錄。
13. 在 Today 修改一筆當日平台收入，返回 Reports，確認數字立即更新；測試後
    將金額改回原值。
14. 開啟飛航模式或中斷網路後重新進入 Reports，確認本機週報、月報、平台與
    Calendar drill-down仍可查看，且只顯示低干擾離線提示。
15. 將 App 加入主畫面並以 installed PWA 開啟；關閉後重開，確認 Reports
    正常、資料保留、Bottom Navigation 與 safe area 沒有遮住內容。
16. 開啟 VoiceOver，確認 Reports tabs、期間按鈕、KPI、比較、趨勢、排行與
    重要日期能理解；平台 bar 不是唯一資訊。
17. 開啟「減少動態效果」，確認功能仍完整，沒有不必要動畫；放大文字後重要
    控制與金額仍可讀。
18. 最後確認 Safari 與 PWA 都沒有水平捲動、內容裁切、鍵盤／原生 input 回歸、
    白畫面或其他阻擋性錯誤。

## Result

- [x] iPhone Safari passed
- [x] Installed PWA passed
- [x] Offline passed
- [x] VoiceOver passed
- [x] Reduced Motion passed
- [x] Safe area and responsive passed
- [x] No High Priority issue
- [x] Product Owner confirmed

Product Owner confirmation date: 2026-07-26

Reports UX Freeze Version 1: Active.
