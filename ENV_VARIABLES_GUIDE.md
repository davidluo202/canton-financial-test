# Canton Mutual Financial - 环境变量配置指南

## 概述

本文档详细说明Canton Mutual Financial网站部署所需的所有环境变量配置。请在部署到AWS生产环境前，仔细配置每一个必需的环境变量。

---

## 一、必需环境变量

### 1.1 数据库配置

#### `DATABASE_URL`

- **说明**：PostgreSQL数据库连接字符串
- **格式**：`postgresql://[用户名]:[密码]@[主机地址]:[端口]/[数据库名]`
- **示例**：`postgresql://admin:SecurePass123@canton-db.xxxxx.ap-southeast-1.rds.amazonaws.com:5432/canton_financial`
- **获取方式**：
  1. 登录AWS RDS控制台
  2. 选择您的PostgreSQL实例
  3. 在"连接和安全"选项卡中找到"终端节点"
  4. 组合格式：`postgresql://[主用户名]:[主密码]@[终端节点]:5432/[数据库名]`

**⚠️ 安全提示**：
- 密码中如包含特殊字符（如`@`、`:`、`/`），需要URL编码
- 不要将此连接字符串提交到Git仓库
- 使用AWS Secrets Manager存储敏感信息

---

### 1.2 AWS S3存储配置

#### `AWS_REGION`

- **说明**：AWS区域代码
- **推荐值**：`ap-southeast-1`（新加坡，距离香港最近）
- **其他选项**：
  - `ap-east-1`（香港）
  - `us-east-1`（美国东部）
  - `eu-west-1`（欧洲爱尔兰）
- **默认值**：`ap-southeast-1`

#### `AWS_ACCESS_KEY_ID`

- **说明**：AWS IAM用户访问密钥ID
- **格式**：20个字符的大写字母数字组合
- **示例**：`AKIAIOSFODNN7EXAMPLE`
- **获取方式**：
  1. 登录AWS IAM控制台
  2. 创建新用户（如canton-financial-s3-user）
  3. 附加S3权限策略（AmazonS3FullAccess或自定义策略）
  4. 创建访问密钥，记录Access Key ID

#### `AWS_SECRET_ACCESS_KEY`

- **说明**：AWS IAM用户访问密钥密文
- **格式**：40个字符的字母数字组合
- **示例**：`wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`
- **获取方式**：创建访问密钥时一次性显示，请妥善保存

#### `S3_BUCKET_NAME`

- **说明**：S3存储桶名称
- **格式**：小写字母、数字、连字符，全球唯一
- **示例**：`canton-financial-images`
- **创建方式**：
  ```bash
  aws s3 mb s3://canton-financial-images --region ap-southeast-1
  ```

**⚠️ 安全提示**：
- AWS访问密钥具有S3完全访问权限，务必妥善保管
- 不要将访问密钥提交到Git仓库或在前端代码中暴露
- 使用AWS Secrets Manager或环境变量存储敏感信息
- 定期轮换访问密钥（建议每90天）
- 为生产环境创建专用IAM用户，遵循最小权限原则

---

### 1.3 JWT和认证配置

#### `JWT_SECRET`

- **说明**：JSON Web Token签名密钥
- **要求**：至少32个字符的强随机字符串
- **生成方式**：
  ```bash
  # 使用OpenSSL生成
  openssl rand -base64 32
  
  # 或使用Node.js生成
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```
- **示例**：`7J9X2kP5mN8qR4tY6wE1aS3dF5gH7jK9lM0nB2vC4xZ6`

**⚠️ 安全提示**：
- 生产环境必须使用唯一的强密钥
- 更换密钥会使所有现有JWT失效，需要用户重新登录
- 不要使用示例中的密钥

#### `OAUTH_SERVER_URL`（可选）

- **说明**：OAuth认证服务器URL
- **示例**：`https://oauth.yourdomain.com`
- **默认值**：如不使用OAuth，可留空

#### `OWNER_NAME`

- **说明**：系统所有者名称
- **示例**：`Canton Admin`
- **用途**：用于系统日志和审计记录

#### `OWNER_OPEN_ID`

- **说明**：系统所有者OpenID
- **示例**：`admin@canton.com`
- **用途**：用于权限管理和审计

---

### 1.4 SMTP邮件配置

#### `SMTP_HOST`

- **说明**：SMTP邮件服务器地址
- **常用值**：
  - Gmail：`smtp.gmail.com`
  - Outlook：`smtp-mail.outlook.com`
  - AWS SES：`email-smtp.[region].amazonaws.com`
  - 企业邮箱：咨询您的IT部门

#### `SMTP_PORT`

