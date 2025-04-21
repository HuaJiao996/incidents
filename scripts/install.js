import chalk from 'chalk';
import { isMac, isWindows, runCommand } from './utils.js';

export async function installDependencies() {
  if (isMac) {
    return await installOnMac();
  } else if (isWindows) {
    return await installOnWindows();
  } else {
    console.log(chalk.red("Unsupported operating system"));
    process.exit(1);
  }
}

async function installOnMac() {
  console.log(chalk.blue("Detected Mac OS, using Mac version..."));
  
  // 安装 PostgreSQL
  if (!(await runCommand('brew', ['list', 'postgresql']))) {
    if (!(await runCommand('brew', ['install', 'postgresql']))) {
      console.log(chalk.red('PostgreSQL installation failed'));
      process.exit(1);
    }
    
    // 启动 PostgreSQL 服务
    await runCommand('brew', ['services', 'start', 'postgresql']);
    
    // 等待 PostgreSQL 服务启动
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 创建数据库
    await runCommand('createdb', ['incidents']);
  } else {
    console.log(chalk.green('PostgreSQL is already installed'));
  }
  
  // 安装 Redis
  if (!(await runCommand('brew', ['list', 'redis']))) {
    if (!(await runCommand('brew', ['install', 'redis']))) {
      console.log(chalk.red('Redis installation failed'));
      process.exit(1);
    }
  } else {
    console.log(chalk.green('Redis is already installed'));
  }
  
  console.log(chalk.green('Installation completed'));
  return true;
}

async function installOnWindows() {
  console.log(chalk.blue("Detected Windows OS, using Windows version..."));
  
  // 检查 Chocolatey 是否已安装
  if (!(await runCommand('powershell', ['-Command', 'Get-Command choco -ErrorAction SilentlyContinue']))) {
    console.log(chalk.yellow('Installing Chocolatey...'));
    await runCommand('powershell', [
      '-ExecutionPolicy', 'Bypass', 
      '-Command', 
      '[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString(\'https://chocolatey.org/install.ps1\'))'
    ]);
  }
  
  // 安装 PostgreSQL
  if (!(await runCommand('powershell', ['-Command', 'Get-Command psql -ErrorAction SilentlyContinue']))) {
    console.log(chalk.yellow('Installing PostgreSQL...'));
    if (!(await runCommand('choco', ['install', 'postgresql', '-y']))) {
      console.log(chalk.red('PostgreSQL installation failed'));
      process.exit(1);
    }
    
    // 等待 PostgreSQL 服务启动
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 创建数据库
    const pgPass = 'postgres';
    process.env.PGPASSWORD = pgPass;
    await runCommand('psql', ['-U', 'postgres', '-c', 'CREATE DATABASE incidents;', '-h', 'localhost']);
  } else {
    console.log(chalk.green('PostgreSQL is already installed'));
  }
  
  // 安装 Redis
  if (!(await runCommand('powershell', ['-Command', 'Test-Path "C:\\Program Files\\Redis"']))) {
    console.log(chalk.yellow('Installing Redis...'));
    if (!(await runCommand('choco', ['install', 'redis-64', '-y']))) {
      console.log(chalk.red('Redis installation failed'));
      process.exit(1);
    }
  } else {
    console.log(chalk.green('Redis is already installed'));
  }
  
  console.log(chalk.green('Installation completed'));
  return true;
}