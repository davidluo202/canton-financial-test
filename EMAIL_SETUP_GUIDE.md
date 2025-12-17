# Canton Mutual Financial Limited - 邮箱服务配置快速指引

## 📧 IT人员专用 - 邮件发送功能设置指南

本文档为IT运维人员提供**快速配置**Canton Financial网站邮件发送功能的步骤指引。

---

## 📋 目录

1. [功能概述](#功能概述)
2. [配置前准备](#配置前准备)
3. [方案选择](#方案选择)
4. [配置步骤](#配置步骤)
   - [方案A：SendGrid（推荐）](#方案a-sendgrid推荐)
   - [方案B：AWS SES](#方案b-aws-ses)
   - [方案C：Gmail（仅测试）](#方案c-gmail仅测试)
5. [配置验证](#配置验证)
6. [故障排除](#故障排除)

---

## 功能概述

Canton Financial网站的AI Chatbot每日对话记录报告功能需要配置SMTP邮件服务，用于：

- **每日自动发送**：每天18:00（香港时间）自动生成并发送对话记录Excel报告
- **收件人**：customer-services@cmfinancial.com
- **报告内容**：
  - 对话ID、用户消息、AI回复、语言、时间戳
  - 统计摘要（总对话数、中英文对话数）

---

## 配置前准备

### 必需的环境变量

在服务器上配置以下环境变量（通过`.env`文件或系统环境变量）：

| 变量名 | 说明 | 是否必需 |
|--------|------|----------|
| `SMTP_HOST` | SMTP服务器地址 | ✅ 必需 |
| `SMTP_PORT` | SMTP服务器端口 | ✅ 必需 |
| `SMTP_USER` | SMTP用户名 | ✅ 必需 |
| `SMTP_PASS` | SMTP密码或API Key | ✅ 必需 |
| `SMTP_FROM` | 发件人邮箱地址 | ⚪ 可选 |
| `REPORT_EMAIL_TO` | 报告收件人邮箱 | ⚪ 可选 |
| `DAILY_REPORT_CRON` | 定时任务时间 | ⚪ 可选 |

### 检查清单

- [ ] 已选择SMTP服务提供商（SendGrid/AWS SES/Gmail）
- [ ] 已准备好SMTP凭证（用户名和密码/API Key）
- [ ] 已验证发件人邮箱地址（如需要）
- [ ] 服务器可访问SMTP服务器的587端口

---

## 方案选择

### 对比表

| 方案 | 优势 | 劣势 | 推荐场景 |
|------|------|------|----------|
| **SendGrid** | 免费额度充足（100封/天）<br>配置简单<br>稳定可靠 | 需要注册账户 | ✅ **推荐用于生产环境** |
| **AWS SES** | 与AWS生态集成<br>价格低廉 | 配置复杂<br>需要验证发件人 | 适合已使用AWS的场景 |
| **Gmail** | 无需注册<br>快速测试 | 每日限制500封<br>不推荐生产环境 | ⚠️ 仅用于测试 |

---

## 配置步骤

### 方案A: SendGrid（推荐）

#### 步骤1：注册SendGrid账户

1. 访问 https://sendgrid.com/
2. 点击 "Start for Free" 注册免费账户
3. 完成邮箱验证

#### 步骤2：创建API Key

1. 登录SendGrid控制台
2. 导航到 **Settings** > **API Keys**
3. 点击 **Create API Key**
4. 选择权限：
   - **API Key Name**: `Canton-Financial-SMTP`
   - **API Key Permissions**: 选择 **Full Access**
5. 点击 **Create & View**
6. **重要**：复制生成的API Key（以`SG.`开头），此密钥只显示一次！

#### 步骤3：验证发件人邮箱（可选但推荐）

1. 导航到 **Settings** > **Sender Authentication**
2. 点击 **Verify a Single Sender**
3. 填写发件人信息：
   - **From Name**: Canton Mutual Financial
   - **From Email Address**: noreply@cmfinancial.com
   - **Reply To**: customer-services@cmfinancial.com
4. 点击 **Create**
5. 检查邮箱并点击验证链接

#### 步骤4：配置环境变量

在服务器上创建或编辑`.env`文件：

```bash
# SendGrid SMTP配置
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 可选配置
SMTP_FROM=noreply@cmfinancial.com
REPORT_EMAIL_TO=customer-services@cmfinancial.com
DAILY_REPORT_CRON=0 0 18 * * *
```

**注意**：
- `SMTP_USER` 固定为 `apikey`（不是您的用户名）
- `SMTP_PASS` 填写步骤2中复制的API Key

#### 步骤5：重启应用

```bash
pm2 restart canton-financial
```

---

### 方案B: AWS SES

#### 步骤1：创建SMTP凭证

1. 打开AWS SES控制台：https://console.aws.amazon.com/ses/
2. 选择区域（如 **us-east-1**）
3. 导航到 **SMTP Settings**
4. 点击 **Create SMTP Credentials**
5. 输入IAM用户名：`canton-financial-smtp`
6. 点击 **Create**
7. **重要**：下载SMTP凭证（包含用户名和密码）

#### 步骤2：验证发件人邮箱

1. 导航到 **Email Addresses**
2. 点击 **Verify a New Email Address**
3. 输入邮箱：`noreply@cmfinancial.com`
4. 点击 **Verify This Email Address**
5. 检查邮箱并点击验证链接

#### 步骤3：配置环境变量

```bash
# AWS SES SMTP配置
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=AKIAIOSFODNN7EXAMPLE
SMTP_PASS=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# 可选配置
SMTP_FROM=noreply@cmfinancial.com
REPORT_EMAIL_TO=customer-services@cmfinancial.com
DAILY_REPORT_CRON=0 0 18 * * *
```

**注意**：
- `SMTP_HOST` 根据您选择的AWS区域调整
- `SMTP_USER` 和 `SMTP_PASS` 使用步骤1中下载的凭证

#### 步骤4：配置安全组（如果使用EC2）

确保EC2实例的安全组允许出站587端口：

```bash
aws ec2 authorize-security-group-egress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 587 \
  --cidr 0.0.0.0/0
```

#### 步骤5：重启应用

```bash
pm2 restart canton-financial
```

---

### 方案C: Gmail（仅测试）

⚠️ **警告**：Gmail不推荐用于生产环境，每日发送限制为500封。

#### 步骤1：启用两步验证

1. 访问 https://myaccount.google.com/security
2. 找到 **两步验证** 并启用

#### 步骤2：生成应用专用密码

1. 访问 https://myaccount.google.com/apppasswords
2. 选择应用：**邮件**
3. 选择设备：**其他（自定义名称）**
4. 输入名称：`Canton Financial`
5. 点击 **生成**
6. **重要**：复制生成的16位密码（格式：xxxx xxxx xxxx xxxx）

#### 步骤3：配置环境变量

```bash
# Gmail SMTP配置
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx

# 可选配置
SMTP_FROM=your-email@gmail.com
REPORT_EMAIL_TO=customer-services@cmfinancial.com
DAILY_REPORT_CRON=0 0 18 * * *
```

**注意**：
- `SMTP_USER` 填写您的Gmail邮箱地址
- `SMTP_PASS` 填写步骤2中生成的16位应用专用密码（包含空格）

#### 步骤4：重启应用

```bash
pm2 restart canton-financial
```

---

## 配置验证

### 方法1：查看应用日志

```bash
# 查看实时日志
pm2 logs canton-financial

# 预期看到类似日志：
# [Scheduler] Daily report scheduled at: 0 0 18 * * * (Hong Kong Time)
# [Scheduler] All scheduled tasks initialized successfully
```

### 方法2：手动触发测试报告

#### 通过API触发

```bash
curl -X POST http://localhost:3000/api/trpc/email.triggerDailyReport \
  -H "Content-Type: application/json"
```

#### 预期响应

```json
{
  "success": true,
  "message": "每日報告已成功生成並發送"
}
```

### 方法3：验证SMTP配置

```bash
curl http://localhost:3000/api/trpc/email.verifyConfig
```

#### 预期响应

```json
{
  "configured": true,
  "message": "SMTP configuration is valid and ready to send emails"
}
```

### 方法4：检查收件箱

1. 登录 customer-services@cmfinancial.com 邮箱
2. 查找主题为 **Canton Financial - 每日AI Chatbot對話記錄報告** 的邮件
3. 验证邮件包含：
   - HTML格式的统计摘要
   - Excel附件（canton-financial-chat-logs-YYYYMMDD.xlsx）

---

## 故障排除

### 问题1：邮件发送失败 - "Invalid login: 535 Authentication failed"

**原因**：SMTP用户名或密码错误

**解决方案**：
1. 检查 `SMTP_USER` 和 `SMTP_PASS` 是否正确
2. SendGrid确认 `SMTP_USER` 为 `apikey`（不是邮箱地址）
3. 确认API Key没有过期或被删除
4. 重新生成API Key并更新配置

### 问题2：邮件发送失败 - "connect ETIMEDOUT"

**原因**：网络连接超时或端口被防火墙阻止

**解决方案**：
1. 检查服务器防火墙规则，允许出站587端口：
   ```bash
   sudo ufw allow out 587/tcp
   ```
2. 检查AWS安全组规则（如使用EC2）
3. 测试SMTP连接：
   ```bash
   telnet smtp.sendgrid.net 587
   ```

### 问题3：定时任务未执行

**原因**：Cron表达式错误或时区设置不正确

**解决方案**：
1. 检查 `DAILY_REPORT_CRON` 格式（6个字段：秒 分 时 日 月 周）
2. 验证服务器时区设置：
   ```bash
   timedatectl
   # 应显示：Time zone: Asia/Hong_Kong (HKT, +0800)
   ```
3. 如果时区不正确，设置为香港时区：
   ```bash
   sudo timedatectl set-timezone Asia/Hong_Kong
   pm2 restart canton-financial
   ```

### 问题4：邮件进入垃圾箱

**原因**：发件人邮箱未验证或SPF/DKIM未配置

**解决方案**：
1. 在SMTP服务提供商处验证发件人邮箱
2. 配置域名的SPF记录（SendGrid/AWS SES提供指引）
3. 配置DKIM签名（SendGrid/AWS SES自动处理）

### 问题5：收不到邮件但无错误日志

**原因**：收件人邮箱地址错误或被过滤

**解决方案**：
1. 检查 `REPORT_EMAIL_TO` 环境变量是否正确
2. 检查收件人邮箱的垃圾邮件文件夹
3. 检查邮箱服务器的过滤规则
4. 尝试发送到其他邮箱地址测试

---

## 快速参考

### 常用命令

```bash
# 查看应用日志
pm2 logs canton-financial

# 查看环境变量
printenv | grep SMTP

# 重启应用
pm2 restart canton-financial

# 手动触发报告
curl -X POST http://localhost:3000/api/trpc/email.triggerDailyReport

# 验证SMTP配置
curl http://localhost:3000/api/trpc/email.verifyConfig

# 测试SMTP连接
telnet smtp.sendgrid.net 587
```

### 环境变量快速模板

#### SendGrid
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### AWS SES
```bash
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=AKIAIOSFODNN7EXAMPLE
SMTP_PASS=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

#### Gmail
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
```

---

## 联系支持

如遇到配置问题，请联系：

- **技术支持邮箱**：it-support@cmfinancial.com
- **项目负责人**：[项目经理姓名]
- **紧急联系电话**：+852 xxxx xxxx

---

**文档版本**：1.0  
**最后更新**：2024年12月17日  
**维护者**：Canton Mutual Financial Limited IT Team
