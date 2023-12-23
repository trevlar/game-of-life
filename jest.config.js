module.exports = {
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!axios).+\\.js$'],
  setupFilesAfterEnv: ['src/setupTests.js'],
};
