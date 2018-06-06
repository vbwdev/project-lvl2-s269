import fs from 'fs';
import genDiff from '../src';

const testsPath = '__tests__/__fixtures__/';
const diffResult = fs.readFileSync(`${testsPath}diffResult.txt`, 'utf8');
const testFormats = {
  json: {
    before: `${testsPath}before.json`,
    after: `${testsPath}after.json`,
  },
  yaml: {
    before: `${testsPath}before.yml`,
    after: `${testsPath}after.yml`,
  },
  ini: {
    before: `${testsPath}before.ini`,
    after: `${testsPath}after.ini`,
  },
};

describe('genDiff tests', () => {
  Object.keys(testFormats).forEach((format) => {
    test(`genDiff should work with ${format}`, () => {
      expect(genDiff(testFormats[format].before, testFormats[format].after)).toBe(diffResult);
    });
  });
});
