# 公司官网 (canton-financial-test) 完整交接文档

**交接日期:** 2026-04-09  
**交接人:** Nova (Claude Opus 4.6)  
**接收人:** Claude (MC系统开发负责人)  
**备案人:** Icy (CEO)

---

## 1. 当前开发进度与已完成功能

### 已完成的核心功能
- **多语言网站**: 中英文双语切换 (NavBar语言选择器)
- **首页 (Home)**: Hero Section + 反欺诈弹窗 (FraudWarningDialog.tsx)
- **关于我们 (About Us)**: Overview, Our Values, Leadership
- **服务 (What We Do)**: FICC, 资产与财富管理, 投行服务
- **思想领导力 (Thought Leadership)**: Vision, Innovation, Credibility, Impact
- **职业发展 (Career)**: 招聘页面 + HR邮箱
- **联系我们 (Contact)**: 完整联系信息
- **AI ChatBot**: 集成在官网的AI客服 (AIChatbot.tsx, AIChatBox.tsx)
- **Dashboard**: 管理后台 (Console.tsx, Dashboard.tsx)
- **市场行情 (Market Ticker)**: 实时行情展示
- **新闻 (News)**: 新闻页面 + NewsPopover
- **邮件报告服务**: 每日报告自动发送 (emailService.ts, emailRouter.ts)

### 技术实现
- **前端**: React 19 + Vite + Tailwind CSS + Radix UI
- **后端**: Express + tRPC
- **数据库**: PostgreSQL (via Drizzle ORM)
- **存储**: AWS S3 (图片/文件)
- **邮件**: SendGrid / AWS SES / Gmail SMTP
- **市场数据**: Yahoo Finance API

---

## 2. Railway 测试环境

### 部署方式
- **平台:** Railway
- **状态:** 已部署 (需确认当前URL)
- **触发:** GitHub push 到 main 分支自动部署

### 环境变量
```
DATABASE_URL=postgresql://...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=...
```

---

## 3. AWS 生产环境

### 部署信息
| 项目 | 信息 |
|------|------|
| **平台** | AWS Elastic Beanstalk |
| **区域** | ap-southeast-1 |
| **应用名** | canton-financial |
| **环境名** | Canton-financial-web |
| **域名** | cmfinancial.com |
| **S3桶** | elasticbeanstalk-ap-southeast-1-971422711834 |

### 部署脚本
```bash
# 方式1: Shell脚本
./scripts/deploy-aws-eb.sh

# 方式2: PowerShell
.\scripts\deploy-aws-eb.ps1
```

### 版本格式
- 格式: `v-YYYYMMDD-HHMMSS`
- 示例: `v-20260330-135448`

### 版本记录 (CHANGELOG.md)
| 版本 | 日期 | 内容 |
|------|------|------|
| v-20260330-135448 | 2026-03-30 | 反欺诈弹窗 ✅ |
| v-20260312-183852 | 2026-03-12 | 多项修复 |
| ... | ... | ... |

### 回滚说明
```bash
# 查看历史版本
aws elasticbeanstalk describe-versions --application-name canton-financial

# 回滚到上一版本 (通过重新部署旧版本标签)
aws elasticbeanstalk update-environment \
  --environment-name Canton-financial-web \
  --version-label <previous-version-label>
```

---

## 4. 已集成的 Skills / Plugins / 外部能力

### 外部API
- **Yahoo Finance**: 市场行情数据
- **SendGrid / AWS SES**: 邮件发送
- **AWS S3**: 文件存储

### 内部集成
- **tRPC**: 类型安全的API层
- **Drizzle ORM**: PostgreSQL数据库操作
- **React Query**: 服务端状态管理
- **Radix UI**: 无障碍UI组件库
- **Framer Motion**: 动画效果

---

## 5. 代码结构总览

