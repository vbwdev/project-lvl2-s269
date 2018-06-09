import _ from 'lodash';

const propertyActions = [
  {
    type: 'nested',
    check: (first, second, key) =>
      _.has(first, key) && _.has(second, key) && _.isPlainObject(first[key]) && _.isPlainObject(second[key]),
    process: (first, second, func) => ({ children: func(first, second) }),
  },
  {
    type: 'unchanged',
    check: (first, second, key) => _.has(first, key) && _.has(second, key) && first[key] === second[key],
    process: first => ({ value: first }),
  },
  {
    type: 'changed',
    check: (first, second, key) => _.has(first, key) && _.has(second, key) && first[key] !== second[key],
    process: (first, second) => ({ oldValue: first, newValue: second }),
  },
  {
    type: 'deleted',
    check: (first, second, key) => _.has(first, key) && !_.has(second, key),
    process: first => ({ value: first }),
  },
  {
    type: 'added',
    check: (first, second, key) => !_.has(first, key) && _.has(second, key),
    process: (first, second) => ({ value: second }),
  },
];

const getPropertyAction = (first, second, key) => {
  const type = _.find(propertyActions, ({ check }) => check(first, second, key));
  if (!type) {
    throw new Error('No suitable type found');
  }
  return type;
};

const generateDiff = (firstContent, secondContent) => {
  const keys = _.union(_.keys(firstContent), _.keys(secondContent));
  return keys.map((key) => {
    const { type, process } = getPropertyAction(firstContent, secondContent, key);
    const processedData = process(firstContent[key], secondContent[key], generateDiff);
    return { key, type, ...processedData };
  }, []);
};

export default generateDiff;
