module.exports = (grunt) ->
  require('time-grunt')(grunt)

  require('load-grunt-config') grunt,
    jitGrunt: true

  grunt.registerTask 'default', ['clean', 'babel:dist_common', 'babel:dist_amd', 'amd_tamer', 'uglify']

  grunt.registerTask 'test', ['default', 'jshint', 'karma']

  grunt.registerTask 'doc', ['groc']

  grunt.registerTask 'pages', ['metalsmith', 'doc', 'bowercopy']
