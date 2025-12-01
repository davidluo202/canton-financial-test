# SMTP Email Service Setup Guide
# SMTP 邮件服务配置指南

## Overview / 概述

The AI Chatbot system includes an automated daily report feature that sends conversation logs to `customer-services@cmfinancial.com` every day at 9:00 AM (Hong Kong Time).

AI聊天机器人系统包含自动每日报告功能，每天早上9:00（香港时间）将对话记录发送到 `customer-services@cmfinancial.com`。

---

## Features / 功能特性

- **Daily Automated Reports / 每日自动报告**: Sends conversation statistics and details every morning
- **Conversation Statistics / 对话统计**: Total conversations, unique users, language breakdown
- **Popular Questions / 热门问题**: Identifies frequently asked questions
- **HTML Email Format / HTML邮件格式**: Professional, responsive email design
- **Backup Reports / 备份报告**: Saves HTML reports locally even if email fails

---

## SMTP Configuration / SMTP配置

### Required Environment Variables / 必需的环境变量

Add the following variables to your `.env` file or deployment environment:

在您的 `.env` 文件或部署环境中添加以下变量：

```bash
# SMTP Server Configuration
SMTP_HOST=smtp.example.com          # SMTP服务器地址
SMTP_PORT=587                        # SMTP端口 (587 for TLS, 465 for SSL)
SMTP_USER=your-email@example.com    # SMTP用户名（通常是邮箱地址）
SMTP_PASS=your-password-or-api-key  # SMTP密码或API密钥

# Optional: Custom sender email
SMTP_FROM=noreply@cmfinancial.com   # 发件人邮箱（可选，默认使用SMTP_USER）

# Optional: Custom schedule (cron expression)
DAILY_REPORT_CRON=0 0 9 * * *       # 定时任务表达式（可选，默认每天9:00）
```

---

## Supported SMTP Providers / 支持的SMTP服务商

### 1. SendGrid (Recommended / 推荐)

**Why SendGrid?** / **为什么选择SendGrid？**
- Reliable delivery / 可靠的送达率
- 100 free emails per day / 每天100封免费邮件
- Easy setup / 简单配置

**Configuration / 配置:**

```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=<your-sendgrid-api-key>
```

**Setup Steps / 设置步骤:**

1. Sign up at https://sendgrid.com
2. Go to Settings → API Keys
3. Create a new API key with "Mail Send" permission
4. Copy the API key and use it as `SMTP_PASS`

---

### 2. AWS SES (Amazon Simple Email Service)

**Why AWS SES?** / **为什么选择AWS SES？**
- Low cost / 低成本
- High scalability / 高扩展性
- Integrated with AWS ecosystem / 与AWS生态集成

**Configuration / 配置:**

```bash
SMTP_HOST=email-smtp.us-east-1.amazonaws.com  # Replace with your region
SMTP_PORT=587
SMTP_USER=<your-ses-smtp-username>
SMTP_PASS=<your-ses-smtp-password>
```

**Setup Steps / 设置步骤:**

1. Sign in to AWS Console
2. Go to Amazon SES
3. Verify your sender email address
4. Create SMTP credentials
5. Use the credentials in your environment variables

---

### 3. Gmail (For Testing Only / 仅用于测试)

**⚠️ Not recommended for production / 不推荐用于生产环境**

**Configuration / 配置:**

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=<app-specific-password>  # Not your regular password!
```

**Setup Steps / 设置步骤:**

1. Enable 2-Factor Authentication on your Google Account
2. Go to Google Account → Security → App passwords
3. Generate an app password for "Mail"
4. Use the generated password as `SMTP_PASS`

---

## Testing the Configuration / 测试配置

### Method 1: Using tRPC API / 使用tRPC API

```typescript
// In browser console or React component
const result = await trpc.email.verifyConfig.query();
console.log(result);
// { configured: true, message: "SMTP configuration is valid..." }
```

### Method 2: Manual Trigger / 手动触发

```typescript
// Trigger daily report manually for testing
const result = await trpc.email.triggerDailyReport.mutate();
console.log(result);
// { success: true, conversationCount: 5, reportPath: "...", emailSent: true }
```

### Method 3: Check Status / 检查状态

```typescript
const status = await trpc.email.getStatus.query();
console.log(status);
// {
//   configured: true,
//   scheduledTime: "0 0 9 * * *",
//   timezone: "Asia/Hong_Kong",
//   recipientEmail: "customer-services@cmfinancial.com"
// }
```

---

## Scheduled Task Configuration / 定时任务配置

The default schedule is **9:00 AM Hong Kong Time** every day.

默认计划是每天**香港时间早上9:00**。

### Custom Schedule / 自定义计划

You can customize the schedule using cron expressions:

您可以使用cron表达式自定义计划：

```bash
# Format: second minute hour day month weekday
# 格式：秒 分 时 日 月 周

