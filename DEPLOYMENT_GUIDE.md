# Canton Mutual Financial Limited - IT部署指南

## 概述

本文档为IT运维团队提供Canton Mutual Financial Limited测试网站的部署指南，包括环境配置、邮件服务设置、定时任务配置和AWS部署步骤。

---

## 目录

1. [系统要求](#系统要求)
2. [环境变量配置](#环境变量配置)
3. [邮件服务配置](#邮件服务配置)
4. [定时任务说明](#定时任务说明)
5. [AWS部署步骤](#aws部署步骤)
6. [测试验证](#测试验证)
7. [故障排除](#故障排除)

---

## 系统要求

### 运行环境
- **Node.js**: 22.x 或更高版本
- **数据库**: MySQL 8.0 或 TiDB（兼容MySQL协议）
- **操作系统**: Linux (Ubuntu 22.04推荐) 或 macOS
- **内存**: 最低2GB，推荐4GB
- **存储**: 最低10GB可用空间

### 依赖服务
- SMTP邮件服务（SendGrid / AWS SES / Gmail）
- MySQL数据库（用于存储AI Chatbot对话记录）
- 可选：AWS S3（用于文件存储）

---

## 环境变量配置

### 必需的环境变量

创建`.env`文件并配置以下变量：

```bash
# 数据库连接
DATABASE_URL=mysql://username:password@host:port/database_name

# JWT密钥（用于会话管理）
JWT_SECRET=your-random-secret-key-here

# 应用基本信息
VITE_APP_TITLE=Canton Mutual Financial Limited - Test Site
VITE_APP_LOGO=/logo.png

# SMTP邮件服务配置（必需）
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 可选：自定义发件人邮箱
SMTP_FROM=noreply@cmfinancial.com

# 可选：自定义收件人邮箱（默认为customer-services@cmfinancial.com）
REPORT_EMAIL_TO=customer-services@cmfinancial.com

# 可选：自定义定时任务时间（默认为每天18:00 HKT）
DAILY_REPORT_CRON=0 0 18 * * *
```

### 环境变量说明

| 变量名 | 说明 | 示例值 | 是否必需 |
|--------|------|--------|----------|
| `DATABASE_URL` | MySQL数据库连接字符串 | `mysql://user:pass@host:3306/db` | ✅ 必需 |
| `JWT_SECRET` | JWT签名密钥 | `random-secret-key-123` | ✅ 必需 |
| `SMTP_HOST` | SMTP服务器地址 | `smtp.sendgrid.net` | ✅ 必需 |
| `SMTP_PORT` | SMTP服务器端口 | `587` | ✅ 必需 |
| `SMTP_USER` | SMTP用户名 | `apikey` | ✅ 必需 |
| `SMTP_PASS` | SMTP密码或API Key | `SG.xxx...` | ✅ 必需 |
| `SMTP_FROM` | 发件人邮箱地址 | `noreply@cmfinancial.com` | ⚪ 可选 |
| `REPORT_EMAIL_TO` | 报告收件人邮箱 | `customer-services@cmfinancial.com` | ⚪ 可选 |
| `DAILY_REPORT_CRON` | 定时任务Cron表达式 | `0 0 18 * * *` | ⚪ 可选 |

---

## 邮件服务配置

### 选项1：使用SendGrid（推荐）

**优势**：免费额度充足（每天100封），稳定可靠，易于配置

**配置步骤**：

1. 注册SendGrid账户：https://sendgrid.com/
2. 创建API Key：
   - 登录SendGrid控制台
   - 导航到 Settings > API Keys
   - 点击 "Create API Key"
   - 选择 "Full Access" 权限
   - 复制生成的API Key（以`SG.`开头）

3. 配置环境变量：
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

4. 验证发件人邮箱（可选但推荐）：
   - 导航到 Settings > Sender Authentication
   - 添加并验证发件人邮箱地址
   - 设置`SMTP_FROM`为已验证的邮箱

### 选项2：使用AWS SES

**优势**：与AWS生态集成良好，适合已使用AWS服务的场景

**配置步骤**：

1. 在AWS SES控制台创建SMTP凭证：
   - 打开AWS SES控制台
   - 选择区域（如us-east-1）
   - 导航到 SMTP Settings
   - 点击 "Create SMTP Credentials"
   - 下载SMTP用户名和密码

2. 验证发件人邮箱：
   - 导航到 Email Addresses
   - 点击 "Verify a New Email Address"
   - 输入邮箱并完成验证

3. 配置环境变量：
```bash
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=AKIAIOSFODNN7EXAMPLE
SMTP_PASS=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
SMTP_FROM=verified-email@cmfinancial.com
```

### 选项3：使用Gmail（仅用于测试）

**注意**：Gmail不推荐用于生产环境，每日发送限制为500封

**配置步骤**：

1. 启用两步验证：https://myaccount.google.com/security
2. 生成应用专用密码：https://myaccount.google.com/apppasswords
3. 配置环境变量：
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
```

---

## 定时任务说明

### 每日AI Chatbot对话记录报告

**功能**：自动生成并发送AI Chatbot的每日对话记录报告

**默认配置**：
- **执行时间**：每天18:00（香港时间）
- **收件人**：customer-services@cmfinancial.com
- **报告格式**：Excel文件（.xlsx）
- **报告内容**：
  - 对话ID
  - 用户消息
  - AI回复
  - 语言（繁体中文/English）
  - 时间戳

### 自定义定时任务时间

通过`DAILY_REPORT_CRON`环境变量自定义执行时间：

```bash
# Cron表达式格式：秒 分 时 日 月 周

# 示例1：每天09:00执行
DAILY_REPORT_CRON=0 0 9 * * *

# 示例2：每天18:00执行（默认值）
DAILY_REPORT_CRON=0 0 18 * * *

# 示例3：每天17:30执行
DAILY_REPORT_CRON=0 30 17 * * *

# 示例4：每周一09:00执行
DAILY_REPORT_CRON=0 0 9 * * 1
```

### Cron表达式说明

| 位置 | 字段 | 允许值 | 特殊字符 |
|------|------|--------|----------|
| 1 | 秒 | 0-59 | `*` `,` `-` `/` |
| 2 | 分 | 0-59 | `*` `,` `-` `/` |
| 3 | 时 | 0-23 | `*` `,` `-` `/` |
| 4 | 日 | 1-31 | `*` `,` `-` `/` `?` |
| 5 | 月 | 1-12 | `*` `,` `-` `/` |
| 6 | 周 | 0-7 (0和7都表示周日) | `*` `,` `-` `/` `?` |

---

## AWS部署步骤

### 1. 准备工作

**1.1 安装AWS CLI**
```bash
# Ubuntu/Debian
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# 配置AWS凭证
aws configure
```

**1.2 创建数据库（RDS MySQL）**
```bash
# 通过AWS控制台创建RDS MySQL实例
# 或使用AWS CLI：
aws rds create-db-instance \
  --db-instance-identifier canton-financial-db \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --master-username admin \
  --master-user-password YourPassword123 \
  --allocated-storage 20

# 获取数据库连接字符串
aws rds describe-db-instances \
  --db-instance-identifier canton-financial-db \
  --query 'DBInstances[0].Endpoint.Address'
```

### 2. 部署应用到EC2

**2.1 创建EC2实例**
```bash
# 启动EC2实例（Ubuntu 22.04）
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.small \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxxxxxx \
  --subnet-id subnet-xxxxxxxxx
```

**2.2 连接到EC2并部署**
```bash
# SSH连接到EC2
ssh -i your-key.pem ubuntu@ec2-xx-xx-xx-xx.compute.amazonaws.com

# 安装Node.js 22.x
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装pnpm
npm install -g pnpm

# 克隆代码（或上传代码包）
git clone <your-repository-url>
cd canton-financial-test

# 安装依赖
pnpm install

# 配置环境变量
nano .env
# （粘贴环境变量配置）

# 构建生产版本
pnpm run build

# 使用PM2运行应用
sudo npm install -g pm2
pm2 start dist/index.js --name canton-financial
pm2 save
pm2 startup
```

### 3. 配置负载均衡器（可选）

```bash
# 创建Application Load Balancer
aws elbv2 create-load-balancer \
  --name canton-financial-alb \
  --subnets subnet-xxxxxxxx subnet-yyyyyyyy \
  --security-groups sg-xxxxxxxxx

# 创建目标组
aws elbv2 create-target-group \
  --name canton-financial-targets \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-xxxxxxxxx

# 注册EC2实例到目标组
aws elbv2 register-targets \
  --target-group-arn <target-group-arn> \
  --targets Id=<ec2-instance-id>
```

### 4. 配置域名（可选）

```bash
# 在Route 53创建A记录指向ALB
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "test.cmfinancial.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "<alb-hosted-zone-id>",
          "DNSName": "<alb-dns-name>",
          "EvaluateTargetHealth": false
        }
      }
    }]
  }'
```

---

## 测试验证

### 1. 验证SMTP配置

**方法1：使用tRPC API（推荐）**
```typescript
// 在浏览器控制台或Postman中调用
const result = await fetch('/api/trpc/email.verifyConfig', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
});
console.log(await result.json());

// 预期输出：
// {
//   "configured": true,
//   "message": "SMTP configuration is valid and ready to send emails"
// }
```

**方法2：手动发送测试报告**
```typescript
// 在浏览器控制台调用
const result = await fetch('/api/trpc/email.triggerDailyReport', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
});
console.log(await result.json());

