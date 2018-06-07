import { safeLoad as yamlParse } from 'js-yaml';
import { parse as iniParse } from 'ini';

const parsers = {
  '.json': JSON.parse,
  '.yaml': yamlParse,
  '.yml': yamlParse,
  '.ini': iniParse,
};

const getParser = (extension) => {
  const parser = parsers[extension];
  if (!parser) {
    throw new Error(`Unknown file extension '${extension}'`);
  }
  return parser;
};

export default getParser;
