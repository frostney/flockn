module.exports = (grunt) ->

  require('time-grunt')(grunt)

  require('load-grunt-config')(grunt)

  grunt.registerTask 'default', ['clean', 'amd_tamer', 'uglify']