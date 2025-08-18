1. 当前项目使用的框架及技术
   1. 前端框架：Vue 3 + primevue + Tailwind CSS + typescript
   2. 后端框架：Bun + Elysia
   3. 数据库：PostgreSQL + Prisma
   4. 消息队列：Redis + BullMQ
   5. 安全：better-auth + prisma-adapter
      1. organization plugin
      2. apiKey plugin
   6. 项目运行环境：Bun
   7. 代码规范：oxlint + prettier
   8. 项目部署：Docker + Nginx
   9. 使用Justfile 进行项目管理
2. 目录结构
   1. /apps 项目应用
      1. /web 前端应用 用于展示数据和提供用户交互界面 配置核心服务所需的数据
         1. /src/api 使bun run api:gen 生成
      2. /rest-server 后端RestApi 服务 用于处理前端请求 提供RestApi接口， 使用ApiKey和organization进行安全认证
      3. /core-server 后端核心服务 用于处理Alert，创建Incident 不使用安全认证，只使用消息队列进行通信
   2. /packages 项目依赖
      1. /auth 项目认证
      2. /database 项目数据库 
      3. /queue 项目消息队列 
      4. /common 项目公共模块
   3. /deploy 项目部署
      1. Dockerfile
      2. docker-compose.yml
      3. nginx.conf
3. 通用依赖包
   1. 日期时间处理 date-fns
   2. 日志处理 pino + pino-pretty
   3. 类型检查 typebox
   4. 数据库操作 prisma
   5. 消息队列操作 bullmq
   6. 安全认证 better-auth
   7. 项目运行环境 bun
   8. 代码规范 oxlint prettier
   9. 项目部署 docker nginx
   10. 工具库 radash