// 预期输出：
// {
//   "success": true,
//   "message": "每日報告已成功生成並發送"
// }
```

### 2. 验证定时任务

**检查定时任务状态**
```bash
# 查看应用日志
pm2 logs canton-financial

# 预期看到类似日志：
# [Scheduler] Daily report scheduled at: 0 0 18 * * * (Hong Kong Time)
# [Scheduler] All scheduled tasks initialized successfully
```

**手动触发定时任务**
```bash
# 方法1：通过API触发
curl -X POST http://localhost:3000/api/trpc/email.triggerDailyReport

# 方法2：在服务器上直接调用
node -e "
const { triggerDailyReportManually } = require('./dist/scheduler.js');
triggerDailyReportManually().then(console.log);
"
```

### 3. 验证数据库连接

```bash
# 测试数据库连接
mysql -h <database-host> -u <username> -p<password> <database-name>

# 查看chatLogs表
USE canton_financial;
SHOW TABLES;
SELECT COUNT(*) FROM chatLogs;
```

### 4. 验证AI Chatbot功能

1. 打开网站首页
2. 点击右下角的AI Chatbot图标
3. 发送测试消息
4. 验证AI回复是否正常
5. 检查数据库中是否记录了对话：
```sql
SELECT * FROM chatLogs ORDER BY createdAt DESC LIMIT 5;
```

---

## 故障排除

### 问题1：邮件发送失败

**症状**：定时任务执行但邮件未收到

**排查步骤**：
1. 检查SMTP配置是否正确：
```bash
# 查看环境变量
echo $SMTP_HOST
echo $SMTP_PORT
echo $SMTP_USER
```

2. 检查应用日志：
```bash
pm2 logs canton-financial | grep -i email
```

3. 验证SMTP凭证：
```bash
# 使用telnet测试SMTP连接
telnet smtp.sendgrid.net 587
```

4. 检查发件人邮箱是否已验证（SendGrid/AWS SES）

**常见错误**：
- `Error: Invalid login: 535 Authentication failed`
  - 原因：SMTP用户名或密码错误
  - 解决：检查`SMTP_USER`和`SMTP_PASS`是否正确

- `Error: connect ETIMEDOUT`
  - 原因：网络连接超时或端口被防火墙阻止
  - 解决：检查安全组规则，允许出站587端口

### 问题2：定时任务未执行

**症状**：到了预定时间但任务未运行

**排查步骤**：
1. 检查Cron表达式是否正确：
```bash
echo $DAILY_REPORT_CRON
```

2. 验证时区设置：
```bash
# 检查服务器时区
timedatectl

