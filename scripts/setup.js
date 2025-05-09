#!/usr/bin/env node

import { Command } from 'commander';
import { installDependencies } from './install.js';
import { startServices } from './start.js';

// 创建命令行程序
const program = new Command();

// 配置命令行参数
program
  .version('1.0.0')
  .description('PostgreSQL and Redis Environment Management Tool');

// 安装命令
program
  .command('install')
  .description('Install PostgreSQL and Redis')
  .action(async () => {
    await installDependencies();
  });

// 启动命令
program
  .command('start')
  .description('Start PostgreSQL and Redis services')
  .action(async () => {
    await startServices();
  });

// 解析命令行参数
program.parse(process.argv);

// 如果没有提供命令，显示帮助信息
if (process.argv.length <= 2) {
  program.outputHelp();
}