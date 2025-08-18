# 使用官方 Bun 镜像作为基础镜像
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# 安装依赖阶段
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# 复制源代码
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# 预发布阶段
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# 构建应用
RUN bun run build

# 生产阶段
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/apps ./apps
COPY --from=prerelease /usr/src/app/packages ./packages
COPY --from=prerelease /usr/src/app/scripts ./scripts
COPY --from=prerelease /usr/src/app/package.json .
COPY --from=prerelease /usr/src/app/tsconfig*.json ./

# 创建非root用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 bun

# 设置用户权限
USER bun

# 暴露端口
EXPOSE 3000 3001

# 启动应用
CMD ["bun", "run", "start"]