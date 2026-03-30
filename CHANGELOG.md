# CHANGELOG - Canton Mutual Financial Limited 官網

所有版本升級記錄，供審計和查詢之用。

---

## v-20260330-135448 (2026-03-30)

**部署環境：** AWS Elastic Beanstalk (ap-southeast-1)
**部署時間：** 2026-03-30 13:55 HKT
**部署狀態：** ✅ 成功 (Health: Green)
**審批人：** David (Xintao Luo)
**操作人：** Nova (AI Dev)

### 新增功能
- **反欺詐聲明彈窗** — 首頁新增重要聲明彈窗，提醒公眾防範冒用公司名義的詐騙活動
  - 中英文雙語支持，根據網站語言自動切換顯示
  - 首次訪問自動彈出
  - 關閉後右上角保留 ⚠️ 浮動圖標，用戶可隨時重新打開
  - 浮動圖標帶脈衝動畫提示

### 聲明要點
1. 公司為香港註冊、SFC 監管的持牌機構（1、4、9 號牌照）
2. 從未授權第三方以公司名義銷售，從未發行任何 App
3. 不設任何對外銷售工牌
4. 所有官方資訊僅通過 www.cmfinancial.com 發佈
5. 有疑問請通過官網聯繫方式以正式郵件查詢
6. 建議向香港警務處或 SFC 舉報可疑活動

### 涉及文件
- `client/src/components/FraudWarningDialog.tsx` (新增)
- `client/src/pages/Home.tsx` (修改 — 引入彈窗組件)

### Git Commits
- `93321e4` feat: add anti-fraud warning dialog on homepage
- `51daa6a` fix: update official website URL to www.cmfinancial.com
- `ca78e99` feat: floating warning icon after dismiss + language-aware content
- `3fdaf27` fix: move warning icon lower to avoid blocking ticker update button

---

## v-20260312-183852 (2026-03-12)

**部署環境：** AWS Elastic Beanstalk (ap-southeast-1)
**部署時間：** 2026-03-12 18:38 HKT
**部署狀態：** ✅ 成功

### 變更內容
- `08200a1` fix: improve language selector contrast in navbar & bump version
- `6ffaf44` fix: use direct Yahoo Finance API for market data & bump version
- `d7703f8` fix: NewsPopover expand cutoff via portal & bump version
- `ae93afc` chore: update version to v1.0.260312.002
- `53ed224` feat: improve news popover with hover delay and expand feature
- `6b30be4` fix: support both S3_BUCKET_NAME and AWS_S3_BUCKET env vars
- `2917239` fix: improve console UI contrast and image display
- `7cc5468` chore: add Elastic Beanstalk deployment scripts
- `60dc1a0` chore: add version number to footer v1.0.260312.001
- `2ce699e` docs+chore: add AWS static deploy script and make analytics optional
- `dd72502` chore: remove Manus leftovers (hosts/.manus) and hardcoded sandbox paths
- `79d08b3` feat: add admin init endpoint to create DB tables

---

_此文件由開發團隊維護，每次生產環境部署時更新。_
