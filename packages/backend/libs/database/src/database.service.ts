import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// 定义扩展的 Prisma 客户端类型
type ExtendPrismaClient = ReturnType<typeof createPrismaExtension>;

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private _prisma: ExtendPrismaClient;

  constructor() {
    // 使用工厂函数创建扩展后的 Prisma 客户端
    this._prisma = createPrismaExtension();
  }

  async onModuleInit() {
    try {
      await this._prisma.$connect();
      this.logger.log('Database connected');
    } catch (error) {
      this.logger.error('Database connection failed', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this._prisma.$disconnect();
      this.logger.log('Database disconnected');
    } catch (error) {
      this.logger.error('Database disconnection failed', error);
      throw error;
    }
  }

  get client() {
    return this._prisma;
  }
}

// 扩展工厂函数，为 Prisma 客户端添加通用功能
function createPrismaExtension() {
  // 创建基础 Prisma 客户端实例
  const prisma = new PrismaClient({
    log: [
      { emit: 'stdout', level: 'query' },
      { emit: 'stdout', level: 'error' },
      { emit: 'stdout', level: 'warn' },
    ],
    errorFormat: 'pretty',
  });

  // 通过 $extends 机制添加功能
  return prisma.$extends({});
}
