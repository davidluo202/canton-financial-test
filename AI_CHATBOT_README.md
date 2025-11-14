# AI Chatbot 功能说明

## 概述

Canton Mutual Financial网站现已集成智能AI客服聊天机器人，可以24/7为访客提供即时帮助和信息查询服务。

## 主要功能

### 1. 智能问答
- **公司信息查询**：回答关于公司服务、业务范围、联系方式等问题
- **投资知识普及**：提供基本的投资相关信息（不提供具体投资建议）
- **监管信息引用**：可参考香港证监会（SFC）、香港证券及投资学会（HKSI）等权威机构的公开信息

### 2. 双语支持
- 自动识别网站当前语言设置
- 支持繁体中文和英文对话
- 根据用户选择的语言提供相应的回复

### 3. 对话记录
- 所有对话自动保存到数据库
- 记录包含：用户问题、AI回复、时间戳、语言版本
- 用于服务质量分析和改进

### 4. 每日报告
- 系统每天生成对话记录报告（HTML格式）
- 报告保存在`chat-reports`目录
- 包含当日所有对话的详细内容和统计信息

## 使用方法

### 访客使用
1. 访问网站任意页面
2. 点击右下角的蓝色聊天图标
3. 在弹出的聊天窗口中输入问题
4. 按Enter键或点击发送按钮
5. AI助手将立即回复

### 管理员查看对话记录

#### 方法一：查看数据库
对话记录存储在`chatLogs`表中，包含以下字段：
- `id`: 记录ID
- `userMessage`: 用户问题
- `assistantMessage`: AI回复
- `language`: 语言（zh/en）
- `createdAt`: 创建时间

#### 方法二：查看每日报告
每日报告保存在项目根目录的`chat-reports`文件夹中：
- 文件名格式：`chat-report-YYYY-MM-DD.html`
- 可直接在浏览器中打开查看
- 包含美观的HTML格式和统计信息

## 知识库内容

AI助手已预装以下知识：

1. **公司基本信息**
   - 公司名称、注册信息
   - SFC牌照信息（中央编号：BSU667）
   - 持牌类型：1号、4号、9号牌照

2. **业务服务**
   - 投资银行服务
   - FICC与股票业务
   - 资产与财富管理

3. **核心价值观**
   - Profession（專精立業）
   - Potential（潛能傲世）
   - Partnership（同道致遠）

4. **联系信息**
   - 地址、电话、传真
   - 邮箱、网站
   - 营业时间

5. **高管信息**
   - Jack Mou（牟致雪）- 创始人兼董事长
   - Xintao Luo（羅新濤）- CEO

## 技术架构

### 前端
- **组件**：`client/src/components/AIChatbot.tsx`
- **框架**：React 19 + TypeScript
- **UI库**：Tailwind CSS + shadcn/ui
- **状态管理**：React Hooks

### 后端
- **路由**：`server/chatbotRouter.ts`
- **数据库**：`drizzle/schema.ts` (chatLogs表)
- **AI服务**：Manus内置LLM服务
- **数据库操作**：`server/db.ts`

### 数据流
1. 用户在前端输入问题
2. 通过tRPC发送到后端
3. 后端调用LLM服务生成回复
4. 同时保存对话记录到数据库
5. 返回回复给前端显示

## 邮件发送配置（待实施）

当前版本将每日报告保存为HTML文件。要实现自动邮件发送，需要：

### 步骤1：安装邮件库
```bash
pnpm add nodemailer
pnpm add -D @types/nodemailer
```

### 步骤2：配置环境变量
在`.env`文件中添加：
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@cmfinancial.com
SMTP_TO=customer-services@cmfinancial.com
```

### 步骤3：更新邮件服务
修改`server/emailService.ts`中的注释代码，启用实际的SMTP发送功能。

### 步骤4：设置定时任务
可以使用以下方式之一：
- **Linux cron**：每天凌晨发送
- **Node.js定时任务**：使用`node-cron`包
- **云服务定时触发**：AWS Lambda、Google Cloud Functions等

示例cron配置（每天凌晨1点发送）：
```bash
0 1 * * * cd /path/to/project && node -e "require('./server/emailService').sendDailyChatReport()"
```

## 安全考虑

1. **数据隐私**
   - 对话记录仅用于服务改进
   - 不收集用户个人身份信息
   - 建议定期清理旧的对话记录

2. **内容过滤**
   - AI助手不提供具体投资建议
   - 对敏感问题会引导用户联系客服
   - 所有回复都经过LLM的内容安全过滤

3. **访问控制**
   - 对话记录数据库需要适当的访问权限
   - 邮件发送凭据应妥善保管
   - 建议使用环境变量而非硬编码

## 常见问题

### Q: Chatbot无法回复？
A: 检查以下几点：
- 开发服务器是否正常运行
- 数据库连接是否正常
- LLM服务是否可用
- 浏览器控制台是否有错误信息

### Q: 如何修改Chatbot的回复内容？
A: 编辑`server/chatbotRouter.ts`中的：
- `WEBSITE_KNOWLEDGE`常量（知识库内容）
- `systemPrompt`变量（AI行为指令）

### Q: 如何更改Chatbot的外观？
A: 编辑`client/src/components/AIChatbot.tsx`中的：
- Tailwind CSS类名
- 颜色、大小、位置等样式
- 欢迎消息文本

### Q: 对话记录会占用多少存储空间？
A: 取决于对话量，建议：
- 定期备份并清理旧记录（如保留3个月）
- 监控数据库大小
- 必要时实施数据归档策略

## 未来改进建议

1. **功能增强**
   - [ ] 添加常见问题快捷回复
   - [ ] 支持文件上传（如文档查询）
   - [ ] 添加对话评分功能
   - [ ] 实现多轮对话上下文理解

2. **性能优化**
   - [ ] 实现回复缓存机制
   - [ ] 优化LLM调用频率
   - [ ] 添加负载均衡

3. **分析功能**
   - [ ] 对话数据可视化仪表板
   - [ ] 热门问题统计
   - [ ] 用户满意度分析

4. **集成扩展**
   - [ ] 与CRM系统集成
   - [ ] 添加人工客服转接功能
   - [ ] 支持多渠道（微信、WhatsApp等）

## 技术支持

如有问题或需要帮助，请联系：
- 技术团队邮箱：（待添加）
- 项目文档：本文件
- 代码仓库：（待添加）

---

**版本**: 1.0.0  
**最后更新**: 2025-11-03  
**维护者**: Canton Mutual Financial IT Team
