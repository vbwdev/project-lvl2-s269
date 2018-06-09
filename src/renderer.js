import { renderDiffOriginal, renderDiffPlain, renderDiffJson } from './renderers';

const renderers = {
  original: renderDiffOriginal,
  plain: renderDiffPlain,
  json: renderDiffJson,
};

const render = (format, diff) => {
  const renderFormat = renderers[format] || renderers.original;
  return renderFormat(diff);
};

export default render;
