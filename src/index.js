import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import { safeLoad as yamlParse } from 'js-yaml';
import { parse as iniParse } from 'ini';

export const parseConfigs = (firstConfigContent, secondConfigContent) => {
  const configsKeys = _.union(_.keys(firstConfigContent), _.keys(secondConfigContent));
  return configsKeys.reduce((acc, key) => {
    const firstConfigValue = firstConfigContent[key];
    const secondConfigValue = secondConfigContent[key];
    return [
      ...acc,
      {
        key,
        firstConfigValue,
        secondConfigValue,
        isSame: firstConfigValue === secondConfigValue,
      },
    ];
  }, []);
};

const stringTemplate = (sign, key, value) => `  ${sign} ${key}: ${value}\n`;
const unchangedStringTemplate = (...args) => stringTemplate(' ', ...args);
const deletedStringTemplate = (...args) => stringTemplate('-', ...args);
const addedStringTemplate = (...args) => stringTemplate('+', ...args);

export const buildDiff = (parsedConfigs) => {
  const resultArray = parsedConfigs
    .reduce((acc, {
      key, firstConfigValue, secondConfigValue, isSame,
    }) => (
      isSame
        ? [...acc, unchangedStringTemplate(key, firstConfigValue)]
        : [
          ...acc,
          secondConfigValue && addedStringTemplate(key, secondConfigValue),
          firstConfigValue && deletedStringTemplate(key, firstConfigValue),
        ]
    ), [])
    .filter(str => str);
  return `{\n${resultArray.join('')}}`;
};

const parsers = {
  '.json': JSON.parse,
  '.yaml': yamlParse,
  '.yml': yamlParse,
  '.ini': iniParse,
};

const getParser = (extension) => {
  const parser = parsers[extension];
  if (!parser) {
    throw new Error(`Unknown file extension '${extension}'`);
  }
  return parser;
};

const genDiff = (firstConfigPath, secondConfigPath) => {
  const firstConfigExtension = path.extname(firstConfigPath);
  const secondConfigExtension = path.extname(secondConfigPath);
  const firstConfigContent = getParser(firstConfigExtension)(fs.readFileSync(firstConfigPath, 'utf8'));
  const secondConfigContent = getParser(secondConfigExtension)(fs.readFileSync(secondConfigPath, 'utf8'));
  const parsedConfigs = parseConfigs(firstConfigContent, secondConfigContent);
  return buildDiff(parsedConfigs);
};

export default genDiff;
