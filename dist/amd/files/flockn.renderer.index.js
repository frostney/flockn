define('flockn/renderer', ['exports', 'module', './dom', './canvas'], function (exports, module, _dom, _canvas) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _DOMRenderer = _interopRequire(_dom);

  var _CanvasRenderer = _interopRequire(_canvas);

  var renderers = {};

  var Renderer = {};

  Renderer.register = function (name, descriptor) {
    renderers[name] = descriptor;
  };

  Renderer.use = function (name) {
    if (Object.hasOwnProperty.call(renderers, name)) {
      renderers[name] && renderers[name]();
    }
  };

  Renderer.register('dom', _DOMRenderer);
  Renderer.register('canvas', _CanvasRenderer);

  module.exports = Renderer;
});
