import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from './prisma';

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
      this.logger.log('数据库连接成功');
    } catch (error) {
      this.logger.error('数据库连接失败', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this._prisma.$disconnect();
      this.logger.log('数据库断开连接成功');
    } catch (error) {
      this.logger.error('数据库断开连接失败', error);
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
  return prisma.$extends({
    // name: 'enhanced-client',
    // model: {
    //   // 为所有模型添加分页功能
    //   $allModels: {
    //     // 分页查询
    //     async paginate<T extends Record<string, any>>(
    //       this: T,
    //       params: {
    //         page?: number;
    //         limit?: number;
    //         where?: any;
    //         orderBy?: any;
    //         include?: any;
    //         select?: any;
    //       } = {},
    //     ) {
    //       const {
    //         page = 1,
    //         limit = 10,
    //         where = {},
    //         orderBy = { createdAt: 'desc' },
    //         include,
    //         select,
    //       } = params;

    //       const skip = (page - 1) * limit;
    //       const [total, items] = await Promise.all([
    //         (this as any).count({ where }),
    //         (this as any).findMany({
    //           where,
    //           skip,
    //           take: limit,
    //           orderBy,
    //           include,
    //           select,
    //         }),
    //       ]);

    //       return {
    //         items,
    //         pagination: {
    //           total,
    //           page,
    //           limit,
    //           totalPages: Math.ceil(total / limit),
    //           hasNextPage: page < Math.ceil(total / limit),
    //           hasPreviousPage: page > 1,
    //         },
    //       };
    //     },

    //     // 批量创建
    //     async createBatch<T extends Record<string, any>>(
    //       this: T,
    //       data: any[],
    //       options?: { skipDuplicates?: boolean },
    //     ) {
    //       return (this as any).createMany({
    //         data,
    //         skipDuplicates: options?.skipDuplicates,
    //       });
    //     },

    //     // 批量更新
    //     async updateBatch<T extends Record<string, any>>(
    //       this: T,
    //       where: any,
    //       data: any,
    //     ) {
    //       return (this as any).updateMany({
    //         where,
    //         data,
    //       });
    //     },

    //     // 软删除
    //     async softDelete<T extends Record<string, any>>(
    //       this: T,
    //       where: any,
    //     ) {
    //       return (this as any).update({
    //         where,
    //         data: {
    //           deletedAt: new Date(),
    //         },
    //       });
    //     },

    //     // 批量软删除
    //     async softDeleteBatch<T extends Record<string, any>>(
    //       this: T,
    //       where: any,
    //     ) {
    //       return (this as any).updateMany({
    //         where,
    //         data: {
    //           deletedAt: new Date(),
    //         },
    //       });
    //     },

    //     // 恢复已软删除的记录
    //     async restore<T extends Record<string, any>>(
    //       this: T,
    //       where: any,
    //     ) {
    //       return (this as any).update({
    //         where,
    //         data: {
    //           deletedAt: null,
    //         },
    //       });
    //     },

    //     // 批量恢复已软删除的记录
    //     async restoreBatch<T extends Record<string, any>>(
    //       this: T,
    //       where: any,
    //     ) {
    //       return (this as any).updateMany({
    //         where,
    //         data: {
    //           deletedAt: null,
    //         },
    //       });
    //     },

    //     // 查询单条包含软删除过滤
    //     async findUnique<T extends Record<string, any>>(
    //       this: T,
    //       args: any,
    //     ) {
    //       // 如果原始参数中没有明确指定包含已删除项
    //       if (!args.where?.deletedAt) {
    //         args.where = {
    //           ...args.where,
    //           deletedAt: null,
    //         };
    //       }
          
    //       return (this as any).$originalFindUnique(args);
    //     },

    //     // 查询多条包含软删除过滤
    //     async findMany<T extends Record<string, any>>(
    //       this: T,
    //       args: any = {},
    //     ) {
    //       // 如果原始参数中没有明确指定包含已删除项
    //       if (!args.where?.deletedAt) {
    //         args.where = {
    //           ...args.where,
    //           deletedAt: null,
    //         };
    //       }
          
    //       return (this as any).$originalFindMany(args);
    //     },

    //     // 包含已删除项的查询
    //     async findWithDeleted<T extends Record<string, any>>(
    //       this: T,
    //       args: any = {},
    //     ) {
    //       // 移除 deletedAt 条件，查询所有记录
    //       if (args.where?.deletedAt === null) {
    //         const { deletedAt, ...rest } = args.where;
    //         args.where = rest;
    //       }
          
    //       return (this as any).$originalFindMany(args);
    //     },
    //   },
    // },
    // query: {
    //   async $allOperations({ operation, model, args, query }) {
    //     const logger = new Logger(`Prisma:${model}:${operation}`);
    //     const startTime = Date.now();
        
    //     try {
    //       // 执行原始查询
    //       const result = await query(args);
          
    //       // 记录成功的查询
    //       logger.debug({
    //         duration: `${Date.now() - startTime}ms`,
    //         args: JSON.stringify(args),
    //       });
          
    //       return result;
    //     } catch (error) {
    //       // 记录错误
    //       logger.error({
    //         error: error instanceof Error ? error.message : String(error),
    //         duration: `${Date.now() - startTime}ms`,
    //         args: JSON.stringify(args),
    //       });
          
    //       throw error;
    //     }
    //   },
    // },
  });
}
