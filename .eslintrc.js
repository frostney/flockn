module.exports = {
  extends: ['airbnb-base', 'prettier'],
  rules: {
    eqeqeq: [2, 'smart'],
  },
  env: {
    browser: true,
    jest: true,
  },
};
