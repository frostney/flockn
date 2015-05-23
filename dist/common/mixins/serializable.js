'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _serialize = require('../serialize');

var _serialize2 = _interopRequireDefault(_serialize);

var serializable = function serializable(Factory) {
  Factory.prototype.toJSON = function () {
    return _serialize2['default'].toJSON(this);
  };

  Factory.prototype.toString = function () {
    return _serialize2['default'].toString(this);
  };
};

exports['default'] = serializable;
module.exports = exports['default'];
//# sourceMappingURL=serializable.js.map