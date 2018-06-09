import _ from 'lodash';

const types = [
  {
    type: 'nested',
    check: (first, second, key) =>
      _.has(first, key) && _.has(second, key) && _.isPlainObject(first[key]) && _.isPlainObject(second[key]),
    process: (first, second, func) => func(first, second),
  },
  {
    type: 'unchanged',
    check: (first, second, key) => _.has(first, key) && _.has(second, key) && first[key] === second[key],
    process: _.identity,
  },
  {
    type: 'changed',
    check: (first, second, key) => _.has(first, key) && _.has(second, key) && first[key] !== second[key],
    process: (first, second) => ({ oldValue: first, newValue: second }),
  },
  {
    type: 'deleted',
    check: (first, second, key) => _.has(first, key) && !_.has(second, key),
    process: _.identity,
  },
  {
    type: 'added',
    check: (first, second, key) => !_.has(first, key) && _.has(second, key),
    process: (first, second) => second,
  },
];

const getType = (first, second, key) => {
  const type = _.find(types, ({ check }) => check(first, second, key));
  if (!type) {
    throw new Error('No suitable type found');
  }
  return type;
};

const generateDiff = (firstContent, secondContent) => {
  const keys = _.union(_.keys(firstContent), _.keys(secondContent));
  return keys.map((key) => {
    const { type, process } = getType(firstContent, secondContent, key);
    const value = process(firstContent[key], secondContent[key], generateDiff);
    return { key, type, value };
  }, []);
};

export default generateDiff;