```
canton-financial-test/
├── client/                      # React前端
│   ├── src/
│   │   ├── components/           # UI组件
│   │   │   ├── AIChatbot.tsx    # AI聊天机器人
│   │   │   ├── AIChatBox.tsx    # AI聊天框
│   │   │   ├── FraudWarningDialog.tsx  # ⚠️ 反欺诈弹窗 (合规关键)
│   │   │   ├── MarketTicker.tsx  # 行情显示
│   │   │   ├── Navbar.tsx       # 导航栏
│   │   │   ├── Footer.tsx       # 页脚
│   │   │   └── ui/              # Radix UI 组件
│   │   ├── pages/               # 页面
│   │   │   ├── Home.tsx
│   │   │   ├── AboutUs.tsx
│   │   │   ├── Services.tsx     # What We Do
│   │   │   ├── Leadership.tsx    # Thought Leadership
│   │   │   ├── Career.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Dashboard.tsx    # 管理后台
│   │   │   └── Console.tsx
│   │   ├── hooks/               # React Hooks
│   │   ├── contexts/            # React Context
│   │   └── lib/                 # 工具库
│   └── index.css                # 全局样式
│
├── server/                      # Express后端
│   ├── _core/                   # 核心服务 (tRPC路由)
│   ├── chatbotRouter.ts         # AI聊天路由
│   ├── dashboardRouter.ts       # Dashboard路由
│   ├── emailRouter.ts           # 邮件路由
│   ├── emailService.ts          # 邮件服务
│   ├── marketRouter.ts          # 市场数据路由
│   ├── newsRouter.ts            # 新闻路由
│   ├── storage-s3.ts            # S3存储
│   └── db.ts                    # 数据库连接
│
├── scripts/                     # 部署脚本
│   ├── deploy-aws-eb.sh         # AWS EB部署 (Shell)
│   ├── deploy-aws-eb.ps1        # AWS EB部署 (PowerShell)
│   ├── deploy-aws-static.sh     # S3静态部署 (Shell)
│   └── deploy-aws-static.ps1    # S3静态部署 (PowerShell)
│
├── drizzle/                     # 数据库ORM
├── dist/                        # 编译输出
│
├── package.json                 # pnpm项目配置
├── vite.config.ts               # Vite配置
├── tsconfig.json                # TypeScript配置
│
├── HANDOVER.md                  # 本交接文档
├── CHANGELOG.md                 # 发布记录
├── DEPLOYMENT_GUIDE.md          # 部署指南
├── AWS_DEPLOYMENT_GUIDE.md      # AWS部署详解
├── ENV_VARIABLES_GUIDE.md       # 环境变量说明
├── SMTP_SETUP_GUIDE.md          # SMTP设置指南
└── AI_CHATBOT_README.md         # AI聊天机器人说明
```

---

## 6. 本地 Repo 路径

```
/Users/davidluo-bot/.openclaw/workspace-cmfcoding/canton-financial-test
```

---

## 7. GitHub Repo 路径

```
https://github.com/davidluo202/canton-financial-test
```

### Git 状态 (2026-04-09)
- **分支:** main
- **最新提交:** 2d29d69 - Add Venture Capital Star fraud warning statement
- **状态:** ✅ 与 origin/main 同步

---

## 8. 运行依赖与环境变量清单

### Node.js 依赖
- **Node:** v25.6.0
- **pnpm:** 10.4.1
- 详见 `package.json`

### 核心依赖
- react: ^19.1.1
- express: ^4.21.2
- @trpc/server: ^11.6.0
- drizzle-orm: ^0.45.1
- mysql2 / postgres
- @sendgrid/mail: ^8.1.6

### 生产环境变量
```bash
# 数据库
DATABASE_URL=postgresql://user:pass@host:5432/db

# AWS
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=ap-southeast-1
AWS_S3_BUCKET=...

# SMTP
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=...

# 应用
NODE_ENV=production
```

---

## 9. 风险、待补项、历史坑点

### ⚠️ 风险项
1. **反欺诈弹窗 (FraudWarningDialog.tsx)**: 合规关键组件，修改需谨慎
2. **SMTP配置**: 生产环境需使用SendGrid或AWS SES，Gmail SMTP有发送限制
3. **数据库连接**: 确保DATABASE_URL正确，EB环境变量配置易出错

### 📋 待补项 (from todo.md)
- [ ] 测试所有页面链接
- [ ] 测试响应式布局
- [ ] 测试多语言切换
- [ ] 优化页面加载性能
- [ ] 创建项目检查点

### 🐛 历史坑点
1. **Market Ticker 数据源**: 之前用Alpha Vantage不稳定，后改用Yahoo Finance直接API
2. **FraudWarningDialog 位置**: 曾因遮挡ticker更新按钮而调整位置
3. **NewsPopover**: 曾有展开截断问题，后改用Portal解决
4. **S3 bucket变量**: 支持`S3_BUCKET_NAME`和`AWS_S3_BUCKET`两种环境变量名

### 📝 注意事项
1. 每次推送**必须更新版本号** (在deploy脚本中自动生成)
2. 生产部署使用**AWS CLI + EB**，本机已配置凭证
3. 部署前先在**Railway测试环境**验证
4. **不要修改** openclaw.json

---

## 常用命令速查

```bash
# 开发
pnpm dev

# 构建
pnpm build

# 生产启动
pnpm start

# AWS生产部署
./scripts/deploy-aws-eb.sh
```

---

**交接完成，等待Claude确认接收。** ✅

---

*备案人: Icy*  
*交接日期: 2026-04-09*
