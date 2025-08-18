import { 
  group, 
  sort, 
  unique, 
  pick, 
  omit, 
  mapValues, 
  isEmpty, 
  isArray, 
  isObject,
  get,
  set,
  clone
} from 'radash'
import { Type, type Static } from '@sinclair/typebox'
import { format, parseISO, isValid } from 'date-fns'

/**
 * 数据处理工具函数集合
 * 使用 radash 库简化常见的数据操作
 */

/**
 * 按指定字段对数组进行分组
 */
export function groupByField<T extends Record<string, unknown>>(
  items: T[], 
  field: keyof T
): Record<string, T[]> {
  const result = group(items, item => String(item[field]))
  return result as Record<string, T[]>
}

/**
 * 对数组进行多字段排序
 */
export function sortByFields<T extends Record<string, unknown>>(
  items: T[],
  fields: Array<{ field: keyof T; order: 'asc' | 'desc' }>
): T[] {
  return [...items].sort((a: T, b: T) => {
    for (const { field, order } of fields) {
      const aVal = a[field]
      const bVal = b[field]
      
      if (aVal < bVal) return order === 'asc' ? -1 : 1
      if (aVal > bVal) return order === 'asc' ? 1 : -1
    }
    return 0
  })
}

/**
 * 获取数组中的唯一值
 */
export function getUniqueValues<T>(items: T[]): T[] {
  return unique(items)
}

/**
 * 从对象中选择指定字段
 */
export function selectFields<T extends Record<string, unknown>, K extends keyof T>(
  obj: T, 
  fields: K[]
): Pick<T, K> {
  return pick(obj, fields)
}

/**
 * 从对象中排除指定字段
 */
export function excludeFields<T extends Record<string, unknown>, K extends keyof T>(
  obj: T, 
  fields: K[]
): Omit<T, K> {
  return omit(obj, fields)
}

/**
 * 转换对象的所有值
 */
export function transformValues<T extends Record<string, unknown>, R>(
  obj: T,
  transformer: (value: T[keyof T], key: keyof T) => R
): Record<keyof T, R> {
  return mapValues(obj, transformer)
}

/**
 * 安全获取对象属性值
 */
export function safeGet<T = unknown>(
  obj: Record<string, unknown>, 
  path: string, 
  defaultValue?: T
): T | undefined {
  return get(obj, path, defaultValue);
}

/**
 * 安全设置对象属性值
 */
export function safeSet<T extends Record<string, unknown>>(
  obj: T, 
  path: string, 
  value: unknown
): T {
  return set(obj, path, value);
}

/**
 * 深度克隆对象
 */
export function deepClone<T>(obj: T): T {
  return clone(obj)
}

/**
 * 检查值是否为空
 */
export function checkEmpty(value: unknown): boolean {
  return isEmpty(value);
}

/**
 * 类型安全的数组检查
 */
export function isValidArray<T = unknown>(value: unknown): value is T[] {
  return isArray(value);
}

/**
 * 类型安全的对象检查
 */
export function isValidObject<T extends Record<string, unknown> = Record<string, unknown>>(
  value: unknown
): value is T {
  return isObject(value);
}

/**
 * 格式化日期字段
 */
export function formatDateFields<T extends Record<string, unknown>>(
  obj: T,
  dateFields: (keyof T)[],
  formatStr: string = 'yyyy-MM-dd HH:mm:ss'
): T {
  return transformValues(obj, (value, key) => {
    if (dateFields.includes(key)) {
      if (value instanceof Date && isValid(value)) {
        return format(value, formatStr);
      }
      if (typeof value === 'string') {
        const date = parseISO(value);
        return isValid(date) ? format(date, formatStr) : value;
      }
    }
    return value;
  }) as T;
}

/**
 * 数据验证辅助函数
 */
export const DataValidators = {
  /**
   * 验证分页参数
   */
  pagination: Type.Object({
    page: Type.Integer({ minimum: 1, default: 1 }),
    pageSize: Type.Integer({ minimum: 1, maximum: 100, default: 10 })
  }),

  /**
   * 验证排序参数
   */
  sorting: Type.Object({
    sortField: Type.Optional(Type.String({ minLength: 1 })),
    sortOrder: Type.Optional(Type.Union([Type.Literal('asc'), Type.Literal('desc')]))
  }),

  /**
   * 验证日期范围
   */
  dateRange: Type.Object({
    startDate: Type.Optional(Type.String({ format: 'date-time' })),
    endDate: Type.Optional(Type.String({ format: 'date-time' }))
  })
}

export type PaginationParams = Static<typeof DataValidators.pagination>
export type SortingParams = Static<typeof DataValidators.sorting>
export type DateRangeParams = Static<typeof DataValidators.dateRange>

/**
 * 查询过滤器选项类型
 */
type QueryFilterOptions<T> = {
  stringFields?: (keyof T)[];
  dateFields?: (keyof T)[];
  exactMatch?: (keyof T)[];
};

/**
 * 查询过滤器结果类型
 */
type QueryFilterResult<T> = {
  [K in keyof T]?: T[K] extends string
    ? string | { contains: string; mode: 'insensitive' }
    : T[K] extends Date
    ? Date | { gte?: Date; lte?: Date }
    : T[K];
};

/**
 * 构建类型安全的查询过滤器
 */
export function buildQueryFilter<T extends Record<string, unknown>>(
  filters: Partial<T>,
  options: QueryFilterOptions<T> = {}
): QueryFilterResult<T> {
  const { stringFields = [], dateFields = [], exactMatch = [] } = options;
  const where = {} as QueryFilterResult<T>;

  (Object.entries(filters) as Array<[keyof T, T[keyof T]]>).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    if (exactMatch.includes(key)) {
      (where as Record<keyof T, unknown>)[key] = value;
    } else if (stringFields.includes(key)) {
      (where as Record<keyof T, unknown>)[key] = { 
        contains: value as string, 
        mode: 'insensitive' as const 
      };
    } else if (dateFields.includes(key)) {
      const date = typeof value === 'string' ? parseISO(value as string) : (value as unknown as Date);
      if (date instanceof Date && isValid(date)) {
        (where as Record<keyof T, unknown>)[key] = date;
      }
    } else {
      (where as Record<keyof T, unknown>)[key] = value;
    }
  });

  return where;
}