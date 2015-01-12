module.exports =
  options:
    engine: 'handlebars'
  test:
    options:
      local:
        script: 'spec/base'
    files:
      'test/browser/base.html': 'test/templates/browser.html'
