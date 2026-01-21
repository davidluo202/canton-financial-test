# 开发环境与生产环境差异说明

## 概述

本项目采用**双数据库方案**：
- **开发环境**：使用MySQL（Manus内置数据库）
- **生产环境**：使用PostgreSQL（AWS RDS）

这种设计允许开发人员在Manus平台上正常开发和测试，同时确保生产部署使用PostgreSQL以满足AWS架构要求。

---

## 数据库差异

### 开发环境（MySQL）

**使用场景**：Manus开发平台

**数据库配置**：
- DATABASE_URL: `mysql://...`（Manus自动注入）
- Schema文件: `drizzle/schema.ts`（MySQL语法）
- 驱动: `drizzle-orm/mysql2`

**Schema特点**：
```typescript
import { mysqlTable, mysqlEnum, int } from "drizzle-orm/mysql-core";

export const roleEnum = mysqlEnum("role", ["user", "admin"]);
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  role: roleEnum.default("user").notNull(),
  // ...
});
```

**数据库操作**：
- 使用 `onDuplicateKeyUpdate` 处理冲突
- 插入返回 `result[0].insertId`

### 生产环境（PostgreSQL）

**使用场景**：AWS部署（Elastic Beanstalk或EC2 + RDS）

**数据库配置**：
- DATABASE_URL: `postgresql://...?sslmode=require`
- Schema文件: `drizzle/schema.postgres.ts`（PostgreSQL语法）
- 驱动: `drizzle-orm/postgres-js`

**Schema特点**：
```typescript
import { pgTable, pgEnum, serial } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  role: roleEnum("role").default("user").notNull(),
  // ...
});
```

**数据库操作**：
- 使用 `onConflictDoUpdate` 处理冲突
- 插入返回 `result[0]?.id`（需要 `.returning()`）

---

## 文件结构

```
drizzle/
├── schema.ts              # 主schema（MySQL，用于开发）
├── schema.mysql.ts        # MySQL专用schema（备份）
├── schema.postgres.ts     # PostgreSQL专用schema（生产部署用）
├── drizzle.config.ts      # Drizzle配置（开发环境用MySQL）
└── migrations/            # 迁移文件

server/
├── db.ts                  # 数据库连接（开发环境用MySQL驱动）
└── newsRouter.ts          # API路由（使用MySQL语法）
```

---

## AWS部署前准备

### 步骤1：替换Schema文件

在创建生产部署包之前，需要将PostgreSQL schema替换为主schema：

```bash
# 备份当前MySQL schema
cp drizzle/schema.ts drizzle/schema.mysql.backup.ts

# 使用PostgreSQL schema
cp drizzle/schema.postgres.ts drizzle/schema.ts
```

### 步骤2：更新数据库连接代码

修改 `server/db.ts`：

```typescript
// 改为PostgreSQL驱动
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL);
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// 修改upsert为PostgreSQL语法
await db.insert(users).values(values).onConflictDoUpdate({
  target: users.openId,
  set: updateSet,
});
```

### 步骤3：更新newsRouter.ts

修改 `server/newsRouter.ts` 中的insert操作：

```typescript
// PostgreSQL需要使用.returning()
const result = await db.insert(news).values({...}).returning();
return { success: true, id: result[0]?.id };
```

### 步骤4：更新Drizzle配置

修改 `drizzle.config.ts`：

```typescript
export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",  // 改为postgresql
  dbCredentials: {
    url: connectionString,
  },
});
```

### 步骤5：重新构建

```bash
# 安装PostgreSQL依赖（如果还没有）
pnpm add postgres pg

# 重新构建
pnpm build

# 创建部署包
zip -r canton-deployment-postgresql.zip dist/ drizzle/ package.json pnpm-lock.yaml Procfile
```

---

## 自动化部署脚本

为了简化部署流程，可以创建一个自动化脚本：

**deploy-to-aws.sh**：

