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
  nested: ({ key, value }, depth, process) => renderString(' ', key, process(value, depth + 1), depth),

  changed: ({ key, value: { oldValue, newValue } }, depth) => [
    renderString('+', key, newValue, depth),
    renderString('-', key, oldValue, depth),
  ].join(''),

  added: ({ key, value }, depth) => renderString('+', key, value, depth),

  deleted: ({ key, value }, depth) => renderString('-', key, value, depth),

  unchanged: ({ key, value }, depth) => renderString(' ', key, value, depth),
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
