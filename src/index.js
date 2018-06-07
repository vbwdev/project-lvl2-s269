import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import getParser from './parsers';

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

export const renderDiff = (diff) => {
  const resultArray = diff
    .reduce((acc, {
      key, firstValue, secondValue, isSame,
    }) => {
      if (isSame) {
        return [...acc, unchangedStringTemplate(key, firstValue)];
      }

      if (firstValue && secondValue) {
        return [
          ...acc,
          addedStringTemplate(key, secondValue),
          deletedStringTemplate(key, firstValue),
        ];
      }

      if (firstValue) {
        return [...acc, deletedStringTemplate(key, firstValue)];
      }

      if (secondValue) {
        return [...acc, addedStringTemplate(key, secondValue)];
      }

      return acc;
    }, []);
  return `{\n${resultArray.join('')}}`;
};

const prepareContent = (filePath) => {
  const extension = path.extname(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const parse = getParser(extension);
  return parse(content);
};

const genDiff = (firstPath, secondPath) => {
  const firstContent = prepareContent(firstPath);
  const secondContent = prepareContent(secondPath);
  const generatedDiff = generateDiff(firstContent, secondContent);
  return renderDiff(generatedDiff);
};

export default genDiff;
