module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/mocks/**',
    '!src/main.jsx',
    '!src/App.jsx',
  ],
  collectCoverage: true,
  setupFilesAfterEnv: ['./setupTests.js'],
  testEnvironment: 'jsdom',
  modulePaths: ['<rootDir>/src'],
  moduleNameMapper: {
    '^.+\\.(css|ess|scss)$': 'identity-obj-proxy',
  },
};
