module.exports =
  options:
    report: 'gzip'
  all:
    files:
      'dist/snowflake.all.min.js': 'dist/snowflake.all.js'
  compact:
    files: [{
      expand: true
      cwd: 'dist/files/'
      src: '**/*.js'
      dest: 'dist/files/'
      ext: '.min.js'
    }]