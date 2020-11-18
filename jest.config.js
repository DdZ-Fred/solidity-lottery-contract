module.exports = {
  verbose: true,
  testPathIgnorePatterns: [
    'node_modules/',
    '/.history/',
    '/.git',
    'test-environment.config.js',
    'truffle-config.js',
    'web3.js',
    'web3Provider.js',
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  extraGlobals: ['Math'],
}