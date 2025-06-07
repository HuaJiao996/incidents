import chalk from 'chalk';
import { runCommand } from './utils.js';

async function stopServices() {
  console.log(chalk.blue('🛑 正在停止服务...'));

  // 停止 PostgreSQL 服务
  console.log(chalk.blue('正在停止 PostgreSQL 服务...'));
  const pgStopped = await runCommand('brew', ['services', 'stop', 'postgresql']);
  if (pgStopped) {
    console.log(chalk.green('✓ PostgreSQL 服务已停止'));
  } else {
    console.log(chalk.yellow('⚠️ PostgreSQL 服务停止失败'));
  }

  // 停止 Redis 服务
  console.log(chalk.blue('正在停止 Redis 服务...'));
  const redisStopped = await runCommand('brew', ['services', 'stop', 'redis']);
  if (redisStopped) {
    console.log(chalk.green('✓ Redis 服务已停止'));
  } else {
    console.log(chalk.yellow('⚠️ Redis 服务停止失败'));
  }

  console.log(chalk.green('✨ 所有服务已停止'));
}

// 执行停止服务的函数
stopServices().catch((error) => {
  console.error(chalk.red('停止服务时发生错误：', error));
  process.exit(1);
}); 