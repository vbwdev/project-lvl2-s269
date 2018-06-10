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

const getStringRenderer = (type) => {
  const render = renderers[type];
  if (!render) {
    throw new Error(`No renderer for type '${type}'`);
  }
  return render;
};

const renderDiffIter = diff =>
  diff.map((item) => {
    const render = getStringRenderer(item.type);
    return render(item, renderDiffIter);
  }, {});

const renderDiff = diff => JSON.stringify(renderDiffIter(diff));

export default renderDiff;
