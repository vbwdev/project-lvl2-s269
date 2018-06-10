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

  added: ({ key, value }, parents) =>
    `Property ${renderName(parents, key)} was added with ${renderValue(value, true)}`,

  deleted: ({ key }, parents) => `Property ${renderName(parents, key)} was removed`,
};

const renderDiffIter = (diff, parents = []) =>
  diff.reduce((acc, item) => {
    const render = renderers[item.type];
    if (!render) {
      return acc;
    }
    return [...acc, render(item, parents, renderDiffIter)];
  }, []);

const renderDiff = (diff) => {
  const strings = renderDiffIter(diff);
  return _.flatten(strings).join('\n');
};

export default renderDiff;
