module.exports =
  pages:
    options:
      metadata:
        title: 'flockn'
        description: 'Lightweight game engine'
      plugins:
        'metalsmith-markdown': {}
        'metalsmith-stylus':
          nib: true
        'metalsmith-templates':
          engine: 'jade'
          directory: 'templates'
    src: 'pages/src'
    dest: 'dist/pages'