import { isNumber, isString } from 'radash';

/**
 * 基础验证器函数
 * 用于验证字段值是否符合指定类型
 */
export const baseValidator = (
  required: boolean,
  fieldValue: unknown,
  typeCheck: (value: unknown) => boolean,
  typeName: string,
) => {
  if (fieldValue === undefined || fieldValue === null) {
    return required
      ? { valid: false, reason: 'Required field is missing' }
      : { valid: true };
  }
  return typeCheck(fieldValue)
    ? { valid: true }
    : {
        valid: false,
        reason: `Value "${JSON.stringify(fieldValue)}" is not of type ${typeName}`,
      };
};

/**
 * 自定义字段验证器集合
 * 包含各种类型的验证逻辑
 */
export const customFieldValidators = {
  STRING: (required: boolean, fieldValue?: unknown) =>
    baseValidator(required, fieldValue, isString, 'string'),

  NUMBER: (required: boolean, fieldValue?: unknown) =>
    baseValidator(required, fieldValue, isNumber, 'number'),

  BOOLEAN: (required: boolean, fieldValue?: unknown) =>
    baseValidator(
      required,
      fieldValue,
      (value) => typeof value === 'boolean',
      'boolean',
    ),

  ARRAY: (required: boolean, fieldValue?: unknown) => {
    // 先检查是否为数组
    const arrayCheck = baseValidator(
      required,
      fieldValue,
      Array.isArray,
      'array',
    );

    if (!arrayCheck.valid) return arrayCheck;

    // 如果是必填，检查数组是否为空
    if (required && (fieldValue as unknown[]).length === 0) {
      return { valid: false, reason: 'Array cannot be empty' };
    }

    return { valid: true };
  },

  DATE: (required: boolean, fieldValue?: unknown) => {
    // 如果值不存在且不是必填，则通过验证
    if (fieldValue === undefined || fieldValue === null) {
      return required
        ? { valid: false, reason: 'Required field is missing' }
        : { valid: true };
    }

    // 尝试将值转换为Date对象
    const date = new Date(fieldValue as string);

    // 检查日期是否有效
    return !isNaN(date.getTime())
      ? { valid: true }
      : { valid: false, reason: `Value is not a valid date` };
  },

  ENUM: (required: boolean, fieldValue?: unknown, enumValues?: string[]) => {
    // 先检查字段值是否存在
    if (fieldValue === undefined || fieldValue === null) {
      return required
        ? { valid: false, reason: 'Required field is missing' }
        : { valid: true };
    }

    // 处理enumValues为JSON类型的情况
    const values = Array.isArray(enumValues)
      ? enumValues
      : enumValues
        ? JSON.parse(JSON.stringify(enumValues))
        : [];

    // 检查枚举值列表是否有效
    if (!Array.isArray(values) || values.length === 0) {
      return { valid: false, reason: 'Invalid enum values list' };
    }

    // 检查值是否在枚举列表中
    return values.includes(fieldValue)
      ? { valid: true }
      : {
          valid: false,
          reason: `Value is not in allowed enum values [${values.join(', ')}]`,
        };
  },
};
