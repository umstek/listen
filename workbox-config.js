module.exports = {
  globDirectory: 'build/',
  globPatterns: ['**/*.{ico,html,txt}'],
  swDest: 'build/sw.js',
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/, /^test/],
};
