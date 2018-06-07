import _ from 'lodash';
import { STATUS } from './constants';

const generateDiff = (firstContent, secondContent) => {
  const prepareDiff = (key, firstValue, secondValue) => {
    const hasFirstValue = _.has(firstContent, key);
    const hasSecondValue = _.has(secondContent, key);

    if (_.isPlainObject(firstValue) && _.isPlainObject(secondValue)) {
      return {
        key,
        status: STATUS.NOT_CHANGED,
        children: generateDiff(firstValue, secondValue),
      };
    }

    if (hasFirstValue && hasSecondValue && firstValue === secondValue) {
      return {
        key,
        status: STATUS.NOT_CHANGED,
        value: firstValue,
      };
    }

    if (hasFirstValue && hasSecondValue && firstValue !== secondValue) {
      return {
        key,
        status: STATUS.CHANGED,
        value: [firstValue, secondValue],
      };
    }

    if (hasFirstValue) {
      return {
        key,
        status: STATUS.DELETED,
        value: firstValue,
      };
    }

    if (hasSecondValue) {
      return {
        key,
        status: STATUS.ADDED,
        value: secondValue,
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
