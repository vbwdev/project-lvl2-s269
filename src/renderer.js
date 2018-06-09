import { renderDiffOriginal, renderDiffPlain } from './renderers';

const renderers = {
  original: renderDiffOriginal,
  plain: renderDiffPlain,
};

const render = (format, diff) => {
  const renderFormat = renderers[format] || renderers.original;
  return renderFormat(diff);
};

export default render;
