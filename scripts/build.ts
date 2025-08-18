#!/usr/bin/env bun

import { runCommand, log } from './utils.ts';

interface BuildOptions {
  service?: 'core' | 'api' | 'web' | 'all';
  production?: boolean;
}

export async function buildProject(options: BuildOptions = {}) {
  const { service = 'all', production = false } = options;
  
  log.info('🔨 开始构建项目...');
  
  // 首先生成数据库客户端
  log.info('生成数据库客户端...');
  if (!(await runCommand('bun', ['run', 'db:generate']))) {
    log.error('数据库客户端生成失败');
    process.exit(1);
  }
  
  // 根据选项构建不同的服务
  switch (service) {
    case 'core':
      await buildCoreServer(production);
      break;
    case 'api':
      await buildApiServer(production);
      break;
    case 'web':
      await buildWebServer(production);
      break;
    case 'all':
    default:
      await buildAllServices(production);
      break;
  }
  
  log.success('✨ 构建完成!');
}

async function buildCoreServer(production: boolean = false) {
  log.info('构建 Core Server...');
  try {
    const buildCommand = production ? 'build:prod' : 'build';
    await Bun.spawn(['bun', 'run', buildCommand], {
      cwd: '../apps/core-server',
      stdio: ['inherit', 'inherit', 'inherit']
    });
    log.success('✓ Core Server 构建完成');
  } catch (error) {
    log.error(`Core Server 构建失败: ${error}`);
    throw error;
  }
}

async function buildApiServer(production: boolean = false) {
  log.info('构建 API Server...');
  try {
    // API Server 可能没有构建脚本，检查是否需要构建
    const fs = await import('fs');
    const path = await import('path');
    const packageJsonPath = path.resolve('../apps/rest-server/package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonContent);
      
      if (packageJson.scripts?.build) {
        const buildCommand = production ? 'build:prod' : 'build';
        await Bun.spawn(['bun', 'run', buildCommand], {
          cwd: '../apps/rest-server',
          stdio: ['inherit', 'inherit', 'inherit']
        });
      } else {
        log.warning('API Server 无需构建');
      }
    } else {
      log.warning('API Server package.json 不存在');
    }
    
    log.success('✓ API Server 处理完成');
  } catch (error) {
    log.error(`API Server 构建失败: ${error}`);
    throw error;
  }
}

async function buildWebServer(production: boolean = false) {
  log.info('构建 Web Server...');
  try {
    const buildCommand = production ? 'build:prod' : 'build';
    await Bun.spawn(['bun', 'run', buildCommand], {
      cwd: '../apps/web',
      stdio: ['inherit', 'inherit', 'inherit']
    });
    log.success('✓ Web Server 构建完成');
  } catch (error) {
    log.error(`Web Server 构建失败: ${error}`);
    throw error;
  }
}

async function buildAllServices(production: boolean = false) {
  log.info('构建所有服务...');
  
  // 按顺序构建服务
  await buildCoreServer(production);
  await buildApiServer(production);
  await buildWebServer(production);
}

// 如果直接运行此脚本
if (import.meta.main) {
  const args = process.argv.slice(2);
  const service = (args[0] as BuildOptions['service']) || 'all';
  const production = args.includes('--prod') || args.includes('--production');
  
  buildProject({ service, production }).catch((error) => {
    log.error(`构建失败: ${error}`);
    process.exit(1);
  });
}