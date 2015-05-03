'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _DOMRenderer = require('./dom');

var _DOMRenderer2 = _interopRequireWildcard(_DOMRenderer);

var _CanvasRenderer = require('./canvas');

var _CanvasRenderer2 = _interopRequireWildcard(_CanvasRenderer);

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

Renderer.register('dom', _DOMRenderer2['default']);
Renderer.register('canvas', _CanvasRenderer2['default']);

exports['default'] = Renderer;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map