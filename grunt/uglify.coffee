module.exports =
  compact:
    files: [{
      expand: true
      cwd: 'dist/'
      src: '**/*.js'
      dest: 'dist/'
      ext: '.min.js'
    }]