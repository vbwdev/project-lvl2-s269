import fs from 'fs';
import path from 'path';

import getParser from './parsers';
import generateDiff from './diffGenerator';
import renderDiff from './diffRenderer';

const prepareContent = (filePath) => {
  const extension = path.extname(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const parse = getParser(extension);
  return parse(content);
};

const genDiff = (firstPath, secondPath) => {
  const firstContent = prepareContent(firstPath);
  const secondContent = prepareContent(secondPath);
  const generatedDiff = generateDiff(firstContent, secondContent);
  return renderDiff(generatedDiff);
};

export default genDiff;
