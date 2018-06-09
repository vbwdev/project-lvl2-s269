#!/usr/bin/env node

import program from 'commander';

import genDiff from '..';

program
  .version('0.4.0')
  .arguments('<firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format', 'original')
  .action((firstConfig, secondConfig, cmd) => {
    const configsDiff = genDiff(firstConfig, secondConfig, cmd.format);
    console.log(configsDiff);
  })
  .parse(process.argv);
