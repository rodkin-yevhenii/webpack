module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'eslint:recommended'
  ],
  globals: {
    jQuery: 'readonly'
  },
  rules: {
    'no-console': 1,
    'no-unused-vars': 0
  }
}
