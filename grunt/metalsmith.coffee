module.exports =
  pages:
    options:
      metadata:
        title: 'flockn'
        description: 'Lightweight game engine'
      plugins:
        'metalsmith-markdown':
          gfm: true
          breaks: true
          smartypants: true
          tables: true
        'metalsmith-navigation': {}
        'metalsmith-stylus':
          nib: true
        'metalsmith-templates':
          engine: 'jade'
          directory: 'pages/templates'
    src: 'pages/src'
    dest: 'dist/pages'