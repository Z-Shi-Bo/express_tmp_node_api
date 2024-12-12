module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-console': 'warn', // 警告使用console
    'no-debugger': 'warn', // 警告使用debugger
    'no-unused-vars': 'warn', // 警告未使用的变量
    'no-var': 'error', // 禁止使用var
    'prefer-const': 'error', // 优先使用const
    'no-multiple-empty-lines': ['error', { max: 1 }], // 最多允许一个空行
    'no-trailing-spaces': 'error', // 禁止行尾空格
    semi: ['error', 'always'], // 必须使用分号
    quotes: ['error', 'single'], // 使用单引号
    'comma-dangle': ['error', 'always-multiline'], // 多行时必须使用尾逗号
    'arrow-parens': ['error', 'always'], // 箭头函数总是使用括号
    'space-before-function-paren': ['error', 'never'], // 函数括号前不要空格
    'object-curly-spacing': ['error', 'always'], // 对象花括号内必须有空格
    'array-bracket-spacing': ['error', 'never'], // 数组方括号内不要空格
    indent: ['error', 2], // 使用2个空格缩进
    'max-len': ['error', { code: 120 }], // 最大行长度120
  },
};
