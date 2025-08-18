#!/usr/bin/env bun


import { Command } from 'commander';
import { log, isMac, isWindows, runCommand, runCommandSilent, sleep, colors, commandExists } from './utils.ts';
import { buildProject } from './build.ts';
import { startDevelopment } from './dev.ts';

// 服务状态接口
interface ServiceStatus {
  name: string;
  running: boolean;
  port?: number;
}

// 安装选项接口
interface InstallOptions {
  skipPostgreSQL?: boolean;
  skipRedis?: boolean;
  createDatabase?: boolean;
}

// 服务管理函数
export async function startServices(): Promise<boolean> {
  if (isMac) {
    return await startOnMac();
  } else if (isWindows) {
    return await startOnWindows();
  } else {
    log.error("Unsupported operating system");
    process.exit(1);
  }
}

export async function stopServices(): Promise<boolean> {
  if (isMac) {
    return await stopOnMac();
  } else if (isWindows) {
    return await stopOnWindows();
  } else {
    log.error("Unsupported operating system");
    return false;
  }
}

export async function installDependencies(options: InstallOptions = {}): Promise<boolean> {
  const { skipPostgreSQL = false, skipRedis = false, createDatabase = true } = options;
  
  if (isMac) {
    return await installOnMac({ skipPostgreSQL, skipRedis, createDatabase });
  } else if (isWindows) {
    return await installOnWindows({ skipPostgreSQL, skipRedis, createDatabase });
  } else {
    log.error("Unsupported operating system");
    return false;
  }
}

// Mac平台服务启动
async function startOnMac(): Promise<boolean> {
  log.info("Detected Mac OS, using Mac version...");
  
  const pgStatus = await checkPostgreSQLStatusMac();
  if (!pgStatus) {
    log.warning('Starting PostgreSQL service...');
    if (await runCommand('brew', ['services', 'start', 'postgresql'])) {
      log.success('✓ PostgreSQL started successfully');
    } else {
      log.error('✗ Failed to start PostgreSQL');
      return false;
    }
  }
  
  const redisStatus = await checkRedisStatusMac();
  if (!redisStatus) {
    log.warning('Starting Redis service...');
    if (await runCommand('brew', ['services', 'start', 'redis'])) {
      log.success('✓ Redis started successfully');
    } else {
      log.error('✗ Failed to start Redis');
      return false;
    }
  }
  
  await displayStatusOnMac();
  return true;
}

// Windows平台服务启动
async function startOnWindows(): Promise<boolean> {
  log.info("Detected Windows, using Windows version...");
  
  const pgStatus = await checkPostgreSQLStatusWindows();
  if (!pgStatus) {
    log.warning('Starting PostgreSQL service...');
    if (await runCommand('net', ['start', 'postgresql-x64-15'])) {
      log.success('✓ PostgreSQL started successfully');
    } else {
      log.error('✗ Failed to start PostgreSQL');
      return false;
    }
  }
  
  const redisStatus = await checkRedisStatusWindows();
  if (!redisStatus) {
    log.warning('Starting Redis service...');
    if (await runCommand('net', ['start', 'Redis'])) {
      log.success('✓ Redis started successfully');
    } else {
      log.error('✗ Failed to start Redis');
      return false;
    }
  }
  
  await displayStatusOnWindows();
  return true;
}

// Mac平台服务停止
async function stopOnMac(): Promise<boolean> {
  log.info("Stopping services on Mac...");
  
  let allStopped = true;
  
  if (await runCommand('brew', ['services', 'stop', 'postgresql'])) {
    log.success('✓ PostgreSQL stopped');
  } else {
    log.error('✗ Failed to stop PostgreSQL');
    allStopped = false;
  }
  
  if (await runCommand('brew', ['services', 'stop', 'redis'])) {
    log.success('✓ Redis stopped');
  } else {
    log.error('✗ Failed to stop Redis');
    allStopped = false;
  }
  
  return allStopped;
}

