export default [
  {
    key: 'host',
    firstConfigValue: 'hexlet.io',
    secondConfigValue: 'hexlet.io',
    isSame: true,
  },
  {
    key: 'timeout',
    firstConfigValue: 50,
    secondConfigValue: 20,
    isSame: false,
  },
  {
    key: 'proxy',
    firstConfigValue: '123.234.53.22',
    secondConfigValue: undefined,
    isSame: false,
  },
  {
    key: 'verbose',
    firstConfigValue: undefined,
    secondConfigValue: true,
    isSame: false,
  },
];
