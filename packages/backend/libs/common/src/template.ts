import { get } from 'radash';

export function compileTemplate(
  template: string,
  context: Record<string, any>,
): string {
  return template.replace(/#{(.*?)}/g, (_, path) => {
    const value = get(context, path.trim());
    return value !== undefined ? String(value) : '';
  });
}
