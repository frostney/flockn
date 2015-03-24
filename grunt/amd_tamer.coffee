path = require 'path'

module.exports =
  options:
    namespace: '<%= package.name %>'
    base: 'tmp/'
  all:
    options:
      footer: '\n//# sourceMappingURL=<%= package.name %>.all.js.map'
    files:
      'dist/amd/<%= package.name %>.all.js': 'tmp/**/*.js'
  base:
    files:
      'dist/amd/files/<%= package.name %>.js': ['tmp/**/*.js', '!tmp/renderer/**/*.js', '!tmp/plugins/**/*.js']
  renderer:
    files: [{
      expand: true
      cwd: 'tmp/renderer/'
      src: '*.js'
      dest: 'dist/amd/files/'
      rename: (dest, src) ->
        "#{dest}<%= package.name %>.renderer.#{src}"
    }]
  plugins:
    files: [{
      expand: true
      cwd: 'tmp/plugins/'
      src: '*.js'
      dest: 'dist/amd/files/'
      rename: (dest, src) ->
        "#{dest}<%= package.name %>.plugin.#{src}"
    }]
  test:
    options:
      namespace: 'spec'
      base: 'test/spec/'
    files: [{
      expand: true
      cwd: 'test/spec/'
      src: '*.js'
      dest: 'test/spec/'
    }]
