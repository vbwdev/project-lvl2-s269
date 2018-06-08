import _ from 'lodash';

const getSpaces = depth => '    '.repeat(depth);

const renderString = (sign, key, value, depth) => {
  if (_.isPlainObject(value)) {
    const objectDepth = depth + 1;
    const objectValues = _.keys(value)
      .map(objectKey => renderString(' ', objectKey, value[objectKey], objectDepth))
      .join('');
    return renderString(sign, key, `{\n${objectValues}${getSpaces(objectDepth)}}`, depth);
  }
  return `${getSpaces(depth)}  ${sign} ${key}: ${value}\n`;
};
const renderUnchangedString = (...args) => renderString(' ', ...args);
const renderDeletedString = (...args) => renderString('-', ...args);
const renderAddedString = (...args) => renderString('+', ...args);

const renderDiff = (diffInput) => {
  const iter = (diff, depth = 0) => {
    const strings = diff.reduce((acc, {
      key, status, newValue, oldValue, children,
    }) => {
      switch (status) {
        case 'nested':
          return [...acc, renderUnchangedString(key, iter(children, depth + 1), depth)];

        case 'changed':
          return [
            ...acc,
            renderAddedString(key, newValue, depth),
            renderDeletedString(key, oldValue, depth),
          ];

        case 'added':
          return [...acc, renderAddedString(key, newValue, depth)];

        case 'deleted':
          return [...acc, renderDeletedString(key, oldValue, depth)];

        case 'unchanged':
          return [...acc, renderUnchangedString(key, newValue, depth)];

        default:
          throw new Error(`Not supported status ${status}`);
      }
    }, []);
    return `{\n${strings.join('')}${getSpaces(depth)}}`;
  };

  return iter(diffInput, 0);
};

export default renderDiff;
