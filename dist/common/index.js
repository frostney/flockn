'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Game = require('./game');

var _Game2 = _interopRequireWildcard(_Game);

var _GameObject = require('./gameobject');

var _GameObject2 = _interopRequireWildcard(_GameObject);

var _Scene = require('./scene');

var _Scene2 = _interopRequireWildcard(_Scene);

var _Behavior = require('./behavior');

var _Behavior2 = _interopRequireWildcard(_Behavior);

var _Renderer = require('./renderer');

var _Renderer2 = _interopRequireWildcard(_Renderer);

var flockn = function flockn(descriptor) {
  return new _Game2['default'](descriptor);
};

// TODO: Comtemplate if this should be a property
flockn.setRenderer = function (name) {
  _Renderer2['default'].use(name);
};

exports['default'] = flockn;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map