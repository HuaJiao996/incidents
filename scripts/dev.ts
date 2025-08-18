#!/usr/bin/env bun

import { startServices } from './setup.ts';
import { colors, log } from './utils.ts';

interface DevOptions {
  service?: 'core' | 'api' | 'web' | 'all';
  port?: number;
}

export async function startDevelopment(options: DevOptions = {}) {
  const { service = 'all' } = options;
  
  log.info('🚀 启动开发环境...');
  
  // 首先启动必要的服务
  log.info('启动基础服务...');
  await startServices();
  
  // 根据选项启动不同的服务
  switch (service) {
    case 'core':
      await startCoreServer();
      break;
    case 'api':
      await startApiServer();
      break;
    case 'web':
      await startWebServer();
      break;
    case 'all':
    default:
      await startAllServices();
      break;
  }
}

async function startCoreServer() {
  log.info('启动 Core Server...');
  try {
    await Bun.spawn(['bun', 'run', 'dev'], {
      cwd: '../apps/core-server',
      stdio: ['inherit', 'inherit', 'inherit']
    });
  } catch (error) {
    log.error(`Core Server 启动失败: ${error}`);
  }
}

async function startApiServer() {
  log.info('启动 API Server...');
  try {
    await Bun.spawn(['bun', 'run', 'dev'], {
      cwd: '../apps/rest-server',
      stdio: ['inherit', 'inherit', 'inherit']
    });
  } catch (error) {
    log.error(`API Server 启动失败: ${error}`);
  }
}

async function startWebServer() {
  log.info('启动 Web Server...');
  try {
    await Bun.spawn(['bun', 'run', 'dev'], {
      cwd: '../apps/web',
      stdio: ['inherit', 'inherit', 'inherit']
    });
  } catch (error) {
    log.error(`Web Server 启动失败: ${error}`);
  }
}

async function startAllServices() {
  log.info('启动所有开发服务...');
  
  // 使用并发方式启动所有服务
  const services = [
    { name: 'Core Server', cwd: '../apps/core-server' },
    { name: 'API Server', cwd: '../apps/rest-server' },
    { name: 'Web Server', cwd: '../apps/web' }
  ];
  
  const promises = services.map(async (service) => {
    try {
      log.info(`启动 ${service.name}...`);
      await Bun.spawn(['bun', 'run', 'dev'], {
        cwd: service.cwd,
        stdio: ['inherit', 'inherit', 'inherit']
      });
    } catch (error) {
      log.error(`${service.name} 启动失败: ${error}`);
    }
  });
  
  await Promise.all(promises);
}

// 如果直接运行此脚本
if (import.meta.main) {
  const args = process.argv.slice(2);
  const service = (args[0] as 'core' | 'api' | 'web' | 'all') || 'all';
  
  startDevelopment({ service }).catch((error) => {
    log.error(`开发环境启动失败: ${error}`);
    process.exit(1);
  });
}