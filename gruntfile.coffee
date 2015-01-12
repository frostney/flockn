module.exports = (grunt) ->

  require('time-grunt')(grunt)

  require('load-grunt-config') grunt,
    jitGrunt: true

  grunt.registerTask 'default', ['clean', '6to5:dist', 'amd_tamer', 'uglify']
  
  grunt.registerTask 'test', ['jshint', '6to5:test']
  
  grunt.registerTask 'doc', ['groc']
  
  grunt.registerTask 'pages', ['metalsmith', 'doc', 'bowercopy']
