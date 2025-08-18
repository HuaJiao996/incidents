import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { $ } from 'bun';
import chalk from 'chalk';

// 获取脚本所在目录
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// 检测操作系统
export const isMac = os.platform() === 'darwin';
export const isWindows = os.platform() === 'win32';
export const isLinux = os.platform() === 'linux';

// 颜色输出函数 - 使用 chalk 库
export const colors = {
  red: chalk.red,
  green: chalk.green,
  yellow: chalk.yellow,
  blue: chalk.blue,
  magenta: chalk.magenta,
  cyan: chalk.cyan,
  white: chalk.white,
  gray: chalk.gray,
  bold: chalk.bold,
  reset: ''
};

/**
 * 执行命令函数 - 使用 Bun 的 $ 替代 execa
 * @param command 命令字符串
 * @param args 参数数组
 * @returns 是否执行成功
 */
export async function runCommand(command: string, args: string[] = []): Promise<boolean> {
  try {
    console.log(colors.blue(`Executing command: ${command} ${args.join(' ')}`));
    const fullCommand = args.length > 0 ? `${command} ${args.join(' ')}` : command;
    await $`${fullCommand.split(' ')}`;
    return true;
  } catch (error) {
    console.error(colors.red(`Command execution failed: ${error}`));
    return false;
  }
}

/**
 * 静默执行命令函数 - 使用 Bun 的 $ 替代 execa
 * @param command 命令字符串
 * @param args 参数数组
 * @returns 执行结果对象
 */
export async function runCommandSilent(command: string, args: string[] = []): Promise<{ success: boolean; stdout?: string; stderr?: string }> {
  try {
    const fullCommand = args.length > 0 ? `${command} ${args.join(' ')}` : command;
    const result = await $`${fullCommand.split(' ')}`.quiet();
    return {
      success: result.exitCode === 0,
      stdout: result.stdout?.toString(),
      stderr: result.stderr?.toString()
    };
  } catch (error: any) {
    return {
      success: false,
      stdout: error.stdout?.toString(),
      stderr: error.stderr?.toString()
    };
  }
}

/**
 * 检查命令是否存在
 * @param command 命令名称
 * @returns 命令是否存在
 */
export async function commandExists(command: string): Promise<boolean> {
  const checkCommand = isWindows ? 'where' : 'which';
  const result = await runCommandSilent(checkCommand, [command]);
  return result.success;
}

/**
 * 检查端口是否被占用
 * @param port 端口号
 * @returns 端口是否被占用
 */
export async function isPortInUse(port: number): Promise<boolean> {
  try {
    if (isWindows) {
      const result = await runCommandSilent('netstat', ['-an']);
      return result.stdout?.includes(`:${port} `) || false;
    } else {
      const result = await runCommandSilent('lsof', ['-i', `:${port}`]);
      return result.success;
    }
  } catch {
    return false;
  }
}

/**
 * 等待函数
 * @param ms 等待毫秒数
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 格式化时间
 * @returns 格式化的时间字符串
 */
export function formatTime(): string {
  return new Date().toLocaleTimeString();
}

/**
 * 日志输出函数
 */
export const log = {
  info: (message: string) => console.log(colors.blue(`ℹ ${message}`)),
  success: (message: string) => console.log(colors.green(`✓ ${message}`)),
  warning: (message: string) => console.log(colors.yellow(`⚠ ${message}`)),
  error: (message: string) => console.log(colors.red(`✗ ${message}`)),
  debug: (message: string) => console.log(colors.gray(`🐛 ${message}`)),
};