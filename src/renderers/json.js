const renderers = {
  nested: ({ key, children }, process) => ({
    status: 'nested',
    key,
    children: process(children),
  }),

  changed: ({ key, newValue, oldValue }) => ({
    status: 'changed',
    key,
    oldValue,
    newValue,
  }),

  added: ({ key, newValue: value }) => ({
    status: 'added',
    key,
    value,
  }),

  deleted: ({ key, oldValue: value }) => ({
    status: 'deleted',
    key,
    value,
  }),

  unchanged: ({ key, newValue: value }) => ({
    status: 'unchanged',
    key,
    value,
  }),
};

const getRenderer = (status) => {
  const render = renderers[status];
  if (!render) {
    throw new Error(`No renderer for status '${status}'`);
  }
  return render;
};

const renderDiffIter = diff =>
  diff.map((item) => {
    const render = getRenderer(item.status);
    return render(item, renderDiffIter);
  }, {});

const renderDiff = diff => renderDiffIter(diff);

export default renderDiff;
