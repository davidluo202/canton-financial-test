# 🚀 CMF 官网迁移计划
## 方案 B：Vercel（测试）+ Railway（生产）+ Cloudflare（CDN/WAF）

**版本：** 1.0  
**日期：** 2026-02-27  
**当前托管：** AWS EC2 + S3  
**目标架构：** Vercel Preview + Railway Production + Cloudflare Front

---

## 架构总览

```
开发者 → GitHub Push
              │
              ├─→ PR/分支 → Vercel 自动预览 (测试环境)
              │
              └─→ main 分支 → Railway 自动部署 (生产环境)
                                    │
                              Cloudflare CDN/WAF
                                    │
                               用户访问
```

---

## 服务对照表

| 组件 | 现在 (AWS) | 迁移后 | 备注 |
|------|-----------|--------|------|
| 应用服务器 | EC2 | Railway | 无需改代码 |
| 图片存储 | AWS S3 | Cloudflare R2 | S3兼容API，代码改动极小 |
| 数据库 | MySQL (EC2本地/RDS) | Railway MySQL | 导出导入 |
| CDN/WAF | 无 | Cloudflare | 免费计划够用 |
| 邮件 | AWS SES / SendGrid | 保持 SendGrid | 无需改变 |
| 测试环境 | 无 | Vercel | 自动 PR 预览 |

---

## 阶段一：准备工作（1-2天）

