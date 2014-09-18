path = require 'path'

module.exports =
  options:
    namespace: '<%= package.name %>'
    base: 'src/'  
  all:
    files:
      'dist/<%= package.name %>.all.js': 'src/**/*.js'
  base:
    files:
      'dist/files/<%= package.name %>.js': ['src/**/*.js', '!src/renderer/**/*.js']
  graphics:
    files: [{
      expand: true
      cwd: 'src/renderer/'
      src: '*.js'
      dest: 'dist/files/'
      rename: (dest, src) ->
        "#{dest}<%= package.name %>.renderer.#{src}"
    }]
