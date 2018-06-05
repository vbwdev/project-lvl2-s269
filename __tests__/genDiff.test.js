import genDiff, { parseConfigs, buildDiff } from '../src';

import firstConfig from './__fixtures__/before.json';
import secondConfig from './__fixtures__/after.json';
import parsedConfigs from './__fixtures__/parsed';
import diffResult from './__fixtures__/diffResult';

describe('genDiff tests', () => {
  test('should work', () => {
    expect(genDiff(firstConfig, secondConfig)).toBe(diffResult);
  });

  test('config parsing', () => {
    expect(parseConfigs(
      { ...firstConfig, ...secondConfig },
      firstConfig,
      secondConfig,
    )).toEqual(parsedConfigs);
  });

  test('diff building', () => {
    expect(buildDiff(parsedConfigs)).toBe(diffResult);
  });
});
