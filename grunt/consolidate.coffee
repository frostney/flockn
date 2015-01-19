fs = require 'fs'
path = require 'path'

dirContent = fs.readdirSync 'test/spec'
dirContent = dirContent.filter (filename) -> path.extname(filename) is '.js'

consolidateConfig =
  options:
    engine: 'handlebars'

dirContent.forEach (filename) ->
  basename = filename.split(path.extname(filename))[0]
  scriptName = "spec/#{basename}"

  templateKey = "test/browser/#{basename}.html"
  templateFile = 'test/templates/browser.html'

  filesObject = {}
  filesObject[templateKey] = templateFile

  consolidateConfig[basename] =
    options:
      local:
        script: scriptName
    files: filesObject


module.exports = consolidateConfig
