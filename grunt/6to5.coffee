module.exports =
  options:
    modules: 'umd'
  dist:
    files: [{
      expand: true,
      cwd: 'src',
      src: ['**/*.js'],
      dest: 'tmp/'
    }]
