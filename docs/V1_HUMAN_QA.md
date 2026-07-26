# Driver Pay Pro — Local-first V1 Human QA

Status: Pending Product Owner L3
Updated: 2026-07-26

本清單只執行一次。L1 與公開 L2 Preview 已通過，現在由 Product Owner 使用
實體 iPhone Safari 與 installed PWA 完成。

QA URL：
`https://mystery-kijiji-publicity-tech.trycloudflare.com`

這是非 Production 的臨時公開 HTTPS tunnel。測試期間 Mac 必須保持開機、
網路連線，且不得關閉目前 Codex 工作或 tunnel；L3 結束後才停止。

## L3 Checklist

- [ ] 1. 未登入 iPhone Safari 可直接開啟 QA URL，沒有第三方登入或警告頁。
- [ ] 2. 今天、月曆、報表、AI、Driver 五個分頁都可正常開啟。
- [ ] 3. 320／390／393／430px 主要畫面沒有水平 overflow 或底部導覽遮擋。
- [ ] 4. Today 建立／更新今日紀錄後，Calendar、Reports 與 AI 顯示一致結果。
- [ ] 5. Calendar 過去紀錄新增、編輯、刪除與 rollback 行為維持既有 Freeze。
- [ ] 6. Reports 週／月／平台資料、期間、比較、趨勢與下鑽維持既有 Freeze。
- [ ] 7. AI 只顯示「營運建議／本月洞察／智慧提醒」三個主要區塊。
- [ ] 8. AI 建議有可讀依據；資料不足時不顯示虛假結論、Infinity 或 NaN。
- [ ] 9. AI 重要日期可到正確 Calendar 日期，且不自動開啟編輯器。
- [ ] 10. AI 與 Reports 對同一期間的收入、工時、時薪與平台結果一致。
- [ ] 11. Driver 修改每日目標後自動儲存，Today 立即顯示相同目標。
- [ ] 12. Driver 的本機資料與 App 狀態清楚，且明示沒有雲端／跨裝置同步。
- [ ] 13. 重新開啟 Safari／PWA 後，既有資料與每日目標仍保留。
- [ ] 14. 飛航模式可開啟 App Shell、讀取本機資料，恢復網路不覆蓋資料。
- [ ] 15. installed PWA 顯示最新版 v13 App Shell，safe area 與 standalone 正常。
- [ ] 16. VoiceOver、focus、44px touch target、Reduced Motion 與表單 label 可用。
- [ ] 17. 測試期間沒有白畫面、Console 阻擋性錯誤或 High Priority 問題。
- [ ] 18. 首頁收入、支出、工時、Calendar、Reports 與現有設定沒有 regression。

全部通過後請回覆：

`Driver Pay Pro V1 L3 全部通過`

未收到這句確認前，不得宣告 V1 Freeze、合併 `main` 或建立 Production
Deployment。
