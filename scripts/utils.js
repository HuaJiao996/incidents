import chalk from 'chalk';
import { execa } from 'execa';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取脚本所在目录
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// 检测操作系统
export const isMac = os.platform() === 'darwin';
export const isWindows = os.platform() === 'win32';

// 执行命令函数
export async function runCommand(command, args = []) {
  try {
    console.log(chalk.blue(`Executing command: ${command} ${args.join(' ')}`));
    await execa(command, args, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(chalk.red(`Command execution failed: ${error.message}`));
    return false;
  }
}