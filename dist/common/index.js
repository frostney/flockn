'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Game = require('flockn/game');

var _Game2 = _interopRequireWildcard(_Game);

var _GameObject = require('flockn/gameobject');

var _GameObject2 = _interopRequireWildcard(_GameObject);

var _Scene = require('flockn/scene');

var _Scene2 = _interopRequireWildcard(_Scene);

var _Behavior = require('flockn/behavior');

var _Behavior2 = _interopRequireWildcard(_Behavior);

var flockn = function flockn(descriptor) {
  return new _Game2['default'](descriptor);
};

flockn.gameObject = function (name, factory) {
  return _GameObject2['default'].define(name, factory);
};

flockn.scene = function (name, factory) {
  return _Scene2['default'].define(name, factory);
};

flockn.behavior = function (name, factory) {
  return _Behavior2['default'].define(name, factory);
};

exports['default'] = flockn;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map