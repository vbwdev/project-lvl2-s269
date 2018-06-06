import fs from 'fs';
import genDiff from '../src';

const diffResult = fs.readFileSync('./__tests__/__fixtures__/diffResult.txt', 'utf8');

describe('genDiff tests', () => {
  test('genDiff should work with json', () => {
    expect(genDiff('./__tests__/__fixtures__/before.json', './__tests__/__fixtures__/after.json')).toBe(diffResult);
  });
});
