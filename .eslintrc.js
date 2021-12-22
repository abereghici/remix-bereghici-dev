module.exports = {
  extends: [
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/jest',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
  rules: {
    'no-console': 'off',
  },
}
