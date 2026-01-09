# Canton Mutual Financial Limited - AWS部署指引

## 项目概述

**项目名称**：Canton Mutual Financial Limited - 企业官网  
**技术栈**：React 19 + Node.js + PostgreSQL + S3存储  
**部署目标**：AWS云平台（推荐使用AWS Elastic Beanstalk或EC2 + RDS + S3）

---

## 一、部署架构建议

### 推荐架构（AWS Elastic Beanstalk）

```
用户请求
    ↓
CloudFront (CDN) ← S3 (静态资源 + 图片存储)
    ↓
Application Load Balancer
    ↓
Elastic Beanstalk (Node.js应用)
    ↓
RDS PostgreSQL (数据库)
```

### 替代架构（EC2手动部署）

```
用户请求
    ↓
CloudFront (CDN) ← S3 (静态资源 + 图片存储)
    ↓
EC2实例 (Node.js应用 + Nginx反向代理)
    ↓
RDS PostgreSQL (数据库)
```

---

## 二、前置准备

### 2.1 AWS服务清单

需要开通以下AWS服务：

1. **RDS PostgreSQL** - 数据库服务
2. **S3** - 对象存储（图片和静态资源）
3. **IAM** - 权限管理
4. **Elastic Beanstalk** 或 **EC2** - 应用服务器
5. **CloudFront**（可选）- CDN加速
6. **Route 53**（可选）- 域名解析

### 2.2 本地工具准备

- AWS CLI（命令行工具）
- Node.js 22.x
- pnpm包管理器
- PostgreSQL客户端（用于数据库初始化）

---

## 三、数据库部署

### 3.1 创建RDS PostgreSQL实例

1. 登录AWS控制台，进入RDS服务
2. 点击"创建数据库"
3. 选择配置：
   - **引擎类型**：PostgreSQL
   - **版本**：15.x或更高
   - **实例类型**：db.t3.micro（测试）或db.t3.small（生产）
   - **存储**：20GB起（可自动扩展）
   - **公开访问**：否（仅VPC内访问）
   - **备份保留期**：7天
4. 记录以下信息：
   - 数据库端点（Endpoint）
   - 端口（默认5432）
   - 主用户名
   - 主密码

### 3.2 初始化数据库

```bash
# 1. 连接到RDS数据库
psql -h <RDS_ENDPOINT> -U <MASTER_USERNAME> -d postgres

# 2. 创建应用数据库
CREATE DATABASE canton_financial;

# 3. 退出psql
\q

# 4. 运行数据库迁移（在项目目录）
export DATABASE_URL="postgresql://<USERNAME>:<PASSWORD>@<RDS_ENDPOINT>:5432/canton_financial"
pnpm db:push
```

---

## 四、S3存储配置

### 4.1 创建S3存储桶

```bash
# 使用AWS CLI创建存储桶
aws s3 mb s3://canton-financial-assets --region ap-southeast-1

# 配置存储桶CORS
aws s3api put-bucket-cors --bucket canton-financial-assets --cors-configuration file://s3-cors.json
```

**s3-cors.json内容**：

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://yourdomain.com", "https://www.yourdomain.com"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

### 4.2 创建IAM用户和访问密钥

1. 进入IAM控制台，创建新用户 `canton-financial-app`
2. 附加权限策略：`AmazonS3FullAccess`（或创建自定义策略限制到特定bucket）
3. 创建访问密钥（Access Key），记录：
   - Access Key ID
   - Secret Access Key

### 4.3 配置S3存储桶权限

本项目直接使用AWS S3存储图片。需要配置S3存储桶的公开访问权限：

```bash
# 配置存储桶策略，允许公开读取
aws s3api put-bucket-policy --bucket canton-financial-images --policy '{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::canton-financial-images/*"
  }]
}'

# 禁用块公共访问设置（允许通过策略控制）
aws s3api put-public-access-block --bucket canton-financial-images --public-access-block-configuration \
  "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

---

## 五、应用部署

### 方案A：使用Elastic Beanstalk（推荐）

#### 5.1 准备部署包

```bash
# 1. 构建生产环境文件
cd /path/to/canton-financial-test
pnpm build

# 2. 创建部署包
zip -r canton-financial-deployment.zip \
  dist/ \
  drizzle/ \
  node_modules/ \
  package.json \
  .npmrc \
  Procfile

