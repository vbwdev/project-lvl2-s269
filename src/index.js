import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import { safeLoad as yamlParse } from 'js-yaml';
import { parse as iniParse } from 'ini';

export const generateDiff = (firstContent, secondContent) => {
  const keys = _.union(_.keys(firstContent), _.keys(secondContent));
  return keys.reduce((acc, key) => {
    const firstValue = firstContent[key];
    const secondValue = secondContent[key];
    return [
      ...acc,
      {
        key,
        firstValue,
        secondValue,
        isSame: firstValue === secondValue,
      },
    ];
  }, []);
};

const stringTemplate = (sign, key, value) => `  ${sign} ${key}: ${value}\n`;
const unchangedStringTemplate = (...args) => stringTemplate(' ', ...args);
const deletedStringTemplate = (...args) => stringTemplate('-', ...args);
const addedStringTemplate = (...args) => stringTemplate('+', ...args);

export const buildDiffStrings = (diff) => {
  const resultArray = diff
    .reduce((acc, {
      key, firstValue, secondValue, isSame,
    }) => (
      isSame
        ? [...acc, unchangedStringTemplate(key, firstValue)]
        : [
          ...acc,
          secondValue && addedStringTemplate(key, secondValue),
          firstValue && deletedStringTemplate(key, firstValue),
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

const genDiff = (firstPath, secondPath) => {
  const firstExtension = path.extname(firstPath);
  const secondExtension = path.extname(secondPath);
  const firstContent = getParser(firstExtension)(fs.readFileSync(firstPath, 'utf8'));
  const secondContent = getParser(secondExtension)(fs.readFileSync(secondPath, 'utf8'));
  const generatedDiff = generateDiff(firstContent, secondContent);
  return buildDiffStrings(generatedDiff);
};

export default genDiff;
