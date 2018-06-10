import fs from 'fs';
import path from 'path';

import getParser from './parsers';
import generateDiff from './diffGenerator';
import * as renderers from './renderers';

const getRender = (format) => {
  const render = renderers[format];
  if (!render) {
    throw new Error(`Rendered not found for '${format}' format`);
  }
  return render;
};

const prepareContent = (filePath) => {
  const extension = path.extname(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const parse = getParser(extension);
  return parse(content);
};

const genDiff = (firstPath, secondPath, format) => {
  const firstContent = prepareContent(firstPath);
  const secondContent = prepareContent(secondPath);
  const generatedDiff = generateDiff(firstContent, secondContent);
  const render = getRender(format);
  return render(generatedDiff);
};

export default genDiff;