- **说明**：SMTP服务器端口
- **常用值**：
  - `587`：STARTTLS加密（推荐）
  - `465`：SSL/TLS加密
  - `25`：无加密（不推荐）

#### `SMTP_USER`

- **说明**：SMTP认证用户名
- **示例**：`noreply@canton.com`

#### `SMTP_PASS`

- **说明**：SMTP认证密码
- **Gmail用户**：需要使用"应用专用密码"而非账户密码
  1. 访问 https://myaccount.google.com/security
  2. 启用两步验证
  3. 生成应用专用密码
- **AWS SES用户**：使用SMTP凭证（非AWS访问密钥）

#### `SMTP_FROM`

- **说明**：发件人邮箱地址
- **示例**：`noreply@canton.com`
- **要求**：必须是已验证的发件人地址

**⚠️ 配置提示**：
- 测试环境可使用Gmail，生产环境推荐使用AWS SES或企业邮箱
- 确保发件人地址已通过SPF/DKIM验证，避免邮件进入垃圾箱

---

### 1.5 前端配置

#### `VITE_APP_TITLE`

- **说明**：网站标题（显示在浏览器标签页）
- **示例**：`Canton Mutual Financial Limited`
- **默认值**：`Canton Mutual Financial Limited`

#### `VITE_APP_LOGO`

- **说明**：网站Logo路径
- **示例**：`/logo.png`
- **要求**：Logo文件需放置在 `client/public/` 目录下

#### `VITE_APP_ID`

- **说明**：应用唯一标识符
- **示例**：`canton-financial-prod`
- **用途**：用于分析和追踪

#### `VITE_ANALYTICS_WEBSITE_ID`（可选）

- **说明**：网站分析服务ID（如Google Analytics）
- **示例**：`G-XXXXXXXXXX`
- **默认值**：如不使用分析服务，可留空

#### `VITE_ANALYTICS_ENDPOINT`（可选）

- **说明**：自定义分析服务端点
- **示例**：`https://analytics.canton.com/api/collect`
- **默认值**：如使用Google Analytics，可留空

#### `VITE_FRONTEND_FORGE_API_KEY`

- **说明**：前端专用Forge API密钥（权限受限）
- **示例**：`manus_frontend_key_xxx`
- **获取方式**：由Manus平台提供（与后端密钥不同）

#### `VITE_FRONTEND_FORGE_API_URL`

- **说明**：前端Forge API服务URL
- **默认值**：`https://api.manus.im`

#### `VITE_OAUTH_PORTAL_URL`（可选）

- **说明**：OAuth登录门户URL
- **示例**：`https://login.canton.com`
- **默认值**：如不使用OAuth，可留空

---

### 1.6 生产环境标识

#### `NODE_ENV`

- **说明**：Node.js运行环境
- **必需值**：`production`
- **作用**：
  - 启用生产优化
  - 禁用开发工具
  - 启用错误日志记录

#### `PORT`

- **说明**：应用监听端口
- **默认值**：`3000`
- **AWS Elastic Beanstalk**：自动设置，无需手动配置
- **EC2部署**：建议使用`3000`，通过Nginx反向代理到80/443端口

---

## 二、环境变量配置方式

### 2.1 AWS Elastic Beanstalk

#### 通过控制台配置

1. 登录AWS控制台，进入Elastic Beanstalk
2. 选择您的环境
3. 点击"配置" → "软件"
4. 在"环境属性"部分添加环境变量
5. 点击"应用"保存

#### 通过EB CLI配置

```bash
eb setenv \
  DATABASE_URL="postgresql://..." \
  BUILT_IN_FORGE_API_URL="https://api.manus.im" \
  BUILT_IN_FORGE_API_KEY="your_key" \
  JWT_SECRET="your_jwt_secret" \
  SMTP_HOST="smtp.gmail.com" \
  SMTP_PORT="587" \
  SMTP_USER="your-email@gmail.com" \
  SMTP_PASS="your_password" \
  SMTP_FROM="noreply@canton.com" \
  VITE_APP_TITLE="Canton Mutual Financial Limited" \
  NODE_ENV="production"
```

### 2.2 EC2部署

#### 创建.env文件

```bash
# 在应用目录创建.env文件
sudo nano /var/www/canton-financial/.env
```

**粘贴以下内容**（替换为实际值）：

