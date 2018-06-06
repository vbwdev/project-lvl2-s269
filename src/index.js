import fs from 'fs';

export const parseConfigs = (firstConfigContent, secondConfigContent) => {
  const mergedConfigsKeys = Object.keys({ ...firstConfigContent, ...secondConfigContent });
  return mergedConfigsKeys.reduce((acc, key) => {
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

const genDiff = (firstConfigPath, secondConfigPath) => {
  const firstConfigContent = JSON.parse(fs.readFileSync(firstConfigPath));
  const secondConfigContent = JSON.parse(fs.readFileSync(secondConfigPath));
  const parsedConfigs = parseConfigs(firstConfigContent, secondConfigContent);
  return buildDiff(parsedConfigs);
};

export default genDiff;