# 注意：node_modules很大，建议使用.ebignore排除，在EB上重新安装
```

#### 5.2 创建Elastic Beanstalk应用

1. 登录AWS控制台，进入Elastic Beanstalk
2. 点击"创建应用程序"
3. 配置：
   - **应用程序名称**：canton-financial
   - **平台**：Node.js 22
   - **应用程序代码**：上传 `canton-financial-deployment.zip`
4. 配置环境变量（见第六节）
5. 点击"创建环境"

#### 5.3 配置Procfile

在项目根目录创建 `Procfile`：

```
web: node dist/index.js
```

### 方案B：使用EC2手动部署

#### 5.1 启动EC2实例

1. 选择Amazon Linux 2023或Ubuntu 22.04 LTS
2. 实例类型：t3.small或更高
3. 配置安全组：
   - 入站规则：允许80（HTTP）、443（HTTPS）、22（SSH）
4. 创建或选择密钥对

#### 5.2 安装依赖

```bash
# SSH连接到EC2实例
ssh -i your-key.pem ec2-user@<EC2_PUBLIC_IP>

# 安装Node.js 22
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo yum install -y nodejs

# 安装pnpm
sudo npm install -g pnpm

# 安装Nginx
sudo yum install -y nginx
```

#### 5.3 部署应用

```bash
# 1. 创建应用目录
sudo mkdir -p /var/www/canton-financial
sudo chown ec2-user:ec2-user /var/www/canton-financial

# 2. 上传部署包（在本地执行）
scp -i your-key.pem canton-financial-deployment.zip ec2-user@<EC2_PUBLIC_IP>:/var/www/canton-financial/

# 3. 解压并安装依赖（在EC2上执行）
cd /var/www/canton-financial
unzip canton-financial-deployment.zip
pnpm install --prod

# 4. 配置环境变量
sudo nano /var/www/canton-financial/.env
# 粘贴环境变量内容（见第六节）

# 5. 使用PM2管理进程
sudo npm install -g pm2
pm2 start dist/index.js --name canton-financial
pm2 startup
pm2 save
```

#### 5.4 配置Nginx反向代理

```bash
sudo nano /etc/nginx/conf.d/canton-financial.conf
```

**Nginx配置内容**：

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# 测试配置并重启Nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

## 六、环境变量配置

在AWS部署环境中配置以下环境变量：

### 6.1 数据库配置

```bash
DATABASE_URL=postgresql://<USERNAME>:<PASSWORD>@<RDS_ENDPOINT>:5432/canton_financial
```

### 6.2 AWS S3存储配置

```bash
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=<您的AWS Access Key ID>
AWS_SECRET_ACCESS_KEY=<您的AWS Secret Access Key>
S3_BUCKET_NAME=canton-financial-images
```

### 6.3 JWT和认证配置

```bash
JWT_SECRET=<生成一个强随机字符串，至少32字符>
OAUTH_SERVER_URL=<OAuth服务器URL，如使用>
OWNER_NAME=<所有者名称>
OWNER_OPEN_ID=<所有者OpenID>
```

生成JWT_SECRET示例：

```bash
openssl rand -base64 32
```

### 6.4 SMTP邮件配置

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=<应用专用密码>
SMTP_FROM=noreply@yourdomain.com
```

### 6.5 前端配置

```bash
VITE_APP_TITLE=Canton Mutual Financial Limited
VITE_APP_LOGO=/logo.png
VITE_APP_ID=<应用ID>
VITE_ANALYTICS_WEBSITE_ID=<分析网站ID>
VITE_ANALYTICS_ENDPOINT=<分析端点URL>
VITE_FRONTEND_FORGE_API_KEY=<前端Forge API Key>
VITE_FRONTEND_FORGE_API_URL=<前端Forge API URL>
VITE_OAUTH_PORTAL_URL=<OAuth门户URL>
```

### 6.6 生产环境标识

```bash
NODE_ENV=production
PORT=3000
```

---

## 七、SSL证书配置

### 使用AWS Certificate Manager（推荐）

1. 进入ACM控制台
2. 请求公有证书
3. 输入域名：`yourdomain.com` 和 `*.yourdomain.com`
4. 选择DNS验证
5. 在Route 53中添加验证记录
6. 等待证书颁发
7. 在Load Balancer或CloudFront中绑定证书

### 使用Let's Encrypt（EC2部署）

```bash
# 安装Certbot
sudo yum install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 自动续期
sudo certbot renew --dry-run
```

---

## 八、CloudFront CDN配置（可选）

### 8.1 创建CloudFront分配

1. 进入CloudFront控制台
2. 创建分配：
   - **源域**：Elastic Beanstalk URL或EC2公网IP
   - **查看器协议策略**：重定向HTTP到HTTPS
   - **允许的HTTP方法**：GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
   - **缓存策略**：CachingOptimized
   - **备用域名（CNAME）**：yourdomain.com, www.yourdomain.com
   - **SSL证书**：选择ACM证书
