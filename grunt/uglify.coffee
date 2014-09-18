module.exports =
  options:
    report: 'gzip'
  all:
    files:
      'dist/<%= package.name %>.all.min.js': 'dist/<%= package.name %>.all.js'
  compact:
    files: [{
      expand: true
      cwd: 'dist/files/'
      src: '**/*.js'
      dest: 'dist/files/'
      ext: '.min.js'
    }]