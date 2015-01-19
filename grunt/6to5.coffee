module.exports =
  options:
    sourceMap: true
  dist:
    options:
      modules: 'amd'
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
      cwd: 'test/src'
      src: ['**/*.js']
      dest: 'test/spec'
    }]