3. 创建后记录CloudFront域名

### 8.2 配置Route 53

1. 创建A记录（Alias）：
   - **名称**：yourdomain.com
   - **类型**：A - IPv4地址
   - **别名**：是
   - **别名目标**：选择CloudFront分配
2. 创建CNAME记录：
   - **名称**：www
   - **类型**：CNAME
   - **值**：yourdomain.com

---

## 九、数据库初始数据

### 9.1 新闻数据导入

如果需要导入现有新闻数据：

```bash
# 连接到RDS数据库
psql -h <RDS_ENDPOINT> -U <USERNAME> -d canton_financial

# 导入SQL文件
\i /path/to/news_data.sql
```

### 9.2 Console后台账号

默认后台登录凭证（**生产环境请务必修改**）：

- **用户名**：admin
- **密码**：Cmf25617028%

修改方式：编辑 `client/src/pages/Console.tsx` 文件中的常量：

```typescript
const ADMIN_USERNAME = "your_new_username";
const ADMIN_PASSWORD = "your_new_password";
```

---

## 十、部署后验证

### 10.1 健康检查

访问以下URL验证部署：

```
https://yourdomain.com/          # 首页
https://yourdomain.com/console   # 后台管理
https://yourdomain.com/news      # 新闻页面
```

### 10.2 功能测试清单

- [ ] 首页加载正常，股市数据显示
- [ ] 新闻弹窗可以打开和关闭
- [ ] 新闻页面图片正常显示
- [ ] 图片点击放大功能正常
- [ ] Console后台可以登录
- [ ] 可以发布新闻（包括图片上传）
- [ ] 可以编辑和删除新闻
- [ ] 图片拖拽排序功能正常
- [ ] 批量图片上传功能正常
- [ ] AI聊天机器人功能正常

### 10.3 性能测试

```bash
# 使用Apache Bench测试
ab -n 1000 -c 10 https://yourdomain.com/

# 使用Lighthouse测试（Chrome DevTools）
# 目标：Performance > 90, Accessibility > 90
```

---

## 十一、监控和日志

### 11.1 CloudWatch日志

Elastic Beanstalk自动将日志发送到CloudWatch。查看方式：

1. 进入CloudWatch控制台
2. 选择"日志组" → `/aws/elasticbeanstalk/canton-financial/`
3. 查看应用日志和错误

### 11.2 应用监控

推荐集成：

- **AWS CloudWatch** - 基础监控（CPU、内存、网络）
- **New Relic** 或 **Datadog** - APM性能监控
- **Sentry** - 错误追踪

### 11.3 数据库监控

在RDS控制台启用：

- **Enhanced Monitoring** - 详细性能指标
- **Performance Insights** - 查询性能分析
- **自动备份** - 每日备份，保留7天

---

## 十二、备份和灾难恢复

### 12.1 数据库备份

```bash
# 手动创建快照
aws rds create-db-snapshot \
  --db-instance-identifier canton-financial-db \
  --db-snapshot-identifier canton-financial-backup-$(date +%Y%m%d)

# 恢复快照
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier canton-financial-db-restored \
  --db-snapshot-identifier canton-financial-backup-20250101
```

### 12.2 S3备份

S3数据自动多区域复制，建议启用版本控制：

```bash
aws s3api put-bucket-versioning \
  --bucket canton-financial-assets \
  --versioning-configuration Status=Enabled
```

### 12.3 应用代码备份

- 使用Git仓库管理代码（GitHub/GitLab/CodeCommit）
- 定期导出Elastic Beanstalk应用版本
- 保存环境变量配置文件

---

## 十三、安全最佳实践

### 13.1 网络安全

- ✅ RDS仅允许VPC内访问，不对公网开放
- ✅ 使用安全组限制入站流量
- ✅ 启用VPC Flow Logs监控网络流量
- ✅ 使用AWS WAF防护Web攻击

### 13.2 数据安全

- ✅ 启用RDS加密（静态数据）
- ✅ 使用SSL/TLS连接数据库（传输加密）
- ✅ 定期轮换数据库密码和API密钥
- ✅ 使用AWS Secrets Manager管理敏感信息

### 13.3 访问控制

- ✅ 使用IAM角色而非长期访问密钥
- ✅ 启用MFA（多因素认证）
- ✅ 遵循最小权限原则
- ✅ 定期审计IAM权限

---

## 十四、常见问题排查

### 14.1 应用无法启动

**症状**：Elastic Beanstalk环境健康状态为"严重"

**排查步骤**：

