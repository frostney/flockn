module.exports = (grunt) ->

  require('time-grunt')(grunt)

  require('load-grunt-config') grunt,
    jitGrunt: true

  grunt.registerTask 'default', ['clean', '6to5', 'amd_tamer', 'uglify']
  
  grunt.registerTask 'test', ['jshint']
  
  grunt.registerTask 'doc', ['groc']
  
  grunt.registerTask 'pages', ['metalsmith', 'doc', 'bowercopy']
