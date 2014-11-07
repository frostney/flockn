path = require 'path'

module.exports =
  options:
    namespace: '<%= package.name %>'
    base: 'tmp/'
  all:
    files:
      'dist/<%= package.name %>.all.js': 'tmp/**/*.js'
  base:
    files:
      'dist/files/<%= package.name %>.js': ['tmp/**/*.js', '!tmp/renderer/**/*.js']
  graphics:
    files: [{
      expand: true
      cwd: 'tmp/renderer/'
      src: '*.js'
      dest: 'dist/files/'
      rename: (dest, src) ->
        "#{dest}<%= package.name %>.renderer.#{src}"
    }]
