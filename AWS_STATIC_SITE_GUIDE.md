# AWS S3 + CloudFront 静态部署（canton-financial-test）

本项目的前端是 **Vite 静态构建**，产物在：`dist/public/`。

> 后端（Express / WebSocket / TRPC API）如果还需要保留，请单独部署（例如 ECS/Lambda/EC2/Railway）。本指南仅覆盖 **纯静态前端** 成本最低方案。

## 1) AWS 资源准备

### 1.1 S3 Bucket
- 建议 bucket 名：`cmf-website-<env>`
- 开启 **Static website hosting**（如果你只用 CloudFront 也可以不开 website hosting，改用 OAC 访问）

### 1.2 CloudFront
- Origin 指向 S3 bucket
- Default root object: `index.html`
- SPA（React Router）需要把 403/404 重写到 `/index.html`

## 2) 本地一键部署脚本

仓库已提供：`scripts/deploy-aws-static.sh`

```bash
cd canton-financial-test

export AWS_S3_BUCKET=cmf-website-prod
export AWS_REGION=ap-east-1
export CLOUDFRONT_DISTRIBUTION_ID=E1234567890ABC  # 可选

./scripts/deploy-aws-static.sh
```

脚本策略：
- `assets/*` 使用长缓存（immutable）
- `index.html` 使用 no-cache，方便快速生效
- 若填了 `CLOUDFRONT_DISTRIBUTION_ID`，会自动创建 invalidation

## 3) 环境变量（可选）

如果需要 Umami（或其他）统计：
- `VITE_ANALYTICS_ENDPOINT`
- `VITE_ANALYTICS_WEBSITE_ID`

未配置时不会注入统计脚本。

## 4) 注意事项

- 若启用 CloudFront + SPA 路由，务必配置错误页重写到 `index.html`，否则刷新子路由会 404。
- 若需要自定义域名与 HTTPS，建议使用 CloudFront + ACM 证书。
