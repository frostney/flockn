path = require 'path'

module.exports =
  options:
    namespace: 'snowflake'
    base: 'src/'  
  all:
    files:
      'dist/snowflake.all.js': 'src/**/*.js'
  base:
    files:
      'dist/files/snowflake.js': ['src/**/*.js', '!src/graphics/**/*.js']
  graphics:
    files: [{
      expand: true
      cwd: 'src/renderer/'
      src: '*.js'
      dest: 'dist/files/'
      rename: (dest, src) ->
        "#{dest}/snowflake.renderer.#{src}"
    }]