```bash
#!/bin/bash

echo "准备AWS PostgreSQL部署包..."

# 1. 备份当前MySQL文件
cp drizzle/schema.ts drizzle/schema.mysql.backup.ts
cp server/db.ts server/db.mysql.backup.ts
cp server/newsRouter.ts server/newsRouter.mysql.backup.ts
cp drizzle.config.ts drizzle.config.mysql.backup.ts

# 2. 替换为PostgreSQL版本
cp drizzle/schema.postgres.ts drizzle/schema.ts

# 3. 更新db.ts为PostgreSQL驱动
sed -i 's/drizzle-orm\/mysql2/drizzle-orm\/postgres-js/g' server/db.ts
sed -i 's/onDuplicateKeyUpdate/onConflictDoUpdate/g' server/db.ts

# 4. 更新newsRouter.ts
sed -i 's/result\[0\]\.insertId/result[0]?.id/g' server/newsRouter.ts
sed -i 's/\.values({/\.values({\n      }).returning();\n\n      return { success: true, id: result[0]?.id };/g' server/newsRouter.ts

# 5. 更新drizzle.config.ts
sed -i 's/dialect: "mysql"/dialect: "postgresql"/g' drizzle.config.ts

# 6. 构建
pnpm build

# 7. 创建部署包
zip -r canton-deployment-postgresql.zip \
  dist/ \
  drizzle/ \
  package.json \
  pnpm-lock.yaml \
  Procfile \
  AWS_DEPLOYMENT_GUIDE.md \
  ENV_VARIABLES_GUIDE.md

echo "部署包创建完成: canton-deployment-postgresql.zip"

# 8. 恢复MySQL文件（用于继续开发）
mv drizzle/schema.mysql.backup.ts drizzle/schema.ts
mv server/db.mysql.backup.ts server/db.ts
mv server/newsRouter.mysql.backup.ts server/newsRouter.ts
mv drizzle.config.mysql.backup.ts drizzle.config.ts

echo "开发环境文件已恢复"
```

---

## 常见问题

### Q1: 为什么不使用统一的数据库？

**A1**: Manus开发平台提供的是MySQL数据库，而AWS生产环境使用PostgreSQL RDS。为了在两个环境中都能正常运行，采用了双schema方案。

### Q2: 如何确保两个schema保持同步？

**A2**: 
1. 所有schema修改都应该同时更新 `schema.mysql.ts` 和 `schema.postgres.ts`
2. 使用相同的表名、列名和数据类型
3. 只有主键定义（`int().autoincrement()` vs `serial()`）和枚举定义不同

### Q3: 部署到AWS后如何回滚？

**A3**: 
1. 使用之前保存的检查点
2. 或者从备份的MySQL文件恢复
3. 重新构建和部署

### Q4: 能否在开发环境使用PostgreSQL？

**A4**: 可以，但需要：
1. 自行搭建PostgreSQL数据库
2. 修改DATABASE_URL指向自己的PostgreSQL实例
3. 使用 `schema.postgres.ts` 作为主schema

---

## 数据迁移

如果需要将开发环境的MySQL数据迁移到生产环境的PostgreSQL：

### 方法1：使用pgloader

```bash
# 安装pgloader
sudo apt-get install pgloader

# 执行迁移
pgloader mysql://user:pass@mysql-host/dbname \
          postgresql://user:pass@postgres-host/dbname
```

### 方法2：导出/导入SQL

```bash
# 1. 从MySQL导出数据
mysqldump -u user -p dbname > data.sql

# 2. 转换SQL语法（手动或使用工具）
# - AUTO_INCREMENT → SERIAL
# - ENGINE=InnoDB → 删除
# - 反引号 → 双引号

# 3. 导入到PostgreSQL
psql -U user -d dbname < data_converted.sql
```

---

## 维护建议

1. **保持schema同步**：每次修改schema时，同时更新MySQL和PostgreSQL版本
2. **测试两个环境**：重要功能应该在两个数据库环境中都测试
3. **文档更新**：任何schema变更都应更新本文档
4. **版本控制**：将 `schema.postgres.ts` 纳入版本控制，确保生产部署使用正确版本

---

**文档版本**：v1.0  
**最后更新**：2025-01-20  
**维护人员**：开发团队
