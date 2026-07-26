# Driver Pay Pro

Driver Pay Pro 是為多元計程車與職業駕駛設計的手機優先收入、工時、支出與營運分析 PWA。

## Project Documentation

開始接手或修改專案時，建議依序閱讀：

- [Codex Instructions](AGENTS.md)：所有 Codex 工作都必須遵守的核心執行、安全與驗證規則。
- [Product Guide](docs/PRODUCT_GUIDE.md)：產品定位、目標使用者、產品價值、MVP 與 Backlog。
- [Product Specification](docs/PRODUCT_SPEC.md)：正式產品邊界、頁面責任與跨頁資料契約。
- [Calendar Specification](docs/CALENDAR_SPEC.md)：Calendar 正式互動、資料與驗收契約。
- [Reports Specification](docs/REPORTS_SPEC.md)：Reports 正式期間、KPI、比較、趨勢、平台與驗收契約。
- [AI Specification](docs/AI_SPEC.md)：唯讀 AI、canonical analytics 與證據式洞察契約。
- [Driver Specification](docs/DRIVER_SPEC.md)：既有持久設定與本機 App 狀態契約。
- [V1 Integration Specification](docs/INTEGRATION_SPEC.md)：跨頁資料、refresh 與 local-first 契約。
- [V1 Human QA](docs/V1_HUMAN_QA.md)：單次 Local-first V1 L3 驗收清單。
- [V1 Release](docs/V1_RELEASE.md)：Release Gate、Production 與 rollback 流程。
- [Design Kit](docs/DESIGN_KIT.md)：Mobile First、UI／UX、互動、響應式與品牌規範。
- [Development Handbook](docs/DEVELOPMENT_HANDBOOK.md)：Sprint、PRD、開發、QA、Beta 與發布流程。
- [Decision Log](docs/DECISION_LOG.md)：重要產品與工程決策、理由及影響。

實作與現況參考：

- [Project Specification](docs/PROJECT_SPEC.md)：App 定位、開發理念、架構、資料模型、頁面與計算規格。
- [UI Guidelines](docs/UI_GUIDELINES.md)：色彩、字體、icon、卡片、進度條、響應式與互動規範。
- [Features](docs/FEATURES.md)：功能架構、已完成／未提交／開發中功能與限制。
- [Roadmap](docs/ROADMAP.md)：近期穩定工作、候選方向、發布門檻與待決策事項。
- [Changelog](docs/CHANGELOG.md)：依 Git commit 與目前工作目錄整理的變更紀錄。
- [AI Development Instructions](docs/AI_INSTRUCTIONS.md)：供 ChatGPT、Codex、Claude Code、Gemini 等 AI 工具遵守的專案規則。

補充背景文件：

- [Project Context](PROJECT_CONTEXT.md)：長期產品原則、已確認 UI 與不可回退設計。
- [Handoff](HANDOFF.md)：目前分支、Git 狀態、本輪進度與安全接手資訊。

## Development Commands

需要 Node.js 20.19、22.13 或 24 以上相容版本。首次使用執行：

```bash
npm install
```

常用命令：

```bash
npm run lint
npm test
npm run test:calendar
npm run test:reports
npm run test:ai
npm run test:driver
npm run test:integration
npm run validate:production
npm run build
npm run release:check
```

`npm run build` 是適合目前靜態 PWA 的 Production validation，不會建立
`dist` 或導入 bundler。Release 前必須使用 `npm run release:check`。

Design System 內部展示頁為 `/design-system.html`；它不在正式導覽，也不加入
Service Worker App Shell。

---

## Author

Designed & Developed by

Mark Hu

GitHub

https://github.com/superstar-boop

Designed to simplify everyday work.

© 2026 Mark Hu
