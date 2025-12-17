# AI Chatbot对话记录每日邮件报告系统架构

## 系统概述

实现每天下午6点自动将AI Chatbot的对话记录统计打包并发送到customer-services@cmfinancial.com的功能。

## 系统架构

### 1. 数据存储层
- **数据库表**：`chatbot_conversations`
  - `id`: 主键
  - `session_id`: 会话ID
  - `user_message`: 用户消息
  - `bot_response`: 机器人回复
  - `timestamp`: 时间戳
  - `user_language`: 用户语言（zh/en）
  - `created_at`: 创建时间

### 2. 业务逻辑层
- **对话记录保存**：每次对话自动保存到数据库
- **数据统计**：按日期统计对话数量、用户语言分布等
- **报告生成**：生成Excel或CSV格式的对话记录文件
- **邮件发送**：使用SMTP发送邮件附件

### 3. 定时任务层
- **Cron Job**：使用node-cron在服务器端设置定时任务
- **执行时间**：每天下午6点（18:00）
- **时区**：香港时间（GMT+8）

## 技术实现方案

### 方案一：服务器端Cron（推荐用于AWS部署）

**优点**：
- 可靠性高，不依赖外部服务
- 适合AWS EC2/ECS部署
- 易于监控和日志记录

**实现**：
```typescript
import cron from 'node-cron';

// 每天下午6点执行
cron.schedule('0 18 * * *', async () => {
  await generateAndSendDailyReport();
}, {
  timezone: "Asia/Hong_Kong"
});
```

### 方案二：AWS EventBridge + Lambda（适合无服务器架构）

**优点**：
- 无需管理服务器
- 自动扩展
- 按使用付费

**实现**：
- 使用AWS EventBridge创建定时规则
- 触发Lambda函数执行报告生成和发送

## 邮件发送配置

### SMTP配置选项

#### 选项1：使用公司邮箱SMTP
```env
SMTP_HOST=smtp.cmfinancial.com
SMTP_PORT=587
SMTP_USER=noreply@cmfinancial.com
SMTP_PASS=<密码>
SMTP_FROM=noreply@cmfinancial.com
REPORT_EMAIL_TO=customer-services@cmfinancial.com
```

#### 选项2：使用AWS SES（推荐用于AWS部署）
```env
AWS_SES_REGION=ap-southeast-1
AWS_SES_FROM=noreply@cmfinancial.com
REPORT_EMAIL_TO=customer-services@cmfinancial.com
```

## 报告内容格式

### Excel文件结构
| 会话ID | 用户消息 | 机器人回复 | 语言 | 时间戳 |
|--------|---------|-----------|------|--------|
| xxx-xxx | 你好 | 您好！... | zh | 2024-12-17 10:30:00 |

### 邮件主题
```
Canton Financial - AI Chatbot对话记录报告 - YYYY-MM-DD
```

### 邮件正文
```
尊敬的客服团队：

附件为 YYYY年MM月DD日 的AI Chatbot对话记录，共 X 条对话。

统计摘要：
- 总对话数：X 条
- 繁体中文对话：X 条
- 英文对话：X 条

请查收。

此邮件由系统自动发送，请勿回复。
```

## IT部署清单

### 1. 环境变量配置
- [ ] SMTP服务器信息
- [ ] 邮件发送账号和密码
- [ ] 收件人邮箱地址

### 2. AWS配置（如使用AWS SES）
- [ ] 验证发件人邮箱域名
- [ ] 配置IAM权限
- [ ] 设置SES发送限制

### 3. 数据库迁移
- [ ] 运行数据库迁移脚本创建表

### 4. 服务器配置
- [ ] 确保服务器时区设置为香港时间
- [ ] 配置日志目录权限

### 5. 测试验证
- [ ] 测试邮件发送功能
- [ ] 验证定时任务执行
- [ ] 检查报告文件生成

## 监控和日志

- 每次执行记录日志到 `logs/email-report.log`
- 发送成功/失败通知
- 保留最近30天的报告文件备份
