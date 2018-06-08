/* eslint-disable consistent-return */
import _ from 'lodash';

const generateDiff = (firstContent, secondContent) => {
  if (!_.isPlainObject(firstContent) || !_.isPlainObject(secondContent)) {
    return [];
  }

  const prepareDiff = (key, firstValue, secondValue) => {
    const hasFirstValue = _.has(firstContent, key);
    const hasSecondValue = _.has(secondContent, key);

    if (_.isPlainObject(firstValue) && _.isPlainObject(secondValue)) {
      return {
        key,
        status: 'nested',
        oldValue: firstValue,
        newValue: secondValue,
        children: generateDiff(firstValue, secondValue),
      };
    }

    if (hasFirstValue && hasSecondValue && firstValue === secondValue) {
      return {
        key,
        status: 'unchanged',
        oldValue: firstValue,
        newValue: secondValue,
        children: generateDiff(firstValue, secondValue),
      };
    }

    if (hasFirstValue && hasSecondValue && firstValue !== secondValue) {
      return {
        key,
        status: 'changed',
        oldValue: firstValue,
        newValue: secondValue,
        children: generateDiff(firstValue, secondValue),
      };
    }

    if (hasFirstValue && !hasSecondValue) {
      return {
        key,
        status: 'deleted',
        oldValue: firstValue,
        newValue: secondValue,
        children: generateDiff(firstValue, secondValue),
      };
    }

    if (!hasFirstValue && hasSecondValue) {
      return {
        key,
        status: 'added',
        oldValue: firstValue,
        newValue: secondValue,
        children: generateDiff(firstValue, secondValue),
      };
    }
  };

  const keys = _.union(_.keys(firstContent), _.keys(secondContent));
  return keys.reduce(
    (acc, key) => [...acc, prepareDiff(key, firstContent[key], secondContent[key])],
    [],
  );
};

export default generateDiff;