```bash
# 数据库
DATABASE_URL=postgresql://username:password@rds-endpoint:5432/canton_financial

# AWS S3存储
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
S3_BUCKET_NAME=canton-financial-images

# JWT和认证
JWT_SECRET=your_jwt_secret_at_least_32_characters
OAUTH_SERVER_URL=https://oauth.yourdomain.com
OWNER_NAME=Canton Admin
OWNER_OPEN_ID=admin@canton.com

# SMTP邮件
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@canton.com

# 前端配置
VITE_APP_TITLE=Canton Mutual Financial Limited
VITE_APP_LOGO=/logo.png
VITE_APP_ID=canton-financial-prod
VITE_ANALYTICS_WEBSITE_ID=G-XXXXXXXXXX
VITE_ANALYTICS_ENDPOINT=https://analytics.canton.com
VITE_FRONTEND_FORGE_API_KEY=your_frontend_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://login.canton.com

# 生产环境
NODE_ENV=production
PORT=3000
```

#### 使用PM2加载环境变量

```bash
# 使用.env文件启动应用
pm2 start dist/index.js --name canton-financial --env-file /var/www/canton-financial/.env
pm2 save
```

### 2.3 Docker部署（可选）

#### docker-compose.yml

```yaml
version: '3.8'
services:
  app:
    image: canton-financial:latest
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - BUILT_IN_FORGE_API_URL=${BUILT_IN_FORGE_API_URL}
      - BUILT_IN_FORGE_API_KEY=${BUILT_IN_FORGE_API_KEY}
      - JWT_SECRET=${JWT_SECRET}
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_PORT=${SMTP_PORT}
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASS=${SMTP_PASS}
      - SMTP_FROM=${SMTP_FROM}
      - NODE_ENV=production
    env_file:
      - .env.production
```

---

## 三、环境变量验证

### 3.1 验证脚本

创建 `verify-env.js` 文件：

```javascript
const requiredEnvVars = [
  'DATABASE_URL',
  'BUILT_IN_FORGE_API_URL',
  'BUILT_IN_FORGE_API_KEY',
  'JWT_SECRET',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'SMTP_FROM',
  'NODE_ENV'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ 缺少以下必需的环境变量:');
  missingVars.forEach(varName => console.error(`  - ${varName}`));
  process.exit(1);
} else {
  console.log('✅ 所有必需的环境变量已配置');
  
  // 验证DATABASE_URL格式
  if (!process.env.DATABASE_URL.startsWith('postgresql://')) {
    console.error('❌ DATABASE_URL格式错误，必须以 postgresql:// 开头');
    process.exit(1);
  }
  
  // 验证JWT_SECRET长度
  if (process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET长度不足，至少需要32个字符');
    process.exit(1);
  }
  
  console.log('✅ 环境变量验证通过');
}
```

运行验证：

```bash
node verify-env.js
```

### 3.2 测试数据库连接

```bash
# 使用psql测试连接
psql "$DATABASE_URL" -c "SELECT version();"

# 或使用Node.js测试
node -e "
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });
client.connect()
  .then(() => { console.log('✅ 数据库连接成功'); client.end(); })
  .catch(err => { console.error('❌ 数据库连接失败:', err.message); process.exit(1); });
"
```

### 3.3 测试SMTP配置

```bash
# 使用Node.js测试SMTP
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
transporter.verify()
  .then(() => { console.log('✅ SMTP配置正确'); })
  .catch(err => { console.error('❌ SMTP配置错误:', err.message); process.exit(1); });
"
```

---

## 四、安全最佳实践

### 4.1 密钥管理

✅ **推荐做法**：

- 使用AWS Secrets Manager存储敏感信息
- 定期轮换密钥和密码（每90天）
- 使用不同的密钥区分开发/测试/生产环境
- 限制密钥访问权限（最小权限原则）

❌ **避免做法**：

- 将密钥硬编码在代码中
- 将.env文件提交到Git仓库
- 在日志中输出敏感信息
- 在前端代码中暴露后端API密钥

### 4.2 使用AWS Secrets Manager

#### 创建密钥

```bash
# 创建数据库密钥
aws secretsmanager create-secret \
  --name canton-financial/database \
  --secret-string '{"url":"postgresql://..."}'

# 创建Forge API密钥
aws secretsmanager create-secret \
  --name canton-financial/forge-api \
  --secret-string '{"key":"manus_forge_xxx"}'
```

#### 在应用中读取密钥

```javascript
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager({ region: 'ap-southeast-1' });

async function getSecret(secretName) {
  const data = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
  return JSON.parse(data.SecretString);
}

// 使用示例
const dbSecret = await getSecret('canton-financial/database');
process.env.DATABASE_URL = dbSecret.url;
```

### 4.3 环境变量加密

对于EC2部署，可以使用加密的环境变量文件：

