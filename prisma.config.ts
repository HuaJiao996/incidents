import path from 'node:path';
import type { PrismaConfig } from 'prisma';

/**
 * Prisma配置文件
 * 定义schema路径和种子脚本
 */
export default {
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: 'bun run ./prisma/seed.ts'
  }
} satisfies PrismaConfig;