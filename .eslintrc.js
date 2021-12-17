module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
    jest: true
  },
  extends: ['standard'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'space-before-function-paren': 0
  }
}
