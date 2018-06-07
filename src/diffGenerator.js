import _ from 'lodash';
import { STATUS } from './constants';

const prepareDiff = (key, firstValue, secondValue) => {
  if (_.isPlainObject(firstValue) && _.isPlainObject(secondValue)) {
    return {
      key,
      status: STATUS.NOT_CHANGED,
      children: generateDiff(firstValue, secondValue),
    };
  }

  if (firstValue && secondValue && firstValue === secondValue) {
    return {
      key,
      status: STATUS.NOT_CHANGED,
      value: firstValue,
    };
  }

  if (firstValue && secondValue && firstValue !== secondValue) {
    return {
      key,
      status: STATUS.CHANGED,
      value: [firstValue, secondValue],
    };
  }

  if (firstValue) {
    return {
      key,
      status: STATUS.DELETED,
      value: firstValue,
    };
  }

  if (secondValue) {
    return {
      key,
      status: STATUS.ADDED,
      value: secondValue,
    };
  }
};

const generateDiff = (firstContent, secondContent) => {
  const keys = _.union(_.keys(firstContent), _.keys(secondContent));
  return keys.reduce(
    (acc, key) => [...acc, prepareDiff(key, firstContent[key], secondContent[key])],
    [],
  );
};

export default generateDiff;
