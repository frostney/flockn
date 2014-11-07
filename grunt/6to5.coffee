module.exports =
  options:
    modules: 'umd'
    sourceMap: true
  dist:
    files: [{
      expand: true,
      cwd: 'src',
      src: ['**/*.js'],
      dest: 'tmp/'
    }]
