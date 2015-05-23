'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _game = require('./game');

var _game2 = _interopRequireDefault(_game);

var _gameobject = require('./gameobject');

var _gameobject2 = _interopRequireDefault(_gameobject);

var _scene = require('./scene');

var _scene2 = _interopRequireDefault(_scene);

var _behavior = require('./behavior');

var _behavior2 = _interopRequireDefault(_behavior);

var _renderer = require('./renderer');

var _renderer2 = _interopRequireDefault(_renderer);

var flockn = function flockn(descriptor) {
  return new _game2['default'](descriptor);
};

// TODO: Comtemplate if this should be a property
flockn.setRenderer = function (name) {
  _renderer2['default'].use(name);
};

exports['default'] = flockn;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map