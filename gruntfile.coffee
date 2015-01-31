module.exports = (grunt) ->

  require('time-grunt')(grunt)

  require('load-grunt-config') grunt,
    jitGrunt: true

  grunt.registerTask 'default', ['clean', '6to5:dist', 'amd_tamer', 'uglify']
  
  grunt.registerTask 'test', ['default', 'jshint', 'consolidate', '6to5:test', 'amd_tamer:test', 'mocha']
  
  grunt.registerTask 'doc', ['groc']
  
  grunt.registerTask 'pages', ['metalsmith', 'doc', 'bowercopy']