// Windows平台服务停止
async function stopOnWindows(): Promise<boolean> {
  log.info("Stopping services on Windows...");
  
  let allStopped = true;
  
  if (await runCommand('net', ['stop', 'postgresql-x64-15'])) {
    log.success('✓ PostgreSQL stopped');
  } else {
    log.error('✗ Failed to stop PostgreSQL');
    allStopped = false;
  }
  
  if (await runCommand('net', ['stop', 'Redis'])) {
    log.success('✓ Redis stopped');
  } else {
    log.error('✗ Failed to stop Redis');
    allStopped = false;
  }
  
  return allStopped;
}

// 安装依赖 - Mac
async function installOnMac(options: InstallOptions): Promise<boolean> {
  log.info("Detected Mac OS, using Mac version...");
  
  if (!(await commandExists('brew'))) {
    log.error('Homebrew is not installed. Please install Homebrew first.');
    log.info('Visit: https://brew.sh/');
    return false;
  }
  
  let success = true;
  
  if (!options.skipPostgreSQL) {
    success = success && await installPostgreSQLOnMac(options.createDatabase || false);
  }
  
  if (!options.skipRedis) {
    success = success && await installRedisOnMac();
  }
  
  if (success) {
    log.success('✨ 所有依赖安装完成!');
  } else {
    log.warning('⚠️ 部分依赖安装失败');
  }
  
  return success;
}

// 安装依赖 - Windows
async function installOnWindows(options: InstallOptions): Promise<boolean> {
  log.info("Detected Windows, using Windows version...");
  
  let success = true;
  
  if (!options.skipPostgreSQL) {
    success = success && await installPostgreSQLOnWindows(options.createDatabase || false);
  }
  
  if (!options.skipRedis) {
    success = success && await installRedisOnWindows();
  }
  
  if (success) {
    log.success('✨ 所有依赖安装完成!');
  } else {
    log.warning('⚠️ 部分依赖安装失败');
  }
  
  return success;
}

// 状态检查函数
async function checkPostgreSQLStatusMac(): Promise<boolean> {
  const result = await runCommandSilent('brew', ['services', 'list']);
  if (result.success && result.stdout) {
    return result.stdout.includes('postgresql') && result.stdout.includes('started');
  }
  return false;
}

async function checkRedisStatusMac(): Promise<boolean> {
  const result = await runCommandSilent('brew', ['services', 'list']);
  if (result.success && result.stdout) {
    return result.stdout.includes('redis') && result.stdout.includes('started');
  }
  return false;
}

async function checkPostgreSQLStatusWindows(): Promise<boolean> {
  const result = await runCommandSilent('sc', ['query', 'postgresql-x64-15']);
  return result.success && result.stdout?.includes('RUNNING') || false;
}

async function checkRedisStatusWindows(): Promise<boolean> {
  const result = await runCommandSilent('sc', ['query', 'Redis']);
  return result.success && result.stdout?.includes('RUNNING') || false;
}

// 安装PostgreSQL - Mac
async function installPostgreSQLOnMac(createDatabase: boolean): Promise<boolean> {
  log.info('检查 PostgreSQL 安装状态...');
  
  const checkResult = await runCommandSilent('brew', ['list', 'postgresql']);
  if (checkResult.success) {
    log.success('PostgreSQL is already installed');
    return true;
  }
  
  log.info('安装 PostgreSQL...');
  if (!(await runCommand('brew', ['install', 'postgresql']))) {
    log.error('PostgreSQL installation failed');
    return false;
  }
  
  if (createDatabase) {
    log.info('创建 incidents 数据库...');
    const createDbResult = await runCommandSilent('createdb', ['incidents']);
    if (createDbResult.success) {
      log.success('✓ incidents 数据库创建成功');
    } else {
      log.warning('⚠️ incidents 数据库创建失败或已存在');
    }
  }
  
  return true;
}

