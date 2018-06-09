import _ from 'lodash';

const renderName = (parents, name) => `'${parents.concat(name).join('.')}'`;

const renderValue = (value, needPrefix) => {
  if (_.isObject(value)) {
    return 'complex value';
  }

  return `${needPrefix ? 'value ' : ''}${`'${value}'`}`;
};

const renderers = {
  nested: ({ key, children }, parents, process) => process(children, [...parents, key], process),

  changed: ({ key, oldValue, newValue }, parents) =>
    `Property ${renderName(parents, key)} was updated from ${renderValue(oldValue)} to ${renderValue(newValue)}`,

  added: ({ key, newValue}, parents) =>
    `Property ${renderName(parents, key)} was added with ${renderValue(newValue, true)}`,

  deleted: ({ key }, parents) => `Property ${renderName(parents, key)} was removed`,

  unchanged: () => {},
};

const getRenderer = (status) => {
  const render = renderers[status];
  if (!render) {
    throw new Error(`No renderer for status '${status}'`);
  }
  return render;
};

const renderDiffIter = (diff, parents = []) =>
  diff.reduce((acc, item) => {
    const render = getRenderer(item.status);
    const renderedItem = render(item, parents, renderDiffIter);
    return renderedItem ? [...acc, renderedItem] : acc;
  }, []);

const renderDiff = (diff) => {
  const strings = renderDiffIter(diff);
  return _.flatten(strings).join('\n');
};

export default renderDiff;