1. 查看CloudWatch日志：`/aws/elasticbeanstalk/canton-financial/var/log/nodejs/nodejs.log`
2. 检查环境变量是否完整配置
3. 验证数据库连接字符串格式
4. 确认Node.js版本兼容（需要22.x）

### 14.2 数据库连接失败

**症状**：应用日志显示 `ECONNREFUSED` 或 `timeout`

**解决方案**：

1. 检查RDS安全组入站规则，允许应用服务器访问5432端口
2. 验证DATABASE_URL格式：`postgresql://username:password@host:5432/database`
3. 确认RDS实例状态为"可用"
4. 测试网络连通性：`telnet <RDS_ENDPOINT> 5432`

### 14.3 图片上传失败

**症状**：Console后台上传图片时报错

**解决方案**：

1. 检查S3存储桶CORS配置
2. 验证IAM用户权限（需要s3:PutObject权限）
3. 确认BUILT_IN_FORGE_API_KEY和BUILT_IN_FORGE_API_URL配置正确
4. 查看应用日志中的详细错误信息

### 14.4 SSL证书错误

**症状**：浏览器显示"您的连接不是私密连接"

**解决方案**：

1. 确认ACM证书状态为"已颁发"
2. 检查CloudFront或Load Balancer是否正确绑定证书
3. 验证域名DNS解析是否指向正确的CloudFront/ALB
4. 等待DNS传播（最多48小时）

---

## 十五、成本估算

### 基础配置（小型生产环境）

| 服务 | 配置 | 月费用（USD） |
|------|------|---------------|
| EC2 (t3.small) | 2 vCPU, 2GB RAM | $15 |
| RDS (db.t3.micro) | PostgreSQL | $15 |
| S3 | 50GB存储 + 传输 | $5 |
| CloudFront | 100GB传输 | $10 |
| Route 53 | 1个托管区域 | $0.50 |
| **总计** | | **$45.50/月** |

### 推荐配置（中型生产环境）

| 服务 | 配置 | 月费用（USD） |
|------|------|---------------|
| Elastic Beanstalk (t3.medium) | 2 vCPU, 4GB RAM | $30 |
| RDS (db.t3.small) | PostgreSQL | $30 |
| S3 | 200GB存储 + 传输 | $15 |
| CloudFront | 500GB传输 | $40 |
| Route 53 | 1个托管区域 | $0.50 |
| **总计** | | **$115.50/月** |

*注：实际费用因流量和使用情况而异，以上为估算值*

---

## 十六、联系支持

### 技术支持

- **Manus平台支持**：https://help.manus.im
- **AWS技术支持**：https://console.aws.amazon.com/support/

### 文档资源

- **AWS Elastic Beanstalk文档**：https://docs.aws.amazon.com/elasticbeanstalk/
- **AWS RDS文档**：https://docs.aws.amazon.com/rds/
- **Node.js部署最佳实践**：https://nodejs.org/en/docs/guides/

---

## 附录A：快速部署命令清单

```bash
# 1. 构建项目
pnpm build

# 2. 创建部署包
zip -r deployment.zip dist/ drizzle/ package.json .npmrc Procfile

# 3. 初始化数据库
export DATABASE_URL="postgresql://user:pass@host:5432/db"
pnpm db:push

# 4. 上传到Elastic Beanstalk
eb init -p node.js-22 canton-financial
eb create canton-financial-prod
eb setenv DATABASE_URL="..." BUILT_IN_FORGE_API_KEY="..." # ... 其他环境变量
eb deploy

# 5. 验证部署
curl https://yourdomain.com
```

---

## 附录B：环境变量模板

创建 `.env.production` 文件：

```bash
# 数据库
DATABASE_URL=postgresql://username:password@rds-endpoint:5432/canton_financial

# S3存储（Manus代理）
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_forge_api_key

# JWT和认证
JWT_SECRET=your_jwt_secret_at_least_32_characters
OAUTH_SERVER_URL=https://oauth.yourdomain.com
OWNER_NAME=Admin
OWNER_OPEN_ID=admin_open_id

# SMTP邮件
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@yourdomain.com

# 前端配置
VITE_APP_TITLE=Canton Mutual Financial Limited
VITE_APP_LOGO=/logo.png
VITE_APP_ID=canton-financial
VITE_ANALYTICS_WEBSITE_ID=your_analytics_id
VITE_ANALYTICS_ENDPOINT=https://analytics.yourdomain.com
VITE_FRONTEND_FORGE_API_KEY=your_frontend_forge_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.yourdomain.com

# 生产环境
NODE_ENV=production
PORT=3000
```

---

**文档版本**：1.0  
**最后更新**：2025-12-29  
**维护者**：Canton Mutual Financial IT Team
