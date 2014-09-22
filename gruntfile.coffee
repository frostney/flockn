module.exports = (grunt) ->

  require('time-grunt')(grunt)

  require('load-grunt-config')(grunt)

  grunt.registerTask 'default', ['clean', 'amd_tamer', 'uglify']
  
  grunt.registerTask 'test', ['jshint']
  
  grunt.registerTask 'doc', ['groc']
  
  grunt.registerTask 'pages', ['metalsmith', 'doc', 'bowercopy']
