module.exports = {
  verbose: true,
  testPathIgnorePatterns: [
    'node_modules/',
    '/build/',
    '/.history/',
    '/.git',
    'test-environment.config.js',
    'truffle-config.js',
  ],
  testRegex: '(/test/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  extraGlobals: ['Math'],
}