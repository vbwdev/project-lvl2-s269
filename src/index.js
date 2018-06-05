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

export const buildDiff = (parsedConfigs) => {
  const resultArray = parsedConfigs.reduce((acc, item) => {
    if (item.isSame) {
      return [...acc, `  ${item.key}: ${item.firstConfigValue}`];
    }

    if (item.firstConfigValue && item.secondConfigValue) {
      return [...acc, `+ ${item.key}: ${item.secondConfigValue}`, `- ${item.key}: ${item.firstConfigValue}`];
    }

    if (item.firstConfigValue) {
      return [...acc, `- ${item.key}: ${item.firstConfigValue}`];
    }

    return [...acc, `+ ${item.key}: ${item.secondConfigValue}`];
  }, []);

  return `{\n  ${resultArray.join('\n  ')}\n}`;
};

const genDiff = (firstConfigContent, secondConfigContent) => {
  const parsedConfigs = parseConfigs(firstConfigContent, secondConfigContent);
  return buildDiff(parsedConfigs);
};

export default genDiff;
