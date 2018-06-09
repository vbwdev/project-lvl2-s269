/* eslint-disable consistent-return */
import _ from 'lodash';

const statuses = [
  {
    status: 'nested',
    check: (first, second, key) =>
      _.has(first, key) && _.has(second, key) && _.isPlainObject(first[key]) && _.isPlainObject(second[key]),
  },
  {
    status: 'unchanged',
    check: (first, second, key) => _.has(first, key) && _.has(second, key) && first[key] === second[key],
  },
  {
    status: 'changed',
    check: (first, second, key) => _.has(first, key) && _.has(second, key) && first[key] !== second[key],
  },
  {
    status: 'deleted',
    check: (first, second, key) => _.has(first, key) && !_.has(second, key),
  },
  {
    status: 'added',
    check: (first, second, key) => !_.has(first, key) && _.has(second, key),
  },
];

const generateDiff = (firstContent, secondContent) => {
  if (!_.isPlainObject(firstContent) || !_.isPlainObject(secondContent)) {
    return [];
  }

  const keys = _.union(_.keys(firstContent), _.keys(secondContent));
  return keys.reduce((acc, key) => {
    const { status } = _.find(statuses, ({ check }) => check(firstContent, secondContent, key));
    return [...acc, {
      key,
      status,
      oldValue: firstContent[key],
      newValue: secondContent[key],
      children: generateDiff(firstContent[key], secondContent[key]),
    }];
  }, []);
};

export default generateDiff;
