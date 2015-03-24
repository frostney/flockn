module.exports =
  options:
    sourceMap: true
    loose: ['es6.classes']
  dist_amd:
    options:
      modules: 'amd'
    files: [{
      expand: true,
      cwd: 'src',
      src: ['**/*.js'],
      dest: 'tmp/'
    }]
  dist_common:
    options:
      modules: 'common'
    files: [{
      expand: true,
      cwd: 'src',
      src: ['**/*.js'],
      dest: 'dist/common/'
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
