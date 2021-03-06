import fs from 'fs';
import genDiff from '../src';

const testsPath = '__tests__/__fixtures__/';
const testFormats = {
  json: {
    before: `${testsPath}before.json`,
    after: `${testsPath}after.json`,
    nestedBefore: `${testsPath}nestedBefore.json`,
    nestedAfter: `${testsPath}nestedAfter.json`,
  },
  yaml: {
    before: `${testsPath}before.yml`,
    after: `${testsPath}after.yml`,
    nestedBefore: `${testsPath}nestedBefore.yml`,
    nestedAfter: `${testsPath}nestedAfter.yml`,
  },
  ini: {
    before: `${testsPath}before.ini`,
    after: `${testsPath}after.ini`,
    nestedBefore: `${testsPath}nestedBefore.ini`,
    nestedAfter: `${testsPath}nestedAfter.ini`,
  },
};

describe('genDiff tests with original output format', () => {
  const diffResult = fs.readFileSync(`${testsPath}diffResult.txt`, 'utf8');
  const nestedDiffResult = fs.readFileSync(`${testsPath}nestedDiffResult.txt`, 'utf8');

  Object.keys(testFormats).forEach((format) => {
    test(`genDiff should work with ${format}`, () => {
      expect(genDiff(testFormats[format].before, testFormats[format].after, 'original')).toBe(diffResult);
    });

    test(`genDiff should work with nested ${format}`, () => {
      expect(genDiff(testFormats[format].nestedBefore, testFormats[format].nestedAfter, 'original'))
        .toBe(nestedDiffResult);
    });
  });
});


describe('genDiff tests with plain output format', () => {
  const diffResult = fs.readFileSync(`${testsPath}diffResultPlain.txt`, 'utf8');
  const nestedDiffResult = fs.readFileSync(`${testsPath}nestedDiffResultPlain.txt`, 'utf8');

  Object.keys(testFormats).forEach((format) => {
    test(`genDiff should work with ${format}`, () => {
      expect(genDiff(testFormats[format].before, testFormats[format].after, 'plain')).toBe(diffResult);
    });

    test(`genDiff should work with nested ${format}`, () => {
      expect(genDiff(testFormats[format].nestedBefore, testFormats[format].nestedAfter, 'plain'))
        .toBe(nestedDiffResult);
    });
  });
});


describe('genDiff tests with json output format', () => {
  const diffResult = fs.readFileSync(`${testsPath}diffResultJson.txt`, 'utf8');
  // Ini parser interpretate all numeric values as strings
  const iniDiffResult = fs.readFileSync(`${testsPath}iniDiffResultJson.txt`, 'utf8');
  const nestedDiffResult = fs.readFileSync(`${testsPath}nestedDiffResultJson.txt`, 'utf8');

  Object.keys(testFormats).forEach((format) => {
    test(`genDiff should work with ${format}`, () => {
      expect(genDiff(testFormats[format].before, testFormats[format].after, 'json'))
        .toBe(format === 'ini' ? iniDiffResult : diffResult);
    });

    test(`genDiff should work with nested ${format}`, () => {
      expect(genDiff(testFormats[format].nestedBefore, testFormats[format].nestedAfter, 'json'))
        .toBe(nestedDiffResult);
    });
  });
});