### 1.1 账号注册
- [ ] 注册 [Railway](https://railway.app)（生产部署）
- [ ] 注册 [Vercel](https://vercel.com)（测试预览）
- [ ] 注册 [Cloudflare](https://cloudflare.com)（CDN/WAF）
- [ ] 注册 [Cloudflare R2](https://cloudflare.com/r2)（图片存储，替换S3）

### 1.2 域名迁移到 Cloudflare
1. 登录 Cloudflare → Add a Site → 输入 `cmfinancial.com`
2. Cloudflare 会扫描现有 DNS 记录
3. 在域名注册商处将 NS 改为 Cloudflare 提供的 NS（约 24h 生效）
4. 启用 Cloudflare Proxy（橙色云朵）— 隐藏真实 IP

---

## 阶段二：Railway 生产部署（1天）

### 2.1 创建 Railway 项目
1. Railway Dashboard → New Project → Deploy from GitHub
2. 选择 `canton-financial-test` 仓库
3. 设置 root directory 为 `/`（项目根目录）

### 2.2 添加 MySQL 数据库
1. Railway Dashboard → Add Service → MySQL
2. Railway 自动生成 `DATABASE_URL`
3. 在项目的 Variables 中会自动注入

### 2.3 数据库迁移
```bash
# 1. 从 AWS 导出现有数据
mysqldump -h <AWS_HOST> -u <USER> -p <DB_NAME> > backup.sql

# 2. 导入到 Railway MySQL
mysql -h <RAILWAY_HOST> -u <USER> -p <DB_NAME> < backup.sql

# 3. 运行 Drizzle 迁移确保 schema 最新
pnpm db:push
```

### 2.4 配置环境变量（Railway Variables）
```env
NODE_ENV=production
DATABASE_URL=<Railway自动提供>
JWT_SECRET=<生成一个强随机字符串，至少32位>
OWNER_OPEN_ID=<Manus OAuth ID>
OAUTH_SERVER_URL=<Manus OAuth URL>
BUILT_IN_FORGE_API_URL=<如果需要AI功能>
BUILT_IN_FORGE_API_KEY=<如果需要AI功能>

# 图片存储（阶段三配置 Cloudflare R2 后填入）
AWS_ACCESS_KEY_ID=<R2 Access Key>
AWS_SECRET_ACCESS_KEY=<R2 Secret Key>
AWS_S3_BUCKET=<R2 Bucket Name>
AWS_REGION=auto
AWS_S3_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com

# 邮件（保持 SendGrid）
SENDGRID_API_KEY=<现有 Key>
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=<SendGrid API Key>
```

### 2.5 Railway 构建配置
Railway 会自动识别 `package.json`，但需要在 Railway 设置：
- **Build Command:** `pnpm install && pnpm build`
- **Start Command:** `pnpm start`
- **Node Version:** 20.x

---

## 阶段三：Cloudflare R2 替换 AWS S3（半天）

R2 兼容 S3 API，代码改动极小。

### 3.1 创建 R2 Bucket
1. Cloudflare Dashboard → R2 → Create Bucket
2. Bucket 名称：`cmfinancial-images`
3. 创建 API Token（R2 专用）→ 获得 Access Key + Secret Key

### 3.2 代码修改（server/storage-s3.ts）
```typescript
// 仅需修改 S3Client 配置，添加 endpoint
s3Client = new S3Client({
  region: "auto",  // R2 使用 "auto"
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
```

### 3.3 迁移现有图片
```bash
# 使用 rclone 从 AWS S3 迁移到 R2
rclone copy s3:cmfinancial-bucket r2:cmfinancial-images
```

---

## 阶段四：Cloudflare 安全配置（半天）

### 4.1 SSL/TLS 设置
- SSL/TLS → 模式设置为 **Full (Strict)**
- Edge Certificates → 开启 **Always Use HTTPS**
- 开启 **HSTS**（max-age=31536000）

### 4.2 WAF 规则（免费版）
Cloudflare → Security → WAF：
- 开启 **Managed Rules**（OWASP 规则集）
- 开启 **Bot Fight Mode**
- Security Level → **Medium**

### 4.3 自定义 WAF 规则
```
规则1：封锁恶意 User-Agent
  条件：http.user_agent contains "sqlmap" OR "nikto" OR "nmap"
  动作：Block

规则2：保护后台路由
  条件：http.request.uri.path contains "/dashboard" OR "/console"
    AND NOT ip.src in {你的办公室IP}
  动作：Challenge（需要通过 Cloudflare 人机验证）

规则3：API Rate Limit
  条件：http.request.uri.path contains "/api/"
  动作：Rate Limit（每分钟超过100次 → Block 1分钟）
```

### 4.4 DNS 配置
```
A    @         → Railway IP    (Proxied ✅)
A    www       → Railway IP    (Proxied ✅)
CNAME api      → Railway域名   (Proxied ✅)
```

---

## 阶段五：Vercel 测试环境（半天）

### 5.1 连接 GitHub
1. Vercel Dashboard → New Project → 选择 `canton-financial-test`
2. Framework Preset: **Vite**（但这是全栈项目，需要特殊配置）

### 5.2 Vercel 配置（vercel.json）
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist/public",
  "framework": null,
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://测试Railway环境.railway.app/api/$1" }
  ]
}
```
> Vercel 前端 → 代理到 Railway 测试环境的 API

### 5.3 分支策略
```
main        → Railway 生产环境自动部署
develop     → Railway 测试环境 + Vercel 预览
feature/*   → Vercel PR 预览（自动生成临时URL）
```

---

## 阶段六：安全加固代码改动（1天）

### 6.1 添加安全响应头（server/_core/index.ts）
```typescript
import helmet from 'helmet';

// 添加 helmet 中间件（安全响应头）
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],  // React 需要
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "*.r2.cloudflarestorage.com"],
      connectSrc: ["'self'", "wss:", "*.finnhub.io"],
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true }
}));
```

### 6.2 添加 Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

// API 全局限流
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,   // 1分钟
  max: 100,               // 最多100次
  message: { error: 'Too many requests' }
});

// AI 聊天接口更严格
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Chat rate limit exceeded' }
});

app.use('/api/', apiLimiter);
app.use('/api/chatbot', chatLimiter);
```

### 6.3 JWT Cookie 安全
```typescript
// 确保 Cookie 设置安全标志
res.cookie('token', jwt, {
  httpOnly: true,      // JS 无法读取
  secure: true,        // 仅 HTTPS
  sameSite: 'strict',  // CSRF 防护
  maxAge: 7 * 24 * 60 * 60 * 1000
});
```

### 6.4 文件上传安全（server/uploadRouter.ts）
```typescript
// 限制文件类型和大小
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

if (!ALLOWED_TYPES.includes(file.type)) {
  throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid file type' });
}
if (file.size > MAX_SIZE) {
  throw new TRPCError({ code: 'BAD_REQUEST', message: 'File too large' });
}
```

---

## 迁移时间线

| 阶段 | 任务 | 时间 | 负责 |
|------|------|------|------|
| 准备 | 注册账号、域名迁到Cloudflare | Day 1 上午 | David |
| 阶段二 | Railway 部署 + 数据库迁移 | Day 1 下午 | Nova |
| 阶段三 | R2 替换 S3 | Day 2 上午 | Nova |
| 阶段四 | Cloudflare 安全配置 | Day 2 下午 | David + Nova |
| 阶段五 | Vercel 测试环境 | Day 3 上午 | Nova |
| 阶段六 | 安全加固代码 | Day 3 下午 | Nova |
| 验证 | 全站测试 + DNS 切换 | Day 4 | 双方 |

**总计：约 4 个工作日**

---

## 切换前检查清单

- [ ] Railway 生产环境所有功能正常
- [ ] 数据库数据完整迁移
- [ ] 所有图片在 R2 可正常访问
- [ ] 邮件发送功能正常
- [ ] 市场行情 WebSocket 正常
- [ ] 后台 Console / Dashboard 正常
- [ ] Cloudflare WAF 规则不误拦截正常请求
- [ ] HTTPS 证书有效
- [ ] 旧 AWS 环境保留 7 天作为回滚备份

---

## 费用估算（月）

| 服务 | 费用 |
|------|------|
| Railway（Hobby Plan）| $5/月 |
| Cloudflare（Free Plan）| $0 |
| Cloudflare R2（< 10GB）| $0 |
| Vercel（Hobby Plan）| $0 |
| SendGrid（免费额度）| $0 |
| **合计** | **~$5/月** |

对比 AWS EC2 + S3 通常 **$30-80/月**，节省显著。

---

## 回滚方案

如果迁移后发现问题：
1. Cloudflare DNS → 把 A 记录改回 AWS IP（约 5 分钟生效）
2. 保留 AWS 环境运行 7 天，确认无误后关闭

---

*文档由 Nova (CMF Coding Bot) 生成于 2026-02-27*
