import chalk from 'chalk';
import { execa } from 'execa';
import { isMac, isWindows, runCommand } from './utils.js';

export async function startServices() {
  if (isMac) {
    return await startOnMac();
  } else if (isWindows) {
    return await startOnWindows();
  } else {
    console.log(chalk.red("Unsupported operating system"));
    process.exit(1);
  }
}

async function startOnMac() {
  console.log(chalk.blue("Detected Mac OS, using Mac version..."));
  
  // 检查并启动 PostgreSQL
  const pgStatus = await execa('brew', ['services', 'list']).then(
    result => result.stdout.includes('postgresql') && result.stdout.includes('started'),
    () => false
  );
  
  if (!pgStatus) {
    console.log(chalk.yellow('Starting PostgreSQL service...'));
    await runCommand('brew', ['services', 'start', 'postgresql']);
    console.log(chalk.green('PostgreSQL service started'));
  } else {
    console.log(chalk.green('PostgreSQL service is already running'));
  }
  
  // 检查并启动 Redis
  const redisStatus = await execa('brew', ['services', 'list']).then(
    result => result.stdout.includes('redis') && result.stdout.includes('started'),
    () => false
  );
  
  if (!redisStatus) {
    console.log(chalk.yellow('Starting Redis service...'));
    await runCommand('brew', ['services', 'start', 'redis']);
    console.log(chalk.green('Redis service started'));
  } else {
    console.log(chalk.green('Redis service is already running'));
  }
  
  await displayStatusOnMac();
  
  console.log(chalk.green('\nDevelopment environment services are ready!'));
  return true;
}

async function startOnWindows() {
  console.log(chalk.blue("Detected Windows OS, using Windows version..."));
  
  // 检查并启动 PostgreSQL
  const pgService = await execa('powershell', [
    '-Command', 
    'Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Status'
  ]).then(
    result => result.stdout.trim(),
    () => ''
  );
  
  if (pgService && pgService !== 'Running') {
    console.log(chalk.yellow('Starting PostgreSQL service...'));
    await runCommand('powershell', [
      '-Command', 
      'Start-Service -Name "postgresql*"'
    ]);
    console.log(chalk.green('PostgreSQL service started'));
  } else if (pgService) {
    console.log(chalk.green('PostgreSQL service is already running'));
  } else {
    console.log(chalk.red('PostgreSQL service not found, please run the installation script first'));
  }
  
  // 检查并启动 Redis
  const redisService = await execa('powershell', [
    '-Command', 
    'Get-Service -Name "Redis" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Status'
  ]).then(
    result => result.stdout.trim(),
    () => ''
  );
  
  if (redisService && redisService !== 'Running') {
    console.log(chalk.yellow('Starting Redis service...'));
    await runCommand('powershell', [
      '-Command', 
      'Start-Service -Name "Redis"'
    ]);
    console.log(chalk.green('Redis service started'));
  } else if (redisService) {
    console.log(chalk.green('Redis service is already running'));
  } else {
    console.log(chalk.red('Redis service not found, please run the installation script first'));
  }
  
  await displayStatusOnWindows();
  
  console.log(chalk.green('\nDevelopment environment services are ready!'));
  return true;
}

async function displayStatusOnMac() {
  // 显示服务状态
  console.log(chalk.cyan('\nCurrent service status:'));
  console.log(chalk.cyan('--------------------'));
  
  const pgRunning = await execa('brew', ['services', 'list']).then(
    result => {
      const pgLine = result.stdout.split('\n').find(line => line.includes('postgresql'));
      return pgLine && pgLine.includes('started');
    },
    () => false
  );
  
  console.log(pgRunning 
    ? chalk.green('PostgreSQL: Running') 
    : chalk.red('PostgreSQL: Not running'));
  
  const redisRunning = await execa('brew', ['services', 'list']).then(
    result => {
      const redisLine = result.stdout.split('\n').find(line => line.includes('redis'));
      return redisLine && redisLine.includes('started');
    },
    () => false
  );
  
  console.log(redisRunning 
    ? chalk.green('Redis: Running') 
    : chalk.red('Redis: Not running'));
  
  console.log(chalk.cyan('--------------------'));
}

async function displayStatusOnWindows() {
  // 显示服务状态
  console.log(chalk.cyan('\nCurrent service status:'));
  console.log(chalk.cyan('--------------------'));
  
  const pgStatus = await execa('powershell', [
    '-Command', 
    'Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Status'
  ]).then(
    result => result.stdout.trim(),
    () => ''
  );
  
  if (pgStatus) {
    console.log(pgStatus === 'Running' 
      ? chalk.green(`PostgreSQL: ${pgStatus}`) 
      : chalk.red(`PostgreSQL: ${pgStatus}`));
  } else {
    console.log(chalk.red('PostgreSQL: Not installed'));
  }
  
  const redisStatus = await execa('powershell', [
    '-Command', 
    'Get-Service -Name "Redis" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Status'
  ]).then(
    result => result.stdout.trim(),
    () => ''
  );
  
  if (redisStatus) {
    console.log(redisStatus === 'Running' 
      ? chalk.green(`Redis: ${redisStatus}`) 
      : chalk.red(`Redis: ${redisStatus}`));
  } else {
    console.log(chalk.red('Redis: Not installed'));
  }
  
  console.log(chalk.cyan('--------------------'));
}