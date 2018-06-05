export const parseConfigs = (mergedConfigs, firstConfigContent, secondConfigContent) => (
  Object.keys(mergedConfigs).reduce((acc, key) => {
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
  }, [])
);

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
  const mergedConfigs = { ...firstConfigContent, ...secondConfigContent };
  const parsedConfigs = parseConfigs(mergedConfigs, firstConfigContent, secondConfigContent);
  return buildDiff(parsedConfigs);
};

export default genDiff;