# 预期输出应包含：
# Time zone: Asia/Hong_Kong (HKT, +0800)
```

3. 检查应用是否正常运行：
```bash
pm2 status
pm2 logs canton-financial
```

**解决方案**：
- 如果时区不正确，设置为香港时区：
```bash
sudo timedatectl set-timezone Asia/Hong_Kong
pm2 restart canton-financial
```

### 问题3：数据库连接失败

**症状**：应用启动失败或AI Chatbot无法保存对话

**排查步骤**：
1. 检查`DATABASE_URL`格式：
```bash
# 正确格式：
# mysql://username:password@host:port/database_name

echo $DATABASE_URL
```

2. 测试数据库连接：
```bash
mysql -h <host> -P <port> -u <username> -p<password> <database_name>
```

3. 检查安全组规则：
   - 确保EC2实例可以访问RDS实例的3306端口
   - 在RDS安全组中添加EC2安全组为入站规则

**解决方案**：
- 更新RDS安全组入站规则：
```bash
aws ec2 authorize-security-group-ingress \
  --group-id <rds-security-group-id> \
  --protocol tcp \
  --port 3306 \
  --source-group <ec2-security-group-id>
```

### 问题4：市场行情栏数据不显示

**症状**：市场行情栏显示"市場數據暫時不可用"

**原因**：Yahoo Finance API限流（429错误）

**解决方案**：
- 系统已实现三层数据保障：
  1. 实时API数据
  2. 服务端5分钟缓存
  3. 静态fallback数据

- 如果长时间无数据，检查：
```bash
# 查看市场数据API日志
pm2 logs canton-financial | grep -i market

