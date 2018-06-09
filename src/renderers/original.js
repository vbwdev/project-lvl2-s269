import _ from 'lodash';

const getSpaces = depth => '    '.repeat(depth);

const renderObjectInner = (values, depth) => `{\n${values.join('')}${getSpaces(depth)}}`;

const renderString = (sign, key, value, depth) => {
  if (_.isPlainObject(value)) {
    const objectDepth = depth + 1;
    const renderedItems = _.keys(value).map(objectKey => renderString(' ', objectKey, value[objectKey], objectDepth));
    return renderString(sign, key, renderObjectInner(renderedItems, objectDepth), depth);
  }
  return `${getSpaces(depth)}  ${sign} ${key}: ${value}\n`;
};

const renderers = {
  nested: (item, depth, process) => renderString(' ', item.key, process(item.children, depth + 1), depth),

  changed: (item, depth) => [
    renderString('+', item.key, item.newValue, depth),
    renderString('-', item.key, item.oldValue, depth),
  ].join(''),

  added: (item, depth) => renderString('+', item.key, item.newValue, depth),

  deleted: (item, depth) => renderString('-', item.key, item.oldValue, depth),

  unchanged: (item, depth) => renderString(' ', item.key, item.newValue, depth),
};

const getRenderer = (type) => {
  const render = renderers[type];
  if (!render) {
    throw new Error(`No renderer for type '${type}'`);
  }
  return render;
};

const renderDiffIter = (diff, depth = 0) => {
  const strings = diff.map((item) => {
    const render = getRenderer(item.type);
    return render(item, depth, renderDiffIter);
  }, []);
  return renderObjectInner(strings, depth);
};

const renderDiff = diff => renderDiffIter(diff, 0);

export default renderDiff;