# Every day at 9:00 AM (default)
DAILY_REPORT_CRON=0 0 9 * * *

# Every day at 6:00 PM
DAILY_REPORT_CRON=0 0 18 * * *

# Every Monday at 9:00 AM
DAILY_REPORT_CRON=0 0 9 * * 1

# Twice a day: 9:00 AM and 6:00 PM
# (Requires code modification to add second schedule)
```

---

## Email Report Contents / 邮件报告内容

Each daily report includes:

每份每日报告包含：

1. **Summary Statistics / 统计摘要**
   - Total conversations / 总对话数
   - Unique users (estimated) / 独立用户数（估算）
   - Language breakdown (Chinese/English) / 语言分布（中文/英文）

2. **Popular Questions / 热门问题**
   - Top 5 most frequently asked questions / 前5个最常见问题

3. **Conversation Details / 对话详情**
   - Timestamp / 时间戳
   - Language / 语言
   - User question / 用户问题
   - AI response / AI回复

---

## Backup Reports / 备份报告

Even if email sending fails, the system saves HTML reports locally:

即使邮件发送失败，系统也会在本地保存HTML报告：

**Location / 位置:** `chat-reports/chat-report-YYYY-MM-DD.html`

You can open these files in a browser to view the reports manually.

您可以在浏览器中打开这些文件手动查看报告。

---

## Troubleshooting / 故障排除

### Email Not Sending / 邮件未发送

1. **Check environment variables / 检查环境变量**
   ```bash
   echo $SMTP_HOST
   echo $SMTP_PORT
   echo $SMTP_USER
   # SMTP_PASS should be set but not echoed for security
   ```

2. **Verify SMTP configuration / 验证SMTP配置**
   ```typescript
   const result = await trpc.email.verifyConfig.query();
   ```

3. **Check server logs / 检查服务器日志**
   Look for messages starting with `[Email Service]`

4. **Test with manual trigger / 使用手动触发测试**
   ```typescript
   await trpc.email.triggerDailyReport.mutate();
   ```

### Common Issues / 常见问题

**Issue:** "SMTP configuration not found"  
**Solution:** Ensure all required environment variables are set

**Issue:** "Authentication failed"  
**Solution:** Double-check your SMTP_USER and SMTP_PASS credentials

**Issue:** "Connection timeout"  
**Solution:** Check if your server can reach the SMTP host (firewall/network issues)

**Issue:** "Email sent but not received"  
**Solution:** Check spam folder, verify recipient email address

---

## Security Best Practices / 安全最佳实践

1. **Never commit SMTP credentials to version control / 切勿将SMTP凭据提交到版本控制**
   - Use `.env` files (already in `.gitignore`)
   - Use environment variables in deployment platforms

2. **Use API keys instead of passwords / 使用API密钥而非密码**
   - SendGrid and AWS SES provide API keys
   - More secure than using email passwords

3. **Restrict SMTP user permissions / 限制SMTP用户权限**
   - Only grant "send email" permission
   - Don't use admin accounts

4. **Monitor email sending / 监控邮件发送**
   - Check server logs regularly
   - Set up alerts for failed deliveries

---

## Production Deployment Checklist / 生产部署检查清单

- [ ] SMTP credentials configured in environment variables
- [ ] SMTP configuration verified using `trpc.email.verifyConfig`
- [ ] Test email sent successfully using `trpc.email.triggerDailyReport`
- [ ] Scheduled task confirmed in server logs
- [ ] Recipient email address correct: `customer-services@cmfinancial.com`
- [ ] Timezone set to `Asia/Hong_Kong`
- [ ] Backup report directory created: `chat-reports/`
- [ ] Server has network access to SMTP host
- [ ] Firewall allows outbound SMTP traffic (port 587 or 465)

---

## Support / 技术支持

For technical assistance with SMTP configuration:

如需SMTP配置技术支持：

- **SendGrid:** https://docs.sendgrid.com/
- **AWS SES:** https://docs.aws.amazon.com/ses/
- **Gmail:** https://support.google.com/mail/answer/7126229

For application-specific issues, check server logs for messages starting with `[Email Service]` or `[Scheduler]`.

对于应用程序特定问题，请检查服务器日志中以 `[Email Service]` 或 `[Scheduler]` 开头的消息。
