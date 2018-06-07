import _ from 'lodash';
import { STATUS } from './constants';

const getSpaces = depth => '    '.repeat(depth);

const renderString = (sign, key, value, depth) => {
  if (_.isPlainObject(value)) {
    const objectValues = _.keys(value).map(objectKey => renderString(' ', objectKey, value[objectKey], depth + 1));
    return renderString(sign, key, `{\n${objectValues.join('')}${getSpaces(depth + 1)}}`, depth);
  }

  return `${getSpaces(depth)}  ${sign} ${key}: ${value}\n`;
};
const renderUnchangedString = (...args) => renderString(' ', ...args);
const renderDeletedString = (...args) => renderString('-', ...args);
const renderAddedString = (...args) => renderString('+', ...args);


const renderDiff = (input) => {
  const prepareDiff = (diff, depth = 0) => {
    const strings = diff.reduce((acc, {
      key, status, value, children,
    }) => {
      if (children) {
        return [...acc, renderUnchangedString(key, prepareDiff(children, depth + 1), depth)];
      }

      if (status === STATUS.CHANGED) {
        return [
          ...acc,
          renderAddedString(key, value[1], depth),
          renderDeletedString(key, value[0], depth),
        ];
      }

      if (status === STATUS.ADDED) {
        return [...acc, renderAddedString(key, value, depth)];
      }

      if (status === STATUS.DELETED) {
        return [...acc, renderDeletedString(key, value, depth)];
      }

      if (status === STATUS.NOT_CHANGED) {
        return [...acc, renderUnchangedString(key, value, depth)];
      }
    }, []);
    return `{\n${strings.join('')}${getSpaces(depth)}}`;
  };

  return prepareDiff(input);
};

export default renderDiff;