// 安装Redis - Mac
async function installRedisOnMac(): Promise<boolean> {
  log.info('检查 Redis 安装状态...');
  
  const checkResult = await runCommandSilent('brew', ['list', 'redis']);
  if (checkResult.success) {
    log.success('Redis is already installed');
    return true;
  }
  
  log.info('安装 Redis...');
  if (!(await runCommand('brew', ['install', 'redis']))) {
    log.error('Redis installation failed');
    return false;
  }
  
  return true;
}

// 安装PostgreSQL - Windows
async function installPostgreSQLOnWindows(createDatabase: boolean): Promise<boolean> {
  log.info('检查 PostgreSQL 安装状态...');
  
  const checkResult = await runCommandSilent('sc', ['query', 'postgresql-x64-15']);
  if (checkResult.success) {
    log.success('PostgreSQL service is already installed');
    return true;
  }
  
  log.warning('PostgreSQL is not installed on Windows.');
  log.info('Please download and install PostgreSQL from:');
  log.info('https://www.postgresql.org/download/windows/');
  log.info('Make sure to remember the password you set for the postgres user.');
  
  return false;
}

// 安装Redis - Windows
async function installRedisOnWindows(): Promise<boolean> {
  log.info('检查 Redis 安装状态...');
  
  const checkResult = await runCommandSilent('sc', ['query', 'Redis']);
  if (checkResult.success) {
    log.success('Redis service is already installed');
    return true;
  }
  
  log.warning('Redis is not installed on Windows.');
  log.info('Please download and install Redis from:');
  log.info('https://github.com/microsoftarchive/redis/releases');
  log.info('Or use Windows Subsystem for Linux (WSL) to install Redis.');
  
  return false;
}

// 显示状态 - Mac
async function displayStatusOnMac(): Promise<void> {
  const result = await runCommandSilent('brew', ['services', 'list']);
  if (result.success && result.stdout) {
    log.info('\n=== Service Status ===');
    const lines = result.stdout.split('\n');
    const relevantServices = lines.filter(line => 
      line.includes('postgresql') || line.includes('redis')
    );
    relevantServices.forEach(line => {
      if (line.includes('started')) {
        console.log(colors.green(`✓ ${line}`));
      } else {
        console.log(colors.red(`✗ ${line}`));
      }
    });
  }
}

// 显示状态 - Windows
async function displayStatusOnWindows(): Promise<void> {
  log.info('\n=== Service Status ===');
  
  const pgResult = await runCommandSilent('sc', ['query', 'postgresql-x64-15']);
  if (pgResult.success && pgResult.stdout?.includes('RUNNING')) {
    console.log(colors.green('✓ PostgreSQL: Running'));
  } else {
    console.log(colors.red('✗ PostgreSQL: Stopped'));
  }
  
  const redisResult = await runCommandSilent('sc', ['query', 'Redis']);
  if (redisResult.success && redisResult.stdout?.includes('RUNNING')) {
    console.log(colors.green('✓ Redis: Running'));
  } else {
    console.log(colors.red('✗ Redis: Stopped'));
  }
}

