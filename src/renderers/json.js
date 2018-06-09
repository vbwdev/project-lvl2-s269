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
  diff.map(item => renderers[item.type](item, renderDiffIter), {});

const renderDiff = diff => JSON.stringify(renderDiffIter(diff));

export default renderDiff;
