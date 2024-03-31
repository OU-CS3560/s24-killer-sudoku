module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals' // <-- moved here from .eslintrc.json
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    'prefer-const': 'warn',
    'no-constant-condition': 'warn'
  }
};