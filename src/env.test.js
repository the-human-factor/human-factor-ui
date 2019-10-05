import { detectEnv } from './env';

describe.each([
  ['https://localhost:9000', 'local'],
  ['http://localhost:9000', 'local'],

  ['https://local.app.thehumanfactor.ai', 'local'],
  ['http://local.app.thehumanfactor.ai', 'local'],

  ['https://staging.app.thehumanfactor.ai', 'staging'],
  ['http://staging.app.thehumanfactor.ai', 'staging'],

  ['https://app.thehumanfactor.ai', 'prod'],
  ['http://app.thehumanfactor.ai', 'prod'],

  ['some-randomother-thing', 'staging'],
])('Environment detection of %s', (url, expected) => {
  test(`should return ${expected}`, () => {
    console.log('URL', url, 'expected', expected);
    expect(detectEnv(url)).toBe(expected);
  });
});
