const renderers = {
  nested: ({ key, children }, process) => ({
    type: 'nested',
    key,
    children: process(children),
  }),

  changed: ({ key, newValue, oldValue }) => ({
    type: 'changed',
    key,
    oldValue,
    newValue,
  }),

  added: ({ key, value }) => ({
    type: 'added',
    key,
    value,
  }),

  deleted: ({ key, value }) => ({
    type: 'deleted',
    key,
    value,
  }),

  unchanged: ({ key, value }) => ({
    type: 'unchanged',
    key,
    value,
  }),
};

const renderDiffIter = diff =>
  diff.reduce((acc, item) => {
    const render = renderers[item.type];
    if (!render) {
      return acc;
    }
    return [...acc, render(item, renderDiffIter)];
  }, []);

const renderDiff = diff => JSON.stringify(renderDiffIter(diff));

export default renderDiff;
