# 🔧 环境变量配置指南

本文档说明如何正确配置 Incidents Management System 的环境变量。

## 📋 快速开始

1. **复制环境变量模板**
   ```bash
   cp .env.example .env
   ```

2. **编辑 `.env` 文件**
   根据你的实际环境修改相应的配置值。

3. **验证配置**
   运行项目前确保所有必需的环境变量都已正确设置。

## 🔑 必需的环境变量

以下环境变量是项目运行的必需配置：

### 数据库配置
- `DATABASE_URL`: PostgreSQL 数据库连接字符串
- `REDIS_URL`: Redis 连接字符串

### 服务器配置
- `REST_SERVER_PORT`: REST API 服务器端口 (默认: 3000)
- `CORE_SERVER_PORT`: 核心服务器端口 (默认: 3001)

### 认证配置
- `BETTER_AUTH_SECRET`: 认证密钥 (生产环境必须更改)
- `BETTER_AUTH_URL`: 应用基础URL

## 🛠️ 开发环境配置

### 本地开发
```bash
# 数据库 (使用本地 PostgreSQL)
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/incidents?schema=public"

# Redis (使用本地 Redis)
REDIS_URL="redis://localhost:6379"

# 开发环境
NODE_ENV="development"
```

### 使用 Docker Compose
如果使用 Docker Compose 进行开发，数据库和 Redis 会自动配置，你只需要确保端口配置正确。

## 🚀 生产环境配置

### 安全注意事项
1. **更改默认密钥**: 生产环境必须使用强随机字符串作为 `BETTER_AUTH_SECRET`
2. **使用环境变量**: 不要在代码中硬编码敏感信息
3. **限制访问**: 确保 `.env` 文件不会被提交到版本控制系统

### 生成安全密钥
```bash
# 生成 32 字节的随机密钥
openssl rand -base64 32
```

## 📊 可选配置

### 邮件通知
如果需要邮件通知功能，配置以下变量：
```bash
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@yourdomain.com"
```

### 日志配置
```bash
# 日志级别: error | warn | info | debug
LOG_LEVEL="info"

# 详细日志 (开发环境可启用)
VERBOSE_LOGGING="true"
```

## 🔍 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查 `DATABASE_URL` 格式是否正确
   - 确认数据库服务正在运行
   - 验证用户名和密码

2. **Redis 连接失败**
   - 检查 `REDIS_URL` 格式是否正确
   - 确认 Redis 服务正在运行
   - 检查端口是否被占用

3. **端口冲突**
   - 修改 `REST_SERVER_PORT` 或 `CORE_SERVER_PORT`
   - 确保端口未被其他应用占用

### 验证配置
```bash
# 检查环境变量是否正确加载
bun run cli status

# 测试数据库连接
bun run db:generate

# 启动开发服务器
bun run dev
```

## 📝 环境变量参考

| 变量名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `DATABASE_URL` | string | - | PostgreSQL 连接字符串 |
| `REDIS_URL` | string | `redis://localhost:6379` | Redis 连接字符串 |
| `REST_SERVER_PORT` | number | `3000` | REST API 端口 |
| `CORE_SERVER_PORT` | number | `3001` | 核心服务端口 |
| `BETTER_AUTH_SECRET` | string | - | 认证密钥 |
| `BETTER_AUTH_URL` | string | - | 应用基础URL |
| `INIT_ADMIN_EMAIL` | string | `admin@localhost` | 初始管理员邮箱 |
| `NODE_ENV` | string | `development` | 运行环境 |
| `LOG_LEVEL` | string | `info` | 日志级别 |

---

💡 **提示**: 如果你在配置过程中遇到问题，请查看项目的 README.md 文件或联系开发团队。