# 清除客户端缓存并刷新页面
# 在浏览器控制台执行：
localStorage.removeItem('market_ticker_data');
localStorage.removeItem('market_ticker_timestamp');
location.reload();
```

---

## 部署检查清单

部署前请确认以下项目：

### 环境配置
- [ ] `.env`文件已创建并配置所有必需变量
- [ ] `DATABASE_URL`已正确配置并测试连接
- [ ] `JWT_SECRET`已设置为随机字符串
- [ ] SMTP配置已完成并验证

### 数据库
- [ ] RDS MySQL实例已创建
- [ ] 数据库表已创建（运行`pnpm db:push`）
- [ ] 安全组规则已配置，允许EC2访问RDS

### 应用部署
- [ ] Node.js 22.x已安装
- [ ] 依赖包已安装（`pnpm install`）
- [ ] 生产构建已完成（`pnpm run build`）
- [ ] PM2已安装并配置自动启动
- [ ] 应用已启动并运行正常

### 邮件服务
- [ ] SMTP服务提供商已选择（SendGrid/AWS SES/Gmail）
- [ ] SMTP凭证已创建
- [ ] 发件人邮箱已验证（如需要）
- [ ] 测试邮件已成功发送

### 定时任务
- [ ] 定时任务Cron表达式已配置
- [ ] 服务器时区已设置为Asia/Hong_Kong
- [ ] 定时任务已在日志中确认启动
- [ ] 手动触发测试已成功

### 网络和安全
- [ ] 安全组规则已配置（允许80/443端口入站）
- [ ] SSL证书已配置（如使用HTTPS）
- [ ] 域名DNS记录已配置（如需要）
- [ ] 负载均衡器已配置（如需要）

### 测试验证
- [ ] 网站首页可正常访问
- [ ] AI Chatbot功能正常
- [ ] 市场行情栏数据正常显示
- [ ] 对话记录已保存到数据库
- [ ] 邮件报告已成功发送

---

## 联系支持

如遇到部署问题，请联系：

- **技术支持邮箱**：it-support@cmfinancial.com
- **项目负责人**：[项目经理姓名]
- **紧急联系电话**：+852 xxxx xxxx

---

## 附录

### A. 常用命令速查

```bash
# 应用管理
pm2 start dist/index.js --name canton-financial
pm2 stop canton-financial
pm2 restart canton-financial
pm2 logs canton-financial
pm2 status

# 数据库操作
pnpm db:push                    # 推送schema到数据库
mysql -h <host> -u <user> -p    # 连接数据库

# 查看日志
tail -f /var/log/pm2/canton-financial-out.log
tail -f /var/log/pm2/canton-financial-error.log

# 测试邮件
curl -X POST http://localhost:3000/api/trpc/email.triggerDailyReport

# 查看环境变量
printenv | grep SMTP
printenv | grep DATABASE
```

### B. 性能优化建议

1. **启用Gzip压缩**：减少传输数据量
2. **配置CDN**：加速静态资源加载
3. **数据库连接池**：优化数据库连接管理
4. **Redis缓存**：缓存热点数据（可选）
5. **负载均衡**：多实例部署提高可用性

### C. 备份策略

1. **数据库备份**：
   - 每日自动备份RDS数据库
   - 保留最近30天的备份

2. **代码备份**：
   - 使用Git版本控制
   - 定期推送到远程仓库

3. **配置备份**：
   - 备份`.env`文件到安全位置
   - 文档化所有环境变量

---

**文档版本**：1.0  
**最后更新**：2024年12月17日  
**维护者**：Canton Mutual Financial Limited IT Team
