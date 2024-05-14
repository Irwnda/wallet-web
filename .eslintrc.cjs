module.exports = {
  env: {
    browser: true,
    es2023: true,
    'jest/globals': true
  },
  extends: [
    'plugin:react/recommended',
    'plugin:jest/recommended',
    'airbnb-base',
    'plugin:react/jsx-runtime',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    requireConfigFile: false,
    sourceType: 'module'
  },
  plugins: [
    'react',
    'testing-library',
    'react-prefer-function-component',
    'react-hooks'
  ],
  rules: {
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'off',
    'object-curly-newline': 'off',
    'comma-dangle': ['error', 'never'],
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function'
      }
    ]
  },
  overrides: [
    {
      files: ['**/*.test.js'],
      rules: {
        'max-lines-per-function': 'off'
      }
    }
  ]
};
