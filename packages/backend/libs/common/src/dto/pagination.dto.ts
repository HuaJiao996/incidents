import { z } from "zod";

export class PaginationDto {
  total: number;
  page: number;
  pageSize: number;
}


export const PaginationQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number),
  pageSize: z.string().regex(/^\d+$/).transform(Number),
  
  // 排序参数 - 支持多字段，用逗号分隔
  sortFields: z.string().optional(),
  sortOrders: z.string().optional()
    .transform(val => val?.split(',').map(order => order.toLowerCase())),
});