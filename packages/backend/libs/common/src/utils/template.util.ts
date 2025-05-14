import { get } from 'radash';

/**
 * 编译模板字符串，将其中的变量替换为上下文中的值
 * @param template 包含变量占位符的模板字符串，格式为 #{path.to.value}
 * @param context 包含变量值的上下文对象
 * @returns 替换变量后的字符串
 * @example
 * const template = '用户 #{user.name} 在 #{time} 登录系统';
 * const context = { user: { name: 'Alice' }, time: '2024-01-01' };
 * const result = compileTemplate(template, context);
 * // 结果: '用户 Alice 在 2024-01-01 登录系统'
 */
export function compileTemplate(template: string, context: Record<string, unknown>): string {
  return template.replace(/#{(.*?)}/g, (_, path) => {
    const value = get(context, path.trim());
    return value !== undefined ? String(value) : '';
  });
} 