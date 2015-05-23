'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dom = require('./dom');

var _dom2 = _interopRequireDefault(_dom);

var _canvas = require('./canvas');

var _canvas2 = _interopRequireDefault(_canvas);

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

Renderer.register('dom', _dom2['default']);
Renderer.register('canvas', _canvas2['default']);

exports['default'] = Renderer;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map