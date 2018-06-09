import renderDiffOriginal from './original';
import renderDiffPlain from './plain';
import renderDiffJson from './json';

const renderers = {
  original: renderDiffOriginal,
  plain: renderDiffPlain,
  json: renderDiffJson,
};

const render = (format, diff) => renderers[format](diff);

export default render;
