import _ from 'lodash';

const types = [
  {
    type: 'nested',
    check: (first, second, key) =>
      _.has(first, key) && _.has(second, key) && _.isPlainObject(first[key]) && _.isPlainObject(second[key]),
  },
  {
    type: 'unchanged',
    check: (first, second, key) => _.has(first, key) && _.has(second, key) && first[key] === second[key],
  },
  {
    type: 'changed',
    check: (first, second, key) => _.has(first, key) && _.has(second, key) && first[key] !== second[key],
  },
  {
    type: 'deleted',
    check: (first, second, key) => _.has(first, key) && !_.has(second, key),
  },
  {
    type: 'added',
    check: (first, second, key) => !_.has(first, key) && _.has(second, key),
  },
];

const getType = (first, second, key) => {
  const { type } = _.find(types, ({ check }) => check(first, second, key));
  if (!type) {
    throw new Error('No suitable type found');
  }
  return type;
};

const generateDiff = (firstContent, secondContent) => {
  if (!_.isPlainObject(firstContent) || !_.isPlainObject(secondContent)) {
    return [];
  }

  const keys = _.union(_.keys(firstContent), _.keys(secondContent));
  return keys.reduce((acc, key) => {
    const type = getType(firstContent, secondContent, key);
    return [
      ...acc,
      {
        key,
        type,
        oldValue: firstContent[key],
        newValue: secondContent[key],
        children: generateDiff(firstContent[key], secondContent[key]),
      },
    ];
  }, []);
};

export default generateDiff;
