#!/usr/bin/env node

import inquirer from 'inquirer';
import { execa } from 'execa';
import chalk from 'chalk';

// 检查是否为生产环境
const isProduction = process.env.NODE_ENV === 'production';

async function main() {
  // 如果是生产环境，则跳过安装提示
  if (isProduction) {
    console.log(chalk.yellow('Production environment detected, skipping database installation prompts.'));
    return;
  }

  console.log(chalk.cyan('\n=== PostgreSQL and Redis Setup ===\n'));

  try {
    const { install } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'install',
        message: 'Do you want to install PostgreSQL and Redis?',
        default: false
      }
    ]);

    if (install) {
      console.log(chalk.blue('\nInstalling PostgreSQL and Redis...'));
      
      try {
        await execa('node', ['scripts/setup.js', 'install'], { stdio: 'inherit' });
        
        const { start } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'start',
            message: 'Do you want to start PostgreSQL and Redis services?',
            default: true
          }
        ]);
        
        if (start) {
          console.log(chalk.blue('\nStarting services...'));
          await execa('node', ['scripts/setup.js', 'start'], { stdio: 'inherit' });
        }
      } catch (error) {
        console.error(chalk.red(`Operation failed: ${error.message}`));
      }
    } else {
      console.log(chalk.yellow('Skipping installation.'));
    }
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
  }
}

main();