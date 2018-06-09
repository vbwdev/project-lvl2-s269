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
      expect(genDiff(testFormats[format].before, testFormats[format].after)).toBe(diffResult);
    });

    test(`genDiff should work with nested ${format}`, () => {
      expect(genDiff(testFormats[format].nestedBefore, testFormats[format].nestedAfter))
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
  const diffResult = JSON.parse(fs.readFileSync(`${testsPath}diffResultJson.json`, 'utf8'));
  const nestedDiffResult = JSON.parse(fs.readFileSync(`${testsPath}nestedDiffResultJson.json`, 'utf8'));

  Object.keys(testFormats).forEach((format) => {
    test(`genDiff should work with ${format}`, () => {
      expect(genDiff(testFormats[format].before, testFormats[format].after, 'json')).toEqual(diffResult);
    });

    test(`genDiff should work with nested ${format}`, () => {
      expect(genDiff(testFormats[format].nestedBefore, testFormats[format].nestedAfter, 'json'))
        .toEqual(nestedDiffResult);
    });
  });
});
