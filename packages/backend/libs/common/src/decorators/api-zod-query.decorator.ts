import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { ZodObject, ZodRawShape, z } from 'zod';

type ZodDtoInput = unknown;

export function ApiZodQuery(dto: ZodDtoInput) {
  // 处理不同类型的输入
  // 1. ZodObject - 直接使用
  // 2. 由createZodDto创建的类 - 需要通过原型获取
  // 3. schema静态属性 - 有些DTO类可能有这个

  let schema: ZodObject<ZodRawShape>;

  try {
    if (dto instanceof ZodObject) {
      // 直接传入了schema
      schema = dto;
    } else if (typeof dto === 'function' && dto.prototype) {
      // 处理类
      if ((dto as any).schema) {
        // 有静态schema属性的类
        schema = (dto as any).schema;
      } else if (
        dto.prototype.constructor &&
        dto.prototype.constructor._schema
      ) {
        // nestjs-zod创建的类
        schema = dto.prototype.constructor._schema;
      } else if ((dto as any)._schema) {
        // 有静态_schema属性的类
        schema = (dto as any)._schema;
      } else {
        throw new Error('无法获取schema');
      }
    } else {
      throw new Error('无效的输入类型');
    }
  } catch (error) {
    console.error('Error in ApiZodQuery:', error);
    return applyDecorators(); // 返回空装饰器
  }

  if (!schema || !schema.shape) {
    console.error('Invalid schema or schema.shape');
    return applyDecorators(); // 返回空装饰器
  }

  const queries: Array<typeof ApiQuery> = [];

  for (const [key, value] of Object.entries(schema.shape)) {
    const zodType = value;
    const isOptional = zodType.isOptional();
    const description = zodType.description;

    queries.push(
      ApiQuery({
        name: key,
        required: !isOptional,
        type: zodType instanceof z.ZodNumber ? Number : String,
        description,
      }),
    );
  }

  return applyDecorators(...queries);
}
