module.exports =
  options:
    sourceMap: true
  dist:
    options:
      modules: 'umd'
    files: [{
      expand: true,
      cwd: 'src',
      src: ['**/*.js'],
      dest: 'tmp/'
    }]
  test:
    options:
      modules: 'amd'
    files: [{
      expand: true,
      cwd: 'test/spec'
      src: ['**/*.js']
      dest: 'test/tmp'
    }]
