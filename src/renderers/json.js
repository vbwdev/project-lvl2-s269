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

const getRenderer = (type) => {
  const render = renderers[type];
  if (!render) {
    throw new Error(`No renderer for type '${type}'`);
  }
  return render;
};

const renderDiffIter = diff =>
  diff.map((item) => {
    const render = getRenderer(item.type);
    return render(item, renderDiffIter);
  }, {});

const renderDiff = diff => renderDiffIter(diff);

export default renderDiff;