```bash
# 加密.env文件
gpg --symmetric --cipher-algo AES256 .env

# 解密并加载
gpg --decrypt .env.gpg > .env
pm2 start dist/index.js --env-file .env
rm .env  # 删除明文文件
```

---

## 五、故障排查

### 5.1 环境变量未生效

**症状**：应用无法读取环境变量

**解决方案**：

1. 确认环境变量已正确设置：
   ```bash
   # Elastic Beanstalk
   eb printenv
   
   # EC2
   cat /var/www/canton-financial/.env
   ```

2. 重启应用：
   ```bash
   # Elastic Beanstalk
   eb restart
   
   # EC2 + PM2
   pm2 restart canton-financial
   ```

3. 检查应用日志：
   ```bash
   # 查看环境变量是否加载
   node -e "console.log(process.env)"
   ```

### 5.2 数据库连接字符串错误

**常见错误**：

- `ECONNREFUSED`：主机地址或端口错误
- `password authentication failed`：用户名或密码错误
- `database "xxx" does not exist`：数据库名错误

**解决方案**：

1. 验证连接字符串格式：
   ```
   postgresql://[用户名]:[密码]@[主机]:[端口]/[数据库]
   ```

2. 特殊字符需要URL编码：
   ```javascript
   const password = 'P@ssw0rd!';
   const encodedPassword = encodeURIComponent(password);
   // P%40ssw0rd%21
   ```

3. 测试每个组件：
   ```bash
   # 测试网络连通性
   telnet rds-endpoint.amazonaws.com 5432
   
   # 测试认证
   psql -h rds-endpoint -U username -d postgres
   ```

### 5.3 SMTP发送失败

**常见错误**：

- `Invalid login`：用户名或密码错误
- `Connection timeout`：SMTP服务器地址或端口错误
- `Message rejected`：发件人地址未验证

**解决方案**：

1. Gmail用户：确保使用应用专用密码，而非账户密码
2. 检查防火墙：确保出站端口587/465未被阻止
3. 验证发件人地址：在SMTP服务商控制台验证域名

---

## 六、环境变量清单

### 必需变量（生产环境）

| 变量名 | 必需 | 默认值 | 说明 |
|--------|------|--------|------|
| `DATABASE_URL` | ✅ | - | PostgreSQL连接字符串 |
| `AWS_REGION` | ✅ | `ap-southeast-1` | AWS区域代码 |
| `AWS_ACCESS_KEY_ID` | ✅ | - | AWS访问密钥ID |
| `AWS_SECRET_ACCESS_KEY` | ✅ | - | AWS访问密钥密文 |
| `S3_BUCKET_NAME` | ✅ | - | S3存储桶名称 |
| `JWT_SECRET` | ✅ | - | JWT签名密钥（≥32字符） |
| `SMTP_HOST` | ✅ | - | SMTP服务器地址 |
| `SMTP_PORT` | ✅ | - | SMTP端口（587/465） |
| `SMTP_USER` | ✅ | - | SMTP用户名 |
| `SMTP_PASS` | ✅ | - | SMTP密码 |
| `SMTP_FROM` | ✅ | - | 发件人邮箱 |
| `NODE_ENV` | ✅ | `production` | 运行环境 |

### 可选变量

| 变量名 | 必需 | 默认值 | 说明 |
|--------|------|--------|------|
| `PORT` | ❌ | `3000` | 应用端口 |
| `OAUTH_SERVER_URL` | ❌ | - | OAuth服务器URL |
| `OWNER_NAME` | ❌ | - | 所有者名称 |
| `OWNER_OPEN_ID` | ❌ | - | 所有者OpenID |
| `VITE_APP_TITLE` | ❌ | `Canton Mutual Financial Limited` | 网站标题 |
| `VITE_APP_LOGO` | ❌ | `/logo.png` | Logo路径 |
| `VITE_APP_ID` | ❌ | - | 应用ID |
| `VITE_ANALYTICS_WEBSITE_ID` | ❌ | - | 分析服务ID |
| `VITE_ANALYTICS_ENDPOINT` | ❌ | - | 分析端点 |
| `VITE_FRONTEND_FORGE_API_KEY` | ❌ | - | 前端Forge密钥 |
| `VITE_FRONTEND_FORGE_API_URL` | ❌ | - | 前端Forge URL |
| `VITE_OAUTH_PORTAL_URL` | ❌ | - | OAuth门户URL |

---

## 七、联系支持

如需帮助配置环境变量，请联系：

- **Manus技术支持**：https://help.manus.im
- **AWS技术支持**：https://console.aws.amazon.com/support/

---

**文档版本**：1.0  
**最后更新**：2025-12-29  
**维护者**：Canton Mutual Financial IT Team
