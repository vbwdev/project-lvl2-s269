#!/usr/bin/env node

import program from 'commander';
import fs from 'fs';

import genDiff from '..';

program
  .version('0.0.1')
  .arguments('<firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .action((firstConfig, secondConfig) => {
    const firstConfigContent = JSON.parse(fs.readFileSync(firstConfig));
    const secondConfigContent = JSON.parse(fs.readFileSync(secondConfig));
    const configsDiff = genDiff(firstConfigContent, secondConfigContent);
    console.log(configsDiff);
  })
  .parse(process.argv);