// 只有在直接运行此脚本时才创建CLI程序
if (import.meta.main) {
  // 创建命令行程序
  const program = new Command();

  // 配置命令行参数
  program
    .version('1.0.0')
    .description('Incidents Project Management Tool - PostgreSQL and Redis Environment Management');

  // 安装命令
  program
    .command('install')
    .description('Install PostgreSQL and Redis')
    .option('--skip-postgresql', 'Skip PostgreSQL installation')
    .option('--skip-redis', 'Skip Redis installation')
    .option('--no-database', 'Skip database creation')
    .action(async (options) => {
      try {
        log.info('🚀 开始安装依赖...');
        const success = await installDependencies({
          skipPostgreSQL: options.skipPostgresql,
          skipRedis: options.skipRedis,
          createDatabase: !options.noDatabase
        });
        
        if (!success) {
          process.exit(1);
        }
      } catch (error) {
        log.error(`Installation failed: ${error}`);
        process.exit(1);
      }
    });

  // 启动命令
  program
    .command('start')
    .description('Start PostgreSQL and Redis services')
    .action(async () => {
      try {
        log.info('🚀 启动服务...');
        const success = await startServices();
        
        if (!success) {
          process.exit(1);
        }
      } catch (error) {
        log.error(`Failed to start services: ${error}`);
        process.exit(1);
      }
    });

  // 停止命令
  program
    .command('stop')
    .description('Stop PostgreSQL and Redis services')
    .option('--force', 'Force stop all related processes')
    .action(async (options) => {
      try {
        log.info('🛑 停止服务...');
        
        if (options.force) {
          const { forceStopServices } = await import('./stop.ts');
          await forceStopServices();
        } else {
          const success = await stopServices();
          if (!success) {
            process.exit(1);
          }
        }
      } catch (error) {
        log.error(`Failed to stop services: ${error}`);
        process.exit(1);
      }
    });

  // 构建命令
  program
    .command('build')
    .description('Build the project')
    .option('--service <service>', 'Build specific service (core|api|web|all)', 'all')
    .option('--prod', 'Production build')
    .action(async (options) => {
      log.info('🔨 构建项目...');
      
      try {
        await buildProject({
          service: options.service,
          production: options.prod
        });
      } catch (error) {
        log.error(`构建失败: ${error}`);
        process.exit(1);
      }
    });

  // 开发命令
  program
    .command('dev')
    .description('Start development environment')
    .option('--service <service>', 'Start specific service (core|api|web|all)', 'all')
    .action(async (options) => {
      log.info('🚀 启动开发环境...');
      
      try {
        await startDevelopment({
          service: options.service
        });
      } catch (error) {
        log.error(`开发环境启动失败: ${error}`);
        process.exit(1);
      }
    });

  // 完整设置命令
  program
    .command('setup')
    .description('Complete setup: install dependencies and start services')
    .option('--skip-postgresql', 'Skip PostgreSQL installation')
    .option('--skip-redis', 'Skip Redis installation')
    .option('--no-database', 'Skip database creation')
    .action(async (options) => {
      try {
        log.info('🚀 开始完整设置...');
        
        // 安装依赖
        log.info('步骤 1/2: 安装依赖');
        const installSuccess = await installDependencies({
          skipPostgreSQL: options.skipPostgresql,
          skipRedis: options.skipRedis,
          createDatabase: !options.noDatabase
        });
        
        if (!installSuccess) {
          log.error('依赖安装失败');
          process.exit(1);
        }
        
        // 启动服务
        log.info('步骤 2/2: 启动服务');
        const startSuccess = await startServices();
        
        if (!startSuccess) {
          log.error('服务启动失败');
          process.exit(1);
        }
        
        log.success('✨ 完整设置完成!');
        log.info('现在你可以运行以下命令:');
        log.warning('  bun run dev          # 启动开发环境');
        log.warning('  bun run build        # 构建项目');
        log.warning('  bun run db:migrate   # 运行数据库迁移');
      } catch (error) {
        log.error(`Setup failed: ${error}`);
        process.exit(1);
      }
    });

  // 状态检查命令
  program
    .command('status')
    .description('Check services status')
    .action(async () => {
      try {
        log.info('📊 检查服务状态...');
        
        if (isMac) {
          await displayStatusOnMac();
        } else if (isWindows) {
          await displayStatusOnWindows();
        } else {
          log.error('Unsupported operating system');
          process.exit(1);
        }
      } catch (error) {
        log.error(`Failed to check status: ${error}`);
        process.exit(1);
      }
    });

  // 解析命令行参数
  program.parse(process.argv);

  // 如果没有提供命令，显示帮助信息
  if (process.argv.length <= 2) {
    program.outputHelp();
  }
}